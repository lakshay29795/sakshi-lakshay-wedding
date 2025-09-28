'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Settings, 
  User,
  Shield,
  Activity,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAdmin } from './AdminProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePWA } from '@/hooks/usePWA';

// Page title mapping
const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/rsvp': 'RSVP Management',
  '/admin/rsvp/export': 'Export RSVP Data',
  '/admin/guestbook': 'Guest Book Management',
  '/admin/guestbook/moderate': 'Moderate Messages',
  '/admin/content': 'Content Management',
  '/admin/content/timeline': 'Timeline Events',
  '/admin/content/gallery': 'Photo Gallery',
  '/admin/notifications': 'Notifications',
  '/admin/analytics': 'Analytics',
  '/admin/users': 'User Management',
  '/admin/settings': 'Settings',
};

export function AdminHeader() {
  const pathname = usePathname();
  const { user, logout } = useAdmin();
  const { isOnline } = usePWA();

  const getPageTitle = () => {
    return pageTitles[pathname] || 'Admin Panel';
  };

  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    for (let i = 0; i < segments.length; i++) {
      const path = '/' + segments.slice(0, i + 1).join('/');
      const title = pageTitles[path] || segments[i].charAt(0).toUpperCase() + segments[i].slice(1);
      breadcrumbs.push({ path, title });
    }
    
    return breadcrumbs;
  };

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Never';
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Title & Breadcrumbs */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-4">
              {/* Page Title */}
              <motion.h1 
                key={pathname}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-semibold text-gray-900"
              >
                {getPageTitle()}
              </motion.h1>
              
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Wifi className="w-4 h-4" />
                    <span className="text-xs font-medium">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-red-600">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-xs font-medium">Offline</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && (
              <nav className="flex mt-1" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={crumb.path} className="flex items-center">
                      {index > 0 && <span className="mx-2">/</span>}
                      <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}>
                        {crumb.title}
                      </span>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>

          {/* Right Section - Search, Notifications, User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search admin panel..."
                  className="pl-10 w-64"
                />
              </div>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3">
                  <div className="w-8 h-8 bg-sage-green rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.displayName?.[0] || user?.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.displayName || user?.email}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role.replace('_', ' ')}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sage-green rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user?.displayName?.[0] || user?.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user?.displayName || user?.email}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user?.role.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <div>
                    <p className="text-sm">Role</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role.replace('_', ' ')}
                    </p>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <div>
                    <p className="text-sm">Last Login</p>
                    <p className="text-xs text-gray-500">
                      {formatLastLogin(user?.lastLogin)}
                    </p>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <div>
                    <p className="text-sm">Permissions</p>
                    <p className="text-xs text-gray-500">
                      {user?.permissions.length || 0} granted
                    </p>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Admin Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="flex items-center space-x-2 text-red-600 focus:text-red-600"
                  onClick={logout}
                >
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
