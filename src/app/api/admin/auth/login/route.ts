import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase/config';
import { AdminUserManager, sanitizeInput, validateEmail } from '@/lib/auth/admin-config';
import { createAdminSession, getSession } from '@/lib/auth/session';
import { loginRateLimit } from '@/lib/auth/rate-limit';
import { withCSRFProtection, setCSRFToken } from '@/lib/auth/csrf';
// Get client info utility
function getClientInfo(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  const ip = cfConnectingIp || realIp || forwarded?.split(',')[0] || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return { ip, userAgent };
}

// Login request validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

// Login attempt logging
interface LoginAttempt {
  email: string;
  ip: string;
  userAgent: string;
  success: boolean;
  timestamp: Date;
  reason?: string;
}

const loginAttempts: LoginAttempt[] = [];

function logLoginAttempt(attempt: LoginAttempt): void {
  loginAttempts.push(attempt);
  
  // Keep only last 1000 attempts in memory
  if (loginAttempts.length > 1000) {
    loginAttempts.splice(0, loginAttempts.length - 1000);
  }
  
  console.log('Login attempt:', {
    email: attempt.email,
    success: attempt.success,
    ip: attempt.ip,
    reason: attempt.reason,
  });
}

export const POST = loginRateLimit(
  withCSRFProtection(async (request: NextRequest, response: NextResponse) => {
    try {
      // Parse and validate request body
      const body = await request.json();
      const { email, password, rememberMe } = loginSchema.parse(body);
      
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());
      
      // Additional email validation
      if (!validateEmail(sanitizedEmail)) {
        const clientInfo = getClientInfo(request);
        logLoginAttempt({
          email: sanitizedEmail,
          ip: clientInfo.ip,
          userAgent: clientInfo.userAgent,
          success: false,
          timestamp: new Date(),
          reason: 'Invalid email format',
        });
        
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      
      // Check if user is already logged in
      const existingSession = await getSession(request, response);
      if (existingSession.isLoggedIn) {
        return NextResponse.json(
          { success: false, error: 'Already logged in' },
          { status: 400 }
        );
      }
      
      const clientInfo = getClientInfo(request);
      const auth = getAuth(app);
      const adminManager = AdminUserManager.getInstance();
      
      try {
        // Authenticate with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail, password);
        const user = userCredential.user;
        
        // Get ID token and verify admin claims
        const idToken = await user.getIdToken();
        const adminVerification = await adminManager.verifyAdminToken(idToken);
        
        if (!adminVerification) {
          logLoginAttempt({
            email: sanitizedEmail,
            ip: clientInfo.ip,
            userAgent: clientInfo.userAgent,
            success: false,
            timestamp: new Date(),
            reason: 'Not an admin user',
          });
          
          return NextResponse.json(
            { success: false, error: 'Access denied' },
            { status: 403 }
          );
        }
        
        // Get admin user details
        const adminUser = await adminManager.getAdminUser(user.uid);
        
        if (!adminUser || !adminUser.isActive) {
          logLoginAttempt({
            email: sanitizedEmail,
            ip: clientInfo.ip,
            userAgent: clientInfo.userAgent,
            success: false,
            timestamp: new Date(),
            reason: 'Admin user not found or inactive',
          });
          
          return NextResponse.json(
            { success: false, error: 'Access denied' },
            { status: 403 }
          );
        }
        
        // Create admin session
        await createAdminSession(adminUser, request, response);
        
        // Update last login time
        await adminManager.updateLastLogin(user.uid);
        
        // Generate new CSRF token
        const csrfToken = await setCSRFToken(response);
        
        // Log successful login
        logLoginAttempt({
          email: sanitizedEmail,
          ip: clientInfo.ip,
          userAgent: clientInfo.userAgent,
          success: true,
          timestamp: new Date(),
        });
        
        // Return success response
        return NextResponse.json({
          success: true,
          data: {
            user: {
              uid: adminUser.uid,
              email: adminUser.email,
              role: adminUser.role,
              permissions: adminUser.permissions,
              displayName: adminUser.displayName,
            },
            csrfToken,
          },
          message: 'Login successful',
        });
        
      } catch (authError: any) {
        let reason = 'Authentication failed';
        
        if (authError.code === 'auth/user-not-found') {
          reason = 'User not found';
        } else if (authError.code === 'auth/wrong-password') {
          reason = 'Invalid password';
        } else if (authError.code === 'auth/too-many-requests') {
          reason = 'Too many failed attempts';
        } else if (authError.code === 'auth/user-disabled') {
          reason = 'User account disabled';
        }
        
        logLoginAttempt({
          email: sanitizedEmail,
          ip: clientInfo.ip,
          userAgent: clientInfo.userAgent,
          success: false,
          timestamp: new Date(),
          reason,
        });
        
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { success: false, error: 'Invalid input data', details: error.errors },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  })
);

// Get login attempts (admin only)
export const GET = loginRateLimit(async (request: NextRequest) => {
  try {
    const session = await getSession();
    
    if (!session.isLoggedIn || session.user?.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const paginatedAttempts = loginAttempts
      .slice(-1000) // Last 1000 attempts
      .reverse() // Most recent first
      .slice(offset, offset + limit);
    
    return NextResponse.json({
      success: true,
      data: {
        attempts: paginatedAttempts,
        total: loginAttempts.length,
        limit,
        offset,
      },
    });
    
  } catch (error: any) {
    console.error('Get login attempts error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
});
