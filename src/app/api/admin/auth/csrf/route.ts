import { NextRequest, NextResponse } from 'next/server';
import { generateCSRFToken, setCSRFToken } from '@/lib/auth/csrf';
import { apiRateLimit } from '@/lib/auth/rate-limit';

export const GET = apiRateLimit(async (request: NextRequest, response: NextResponse) => {
  try {
    // Generate new CSRF token
    const csrfToken = generateCSRFToken();
    
    // Set CSRF token in cookie
    await setCSRFToken(response, csrfToken);
    
    return NextResponse.json({
      success: true,
      csrfToken,
    });
    
  } catch (error: any) {
    console.error('CSRF token generation error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
});
