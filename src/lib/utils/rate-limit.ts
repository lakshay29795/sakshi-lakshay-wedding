import { NextRequest } from 'next/server';

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limit by IP address
 */
export async function rateLimitByIP(
  request: NextRequest,
  maxRequests: number,
  windowSeconds: number
): Promise<{ success: boolean; remaining?: number; resetTime?: number }> {
  const ip = getClientIP(request);
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const resetTime = now + windowMs;

  const current = rateLimitMap.get(ip);

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  if (!current || current.resetTime < now) {
    // Reset or initialize
    rateLimitMap.set(ip, { count: 1, resetTime });
    return { 
      success: true, 
      remaining: maxRequests - 1,
      resetTime 
    };
  }

  if (current.count >= maxRequests) {
    return { 
      success: false, 
      remaining: 0,
      resetTime: current.resetTime 
    };
  }

  current.count++;
  return { 
    success: true, 
    remaining: maxRequests - current.count,
    resetTime: current.resetTime 
  };
}

/**
 * Rate limit by email address
 */
export async function rateLimitByEmail(
  email: string,
  maxRequests: number,
  windowSeconds: number
): Promise<{ success: boolean; remaining?: number; resetTime?: number }> {
  const key = `email:${email.toLowerCase()}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const resetTime = now + windowMs;

  const current = rateLimitMap.get(key);

  if (!current || current.resetTime < now) {
    rateLimitMap.set(key, { count: 1, resetTime });
    return { 
      success: true, 
      remaining: maxRequests - 1,
      resetTime 
    };
  }

  if (current.count >= maxRequests) {
    return { 
      success: false, 
      remaining: 0,
      resetTime: current.resetTime 
    };
  }

  current.count++;
  return { 
    success: true, 
    remaining: maxRequests - current.count,
    resetTime: current.resetTime 
  };
}

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  // Try various headers for IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to request.ip or unknown
  return request.ip || 'unknown';
}

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];

  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      keysToDelete.push(key);
    }
  }

  for (const key of keysToDelete) {
    rateLimitMap.delete(key);
  }
}

/**
 * Clear all rate limit data (useful for testing)
 */
export function clearRateLimitData(): void {
  rateLimitMap.clear();
}

/**
 * Get current rate limit status for debugging
 */
export function getRateLimitStatus(): Map<string, { count: number; resetTime: number }> {
  return new Map(rateLimitMap);
}
