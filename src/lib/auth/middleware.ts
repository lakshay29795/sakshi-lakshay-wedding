import { NextRequest, NextResponse } from 'next/server';
import { getSession, isSessionValid } from './session';
import { SECURITY_HEADERS } from './admin-config';
import { validateCSRFToken } from './csrf';
import { rateLimitMonitor } from './rate-limit';

// Admin route patterns
const ADMIN_ROUTES = [
  '/admin',
  '/api/admin',
];

const PUBLIC_ADMIN_ROUTES = [
  '/admin/login',
  '/api/admin/auth/login',
  '/api/admin/auth/csrf',
];

// Check if route requires admin authentication
export function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => pathname.startsWith(route));
}

// Check if route is public admin route
export function isPublicAdminRoute(pathname: string): boolean {
  return PUBLIC_ADMIN_ROUTES.some(route => pathname.startsWith(route));
}

// Admin authentication middleware
export async function adminAuthMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;
  
  // Skip non-admin routes
  if (!isAdminRoute(pathname)) {
    return null;
  }
  
  // Allow public admin routes
  if (isPublicAdminRoute(pathname)) {
    return addSecurityHeaders(NextResponse.next());
  }
  
  try {
    // Get session
    const session = await getSession();
    
    // Check if session is valid
    if (!session.isLoggedIn || !isSessionValid(session)) {
      // Redirect to login for page requests
      if (!pathname.startsWith('/api/')) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // Return 401 for API requests
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }
    
    // Validate CSRF for state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      const isValidCSRF = await validateCSRFToken(request);
      
      if (!isValidCSRF) {
        rateLimitMonitor.recordViolation(
          getClientIdentifier(request),
          'csrf_violation'
        );
        
        return NextResponse.json(
          { success: false, error: 'CSRF token validation failed' },
          { status: 403, headers: getSecurityHeaders() }
        );
      }
    }
    
    // Add user info to request headers for downstream handlers
    const response = NextResponse.next();
    response.headers.set('x-admin-user-id', session.user!.uid);
    response.headers.set('x-admin-user-role', session.user!.role);
    response.headers.set('x-admin-permissions', JSON.stringify(session.user!.permissions));
    
    return addSecurityHeaders(response);
    
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    
    // Redirect to login for page requests
    if (!pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // Return 500 for API requests
    return NextResponse.json(
      { success: false, error: 'Authentication error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// Permission-based middleware
export function requirePermission(permission: string) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    try {
      const session = await getSession();
      
      if (!session.isLoggedIn || !isSessionValid(session)) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      if (!session.user?.permissions.includes(permission)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      
      return null; // Allow request to continue
      
    } catch (error) {
      console.error('Permission middleware error:', error);
      
      return NextResponse.json(
        { success: false, error: 'Permission check failed' },
        { status: 500 }
      );
    }
  };
}

// Role-based middleware
export function requireRole(role: string) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    try {
      const session = await getSession();
      
      if (!session.isLoggedIn || !isSessionValid(session)) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      if (session.user?.role !== role) {
        return NextResponse.json(
          { success: false, error: 'Insufficient role' },
          { status: 403 }
        );
      }
      
      return null; // Allow request to continue
      
    } catch (error) {
      console.error('Role middleware error:', error);
      
      return NextResponse.json(
        { success: false, error: 'Role check failed' },
        { status: 500 }
      );
    }
  };
}

// Security headers helper
export function getSecurityHeaders(): Headers {
  const headers = new Headers();
  
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    headers.set(key, value);
  });
  
  return headers;
}

// Add security headers to response
export function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

// Get client identifier for rate limiting
export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  const ip = cfConnectingIp || realIp || forwarded?.split(',')[0] || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const userAgentHash = Buffer.from(userAgent).toString('base64').slice(0, 10);
  
  return `${ip}:${userAgentHash}`;
}

// Audit logging middleware
export async function auditLogMiddleware(
  request: NextRequest,
  action: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    const session = await getSession();
    const clientInfo = {
      ip: getClientIdentifier(request),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
    };
    
    const auditLog = {
      timestamp: new Date().toISOString(),
      action,
      user: session.user ? {
        uid: session.user.uid,
        email: session.user.email,
        role: session.user.role,
      } : null,
      request: {
        method: request.method,
        url: request.url,
        ...clientInfo,
      },
      details: details || {},
    };
    
    // Log to console (in production, this would go to a proper audit log)
    console.log('Admin Audit Log:', JSON.stringify(auditLog, null, 2));
    
    // In production, you would store this in a database or logging service
    
  } catch (error) {
    console.error('Audit logging error:', error);
  }
}

// Session timeout middleware
export async function sessionTimeoutMiddleware(request: NextRequest): Promise<NextResponse | null> {
  try {
    const session = await getSession();
    
    if (session.isLoggedIn && session.lastActivity) {
      const now = Date.now();
      const inactivityTimeout = 24 * 60 * 60 * 1000; // 24 hours
      
      if (now - session.lastActivity > inactivityTimeout) {
        // Session expired due to inactivity
        session.destroy();
        
        const { pathname } = request.nextUrl;
        
        if (!pathname.startsWith('/api/')) {
          return NextResponse.redirect(new URL('/admin/login?expired=true', request.url));
        }
        
        return NextResponse.json(
          { success: false, error: 'Session expired due to inactivity' },
          { status: 401 }
        );
      }
    }
    
    return null; // Continue with request
    
  } catch (error) {
    console.error('Session timeout middleware error:', error);
    return null;
  }
}

// Content Security Policy middleware
export function addCSPHeaders(response: NextResponse): NextResponse {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://firebaseapp.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://firebaseapp.com https://*.firebaseapp.com wss:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  return response;
}
