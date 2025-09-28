import { sendRSVPConfirmationEmail, sendRSVPUpdateEmail } from '@/lib/email';
import { RSVPData } from '@/types/rsvp';

// Mock Resend
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'mock-email-id' }),
    },
  })),
}));

describe('Email Service', () => {
  const mockRSVPData: RSVPData = {
    id: 'rsvp-123',
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
      {
        id: 'guest-2',
        fullName: 'Jane Doe',
        isAttending: true,
        mealPreference: 'vegetarian',
        dietaryRestrictions: 'No nuts',
      },
    ],
    totalGuests: 2,
    totalGuestsAttending: 2,
    totalGuestsDeclined: 0,
    message: 'Looking forward to celebrating with you!',
    songRequest: 'Perfect by Ed Sheeran',
    accommodationNeeded: true,
    transportationNeeded: false,
    submittedAt: new Date(),
    status: 'confirmed',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendRSVPConfirmationEmail', () => {
    it('sends confirmation email for attending guest', async () => {
      const result = await sendRSVPConfirmationEmail(mockRSVPData);

      expect(result.success).toBe(true);
      expect(result.emailId).toBe('mock-email-id');

      const { Resend } = require('resend');
      const mockResend = new Resend();
      expect(mockResend.emails.send).toHaveBeenCalledWith({
        from: expect.stringContaining('@'),
        to: 'john@example.com',
        subject: 'RSVP Confirmation - Sarah & Michael\'s Wedding',
        html: expect.stringContaining('John Doe'),
        text: expect.stringContaining('John Doe'),
      });
    });

    it('sends confirmation email for non-attending guest', async () => {
      const nonAttendingRSVP: RSVPData = {
        ...mockRSVPData,
        isAttending: false,
        guests: [],
        totalGuestsAttending: 0,
        totalGuestsDeclined: 1,
      };

      const result = await sendRSVPConfirmationEmail(nonAttendingRSVP);

      expect(result.success).toBe(true);

      const { Resend } = require('resend');
      const mockResend = new Resend();
      expect(mockResend.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining('RSVP Confirmation'),
          html: expect.stringContaining('sorry you can\'t make it'),
        })
      );
    });

    it('includes guest details in email', async () => {
      await sendRSVPConfirmationEmail(mockRSVPData);

      const { Resend } = require('resend');
      const mockResend = new Resend();
      const emailCall = mockResend.emails.send.mock.calls[0][0];

      expect(emailCall.html).toContain('John Doe');
      expect(emailCall.html).toContain('Jane Doe');
      expect(emailCall.html).toContain('Regular');
      expect(emailCall.html).toContain('Vegetarian');
      expect(emailCall.html).toContain('No nuts');
    });

    it('includes special requests in email', async () => {
      await sendRSVPConfirmationEmail(mockRSVPData);

      const { Resend } = require('resend');
      const mockResend = new Resend();
      const emailCall = mockResend.emails.send.mock.calls[0][0];

      expect(emailCall.html).toContain('Perfect by Ed Sheeran');
      expect(emailCall.html).toContain('Looking forward to celebrating');
      expect(emailCall.html).toContain('accommodation information');
    });

    it('handles email sending errors', async () => {
      const { Resend } = require('resend');
      const mockResend = new Resend();
      mockResend.emails.send.mockRejectedValueOnce(new Error('Email service error'));

      const result = await sendRSVPConfirmationEmail(mockRSVPData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email service error');
    });
  });

  describe('sendRSVPUpdateEmail', () => {
    it('sends update email when RSVP is modified', async () => {
      const updatedRSVP: RSVPData = {
        ...mockRSVPData,
        updatedAt: new Date(),
        totalGuestsAttending: 1,
        guests: [mockRSVPData.guests[0]], // Removed one guest
      };

      const result = await sendRSVPUpdateEmail(updatedRSVP);

      expect(result.success).toBe(true);

      const { Resend } = require('resend');
      const mockResend = new Resend();
      expect(mockResend.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining('RSVP Updated'),
          html: expect.stringContaining('updated'),
        })
      );
    });

    it('sends cancellation email when guest changes to not attending', async () => {
      const cancelledRSVP: RSVPData = {
        ...mockRSVPData,
        isAttending: false,
        guests: [],
        totalGuestsAttending: 0,
        totalGuestsDeclined: 1,
        updatedAt: new Date(),
      };

      const result = await sendRSVPUpdateEmail(cancelledRSVP);

      expect(result.success).toBe(true);

      const { Resend } = require('resend');
      const mockResend = new Resend();
      const emailCall = mockResend.emails.send.mock.calls[0][0];

      expect(emailCall.subject).toContain('RSVP Updated');
      expect(emailCall.html).toContain('no longer attending');
    });
  });

  describe('Email templates', () => {
    it('generates proper HTML email template', async () => {
      await sendRSVPConfirmationEmail(mockRSVPData);

      const { Resend } = require('resend');
      const mockResend = new Resend();
      const emailCall = mockResend.emails.send.mock.calls[0][0];

      // Check HTML structure
      expect(emailCall.html).toContain('<!DOCTYPE html>');
      expect(emailCall.html).toContain('<html');
      expect(emailCall.html).toContain('<head>');
      expect(emailCall.html).toContain('<body>');
      expect(emailCall.html).toContain('</html>');

      // Check styling
      expect(emailCall.html).toContain('style=');
      expect(emailCall.html).toContain('font-family');
      expect(emailCall.html).toContain('color');
    });

    it('generates proper text email template', async () => {
      await sendRSVPConfirmationEmail(mockRSVPData);

      const { Resend } = require('resend');
      const mockResend = new Resend();
      const emailCall = mockResend.emails.send.mock.calls[0][0];

      // Check text content
      expect(emailCall.text).toContain('Dear John Doe');
      expect(emailCall.text).toContain('RSVP Confirmation');
      expect(emailCall.text).toContain('Sarah & Michael');
      expect(emailCall.text).not.toContain('<html>');
      expect(emailCall.text).not.toContain('<div>');
    });

    it('escapes HTML in user input', async () => {
      const rsvpWithHtml: RSVPData = {
        ...mockRSVPData,
        message: '<script>alert("xss")</script>Safe message',
        songRequest: '<img src="x" onerror="alert(1)">Song Title',
      };

      await sendRSVPConfirmationEmail(rsvpWithHtml);

      const { Resend } = require('resend');
      const mockResend = new Resend();
      const emailCall = mockResend.emails.send.mock.calls[0][0];

      // HTML should be escaped
      expect(emailCall.html).not.toContain('<script>');
      expect(emailCall.html).not.toContain('<img src="x"');
      expect(emailCall.html).toContain('&lt;script&gt;');
      expect(emailCall.html).toContain('Safe message');
      expect(emailCall.html).toContain('Song Title');
    });
  });

  describe('Email delivery tracking', () => {
    it('logs successful email delivery', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await sendRSVPConfirmationEmail(mockRSVPData);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('RSVP confirmation email sent'),
        expect.objectContaining({
          emailId: 'mock-email-id',
          recipient: 'john@example.com',
        })
      );

      consoleSpy.mockRestore();
    });

    it('logs email delivery failures', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const { Resend } = require('resend');
      const mockResend = new Resend();
      mockResend.emails.send.mockRejectedValueOnce(new Error('Email service error'));

      await sendRSVPConfirmationEmail(mockRSVPData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to send RSVP confirmation email'),
        expect.objectContaining({
          error: 'Email service error',
          recipient: 'john@example.com',
        })
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
