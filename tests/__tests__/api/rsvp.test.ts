import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/rsvp/route';
import { RSVPFormInput } from '@/lib/validations/rsvp';

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      add: jest.fn().mockResolvedValue({ id: 'mock-doc-id' }),
      doc: jest.fn(() => ({
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => ({ id: 'mock-doc-id', primaryGuestName: 'John Doe' }),
        }),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
      })),
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        docs: [
          {
            id: 'mock-doc-id',
            data: () => ({ primaryGuestName: 'John Doe', primaryGuestEmail: 'john@example.com' }),
          },
        ],
      }),
    })),
  })),
}));

// Mock Resend
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'mock-email-id' }),
    },
  })),
}));

describe('/api/rsvp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/rsvp', () => {
    it('creates a new RSVP successfully', async () => {
      const validRSVPData: RSVPFormInput = {
        primaryGuestName: 'John Doe',
        primaryGuestEmail: 'john@example.com',
        phone: '+1234567890',
        isAttending: true,
        guests: [
          {
            id: 'guest-1',
            fullName: 'John Doe',
            isAttending: true,
            mealPreference: 'regular',
          },
        ],
        totalGuests: 1,
        message: 'Looking forward to the celebration!',
        songRequest: 'Perfect by Ed Sheeran',
        accommodationNeeded: false,
        transportationNeeded: false,
      };

      const { req, res } = createMocks({
        method: 'POST',
        body: validRSVPData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data.id).toBe('mock-doc-id');
    });

    it('validates required fields', async () => {
      const invalidRSVPData = {
        primaryGuestName: '', // Missing required field
        primaryGuestEmail: 'invalid-email', // Invalid email
        isAttending: true,
      };

      const { req, res } = createMocks({
        method: 'POST',
        body: invalidRSVPData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error).toContain('validation');
    });

    it('handles database errors gracefully', async () => {
      // Mock database error
      const mockFirestore = require('firebase-admin').firestore();
      mockFirestore.collection().add.mockRejectedValueOnce(new Error('Database error'));

      const validRSVPData: RSVPFormInput = {
        primaryGuestName: 'John Doe',
        primaryGuestEmail: 'john@example.com',
        isAttending: true,
        guests: [],
        totalGuests: 1,
      };

      const { req, res } = createMocks({
        method: 'POST',
        body: validRSVPData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(500);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error).toContain('Failed to save RSVP');
    });

    it('sends confirmation email after successful RSVP', async () => {
      const validRSVPData: RSVPFormInput = {
        primaryGuestName: 'John Doe',
        primaryGuestEmail: 'john@example.com',
        isAttending: true,
        guests: [],
        totalGuests: 1,
      };

      const { req, res } = createMocks({
        method: 'POST',
        body: validRSVPData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);
      
      // Check that email was sent
      const { Resend } = require('resend');
      const mockResend = new Resend();
      expect(mockResend.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'john@example.com',
          subject: expect.stringContaining('RSVP Confirmation'),
        })
      );
    });
  });

  describe('GET /api/rsvp', () => {
    it('retrieves RSVP by email', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { email: 'john@example.com' },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].primaryGuestEmail).toBe('john@example.com');
    });

    it('returns 404 when RSVP not found', async () => {
      // Mock empty result
      const mockFirestore = require('firebase-admin').firestore();
      mockFirestore.collection().where().get.mockResolvedValueOnce({ docs: [] });

      const { req, res } = createMocks({
        method: 'GET',
        query: { email: 'notfound@example.com' },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error).toBe('RSVP not found');
    });
  });

  describe('PUT /api/rsvp', () => {
    it('updates existing RSVP', async () => {
      const updateData = {
        id: 'mock-doc-id',
        primaryGuestName: 'John Updated',
        primaryGuestEmail: 'john@example.com',
        isAttending: false,
        guests: [],
        totalGuests: 0,
      };

      const { req, res } = createMocks({
        method: 'PUT',
        body: updateData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
    });
  });

  describe('DELETE /api/rsvp', () => {
    it('deletes RSVP by ID', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'mock-doc-id' },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
    });
  });

  describe('Rate limiting', () => {
    it('enforces rate limits', async () => {
      const validRSVPData: RSVPFormInput = {
        primaryGuestName: 'John Doe',
        primaryGuestEmail: 'john@example.com',
        isAttending: true,
        guests: [],
        totalGuests: 1,
      };

      // Make multiple requests quickly
      const requests = Array.from({ length: 6 }, () =>
        createMocks({
          method: 'POST',
          body: validRSVPData,
          headers: { 'x-forwarded-for': '192.168.1.1' },
        })
      );

      const responses = await Promise.all(
        requests.map(({ req, res }) => handler(req, res))
      );

      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter((_, index) => {
        const { res } = requests[index];
        return res._getStatusCode() === 429;
      });

      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});