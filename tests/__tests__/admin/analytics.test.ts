import { NextRequest } from 'next/server';
import { GET as analyticsHandler } from '@/app/api/admin/analytics/route';
import { GET as activityHandler } from '@/app/api/admin/activity/route';
import { verifyAdminAuth } from '@/lib/admin-auth';

// Mock admin auth
jest.mock('@/lib/admin-auth', () => ({
  verifyAdminAuth: jest.fn(),
}));

// Mock Firebase Admin
jest.mock('@/lib/firebase-admin', () => ({
  initializeFirebase: jest.fn().mockResolvedValue({
    db: {
      collection: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          docs: [],
        }),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
      }),
    },
  }),
}));

describe('Admin Analytics API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'development'; // Use development mode for predictable mock data
  });

  describe('GET /api/admin/analytics', () => {
    it('should return analytics data for authorized admin', async () => {
      // Mock successful auth with analytics permission
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

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('rsvps');
      expect(result.data).toHaveProperty('guestbook');
      expect(result.data).toHaveProperty('notifications');
      expect(result.data).toHaveProperty('website');

      // Verify data structure
      expect(result.data.rsvps).toHaveProperty('total');
      expect(result.data.rsvps).toHaveProperty('attending');
      expect(result.data.rsvps).toHaveProperty('notAttending');
      expect(result.data.rsvps).toHaveProperty('pending');
      expect(result.data.rsvps).toHaveProperty('trend');

      expect(result.data.guestbook).toHaveProperty('total');
      expect(result.data.guestbook).toHaveProperty('approved');
      expect(result.data.guestbook).toHaveProperty('pending');
      expect(result.data.guestbook).toHaveProperty('rejected');

      expect(result.data.notifications).toHaveProperty('sent');
      expect(result.data.notifications).toHaveProperty('delivered');
      expect(result.data.notifications).toHaveProperty('opened');

      expect(result.data.website).toHaveProperty('visitors');
      expect(result.data.website).toHaveProperty('pageViews');
      expect(result.data.website).toHaveProperty('avgSession');
    });

    it('should reject unauthorized access', async () => {
      // Mock auth failure
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Not authenticated',
        status: 401,
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/analytics'));

      const response = await analyticsHandler(request);
      const result = await response.json();

      expect(response.status).toBe(401);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });

    it('should reject access without analytics permission', async () => {
      // Mock auth success but without analytics permission
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          permissions: ['manage_content'], // No view_analytics permission
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/analytics'));

      const response = await analyticsHandler(request);
      const result = await response.json();

      expect(response.status).toBe(403);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Insufficient permissions');
    });

    it('should handle Firebase errors gracefully in production mode', async () => {
      // Set production mode
      process.env.NODE_ENV = 'production';

      // Mock successful auth
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          permissions: ['view_analytics'],
        },
      });

      // Mock Firebase error
      const mockFirebase = require('@/lib/firebase-admin').initializeFirebase;
      mockFirebase.mockRejectedValue(new Error('Firebase connection failed'));

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/analytics'));

      const response = await analyticsHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200); // Should still return 200 with fallback data
      expect(result.success).toBe(true);
      expect(result.warning).toContain('fallback data');
      expect(result.data.rsvps.total).toBe(0); // Fallback values
    });

    it('should return development mock data in development mode', async () => {
      // Ensure development mode
      process.env.NODE_ENV = 'development';

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

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.rsvps.total).toBeGreaterThan(0); // Mock data should have values
      expect(result.data.guestbook.total).toBeGreaterThan(0);
      expect(result.data.notifications.sent).toBeGreaterThan(0);
      expect(result.data.website.visitors).toBeGreaterThan(0);
    });
  });
});

describe('Admin Activity API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'development';
  });

  describe('GET /api/admin/activity', () => {
    it('should return activity data with default pagination', async () => {
      // Mock successful auth
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          permissions: ['view_analytics'],
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/activity'));

      const response = await activityHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('activities');
      expect(result.data).toHaveProperty('total');
      expect(result.data).toHaveProperty('hasMore');

      expect(Array.isArray(result.data.activities)).toBe(true);
      expect(result.data.activities.length).toBeGreaterThan(0);

      // Verify activity structure
      const activity = result.data.activities[0];
      expect(activity).toHaveProperty('id');
      expect(activity).toHaveProperty('type');
      expect(activity).toHaveProperty('message');
      expect(activity).toHaveProperty('time');
      expect(activity).toHaveProperty('status');
      expect(activity).toHaveProperty('timestamp');

      // Verify activity types
      const validTypes = ['rsvp', 'guestbook', 'notification', 'system', 'timeline', 'photo'];
      expect(validTypes).toContain(activity.type);

      // Verify status types
      const validStatuses = ['success', 'warning', 'info', 'error'];
      expect(validStatuses).toContain(activity.status);
    });

    it('should handle pagination parameters', async () => {
      // Mock successful auth
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          permissions: ['view_analytics'],
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/activity?limit=5&offset=10'));

      const response = await activityHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.activities.length).toBeLessThanOrEqual(5);
    });

    it('should reject unauthorized access', async () => {
      // Mock auth failure
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Not authenticated',
        status: 401,
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/activity'));

      const response = await activityHandler(request);
      const result = await response.json();

      expect(response.status).toBe(401);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });

    it('should handle invalid pagination parameters', async () => {
      // Mock successful auth
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          permissions: ['view_analytics'],
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/activity?limit=invalid&offset=negative'));

      const response = await activityHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200); // Should handle gracefully
      expect(result.success).toBe(true);
      // Should use default values for invalid parameters
    });

    it('should return activities sorted by timestamp (newest first)', async () => {
      // Mock successful auth
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          permissions: ['view_analytics'],
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/activity'));

      const response = await activityHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);

      const activities = result.data.activities;
      if (activities.length > 1) {
        // Verify sorting (newest first)
        for (let i = 0; i < activities.length - 1; i++) {
          const current = new Date(activities[i].timestamp);
          const next = new Date(activities[i + 1].timestamp);
          expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
        }
      }
    });

    it('should include metadata for activities', async () => {
      // Mock successful auth
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          permissions: ['view_analytics'],
        },
      });

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/activity'));

      const response = await activityHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);

      const activities = result.data.activities;
      const activityWithMetadata = activities.find(a => a.metadata);

      if (activityWithMetadata) {
        expect(activityWithMetadata.metadata).toBeDefined();
        expect(typeof activityWithMetadata.metadata).toBe('object');
      }
    });

    it('should handle Firebase errors gracefully in production mode', async () => {
      // Set production mode
      process.env.NODE_ENV = 'production';

      // Mock successful auth
      (verifyAdminAuth as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          uid: 'test-uid',
          email: 'admin@example.com',
          permissions: ['view_analytics'],
        },
      });

      // Mock Firebase error
      const mockFirebase = require('@/lib/firebase-admin').initializeFirebase;
      mockFirebase.mockRejectedValue(new Error('Firebase connection failed'));

      const request = new NextRequest(new Request('http://localhost:3000/api/admin/activity'));

      const response = await activityHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200); // Should still return 200 with fallback
      expect(result.success).toBe(true);
      expect(result.warning).toContain('database connection issues');
      expect(result.data.activities).toEqual([]);
      expect(result.data.total).toBe(0);
      expect(result.data.hasMore).toBe(false);
    });
  });
});

