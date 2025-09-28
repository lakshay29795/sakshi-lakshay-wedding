import { NextRequest, NextResponse } from 'next/server';
import { RATE_LIMIT_CONFIG } from './admin-config';

// Rate limit store interface
interface RateLimitStore {
  get(key: string): Promise<number | null>;
  set(key: string, value: number, ttl: number): Promise<void>;
  increment(key: string, ttl: number): Promise<number>;
  delete(key: string): Promise<void>;
}

// In-memory rate limit store (for development)
class MemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, { value: number; expires: number }>();
  
  async get(key: string): Promise<number | null> {
    const item = this.store.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() > item.expires) {
      this.store.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  async set(key: string, value: number, ttl: number): Promise<void> {
    this.store.set(key, {
      value,
      expires: Date.now() + ttl,
    });
  }
  
  async increment(key: string, ttl: number): Promise<number> {
    const current = await this.get(key);
    const newValue = (current || 0) + 1;
    await this.set(key, newValue, ttl);
    return newValue;
  }
  
  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
  
  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (now > item.expires) {
        this.store.delete(key);
      }
    }
  }
}

// Redis rate limit store (for production)
class RedisRateLimitStore implements RateLimitStore {
  private redis: any; // Would be Redis client
  
  constructor(redisClient?: any) {
    this.redis = redisClient;
  }
  
  async get(key: string): Promise<number | null> {
    if (!this.redis) return null;
    
    const value = await this.redis.get(key);
    return value ? parseInt(value, 10) : null;
  }
  
  async set(key: string, value: number, ttl: number): Promise<void> {
    if (!this.redis) return;
    
    await this.redis.setex(key, Math.ceil(ttl / 1000), value);
  }
  
  async increment(key: string, ttl: number): Promise<number> {
    if (!this.redis) return 1;
    
    const multi = this.redis.multi();
    multi.incr(key);
    multi.expire(key, Math.ceil(ttl / 1000));
    const results = await multi.exec();
    
    return results[0][1];
  }
  
  async delete(key: string): Promise<void> {
    if (!this.redis) return;
    
    await this.redis.del(key);
  }
}

// Rate limiter class
export class RateLimiter {
  private store: RateLimitStore;
  
  constructor(store?: RateLimitStore) {
    this.store = store || new MemoryRateLimitStore();
  }
  
  async check(
    identifier: string,
    windowMs: number,
    maxRequests: number
  ): Promise<{
    success: boolean;
    remaining: number;
    resetTime: number;
    total: number;
  }> {
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    try {
      const current = await this.store.increment(key, windowMs);
      const remaining = Math.max(0, maxRequests - current);
      const resetTime = now + windowMs;
      
      return {
        success: current <= maxRequests,
        remaining,
        resetTime,
        total: current,
      };
    } catch (error) {
      console.error('Rate limiter error:', error);
      
      // Fail open - allow request if rate limiter fails
      return {
        success: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs,
        total: 1,
      };
    }
  }
  
  async reset(identifier: string): Promise<void> {
    const key = `rate_limit:${identifier}`;
    await this.store.delete(key);
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter();

// Export the global rate limiter instance
export { rateLimiter };

// Get client identifier for rate limiting
export function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  const ip = cfConnectingIp || realIp || forwarded?.split(',')[0] || 'unknown';
  
  // Include user agent for additional uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const userAgentHash = Buffer.from(userAgent).toString('base64').slice(0, 10);
  
  return `${ip}:${userAgentHash}`;
}

// Rate limit middleware factory
export function createRateLimitMiddleware(
  windowMs: number,
  maxRequests: number,
  message?: string
) {
  return async function<T = any>(
    handler: (req: NextRequest, res: NextResponse) => Promise<T>
  ) {
    return async (req: NextRequest, res: NextResponse): Promise<T | NextResponse> => {
      const identifier = getClientIdentifier(req);
      const result = await rateLimiter.check(identifier, windowMs, maxRequests);
      
      // Add rate limit headers
      const headers = new Headers();
      headers.set('X-RateLimit-Limit', maxRequests.toString());
      headers.set('X-RateLimit-Remaining', result.remaining.toString());
      headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString());
      
      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: message || 'Rate limit exceeded',
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
          },
          {
            status: 429,
            headers,
          }
        );
      }
      
      const response = await handler(req, res);
      
      // Add rate limit headers to successful responses
      if (response instanceof NextResponse) {
        headers.forEach((value, key) => {
          response.headers.set(key, value);
        });
      }
      
      return response;
    };
  };
}

