'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Admin user interface
interface AdminUser {
  uid: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  displayName?: string;
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
}

// Admin context interface
interface AdminContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

// Create admin context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Admin provider props
interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/admin/auth/me');
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data.user) {
          setUser(result.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        
        // Redirect to login if on admin page
        if (window.location.pathname.startsWith('/admin') && 
            !window.location.pathname.startsWith('/admin/login')) {
          router.push('/admin/login');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Get CSRF token first
      const csrfResponse = await fetch('/api/admin/auth/csrf');
      const csrfData = await csrfResponse.json();
      
      if (!csrfData.success) {
        throw new Error('Failed to get CSRF token');
      }
      
      // Attempt login
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfData.csrfToken,
        },
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return true;
      } else {
        toast.error(result.error || 'Login failed');
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Network error. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        setUser(null);
        setIsAuthenticated(false);
        toast.success('Logged out successfully');
        router.push('/admin/login');
      } else {
        toast.error('Logout failed');
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    await checkAuthStatus();
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const contextValue: AdminContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
    hasPermission,
    hasRole,
    hasAnyRole,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

// Hook to use admin context
export function useAdmin(): AdminContextType {
  const context = useContext(AdminContext);
  
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  
  return context;
}

// HOC for admin-only components
export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AdminAuthComponent(props: P) {
    const { isAuthenticated, isLoading } = useAdmin();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/admin/login');
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-green"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}

// HOC for permission-based components
export function withPermission<P extends object>(
  permission: string,
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function PermissionComponent(props: P) {
    const { hasPermission, isAuthenticated, isLoading } = useAdmin();

    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      );
    }

    if (!isAuthenticated || !hasPermission(permission)) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">You don't have permission to view this content.</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// HOC for role-based components
export function withRole<P extends object>(
  role: string,
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function RoleComponent(props: P) {
    const { hasRole, isAuthenticated, isLoading } = useAdmin();

    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      );
    }

    if (!isAuthenticated || !hasRole(role)) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">You don't have the required role to view this content.</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
