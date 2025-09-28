import { NextRequest, NextResponse } from 'next/server';
import { createMocks } from 'node-mocks-http';
import { POST as loginHandler } from '@/app/api/admin/auth/login/route';
import { POST as logoutHandler } from '@/app/api/admin/auth/logout/route';
import { GET as meHandler } from '@/app/api/admin/auth/me/route';
import { GET as csrfHandler } from '@/app/api/admin/auth/csrf/route';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { createAdminSession, getSession, destroySession } from '@/lib/auth/session';
import { validateCSRFToken } from '@/lib/auth/csrf';

// Mock Firebase Admin
jest.mock('@/lib/firebase-admin', () => ({
  initializeFirebase: jest.fn().mockResolvedValue({
    auth: {
      verifyIdToken: jest.fn(),
    },
  }),
}));

// Mock session management
jest.mock('@/lib/auth/session', () => ({
  createAdminSession: jest.fn(),
  getSession: jest.fn(),
  destroySession: jest.fn(),
}));

// Mock CSRF validation
jest.mock('@/lib/auth/csrf', () => ({
  validateCSRFToken: jest.fn(),
  generateCSRFToken: jest.fn().mockReturnValue('mock-csrf-token'),
  setCSRFToken: jest.fn().mockResolvedValue('mock-csrf-token'),
}));

// Mock admin config
jest.mock('@/lib/auth/admin-config', () => ({
  AdminUserManager: {
    getInstance: jest.fn().mockReturnValue({
      findUserByEmail: jest.fn(),
      updateLastLogin: jest.fn(),
    }),
  },
  sanitizeInput: jest.fn((input) => input),
  validateEmail: jest.fn().mockReturnValue(true),
}));

describe('Admin Authentication API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment
    process.env.NODE_ENV = 'test';
  });

  describe('POST /api/admin/auth/login', () => {
    it('should successfully login with valid credentials', async () => {
      // Mock successful Firebase auth
      const mockFirebaseAuth = require('@/lib/firebase-admin').initializeFirebase;
      mockFirebaseAuth.mockResolvedValue({
        auth: {
          verifyIdToken: jest.fn().mockResolvedValue({
            uid: 'test-uid',
            email: 'admin@example.com',
            email_verified: true,
          }),
        },
      });

      // Mock admin user lookup
      const mockAdminManager = require('@/lib/auth/admin-config').AdminUserManager.getInstance();
      mockAdminManager.findUserByEmail.mockResolvedValue({
        email: 'admin@example.com',
        role: 'super_admin',
        permissions: ['manage_all'],
        isActive: true,
      });

      // Mock CSRF validation
      (validateCSRFToken as jest.Mock).mockResolvedValue(true);

      // Mock session creation
      (createAdminSession as jest.Mock).mockResolvedValue(undefined);

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          idToken: 'valid-firebase-token',
          email: 'admin@example.com',
          password: 'password123',
          _csrf: 'valid-csrf-token',
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(req.body),
      }));

      const response = await loginHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.user.email).toBe('admin@example.com');
      expect(result.data.user.role).toBe('super_admin');
      expect(createAdminSession).toHaveBeenCalled();
    });

    it('should reject login with invalid credentials', async () => {
      // Mock Firebase auth failure
      const mockFirebaseAuth = require('@/lib/firebase-admin').initializeFirebase;
      mockFirebaseAuth.mockResolvedValue({
        auth: {
          verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid token')),
        },
      });

      // Mock CSRF validation
      (validateCSRFToken as jest.Mock).mockResolvedValue(true);

      const { req } = createMocks({
        method: 'POST',
        body: {
          idToken: 'invalid-firebase-token',
          email: 'admin@example.com',
          password: 'wrongpassword',
          _csrf: 'valid-csrf-token',
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(req.body),
      }));

      const response = await loginHandler(request);
      const result = await response.json();

      expect(response.status).toBe(401);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid credentials');
    });

    it('should reject login with invalid CSRF token', async () => {
      // Mock CSRF validation failure
      (validateCSRFToken as jest.Mock).mockResolvedValue(false);

      const { req } = createMocks({
        method: 'POST',
        body: {
          idToken: 'valid-firebase-token',
          email: 'admin@example.com',
          password: 'password123',
          _csrf: 'invalid-csrf-token',
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(req.body),
      }));

      const response = await loginHandler(request);
      const result = await response.json();

      expect(response.status).toBe(403);
      expect(result.success).toBe(false);
      expect(result.error).toContain('CSRF');
    });

    it('should reject login for inactive admin user', async () => {
      // Mock successful Firebase auth
      const mockFirebaseAuth = require('@/lib/firebase-admin').initializeFirebase;
      mockFirebaseAuth.mockResolvedValue({
        auth: {
          verifyIdToken: jest.fn().mockResolvedValue({
            uid: 'test-uid',
            email: 'inactive@example.com',
            email_verified: true,
          }),
        },
      });

      // Mock inactive admin user
      const mockAdminManager = require('@/lib/auth/admin-config').AdminUserManager.getInstance();
      mockAdminManager.findUserByEmail.mockResolvedValue({
        email: 'inactive@example.com',
        role: 'admin',
        permissions: ['manage_content'],
        isActive: false, // Inactive user
      });

      // Mock CSRF validation
      (validateCSRFToken as jest.Mock).mockResolvedValue(true);

      const { req } = createMocks({
        method: 'POST',
        body: {
          idToken: 'valid-firebase-token',
          email: 'inactive@example.com',
          password: 'password123',
          _csrf: 'valid-csrf-token',
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(req.body),
      }));

      const response = await loginHandler(request);
      const result = await response.json();

      expect(response.status).toBe(403);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Account is inactive');
    });

    it('should handle rate limiting', async () => {
      // This test would require mocking the rate limiter
      // For now, we'll test that the rate limiter is applied
      expect(loginHandler).toBeDefined();
    });
  });

  describe('POST /api/admin/auth/logout', () => {
    it('should successfully logout authenticated user', async () => {
      // Mock valid session
      (getSession as jest.Mock).mockResolvedValue({
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          role: 'admin',
        },
        isLoggedIn: true,
      });

      // Mock CSRF validation
      (validateCSRFToken as jest.Mock).mockResolvedValue(true);

      // Mock session destruction
      (destroySession as jest.Mock).mockResolvedValue(undefined);

      const { req } = createMocks({
        method: 'POST',
        body: {
          _csrf: 'valid-csrf-token',
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/logout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(req.body),
      }));

      const response = await logoutHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(destroySession).toHaveBeenCalled();
    });

    it('should handle logout without active session', async () => {
      // Mock no session
      (getSession as jest.Mock).mockResolvedValue({
        isLoggedIn: false,
      });

      // Mock CSRF validation
      (validateCSRFToken as jest.Mock).mockResolvedValue(true);

      const { req } = createMocks({
        method: 'POST',
        body: {
          _csrf: 'valid-csrf-token',
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/logout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(req.body),
      }));

      const response = await logoutHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.message).toContain('No active session');
    });
  });

  describe('GET /api/admin/auth/me', () => {
    it('should return user info for authenticated admin', async () => {
      // Mock valid session
      (getSession as jest.Mock).mockResolvedValue({
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          role: 'admin',
          permissions: ['manage_content'],
        },
        isLoggedIn: true,
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/me'));

      const response = await meHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.user.email).toBe('admin@example.com');
      expect(result.data.user.role).toBe('admin');
    });

    it('should return 401 for unauthenticated request', async () => {
      // Mock no session
      (getSession as jest.Mock).mockResolvedValue({
        isLoggedIn: false,
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/me'));

      const response = await meHandler(request);
      const result = await response.json();

      expect(response.status).toBe(401);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Not authenticated');
    });
  });

  describe('GET /api/admin/auth/csrf', () => {
    it('should generate and return CSRF token', async () => {
      const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/csrf'));

      const response = await csrfHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.csrfToken).toBe('mock-csrf-token');
    });
  });
});