// Predefined rate limiters
export const loginRateLimit = createRateLimitMiddleware(
  RATE_LIMIT_CONFIG.login.windowMs,
  RATE_LIMIT_CONFIG.login.max,
  RATE_LIMIT_CONFIG.login.message
);

export const apiRateLimit = createRateLimitMiddleware(
  RATE_LIMIT_CONFIG.api.windowMs,
  RATE_LIMIT_CONFIG.api.max,
  RATE_LIMIT_CONFIG.api.message
);

export const adminRateLimit = createRateLimitMiddleware(
  RATE_LIMIT_CONFIG.admin.windowMs,
  RATE_LIMIT_CONFIG.admin.max,
  RATE_LIMIT_CONFIG.admin.message
);

// Advanced rate limiting with different strategies
export class AdvancedRateLimiter {
  private limiter: RateLimiter;
  
  constructor(store?: RateLimitStore) {
    this.limiter = new RateLimiter(store);
  }
  
  // Sliding window rate limiter
  async slidingWindow(
    identifier: string,
    windowMs: number,
    maxRequests: number
  ): Promise<{ success: boolean; remaining: number }> {
    const result = await this.limiter.check(identifier, windowMs, maxRequests);
    return {
      success: result.success,
      remaining: result.remaining,
    };
  }
  
  // Token bucket rate limiter
  async tokenBucket(
    identifier: string,
    capacity: number,
    refillRate: number,
    tokensRequested: number = 1
  ): Promise<{ success: boolean; tokensRemaining: number }> {
    // Simplified token bucket implementation
    const key = `token_bucket:${identifier}`;
    const now = Date.now();
    
    // This would need more sophisticated implementation in production
    const result = await this.limiter.check(identifier, 60000, capacity);
    
    return {
      success: result.remaining >= tokensRequested,
      tokensRemaining: result.remaining,
    };
  }
  
  // Exponential backoff rate limiter
  async exponentialBackoff(
    identifier: string,
    baseDelayMs: number,
    maxDelayMs: number,
    attempts: number
  ): Promise<{ success: boolean; delayMs: number }> {
    const delayMs = Math.min(
      baseDelayMs * Math.pow(2, attempts - 1),
      maxDelayMs
    );
    
    const result = await this.limiter.check(identifier, delayMs, 1);
    
    return {
      success: result.success,
      delayMs: result.success ? 0 : delayMs,
    };
  }
}

// Rate limit bypass for admin users
export async function bypassRateLimit(
  request: NextRequest,
  userRole?: string
): Promise<boolean> {
  // Allow super admins to bypass rate limits
  if (userRole === 'super_admin') {
    return true;
  }
  
  // Check for bypass token in headers
  const bypassToken = request.headers.get('x-rate-limit-bypass');
  const validBypassToken = process.env.RATE_LIMIT_BYPASS_TOKEN;
  
  if (bypassToken && validBypassToken && bypassToken === validBypassToken) {
    return true;
  }
  
  return false;
}

// Rate limit monitoring and alerting
export class RateLimitMonitor {
  private static instance: RateLimitMonitor;
  private alerts: Map<string, number> = new Map();
  
  static getInstance(): RateLimitMonitor {
    if (!RateLimitMonitor.instance) {
      RateLimitMonitor.instance = new RateLimitMonitor();
    }
    return RateLimitMonitor.instance;
  }
  
  recordViolation(identifier: string, endpoint: string): void {
    const key = `${identifier}:${endpoint}`;
    const count = this.alerts.get(key) || 0;
    this.alerts.set(key, count + 1);
    
    // Alert after 5 violations
    if (count + 1 >= 5) {
      this.sendAlert(identifier, endpoint, count + 1);
    }
  }
  
  private sendAlert(identifier: string, endpoint: string, count: number): void {
    console.warn(`Rate limit violation alert: ${identifier} hit ${endpoint} ${count} times`);
    
    // In production, this would send alerts to monitoring systems
    // like Slack, email, or logging services
  }
  
  getViolations(identifier: string): number {
    let total = 0;
    for (const [key, count] of this.alerts.entries()) {
      if (key.startsWith(identifier)) {
        total += count;
      }
    }
    return total;
  }
  
  clearViolations(identifier: string): void {
    for (const key of this.alerts.keys()) {
      if (key.startsWith(identifier)) {
        this.alerts.delete(key);
      }
    }
  }
}

export const rateLimitMonitor = RateLimitMonitor.getInstance();
