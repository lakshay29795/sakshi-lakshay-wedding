import { NextRequest, NextResponse } from 'next/server';
import { destroySession, getSession } from '@/lib/auth/session';
import { adminRateLimit } from '@/lib/auth/rate-limit';
import { withCSRFProtection } from '@/lib/auth/csrf';
// Get client info utility
function getClientInfo(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  const ip = cfConnectingIp || realIp || forwarded?.split(',')[0] || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return { ip, userAgent };
}

export const POST = adminRateLimit(
  withCSRFProtection(async (request: NextRequest, response: NextResponse) => {
    try {
      // Get current session
      const session = await getSession(request, response);
      
      if (!session.isLoggedIn) {
        return NextResponse.json(
          { success: false, error: 'Not logged in' },
          { status: 401 }
        );
      }
      
      const clientInfo = getClientInfo(request);
      
      // Log logout attempt
      console.log('Admin logout:', {
        user: session.user?.email,
        uid: session.user?.uid,
        ip: clientInfo.ip,
        timestamp: new Date().toISOString(),
      });
      
      // Destroy session
      await destroySession(request, response);
      
      // Clear CSRF token cookie
      response.cookies.delete('__Host-csrf-token');
      
      // Set security headers
      response.headers.set('Clear-Site-Data', '"cookies", "storage"');
      
      return NextResponse.json({
        success: true,
        message: 'Logged out successfully',
      });
      
    } catch (error: any) {
      console.error('Logout error:', error);
      
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  })
);

// Handle GET requests for logout (for convenience)
export const GET = async (request: NextRequest, response: NextResponse) => {
  return POST(request, response);
};
