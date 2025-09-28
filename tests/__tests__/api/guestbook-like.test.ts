import { createMocks } from 'node-mocks-http';
import { POST, DELETE } from '@/app/api/guestbook/[messageId]/like/route';

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
  }),
}));

// Mock rate limiting
jest.mock('@/lib/rate-limit', () => ({
  rateLimiter: {
    check: jest.fn().mockResolvedValue({ success: true }),
  },
}));

// Mock client info
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  getClientInfo: jest.fn().mockReturnValue({
    ip: '127.0.0.1',
    userAgent: 'test-agent',
    country: 'US',
  }),
}));

describe('/api/guestbook/[messageId]/like', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set NODE_ENV to development for consistent testing
    process.env.NODE_ENV = 'development';
  });

  describe('POST /api/guestbook/[messageId]/like', () => {
    it('likes a message successfully in development mode', async () => {
      const { req } = createMocks({
        method: 'POST',
        url: '/api/guestbook/test-message-1/like',
      });

      const response = await POST(req as any, { params: { messageId: 'test-message-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.messageId).toBe('test-message-1');
      expect(data.data.likes).toBeGreaterThan(0);
    });

    it('handles rate limiting', async () => {
      // Mock rate limiter to return failure
      const { rateLimiter } = require('@/lib/rate-limit');
      rateLimiter.check.mockResolvedValueOnce({ success: false });

      const { req } = createMocks({
        method: 'POST',
        url: '/api/guestbook/test-message-1/like',
      });

      const response = await POST(req as any, { params: { messageId: 'test-message-1' } });
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Too many requests. Please slow down.');
    });

    it('handles missing messageId parameter', async () => {
      const { req } = createMocks({
        method: 'POST',
        url: '/api/guestbook//like',
      });

      const response = await POST(req as any, { params: { messageId: '' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Message ID is required');
    });

    it('handles production mode with Firestore', async () => {
      // Set to production mode
      process.env.NODE_ENV = 'production';

      const mockDoc = {
        exists: true,
        data: () => ({
          status: 'approved',
          likes: 5,
          likedBy: [],
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
        url: '/api/guestbook/test-message-1/like',
      });

      const response = await POST(req as any, { params: { messageId: 'test-message-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith({
        likes: 6,
        likedBy: ['127.0.0.1'],
        updatedAt: expect.any(Date),
      });

      // Reset NODE_ENV
      process.env.NODE_ENV = 'development';
    });

    it('handles non-existent message in production', async () => {
      // Set to production mode
      process.env.NODE_ENV = 'production';

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
        url: '/api/guestbook/non-existent/like',
      });

      const response = await POST(req as any, { params: { messageId: 'non-existent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Message not found');

      // Reset NODE_ENV
      process.env.NODE_ENV = 'development';
    });

    it('prevents liking non-approved messages in production', async () => {
      // Set to production mode
      process.env.NODE_ENV = 'production';

      const mockDoc = {
        exists: true,
        data: () => ({
          status: 'pending',
          likes: 0,
          likedBy: [],
        }),
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
        url: '/api/guestbook/pending-message/like',
      });

      const response = await POST(req as any, { params: { messageId: 'pending-message' } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Cannot like this message');

      // Reset NODE_ENV
      process.env.NODE_ENV = 'development';
    });

    it('prevents duplicate likes in production', async () => {
      // Set to production mode
      process.env.NODE_ENV = 'production';

      const mockDoc = {
        exists: true,
        data: () => ({
          status: 'approved',
          likes: 5,
          likedBy: ['127.0.0.1'], // Already liked by this IP
        }),
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
        url: '/api/guestbook/test-message-1/like',
      });

      const response = await POST(req as any, { params: { messageId: 'test-message-1' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Already liked this message');

      // Reset NODE_ENV
      process.env.NODE_ENV = 'development';
    });
  });

  describe('DELETE /api/guestbook/[messageId]/like', () => {
    it('unlikes a message successfully in development mode', async () => {
      const { req } = createMocks({
        method: 'DELETE',
        url: '/api/guestbook/test-message-1/like',
      });

      const response = await DELETE(req as any, { params: { messageId: 'test-message-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.messageId).toBe('test-message-1');
      expect(data.data.likes).toBeGreaterThanOrEqual(0);
    });

    it('handles rate limiting for unlike', async () => {
      // Mock rate limiter to return failure
      const { rateLimiter } = require('@/lib/rate-limit');
      rateLimiter.check.mockResolvedValueOnce({ success: false });

      const { req } = createMocks({
        method: 'DELETE',
        url: '/api/guestbook/test-message-1/like',
      });

      const response = await DELETE(req as any, { params: { messageId: 'test-message-1' } });
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Too many requests. Please slow down.');
    });

    it('handles production mode unlike with Firestore', async () => {
      // Set to production mode
      process.env.NODE_ENV = 'production';

      const mockDoc = {
        exists: true,
        data: () => ({
          status: 'approved',
          likes: 5,
          likedBy: ['127.0.0.1'], // User has liked this message
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
        method: 'DELETE',
        url: '/api/guestbook/test-message-1/like',
      });

      const response = await DELETE(req as any, { params: { messageId: 'test-message-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith({
        likes: 4,
        likedBy: [],
        updatedAt: expect.any(Date),
      });

      // Reset NODE_ENV
      process.env.NODE_ENV = 'development';
    });

    it('prevents unliking when not previously liked in production', async () => {
      // Set to production mode
      process.env.NODE_ENV = 'production';

      const mockDoc = {
        exists: true,
        data: () => ({
          status: 'approved',
          likes: 5,
          likedBy: [], // User has not liked this message
        }),
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
        method: 'DELETE',
        url: '/api/guestbook/test-message-1/like',
      });

      const response = await DELETE(req as any, { params: { messageId: 'test-message-1' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Have not liked this message');

      // Reset NODE_ENV
      process.env.NODE_ENV = 'development';
    });
  });
});
