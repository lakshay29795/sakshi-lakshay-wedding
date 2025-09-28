import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  try {
    // Only apply middleware to admin routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      // For now, just add basic security headers and allow all requests
      // The actual authentication will be handled in the API routes themselves
      const response = NextResponse.next();
      
      // Add basic security headers
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      
      return response;
    }
    
    // For non-admin routes, just continue
    return NextResponse.next();
    
  } catch (error) {
    console.error('Middleware error:', error);
    
    // For any errors, just continue normally
    return NextResponse.next();
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
