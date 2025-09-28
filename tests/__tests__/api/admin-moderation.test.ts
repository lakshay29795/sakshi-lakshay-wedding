import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/admin/guestbook/moderate/route';

// Mock Firebase Admin
jest.mock('@/lib/firebase-admin', () => ({
  initializeFirebase: () => ({
    db: {
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          get: jest.fn(),
          update: jest.fn(),
        })),
      })),
    },
    auth: {
      verifyIdToken: jest.fn(),
    },
  }),
}));

// Mock admin authentication
jest.mock('@/lib/admin-auth', () => ({
  verifyAdminAuth: jest.fn(),
}));

// Mock rate limiting
jest.mock('@/lib/rate-limit', () => ({
  rateLimiter: {
    check: jest.fn().mockResolvedValue({ success: true }),
  },
}));

describe('/api/admin/guestbook/moderate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'development';
  });

  describe('POST /api/admin/guestbook/moderate', () => {
    it('approves a message successfully', async () => {
      // Mock admin verification
      const { verifyAdminAuth } = require('@/lib/admin-auth');
      verifyAdminAuth.mockResolvedValueOnce({
        isAdmin: true,
        user: { uid: 'admin-123', email: 'admin@example.com' },
      });

      // Mock Firestore document
      const mockDoc = {
        exists: true,
        data: () => ({
          guestName: 'Test User',
          message: 'Test message',
          status: 'pending',
          submittedAt: new Date(),
        }),
      };

      const mockUpdate = jest.fn();
      const mockGet = jest.fn().mockResolvedValue(mockDoc);
      const mockDocRef = { get: mockGet, update: mockUpdate };

      const { initializeFirebase } = require('@/lib/firebase-admin');
      const mockDb = {
        collection: jest.fn(() => ({
          doc: jest.fn(() => mockDocRef),
        })),
      };
      initializeFirebase.mockReturnValue({ db: mockDb });

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-admin-token',
        },
        body: {
          messageId: 'test-message-1',
          action: 'approve',
          adminNotes: 'Approved after review',
        },
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith({
        status: 'approved',
        adminNotes: 'Approved after review',
        moderatedAt: expect.any(Date),
        moderatedBy: 'admin-123',
      });
    });

    it('rejects a message successfully', async () => {
      // Mock admin verification
      const { verifyAdminAuth } = require('@/lib/admin-auth');
      verifyAdminAuth.mockResolvedValueOnce({
        isAdmin: true,
        user: { uid: 'admin-123', email: 'admin@example.com' },
      });

      // Mock Firestore document
      const mockDoc = {
        exists: true,
        data: () => ({
          guestName: 'Test User',
          message: 'Inappropriate message',
          status: 'pending',
          submittedAt: new Date(),
        }),
      };

      const mockUpdate = jest.fn();
      const mockGet = jest.fn().mockResolvedValue(mockDoc);
      const mockDocRef = { get: mockGet, update: mockUpdate };

      const { initializeFirebase } = require('@/lib/firebase-admin');
      const mockDb = {
        collection: jest.fn(() => ({
          doc: jest.fn(() => mockDocRef),
        })),
      };
      initializeFirebase.mockReturnValue({ db: mockDb });

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-admin-token',
        },
        body: {
          messageId: 'test-message-2',
          action: 'reject',
          adminNotes: 'Contains inappropriate content',
        },
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith({
        status: 'rejected',
        adminNotes: 'Contains inappropriate content',
        moderatedAt: expect.any(Date),
        moderatedBy: 'admin-123',
      });
    });

    it('highlights a message successfully', async () => {
      // Mock admin verification
      const { verifyAdminAuth } = require('@/lib/admin-auth');
      verifyAdminAuth.mockResolvedValueOnce({
        isAdmin: true,
        user: { uid: 'admin-123', email: 'admin@example.com' },
      });

      // Mock Firestore document
      const mockDoc = {
        exists: true,
        data: () => ({
          guestName: 'VIP Guest',
          message: 'Beautiful wedding message',
          status: 'approved',
          isHighlighted: false,
          submittedAt: new Date(),
        }),
      };

      const mockUpdate = jest.fn();
      const mockGet = jest.fn().mockResolvedValue(mockDoc);
      const mockDocRef = { get: mockGet, update: mockUpdate };

      const { initializeFirebase } = require('@/lib/firebase-admin');
      const mockDb = {
        collection: jest.fn(() => ({
          doc: jest.fn(() => mockDocRef),
        })),
      };
      initializeFirebase.mockReturnValue({ db: mockDb });

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-admin-token',
        },
        body: {
          messageId: 'test-message-3',
          action: 'highlight',
          adminNotes: 'Featured message from VIP guest',
        },
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith({
        isHighlighted: true,
        adminNotes: 'Featured message from VIP guest',
        moderatedAt: expect.any(Date),
        moderatedBy: 'admin-123',
      });
    });

    it('unhighlights a message successfully', async () => {
      // Mock admin verification
      const { verifyAdminAuth } = require('@/lib/admin-auth');
      verifyAdminAuth.mockResolvedValueOnce({
        isAdmin: true,
        user: { uid: 'admin-123', email: 'admin@example.com' },
      });

      // Mock Firestore document
      const mockDoc = {
        exists: true,
        data: () => ({
          guestName: 'Guest',
          message: 'Regular message',
          status: 'approved',
          isHighlighted: true,
          submittedAt: new Date(),
        }),
      };

      const mockUpdate = jest.fn();
      const mockGet = jest.fn().mockResolvedValue(mockDoc);
      const mockDocRef = { get: mockGet, update: mockUpdate };

      const { initializeFirebase } = require('@/lib/firebase-admin');
      const mockDb = {
        collection: jest.fn(() => ({
          doc: jest.fn(() => mockDocRef),
        })),
      };
      initializeFirebase.mockReturnValue({ db: mockDb });

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-admin-token',
        },
        body: {
          messageId: 'test-message-4',
          action: 'unhighlight',
        },
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith({
        isHighlighted: false,
        moderatedAt: expect.any(Date),
        moderatedBy: 'admin-123',
      });
    });

    it('rejects requests from non-admin users', async () => {
      // Mock admin verification to return false
      const { verifyAdminAuth } = require('@/lib/admin-auth');
      verifyAdminAuth.mockResolvedValueOnce({
        isAdmin: false,
        user: { uid: 'user-123', email: 'user@example.com' },
      });

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer user-token',
        },
        body: {
          messageId: 'test-message-1',
          action: 'approve',
        },
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Admin access required');
    });

    it('rejects requests without authentication', async () => {
      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          messageId: 'test-message-1',
          action: 'approve',
        },
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Authentication required');
    });

    it('validates required fields', async () => {
      // Mock admin verification
      const { verifyAdminAuth } = require('@/lib/admin-auth');
      verifyAdminAuth.mockResolvedValueOnce({
        isAdmin: true,
        user: { uid: 'admin-123', email: 'admin@example.com' },
      });

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-admin-token',
        },
        body: {
          // Missing messageId and action
        },
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid moderation data');
    });

    it('validates action types', async () => {
      // Mock admin verification
      const { verifyAdminAuth } = require('@/lib/admin-auth');
      verifyAdminAuth.mockResolvedValueOnce({
        isAdmin: true,
        user: { uid: 'admin-123', email: 'admin@example.com' },
      });

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-admin-token',
        },
        body: {
          messageId: 'test-message-1',
          action: 'invalid-action',
        },
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid moderation data');
    });

    it('handles non-existent messages', async () => {
      // Mock admin verification
      const { verifyAdminAuth } = require('@/lib/admin-auth');
      verifyAdminAuth.mockResolvedValueOnce({
        isAdmin: true,
        user: { uid: 'admin-123', email: 'admin@example.com' },
      });

      // Mock non-existent document
      const mockDoc = {
        exists: false,
        data: () => null,
      };

      const mockGet = jest.fn().mockResolvedValue(mockDoc);
      const mockDocRef = { get: mockGet, update: jest.fn() };

      const { initializeFirebase } = require('@/lib/firebase-admin');
      const mockDb = {
        collection: jest.fn(() => ({
          doc: jest.fn(() => mockDocRef),
        })),
      };
      initializeFirebase.mockReturnValue({ db: mockDb });

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-admin-token',
        },
        body: {
          messageId: 'non-existent-message',
          action: 'approve',
        },
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Message not found');
    });

    it('handles rate limiting', async () => {
      // Mock rate limiter to return failure
      const { rateLimiter } = require('@/lib/rate-limit');
      rateLimiter.check.mockResolvedValueOnce({ success: false });

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-admin-token',
        },
        body: {
          messageId: 'test-message-1',
          action: 'approve',
        },
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Too many requests. Please slow down.');
    });

    it('validates admin notes length', async () => {
      // Mock admin verification
      const { verifyAdminAuth } = require('@/lib/admin-auth');
      verifyAdminAuth.mockResolvedValueOnce({
        isAdmin: true,
        user: { uid: 'admin-123', email: 'admin@example.com' },
      });

      const longNotes = 'a'.repeat(201); // Exceeds 200 character limit

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-admin-token',
        },
        body: {
          messageId: 'test-message-1',
          action: 'approve',
          adminNotes: longNotes,
        },
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid moderation data');
    });

    it('works in development mode with mock data', async () => {
      // Ensure we're in development mode
      process.env.NODE_ENV = 'development';

      // Mock admin verification
      const { verifyAdminAuth } = require('@/lib/admin-auth');
      verifyAdminAuth.mockResolvedValueOnce({
        isAdmin: true,
        user: { uid: 'admin-123', email: 'admin@example.com' },
      });

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-admin-token',
        },
        body: {
          messageId: 'sample-1',
          action: 'approve',
          adminNotes: 'Approved in development mode',
        },
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('development mode');
    });

    it('handles Firebase errors gracefully', async () => {
      // Set to production mode to test Firebase integration
      process.env.NODE_ENV = 'production';

      // Mock admin verification
      const { verifyAdminAuth } = require('@/lib/admin-auth');
      verifyAdminAuth.mockResolvedValueOnce({
        isAdmin: true,
        user: { uid: 'admin-123', email: 'admin@example.com' },
      });

      // Mock Firebase error
      const mockGet = jest.fn().mockRejectedValue(new Error('Firebase connection error'));
      const mockDocRef = { get: mockGet, update: jest.fn() };

      const { initializeFirebase } = require('@/lib/firebase-admin');
      const mockDb = {
        collection: jest.fn(() => ({
          doc: jest.fn(() => mockDocRef),
        })),
      };
      initializeFirebase.mockReturnValue({ db: mockDb });

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-admin-token',
        },
        body: {
          messageId: 'test-message-1',
          action: 'approve',
        },
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to moderate message');

      // Reset NODE_ENV
      process.env.NODE_ENV = 'development';
    });
  });
});
