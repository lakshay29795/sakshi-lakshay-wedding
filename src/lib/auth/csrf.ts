import { NextRequest, NextResponse } from 'next/server';
import { CSRF_CONFIG } from './admin-config';

// Edge-compatible CSRF token generation (using Web Crypto API)
export function generateCSRFToken(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback for environments without Web Crypto API
  return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}

// Create CSRF token hash (Edge-compatible)
export async function createCSRFHash(token: string, secret: string = CSRF_CONFIG.secret): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(token + secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback - simple hash (not cryptographically secure, for development only)
  let hash = 0;
  const str = token + secret;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

// Verify CSRF token
export async function verifyCSRFToken(token: string, hash: string, secret: string = CSRF_CONFIG.secret): Promise<boolean> {
  const expectedHash = await createCSRFHash(token, secret);
  return hash === expectedHash;
}

// Set CSRF token in response
export async function setCSRFToken(response: NextResponse, token?: string): Promise<string> {
  const csrfToken = token || generateCSRFToken();
  const csrfHash = await createCSRFHash(csrfToken);
  
  // Set CSRF token in cookie
  response.cookies.set(CSRF_CONFIG.cookieName, csrfHash, CSRF_CONFIG.cookieOptions);
  
  return csrfToken;
}

// Get CSRF token from request
export async function getCSRFTokenFromRequest(request: NextRequest): Promise<string | null> {
  // Try header first
  const headerToken = request.headers.get(CSRF_CONFIG.headerName);
  if (headerToken) {
    return headerToken;
  }
  
  // Try form data for POST requests
  if (request.method === 'POST') {
    try {
      const formData = await request.formData();
      return formData.get('_csrf') as string || null;
    } catch {
      // Ignore form data parsing errors
      return null;
    }
  }
  
  return null;
}

// Get CSRF hash from cookie
export function getCSRFHashFromCookie(request: NextRequest): string | null {
  return request.cookies.get(CSRF_CONFIG.cookieName)?.value || null;
}

// Validate CSRF token from request
export async function validateCSRFToken(request: NextRequest): Promise<boolean> {
  // Skip CSRF validation for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return true;
  }
  
  const token = await getCSRFTokenFromRequest(request);
  const hash = getCSRFHashFromCookie(request);
  
  if (!token || !hash) {
    return false;
  }
  
  return await verifyCSRFToken(token, hash);
}

// CSRF middleware
export function withCSRFProtection<T = any>(
  handler: (req: NextRequest, res: NextResponse) => Promise<T>
) {
  return async (req: NextRequest, res: NextResponse): Promise<T | NextResponse> => {
    // Validate CSRF token
    const isValidCSRF = await validateCSRFToken(req);
    
    if (!isValidCSRF) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'CSRF token validation failed',
          code: 'CSRF_INVALID'
        },
        { status: 403 }
      );
    }
    
    return handler(req, res);
  };
}

// Generate CSRF token for forms
export async function getCSRFTokenForForm(request: NextRequest): Promise<string> {
  const token = generateCSRFToken();
  const hash = createCSRFHash(token);
  
  // Store hash in session or return it to be set in cookie
  return token;
}

// CSRF token component helper interface
export interface CSRFTokenProps {
  token: string;
}

// Hook for CSRF token in React components
export function useCSRFToken(): {
  token: string | null;
  setToken: (token: string) => void;
  getHeaders: () => Record<string, string>;
} {
  // This would be implemented as a React hook in a real component
  // For now, providing the interface
  
  return {
    token: null,
    setToken: (token: string) => {
      // Store token in state or context
    },
    getHeaders: () => ({
      [CSRF_CONFIG.headerName]: '', // Would return actual token
    }),
  };
}

// Utility to add CSRF token to fetch requests
export function addCSRFToFetch(token: string) {
  return {
    headers: {
      [CSRF_CONFIG.headerName]: token,
      'Content-Type': 'application/json',
    },
  };
}

// Double submit cookie pattern implementation
export class CSRFProtection {
  private static instance: CSRFProtection;
  
  private constructor() {}
  
  static getInstance(): CSRFProtection {
    if (!CSRFProtection.instance) {
      CSRFProtection.instance = new CSRFProtection();
    }
    return CSRFProtection.instance;
  }
  
  generateToken(): string {
    return generateCSRFToken();
  }
  
  setTokenCookie(response: NextResponse, token: string): void {
    const hash = createCSRFHash(token);
    response.cookies.set(CSRF_CONFIG.cookieName, hash, CSRF_CONFIG.cookieOptions);
  }
  
  async validateRequest(request: NextRequest): Promise<boolean> {
    return validateCSRFToken(request);
  }
  
  getTokenFromHeader(request: NextRequest): string | null {
    return request.headers.get(CSRF_CONFIG.headerName);
  }
  
  createSecureHeaders(): Record<string, string> {
    return {
      'X-CSRF-Protection': '1',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    };
  }
}

// Export singleton instance
export const csrfProtection = CSRFProtection.getInstance();
