import { getIronSession, IronSession } from 'iron-session';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_CONFIG, AdminUser } from './admin-config';

// Session data interface
export interface SessionData {
  user?: {
    uid: string;
    email: string;
    role: string;
    permissions: string[];
    displayName?: string;
    avatar?: string;
  };
  isLoggedIn: boolean;
  loginTime?: number;
  csrfToken?: string;
  lastActivity?: number;
}

// Default session data
const defaultSession: SessionData = {
  isLoggedIn: false,
};

// Get session from request/response
export async function getSession(
  req?: NextRequest,
  res?: NextResponse
): Promise<IronSession<SessionData>> {
  if (req && res) {
    // For API routes with request/response objects
    return getIronSession<SessionData>(req, res, {
      cookieName: SESSION_CONFIG.cookieName,
      password: SESSION_CONFIG.password,
      cookieOptions: SESSION_CONFIG.cookieOptions,
    });
  } else {
    // For server components using cookies()
    const cookieStore = cookies();
    return getIronSession<SessionData>(cookieStore, {
      cookieName: SESSION_CONFIG.cookieName,
      password: SESSION_CONFIG.password,
      cookieOptions: SESSION_CONFIG.cookieOptions,
    });
  }
}

// Create session for admin user
export async function createAdminSession(
  adminUser: AdminUser,
  req: NextRequest,
  res: NextResponse
): Promise<void> {
  const session = await getSession(req, res);
  
  session.user = {
    uid: adminUser.uid,
    email: adminUser.email,
    role: adminUser.role,
    permissions: adminUser.permissions,
    displayName: adminUser.displayName,
    avatar: adminUser.avatar,
  };
  
  session.isLoggedIn = true;
  session.loginTime = Date.now();
  session.lastActivity = Date.now();
  
  await session.save();
}

// Destroy session
export async function destroySession(
  req: NextRequest,
  res: NextResponse
): Promise<void> {
  const session = await getSession(req, res);
  session.destroy();
}

// Update session activity
export async function updateSessionActivity(
  req: NextRequest,
  res: NextResponse
): Promise<void> {
  const session = await getSession(req, res);
  
  if (session.isLoggedIn) {
    session.lastActivity = Date.now();
    await session.save();
  }
}

// Check if session is valid
export function isSessionValid(session: SessionData): boolean {
  if (!session.isLoggedIn || !session.user || !session.loginTime) {
    return false;
  }
  
  // Check session timeout (7 days)
  const sessionTimeout = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  const now = Date.now();
  
  if (now - session.loginTime > sessionTimeout) {
    return false;
  }
  
  // Check activity timeout (24 hours)
  const activityTimeout = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  if (session.lastActivity && now - session.lastActivity > activityTimeout) {
    return false;
  }
  
  return true;
}

// Check if user has permission
export function hasPermission(session: SessionData, permission: string): boolean {
  if (!session.isLoggedIn || !session.user) {
    return false;
  }
  
  return session.user.permissions.includes(permission);
}

// Check if user has role
export function hasRole(session: SessionData, role: string): boolean {
  if (!session.isLoggedIn || !session.user) {
    return false;
  }
  
  return session.user.role === role;
}

// Check if user has any of the specified roles
export function hasAnyRole(session: SessionData, roles: string[]): boolean {
  if (!session.isLoggedIn || !session.user) {
    return false;
  }
  
  return roles.includes(session.user.role);
}

// Session middleware for API routes
export async function withSession<T = any>(
  handler: (req: NextRequest, res: NextResponse, session: IronSession<SessionData>) => Promise<T>
) {
  return async (req: NextRequest, res: NextResponse): Promise<T> => {
    const session = await getSession(req, res);
    return handler(req, res, session);
  };
}

// Admin authentication middleware
export async function requireAdmin<T = any>(
  handler: (req: NextRequest, res: NextResponse, session: IronSession<SessionData>) => Promise<T>
) {
  return async (req: NextRequest, res: NextResponse): Promise<T | NextResponse> => {
    const session = await getSession(req, res);
    
    if (!isSessionValid(session)) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return handler(req, res, session);
  };
}

// Permission-based middleware
export function requirePermission(permission: string) {
  return async function<T = any>(
    handler: (req: NextRequest, res: NextResponse, session: IronSession<SessionData>) => Promise<T>
  ) {
    return async (req: NextRequest, res: NextResponse): Promise<T | NextResponse> => {
      const session = await getSession(req, res);
      
      if (!isSessionValid(session)) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      if (!hasPermission(session, permission)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      
      return handler(req, res, session);
    };
  };
}

// Role-based middleware
export function requireRole(role: string) {
  return async function<T = any>(
    handler: (req: NextRequest, res: NextResponse, session: IronSession<SessionData>) => Promise<T>
  ) {
    return async (req: NextRequest, res: NextResponse): Promise<T | NextResponse> => {
      const session = await getSession(req, res);
      
      if (!isSessionValid(session)) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      if (!hasRole(session, role)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient role' },
          { status: 403 }
        );
      }
      
      return handler(req, res, session);
    };
  };
}

// Session cleanup utility
export async function cleanupExpiredSessions(): Promise<void> {
  // This would typically be run as a background job
  // For now, we rely on the session validation in isSessionValid
  console.log('Session cleanup would run here in a production environment');
}
