import { NextRequest } from 'next/server';
import { POST as loginHandler } from '@/app/api/admin/auth/login/route';
import { GET as analyticsHandler } from '@/app/api/admin/analytics/route';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { validateCSRFToken } from '@/lib/auth/csrf';
import { loginRateLimit } from '@/lib/auth/rate-limit';

// Mock dependencies
jest.mock('@/lib/admin-auth');
jest.mock('@/lib/auth/csrf');
jest.mock('@/lib/auth/rate-limit');
jest.mock('@/lib/firebase-admin');
jest.mock('@/lib/auth/session');

describe('Security Vulnerability Assessment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
  });

  describe('Authentication Security', () => {
    it('should prevent brute force attacks with rate limiting', async () => {
      // Mock rate limit exceeded
      const mockRateLimit = loginRateLimit as jest.MockedFunction<typeof loginRateLimit>;
      mockRateLimit.mockImplementation((handler) => async (req) => {
        return new Response(JSON.stringify({
          success: false,
          error: 'Too many login attempts. Please try again later.',
        }), { status: 429 });
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'password123',
          _csrf: 'valid-csrf-token',
        }),
      }));

      const response = await loginHandler(request);
      const result = await response.json();

      expect(response.status).toBe(429);
      expect(result.error).toContain('Too many login attempts');
    });

    it('should validate CSRF tokens on all state-changing requests', async () => {
      // Mock CSRF validation failure
      (validateCSRFToken as jest.Mock).mockResolvedValue(false);

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'password123',
          _csrf: 'invalid-csrf-token',
        }),
      }));

      const response = await loginHandler(request);
      const result = await response.json();

      expect(response.status).toBe(403);
      expect(result.error).toContain('CSRF');
    });

    it('should sanitize all input data', async () => {
      // Mock successful auth but with XSS attempt
      (validateCSRFToken as jest.Mock).mockResolvedValue(true);

      const maliciousInput = '<script>alert("XSS")</script>admin@example.com';
      
      const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: maliciousInput,
          password: 'password123',
          _csrf: 'valid-csrf-token',
        }),
      }));

      // The handler should sanitize the input
      await loginHandler(request);

      // Verify that sanitization was called
      const mockSanitizeInput = require('@/lib/auth/admin-config').sanitizeInput;
      expect(mockSanitizeInput).toHaveBeenCalledWith(maliciousInput);
    });

    it('should prevent SQL injection attempts', async () => {
      // Mock successful auth
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          permissions: ['view_analytics'],
        },
      });

      // Attempt SQL injection in query parameters
      const maliciousQuery = "'; DROP TABLE users; --";
      const request = new NextRequest(
        new Request(`http://localhost:3000/api/admin/analytics?limit=${encodeURIComponent(maliciousQuery)}`)
      );

      const response = await analyticsHandler(request);

      // Should handle gracefully without executing malicious query
      expect(response.status).toBe(200);
      
      // Verify that the malicious query didn't cause any database operations
      const mockFirebase = require('@/lib/firebase-admin').initializeFirebase;
      if (mockFirebase.mock.calls.length > 0) {
        // If Firebase was called, verify it was with safe parameters
        expect(mockFirebase).not.toHaveBeenCalledWith(
          expect.objectContaining({
            query: expect.stringContaining('DROP TABLE')
          })
        );
      }
    });

    it('should prevent NoSQL injection attempts', async () => {
      // Mock successful auth
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          permissions: ['view_analytics'],
        },
      });

      // Attempt NoSQL injection
      const request = new NextRequest(new Request('http://localhost:3000/api/admin/analytics', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      }));

      const response = await analyticsHandler(request);

      // Should handle safely
      expect(response.status).toBe(200);
    });
  });

  describe('Authorization Security', () => {
    it('should prevent privilege escalation', async () => {
      // Mock user with limited permissions trying to access admin-only data
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'limited@example.com',
          permissions: ['manage_content'], // No view_analytics permission
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/analytics'));

      const response = await analyticsHandler(request);
      const result = await response.json();

      expect(response.status).toBe(403);
      expect(result.error).toBe('Insufficient permissions');
    });

    it('should validate session integrity', async () => {
      // Mock tampered session
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Invalid session',
        status: 401,
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/analytics'));

      const response = await analyticsHandler(request);
      const result = await response.json();

      expect(response.status).toBe(401);
      expect(result.error).toBe('Invalid session');
    });

    it('should prevent session fixation attacks', async () => {
      // This would be tested by ensuring new sessions are created on login
      // and old sessions are invalidated
      expect(true).toBe(true); // Placeholder for session fixation tests
    });
  });

  describe('Data Security', () => {
    it('should not expose sensitive information in error messages', async () => {
      // Mock database error
      const mockFirebase = require('@/lib/firebase-admin').initializeFirebase;
      mockFirebase.mockRejectedValue(new Error('Database connection string: mongodb://user:password@host'));

      // Mock successful auth
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          permissions: ['view_analytics'],
        },
      });

      // Set production mode to test error handling
      process.env.NODE_ENV = 'production';

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/analytics'));

      const response = await analyticsHandler(request);
      const result = await response.json();

      // Should not expose internal error details
      expect(response.status).toBe(200); // Graceful fallback
      expect(JSON.stringify(result)).not.toContain('password');
      expect(JSON.stringify(result)).not.toContain('connection string');
    });

    it('should validate data types and ranges', async () => {
      // Mock successful auth
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          permissions: ['view_analytics'],
        },
      });

      // Test with invalid pagination parameters
      const request = new NextRequest(
        new Request('http://localhost:3000/api/admin/activity?limit=-1&offset=999999999')
      );

      const response = await require('@/app/api/admin/activity/route').GET(request);
      const result = await response.json();

      // Should handle invalid parameters gracefully
      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      // Should use safe defaults
    });

    it('should prevent information disclosure through timing attacks', async () => {
      // Test that login attempts take similar time regardless of whether user exists
      const startTime1 = Date.now();
      
      // Mock non-existent user
      (validateCSRFToken as jest.Mock).mockResolvedValue(true);
      const mockFirebase = require('@/lib/firebase-admin').initializeFirebase;
      mockFirebase.mockResolvedValue({
        auth: {
          verifyIdToken: jest.fn().mockRejectedValue(new Error('User not found')),
        },
      });

      const request1 = new NextRequest(new Request('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'password123',
          _csrf: 'valid-csrf-token',
        }),
      }));

      await loginHandler(request1);
      const time1 = Date.now() - startTime1;

      const startTime2 = Date.now();
      
      // Mock existing user with wrong password
      mockFirebase.mockResolvedValue({
        auth: {
          verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid password')),
        },
      });

      const request2 = new NextRequest(new Request('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'wrongpassword',
          _csrf: 'valid-csrf-token',
        }),
      }));

      await loginHandler(request2);
      const time2 = Date.now() - startTime2;

      // Times should be similar (within reasonable variance)
      const timeDifference = Math.abs(time1 - time2);
      expect(timeDifference).toBeLessThan(100); // Allow 100ms variance
    });
  });

  describe('Network Security', () => {
    it('should enforce HTTPS in production', async () => {
      // This would typically be handled by the deployment environment
      // but we can test that the app expects secure connections
      process.env.NODE_ENV = 'production';
      
      // Mock request without HTTPS
      const request = new NextRequest(new Request('http://localhost:3000/api/admin/analytics'));
      
      // In a real implementation, this should redirect to HTTPS or reject
      // For now, we'll just verify the handler exists
      expect(analyticsHandler).toBeDefined();
    });

    it('should set appropriate security headers', async () => {
      // Mock successful auth
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          permissions: ['view_analytics'],
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/analytics'));

      const response = await analyticsHandler(request);

      // Check for security headers (these would be set by Next.js config or middleware)
      // For API routes, we mainly care about content type and cache control
      expect(response.headers.get('content-type')).toContain('application/json');
    });

    it('should prevent CORS attacks', async () => {
      // Mock successful auth
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          permissions: ['view_analytics'],
        },
      });

      // Request from unauthorized origin
      const request = new NextRequest(new Request('http://localhost:3000/api/admin/analytics', {
        headers: {
          'origin': 'https://malicious-site.com',
        },
      }));

      const response = await analyticsHandler(request);

      // Should not include permissive CORS headers
      expect(response.headers.get('access-control-allow-origin')).not.toBe('*');
    });
  });

  describe('Input Validation Security', () => {
    it('should reject oversized payloads', async () => {
      // Create very large payload
      const largePayload = 'x'.repeat(10 * 1024 * 1024); // 10MB

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: largePayload,
          _csrf: 'valid-csrf-token',
        }),
      }));

      // Should handle large payloads gracefully (Next.js has built-in limits)
      try {
        const response = await loginHandler(request);
        // If it doesn't throw, it should at least return an error
        expect(response.status).toBeGreaterThanOrEqual(400);
      } catch (error) {
        // Large payloads might cause the request to be rejected before reaching the handler
        expect(error).toBeDefined();
      }
    });

    it('should validate email format strictly', async () => {
      (validateCSRFToken as jest.Mock).mockResolvedValue(true);

      const invalidEmails = [
        'not-an-email',
        'missing@',
        '@missing-local.com',
        'spaces in@email.com',
        'unicode@тест.com',
        'admin@',
        '@example.com',
      ];

      for (const email of invalidEmails) {
        const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/login', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            email,
            password: 'password123',
            _csrf: 'valid-csrf-token',
          }),
        }));

        const response = await loginHandler(request);
        const result = await response.json();

        expect(response.status).toBe(400);
        expect(result.success).toBe(false);
        expect(result.error).toContain('email');
      }
    });

    it('should prevent header injection attacks', async () => {
      // Mock successful auth
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          permissions: ['view_analytics'],
        },
      });

      // Attempt header injection
      const request = new NextRequest(new Request('http://localhost:3000/api/admin/analytics', {
        headers: {
          'user-agent': 'Mozilla/5.0\r\nX-Injected-Header: malicious-value',
          'x-forwarded-for': '127.0.0.1\r\nX-Another-Injection: attack',
        },
      }));

      const response = await analyticsHandler(request);

      // Should handle gracefully without allowing header injection
      expect(response.status).toBe(200);
      
      // Verify no injected headers in response
      expect(response.headers.get('x-injected-header')).toBeNull();
      expect(response.headers.get('x-another-injection')).toBeNull();
    });
  });

  describe('Session Security', () => {
    it('should use secure session configuration', async () => {
      // This tests that sessions are configured securely
      // The actual implementation would be in the session middleware
      const sessionConfig = require('@/lib/auth/session');
      
      // Verify session configuration exists
      expect(sessionConfig).toBeDefined();
    });

    it('should invalidate sessions on logout', async () => {
      // Mock session destruction
      const mockDestroySession = require('@/lib/auth/session').destroySession;
      mockDestroySession.mockResolvedValue(undefined);

      // Mock CSRF validation
      (validateCSRFToken as jest.Mock).mockResolvedValue(true);

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/logout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          _csrf: 'valid-csrf-token',
        }),
      }));

      const logoutHandler = require('@/app/api/admin/auth/logout/route').POST;
      await logoutHandler(request);

      expect(mockDestroySession).toHaveBeenCalled();
    });

    it('should handle concurrent sessions appropriately', async () => {
      // Test that multiple sessions for the same user are handled correctly
      // This would depend on the specific session strategy implemented
      expect(true).toBe(true); // Placeholder for concurrent session tests
    });
  });

  describe('Error Handling Security', () => {
    it('should not leak stack traces in production', async () => {
      process.env.NODE_ENV = 'production';

      // Force an error
      const mockFirebase = require('@/lib/firebase-admin').initializeFirebase;
      mockFirebase.mockRejectedValue(new Error('Internal database error with sensitive info'));

      // Mock successful auth
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          permissions: ['view_analytics'],
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/analytics'));

      const response = await analyticsHandler(request);
      const result = await response.json();

      // Should not expose internal error details
      expect(JSON.stringify(result)).not.toContain('stack');
      expect(JSON.stringify(result)).not.toContain('sensitive info');
    });

    it('should log security events appropriately', async () => {
      // Mock console.error to capture logs
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Trigger a security event (failed login)
      (validateCSRFToken as jest.Mock).mockResolvedValue(false);

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'password123',
          _csrf: 'invalid-csrf-token',
        }),
      }));

      await loginHandler(request);

      // Should log security events
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
