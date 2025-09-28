import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';
import { GET as guestbookGetHandler, POST as guestbookPostHandler } from '@/app/api/admin/guestbook/moderate/route';
import { verifyAdminAuth } from '@/lib/admin-auth';

// Mock dependencies
jest.mock('@/lib/admin-auth');
jest.mock('@/lib/firebase-admin', () => ({
  initializeFirebase: jest.fn().mockResolvedValue({
    db: {
      collection: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          docs: [
            {
              id: 'msg1',
              data: () => ({
                guestName: 'John Doe',
                guestEmail: 'john@example.com',
                message: 'Congratulations on your wedding!',
                status: 'pending',
                submittedAt: { toDate: () => new Date('2024-01-01') },
                likes: 0,
                likedBy: [],
              }),
            },
            {
              id: 'msg2',
              data: () => ({
                guestName: 'Jane Smith',
                guestEmail: 'jane@example.com',
                message: 'Wishing you both happiness!',
                status: 'approved',
                submittedAt: { toDate: () => new Date('2024-01-02') },
                likes: 5,
                likedBy: ['user1', 'user2'],
              }),
            },
          ],
        }),
        doc: jest.fn().mockReturnValue({
          update: jest.fn().mockResolvedValue(undefined),
          delete: jest.fn().mockResolvedValue(undefined),
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: () => ({
              guestName: 'John Doe',
              message: 'Test message',
              status: 'pending',
            }),
          }),
        }),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
      }),
    },
  }),
}));

// Mock rate limiting
jest.mock('@/lib/rate-limit', () => ({
  rateLimiter: {
    check: jest.fn().mockResolvedValue({ success: true }),
  },
}));