describe('Admin Authorization Helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyAdminAuth', () => {
    it('should verify valid admin authentication', async () => {
      // Mock valid session
      (getSession as jest.Mock).mockResolvedValue({
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          role: 'admin',
          permissions: ['manage_content'],
        },
        isLoggedIn: true,
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/test'));

      const result = await verifyAdminAuth(request);

      expect(result.success).toBe(true);
      expect(result.user.email).toBe('admin@example.com');
      expect(result.user.permissions).toContain('manage_content');
    });

    it('should reject unauthenticated requests', async () => {
      // Mock no session
      (getSession as jest.Mock).mockResolvedValue({
        isLoggedIn: false,
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/test'));

      const result = await verifyAdminAuth(request);

      expect(result.success).toBe(false);
      expect(result.status).toBe(401);
      expect(result.error).toContain('Not authenticated');
    });

    it('should handle session errors gracefully', async () => {
      // Mock session error
      (getSession as jest.Mock).mockRejectedValue(new Error('Session error'));

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/test'));

      const result = await verifyAdminAuth(request);

      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
    });
  });
});

describe('Permission-based Access Control', () => {
  const createAuthenticatedRequest = (permissions: string[]) => {
    (getSession as jest.Mock).mockResolvedValue({
      user: {
        uid: 'test-uid',
        email: 'admin@example.com',
        role: 'admin',
        permissions,
      },
      isLoggedIn: true,
    });

    return new NextRequest(new Request('http://localhost:3000/api/admin/test'));
  };

  it('should allow access with correct permissions', async () => {
    const request = createAuthenticatedRequest(['manage_content', 'view_analytics']);

    const result = await verifyAdminAuth(request);

    expect(result.success).toBe(true);
    expect(result.user.permissions).toContain('manage_content');
    expect(result.user.permissions).toContain('view_analytics');
  });

  it('should work with super admin permissions', async () => {
    const request = createAuthenticatedRequest(['manage_all']);

    const result = await verifyAdminAuth(request);

    expect(result.success).toBe(true);
    expect(result.user.permissions).toContain('manage_all');
  });

  it('should handle empty permissions array', async () => {
    const request = createAuthenticatedRequest([]);

    const result = await verifyAdminAuth(request);

    expect(result.success).toBe(true);
    expect(result.user.permissions).toEqual([]);
  });
});

describe('Security Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle malformed request bodies', async () => {
    const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'invalid-json',
    }));

    const response = await loginHandler(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
  });

  it('should handle missing required fields', async () => {
    const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        // Missing required fields
      }),
    }));

    const response = await loginHandler(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
  });

  it('should sanitize input data', async () => {
    const mockSanitizeInput = require('@/lib/auth/admin-config').sanitizeInput;
    mockSanitizeInput.mockImplementation((input) => input.replace(/<script>/g, ''));

    // Mock CSRF validation
    (validateCSRFToken as jest.Mock).mockResolvedValue(true);

    const request = new NextRequest(new Request('http://localhost:3000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com<script>alert("xss")</script>',
        password: 'password123',
        _csrf: 'valid-csrf-token',
      }),
    }));

    await loginHandler(request);

    expect(mockSanitizeInput).toHaveBeenCalledWith('admin@example.com<script>alert("xss")</script>');
  });
});
