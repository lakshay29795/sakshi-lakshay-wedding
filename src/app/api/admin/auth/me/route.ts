import { NextRequest, NextResponse } from 'next/server';
import { getSession, isSessionValid, updateSessionActivity } from '@/lib/auth/session';
import { AdminUserManager } from '@/lib/auth/admin-config';
import { adminRateLimit } from '@/lib/auth/rate-limit';

export const GET = adminRateLimit(async (request: NextRequest, response: NextResponse) => {
  try {
    // Get current session
    const session = await getSession(request, response);
    
    if (!session.isLoggedIn || !isSessionValid(session)) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Update session activity
    await updateSessionActivity(request, response);
    
    // Get fresh admin user data
    const adminManager = AdminUserManager.getInstance();
    const adminUser = await adminManager.getAdminUser(session.user!.uid);
    
    if (!adminUser || !adminUser.isActive) {
      return NextResponse.json(
        { success: false, error: 'Admin user not found or inactive' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        user: {
          uid: adminUser.uid,
          email: adminUser.email,
          role: adminUser.role,
          permissions: adminUser.permissions,
          displayName: adminUser.displayName,
          avatar: adminUser.avatar,
          lastLogin: adminUser.lastLogin?.toISOString(),
          createdAt: adminUser.createdAt.toISOString(),
        },
        session: {
          loginTime: session.loginTime,
          lastActivity: session.lastActivity,
        },
      },
    });
    
  } catch (error: any) {
    console.error('Get current user error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
});