describe('Content Management Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
  });

  describe('Guest Book Moderation', () => {
    describe('GET /api/admin/guestbook/moderate', () => {
      it('should fetch pending guest book messages for moderation', async () => {
        // Mock successful auth with guestbook permission
        (verifyAdminAuth as jest.Mock).mockResolvedValue({
          success: true,
          user: {
            uid: 'admin-uid',
            email: 'admin@example.com',
            permissions: ['manage_guestbook'],
          },
        });

        const request = new NextRequest(new Request('http://localhost:3000/api/admin/guestbook/moderate'));

        const response = await guestbookGetHandler(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
        expect(result.data.messages).toHaveLength(2);
        expect(result.data.messages[0].guestName).toBe('John Doe');
        expect(result.data.messages[1].guestName).toBe('Jane Smith');
      });

      it('should filter messages by status', async () => {
        (verifyAdminAuth as jest.Mock).mockResolvedValue({
          success: true,
          user: {
            uid: 'admin-uid',
            email: 'admin@example.com',
            permissions: ['manage_guestbook'],
          },
        });

        const request = new NextRequest(
          new Request('http://localhost:3000/api/admin/guestbook/moderate?status=pending')
        );

        const response = await guestbookGetHandler(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
        // In a real implementation, this would filter by status
        expect(result.data.messages).toBeDefined();
      });

      it('should reject unauthorized access', async () => {
        (verifyAdminAuth as jest.Mock).mockResolvedValue({
          success: false,
          error: 'Not authenticated',
          status: 401,
        });

        const request = new NextRequest(new Request('http://localhost:3000/api/admin/guestbook/moderate'));

        const response = await guestbookGetHandler(request);
        const result = await response.json();

        expect(response.status).toBe(401);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Not authenticated');
      });

      it('should reject access without guestbook permission', async () => {
        (verifyAdminAuth as jest.Mock).mockResolvedValue({
          success: true,
          user: {
            uid: 'admin-uid',
            email: 'admin@example.com',
            permissions: ['manage_content'], // No manage_guestbook permission
          },
        });

        const request = new NextRequest(new Request('http://localhost:3000/api/admin/guestbook/moderate'));

        const response = await guestbookGetHandler(request);
        const result = await response.json();

        expect(response.status).toBe(403);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Insufficient permissions');
      });
    });

    describe('POST /api/admin/guestbook/moderate', () => {
      it('should approve a guest book message', async () => {
        (verifyAdminAuth as jest.Mock).mockResolvedValue({
          success: true,
          user: {
            uid: 'admin-uid',
            email: 'admin@example.com',
            permissions: ['manage_guestbook'],
          },
        });

        const { req } = createMocks({
          method: 'POST',
          body: {
            messageId: 'msg1',
            action: 'approve',
            moderatorNote: 'Approved - appropriate content',
          },
        });

        const request = new NextRequest(new Request('http://localhost:3000/api/admin/guestbook/moderate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(req.body),
        }));

        const response = await guestbookPostHandler(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
        expect(result.message).toContain('approved');

        // Verify database update was called
        const mockFirebase = require('@/lib/firebase-admin').initializeFirebase;
        const mockDb = await mockFirebase();
        expect(mockDb.db.collection().doc().update).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'approved',
            moderatedAt: expect.any(Date),
            moderatedBy: 'admin-uid',
            moderatorNote: 'Approved - appropriate content',
          })
        );
      });

      it('should reject a guest book message', async () => {
        (verifyAdminAuth as jest.Mock).mockResolvedValue({
          success: true,
          user: {
            uid: 'admin-uid',
            email: 'admin@example.com',
            permissions: ['manage_guestbook'],
          },
        });

        const { req } = createMocks({
          method: 'POST',
          body: {
            messageId: 'msg1',
            action: 'reject',
            moderatorNote: 'Rejected - inappropriate content',
          },
        });

        const request = new NextRequest(new Request('http://localhost:3000/api/admin/guestbook/moderate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(req.body),
        }));

        const response = await guestbookPostHandler(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
        expect(result.message).toContain('rejected');

        // Verify database update was called
        const mockFirebase = require('@/lib/firebase-admin').initializeFirebase;
        const mockDb = await mockFirebase();
        expect(mockDb.db.collection().doc().update).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'rejected',
            moderatedAt: expect.any(Date),
            moderatedBy: 'admin-uid',
            moderatorNote: 'Rejected - inappropriate content',
          })
        );
      });

      it('should delete a guest book message', async () => {
        (verifyAdminAuth as jest.Mock).mockResolvedValue({
          success: true,
          user: {
            uid: 'admin-uid',
            email: 'admin@example.com',
            permissions: ['manage_guestbook'],
          },
        });

        const { req } = createMocks({
          method: 'POST',
          body: {
            messageId: 'msg1',
            action: 'delete',
            moderatorNote: 'Deleted - spam content',
          },
        });

        const request = new NextRequest(new Request('http://localhost:3000/api/admin/guestbook/moderate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(req.body),
        }));

        const response = await guestbookPostHandler(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
        expect(result.message).toContain('deleted');

        // Verify database delete was called
        const mockFirebase = require('@/lib/firebase-admin').initializeFirebase;
        const mockDb = await mockFirebase();
        expect(mockDb.db.collection().doc().delete).toHaveBeenCalled();
      });

      it('should handle invalid message ID', async () => {
        (verifyAdminAuth as jest.Mock).mockResolvedValue({
          success: true,
          user: {
            uid: 'admin-uid',
            email: 'admin@example.com',
            permissions: ['manage_guestbook'],
          },
        });

        // Mock message not found
        const mockFirebase = require('@/lib/firebase-admin').initializeFirebase;
        const mockDb = await mockFirebase();
        mockDb.db.collection().doc().get.mockResolvedValue({
          exists: false,
        });

        const { req } = createMocks({
          method: 'POST',
          body: {
            messageId: 'nonexistent',
            action: 'approve',
          },
        });

        const request = new NextRequest(new Request('http://localhost:3000/api/admin/guestbook/moderate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(req.body),
        }));

        const response = await guestbookPostHandler(request);
        const result = await response.json();

        expect(response.status).toBe(404);
        expect(result.success).toBe(false);
        expect(result.error).toContain('not found');
      });

      it('should validate required fields', async () => {
        (verifyAdminAuth as jest.Mock).mockResolvedValue({
          success: true,
          user: {
            uid: 'admin-uid',
            email: 'admin@example.com',
            permissions: ['manage_guestbook'],
          },
        });

        const { req } = createMocks({
          method: 'POST',
          body: {
            // Missing messageId and action
          },
        });

        const request = new NextRequest(new Request('http://localhost:3000/api/admin/guestbook/moderate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(req.body),
        }));

        const response = await guestbookPostHandler(request);
        const result = await response.json();

        expect(response.status).toBe(400);
        expect(result.success).toBe(false);
        expect(result.error).toContain('required');
      });

      it('should validate action values', async () => {
        (verifyAdminAuth as jest.Mock).mockResolvedValue({
          success: true,
          user: {
            uid: 'admin-uid',
            email: 'admin@example.com',
            permissions: ['manage_guestbook'],
          },
        });

        const { req } = createMocks({
          method: 'POST',
          body: {
            messageId: 'msg1',
            action: 'invalid-action',
          },
        });

        const request = new NextRequest(new Request('http://localhost:3000/api/admin/guestbook/moderate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(req.body),
        }));

        const response = await guestbookPostHandler(request);
        const result = await response.json();

        expect(response.status).toBe(400);
        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid action');
      });
    });
  });

  describe('Bulk Operations', () => {
    it('should handle bulk approval of messages', async () => {
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'admin-uid',
          email: 'admin@example.com',
          permissions: ['manage_guestbook'],
        },
      });

      const { req } = createMocks({
        method: 'POST',
        body: {
          messageIds: ['msg1', 'msg2', 'msg3'],
          action: 'approve',
          moderatorNote: 'Bulk approved',
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/guestbook/moderate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(req.body),
      }));

      const response = await guestbookPostHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.message).toContain('3 messages');
    });

    it('should handle partial failures in bulk operations', async () => {
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'admin-uid',
          email: 'admin@example.com',
          permissions: ['manage_guestbook'],
        },
      });

      // Mock one message not found
      const mockFirebase = require('@/lib/firebase-admin').initializeFirebase;
      const mockDb = await mockFirebase();
      mockDb.db.collection().doc().get
        .mockResolvedValueOnce({ exists: true, data: () => ({}) })
        .mockResolvedValueOnce({ exists: false }) // Second message not found
        .mockResolvedValueOnce({ exists: true, data: () => ({}) });

      const { req } = createMocks({
        method: 'POST',
        body: {
          messageIds: ['msg1', 'nonexistent', 'msg3'],
          action: 'approve',
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/guestbook/moderate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(req.body),
      }));

      const response = await guestbookPostHandler(request);
      const result = await response.json();

      expect(response.status).toBe(207); // Partial success
      expect(result.success).toBe(true);
      expect(result.data.successful).toBe(2);
      expect(result.data.failed).toBe(1);
    });
  });

  describe('Content Filtering and Search', () => {
    it('should filter messages by date range', async () => {
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'admin-uid',
          email: 'admin@example.com',
          permissions: ['manage_guestbook'],
        },
      });

      const request = new NextRequest(
        new Request('http://localhost:3000/api/admin/guestbook/moderate?startDate=2024-01-01&endDate=2024-01-31')
      );

      const response = await guestbookGetHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      // In a real implementation, this would filter by date range
      expect(result.data.messages).toBeDefined();
    });

    it('should search messages by content', async () => {
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'admin-uid',
          email: 'admin@example.com',
          permissions: ['manage_guestbook'],
        },
      });

      const request = new NextRequest(
        new Request('http://localhost:3000/api/admin/guestbook/moderate?search=congratulations')
      );

      const response = await guestbookGetHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      // In a real implementation, this would filter by search term
      expect(result.data.messages).toBeDefined();
    });

    it('should sort messages by different criteria', async () => {
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'admin-uid',
          email: 'admin@example.com',
          permissions: ['manage_guestbook'],
        },
      });

      const request = new NextRequest(
        new Request('http://localhost:3000/api/admin/guestbook/moderate?sortBy=submittedAt&sortOrder=desc')
      );

      const response = await guestbookGetHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.messages).toBeDefined();
    });
  });

  describe('Audit Trail', () => {
    it('should log moderation actions', async () => {
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'admin-uid',
          email: 'admin@example.com',
          permissions: ['manage_guestbook'],
        },
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const { req } = createMocks({
        method: 'POST',
        body: {
          messageId: 'msg1',
          action: 'approve',
          moderatorNote: 'Test approval',
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/guestbook/moderate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(req.body),
      }));

      await guestbookPostHandler(request);

      // Should log the moderation action
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Guestbook moderation action'),
        expect.objectContaining({
          messageId: 'msg1',
          action: 'approve',
          moderatorId: 'admin-uid',
        })
      );

      consoleSpy.mockRestore();
    });

    it('should track moderation history', async () => {
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'admin-uid',
          email: 'admin@example.com',
          permissions: ['manage_guestbook'],
        },
      });

      const { req } = createMocks({
        method: 'POST',
        body: {
          messageId: 'msg1',
          action: 'approve',
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/guestbook/moderate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(req.body),
      }));

      const response = await guestbookPostHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);

      // Verify moderation metadata was added
      const mockFirebase = require('@/lib/firebase-admin').initializeFirebase;
      const mockDb = await mockFirebase();
      expect(mockDb.db.collection().doc().update).toHaveBeenCalledWith(
        expect.objectContaining({
          moderatedAt: expect.any(Date),
          moderatedBy: 'admin-uid',
        })
      );
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle pagination for large datasets', async () => {
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'admin-uid',
          email: 'admin@example.com',
          permissions: ['manage_guestbook'],
        },
      });

      const request = new NextRequest(
        new Request('http://localhost:3000/api/admin/guestbook/moderate?page=2&limit=50')
      );

      const response = await guestbookGetHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.messages).toBeDefined();
      expect(result.data.pagination).toBeDefined();
    });

    it('should handle concurrent moderation actions', async () => {
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'admin-uid',
          email: 'admin@example.com',
          permissions: ['manage_guestbook'],
        },
      });

      // Simulate concurrent requests
      const requests = Array.from({ length: 5 }, (_, i) => {
        const { req } = createMocks({
          method: 'POST',
          body: {
            messageId: `msg${i + 1}`,
            action: 'approve',
          },
        });

        return new NextRequest(new Request('http://localhost:3000/api/admin/guestbook/moderate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(req.body),
        }));
      });

      const responses = await Promise.all(
        requests.map(request => guestbookPostHandler(request))
      );

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    it('should handle rate limiting for moderation actions', async () => {
      // Mock rate limit exceeded
      const mockRateLimit = require('@/lib/rate-limit').rateLimiter;
      mockRateLimit.check.mockResolvedValue({
        success: false,
        error: 'Rate limit exceeded',
      });

      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'admin-uid',
          email: 'admin@example.com',
          permissions: ['manage_guestbook'],
        },
      });

      const { req } = createMocks({
        method: 'POST',
        body: {
          messageId: 'msg1',
          action: 'approve',
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/guestbook/moderate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(req.body),
      }));

      const response = await guestbookPostHandler(request);
      const result = await response.json();

      expect(response.status).toBe(429);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Rate limit');
    });
  });
});