describe('Analytics Data Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'development';
  });

  it('should validate analytics data structure', async () => {
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

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);

    // Validate RSVP data
    const rsvpData = result.data.rsvps;
    expect(typeof rsvpData.total).toBe('number');
    expect(typeof rsvpData.attending).toBe('number');
    expect(typeof rsvpData.notAttending).toBe('number');
    expect(typeof rsvpData.pending).toBe('number');
    expect(typeof rsvpData.trend).toBe('string');
    expect(rsvpData.trend).toMatch(/^[+-]\d+(\.\d+)?%$/); // Format: +12% or -5.5%

    // Validate guest book data
    const guestbookData = result.data.guestbook;
    expect(typeof guestbookData.total).toBe('number');
    expect(typeof guestbookData.approved).toBe('number');
    expect(typeof guestbookData.pending).toBe('number');
    expect(typeof guestbookData.rejected).toBe('number');

    // Validate notifications data
    const notificationData = result.data.notifications;
    expect(typeof notificationData.sent).toBe('number');
    expect(typeof notificationData.delivered).toBe('number');
    expect(typeof notificationData.opened).toBe('number');

    // Validate website data
    const websiteData = result.data.website;
    expect(typeof websiteData.visitors).toBe('number');
    expect(typeof websiteData.pageViews).toBe('number');
    expect(typeof websiteData.avgSession).toBe('string');
  });

  it('should validate activity data structure', async () => {
    // Mock successful auth
    (verifyAdminAuth as jest.Mock).mockResolvedValue({
      success: true,
      user: {
        uid: 'test-uid',
        email: 'admin@example.com',
        permissions: ['view_analytics'],
      },
    });

    const request = new NextRequest(new Request('http://localhost:3000/api/admin/activity'));

    const response = await activityHandler(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);

    result.data.activities.forEach((activity: any) => {
      expect(typeof activity.id).toBe('string');
      expect(typeof activity.type).toBe('string');
      expect(typeof activity.message).toBe('string');
      expect(typeof activity.time).toBe('string');
      expect(typeof activity.status).toBe('string');
      expect(activity.timestamp).toBeDefined();

      // Validate timestamp is a valid date
      const timestamp = new Date(activity.timestamp);
      expect(timestamp.getTime()).not.toBeNaN();

      // Validate time format (should be human readable)
      expect(activity.time).toMatch(/\d+\s+(second|minute|hour|day)s?\s+ago/);
    });
  });
});

describe('Performance and Load Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'development';
  });

  it('should handle concurrent requests', async () => {
    // Mock successful auth
    (verifyAdminAuth as jest.Mock).mockResolvedValue({
      success: true,
      user: {
        uid: 'test-uid',
        email: 'admin@example.com',
        permissions: ['view_analytics'],
      },
    });

    // Create multiple concurrent requests
    const requests = Array.from({ length: 10 }, () => 
      analyticsHandler(new NextRequest(new Request('http://localhost:3000/api/admin/analytics')))
    );

    const responses = await Promise.all(requests);

    // All requests should succeed
    responses.forEach(response => {
      expect(response.status).toBe(200);
    });

    // Verify all responses have the same structure
    const results = await Promise.all(responses.map(r => r.json()));
    results.forEach(result => {
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('rsvps');
      expect(result.data).toHaveProperty('guestbook');
    });
  });

  it('should handle large pagination requests', async () => {
    // Mock successful auth
    (verifyAdminAuth as jest.Mock).mockResolvedValue({
      success: true,
      user: {
        uid: 'test-uid',
        email: 'admin@example.com',
        permissions: ['view_analytics'],
      },
    });

    // Request large limit (should be handled gracefully)
    const request = new NextRequest(new Request('http://localhost:3000/api/admin/activity?limit=1000&offset=0'));

    const response = await activityHandler(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    // Should limit the response size appropriately
    expect(result.data.activities.length).toBeLessThanOrEqual(100); // Reasonable limit
  });
});
