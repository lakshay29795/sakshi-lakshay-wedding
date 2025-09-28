import { createMocks } from 'node-mocks-http';
import { GET, POST } from '@/app/api/guestbook/route';
import { GuestMessage } from '@/types/guestbook';

// Mock Firebase Admin
jest.mock('@/lib/firebase-admin', () => ({
  initializeFirebase: () => ({
    db: {
      collection: jest.fn(() => ({
        add: jest.fn(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        get: jest.fn(),
      })),
    },
    auth: {
      verifyIdToken: jest.fn(),
    },
  }),
}));

// Mock rate limiting
jest.mock('@/lib/rate-limit', () => ({
  rateLimiter: {
    check: jest.fn().mockResolvedValue({ success: true }),
  },
}));

// Mock spam detection
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  detectSpam: jest.fn().mockReturnValue(false),
  getClientInfo: jest.fn().mockReturnValue({
    ip: '127.0.0.1',
    userAgent: 'test-agent',
    country: 'US',
  }),
}));

describe('/api/guestbook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set NODE_ENV to development for consistent testing
    process.env.NODE_ENV = 'development';
  });

  describe('GET /api/guestbook', () => {
    it('returns sample messages in development mode', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/guestbook?status=approved',
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.messages).toHaveLength(4); // Sample approved messages
      expect(data.data.stats).toBeDefined();
      expect(data.data.stats.totalMessages).toBe(5);
      expect(data.data.stats.approvedMessages).toBe(4);
    });

    it('filters messages by status', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/guestbook?status=pending',
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.messages).toHaveLength(1); // Only pending message
      expect(data.data.messages[0].status).toBe('pending');
    });

    it('sorts messages by newest first by default', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/guestbook?status=approved',
      });

      const response = await GET(req as any);
      const data = await response.json();

      const messages = data.data.messages;
      expect(messages.length).toBeGreaterThan(1);
      
      // Check that messages are sorted by newest first
      for (let i = 0; i < messages.length - 1; i++) {
        const currentDate = new Date(messages[i].submittedAt);
        const nextDate = new Date(messages[i + 1].submittedAt);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });

    it('sorts messages by oldest first when requested', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/guestbook?status=approved&sortBy=oldest',
      });

      const response = await GET(req as any);
      const data = await response.json();

      const messages = data.data.messages;
      expect(messages.length).toBeGreaterThan(1);
      
      // Check that messages are sorted by oldest first
      for (let i = 0; i < messages.length - 1; i++) {
        const currentDate = new Date(messages[i].submittedAt);
        const nextDate = new Date(messages[i + 1].submittedAt);
        expect(currentDate.getTime()).toBeLessThanOrEqual(nextDate.getTime());
      }
    });

    it('sorts messages by most liked when requested', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/guestbook?status=approved&sortBy=mostLiked',
      });

      const response = await GET(req as any);
      const data = await response.json();

      const messages = data.data.messages;
      expect(messages.length).toBeGreaterThan(1);
      
      // Check that messages are sorted by likes descending
      for (let i = 0; i < messages.length - 1; i++) {
        expect(messages[i].likes).toBeGreaterThanOrEqual(messages[i + 1].likes);
      }
    });

    it('filters messages by search term', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/guestbook?status=approved&search=congratulations',
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.messages.length).toBeGreaterThan(0);
      
      // Check that all returned messages contain the search term
      data.data.messages.forEach((message: GuestMessage) => {
        const containsInName = message.guestName.toLowerCase().includes('congratulations');
        const containsInMessage = message.message.toLowerCase().includes('congratulations');
        expect(containsInName || containsInMessage).toBe(true);
      });
    });

    it('returns all messages when status is "all"', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/guestbook?status=all',
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.messages).toHaveLength(5); // All sample messages
    });

    it('handles invalid filter parameters', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/guestbook?status=invalid&sortBy=invalid',
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid filter parameters');
    });
  });

  describe('POST /api/guestbook', () => {
    it('creates a new message successfully', async () => {
      const messageData = {
        senderName: 'Test User',
        message: 'This is a test message for the happy couple!',
      };

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: messageData,
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.guestName).toBe(messageData.senderName);
      expect(data.data.message).toBe(messageData.message);
      expect(data.data.status).toBe('approved'); // Auto-approved in development
      expect(data.data.id).toBeDefined();
    });

    it('validates required fields', async () => {
      const invalidData = {
        senderName: '', // Empty name
        message: 'Test message',
      };

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: invalidData,
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid message data');
    });

    it('validates message length', async () => {
      const longMessage = 'a'.repeat(501); // Exceeds 500 character limit
      const invalidData = {
        senderName: 'Test User',
        message: longMessage,
      };

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: invalidData,
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid message data');
    });

    it('validates name length', async () => {
      const longName = 'a'.repeat(51); // Exceeds 50 character limit
      const invalidData = {
        senderName: longName,
        message: 'Test message',
      };

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: invalidData,
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid message data');
    });

    it('handles rate limiting', async () => {
      // Mock rate limiter to return failure
      const { rateLimiter } = require('@/lib/rate-limit');
      rateLimiter.check.mockResolvedValueOnce({ success: false });

      const messageData = {
        senderName: 'Test User',
        message: 'Test message',
      };

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: messageData,
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Too many requests. Please slow down.');
    });

    it('handles spam detection', async () => {
      // Mock spam detection to return true
      const { detectSpam } = require('@/lib/utils');
      detectSpam.mockReturnValueOnce(true);

      const messageData = {
        senderName: 'Spammer',
        message: 'This is spam content with suspicious keywords',
      };

      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: messageData,
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe('pending'); // Flagged for review
      expect(data.message).toContain('flagged for review');
    });

    it('handles missing request body', async () => {
      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // No body
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid message data');
    });

    it('handles malformed JSON', async () => {
      const { req } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json',
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });
});
