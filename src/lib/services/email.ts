import { Resend } from 'resend';
import type { RSVPFormData, RSVPSubmission } from '@/types/rsvp';

// Initialize Resend (you can also use SendGrid, Nodemailer, etc.)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Email configuration
const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'Sakshi & Lakshay <noreply@sakshilakshay.com>',
  replyTo: process.env.EMAIL_REPLY_TO || 'sakshi.lakshay.wedding@example.com',
  domain: process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000',
};

// Email templates
const EMAIL_TEMPLATES = {
  rsvpConfirmation: {
    attending: {
      subject: "We're so excited you'll be there! 💕",
      template: 'rsvp-confirmation-attending',
    },
    notAttending: {
      subject: "Thank you for letting us know 💕",
      template: 'rsvp-confirmation-not-attending',
    },
  },
  rsvpUpdate: {
    subject: "Your RSVP has been updated 💕",
    template: 'rsvp-update',
  },
  adminNotification: {
    subject: "New RSVP Received",
    template: 'admin-rsvp-notification',
  },
};

/**
 * Send RSVP confirmation email to guest
 */
export async function sendRSVPConfirmationEmail(
  rsvpData: RSVPFormData,
  rsvpId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!resend) {
      console.warn('Email service not configured - skipping confirmation email');
      return { success: true };
    }

    const template = rsvpData.isAttending 
      ? EMAIL_TEMPLATES.rsvpConfirmation.attending
      : EMAIL_TEMPLATES.rsvpConfirmation.notAttending;

    const emailContent = generateRSVPConfirmationHTML(rsvpData, rsvpId);

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: rsvpData.primaryGuestEmail,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: template.subject,
      html: emailContent,
    });

    console.log('Confirmation email sent:', result);
    return { success: true };

  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown email error' 
    };
  }
}

/**
 * Send RSVP update confirmation email
 */
export async function sendRSVPUpdateEmail(
  rsvpData: RSVPSubmission,
  rsvpId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!resend) {
      console.warn('Email service not configured - skipping update email');
      return { success: true };
    }

    const emailContent = generateRSVPUpdateHTML(rsvpData, rsvpId);

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: rsvpData.primaryGuestEmail,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: EMAIL_TEMPLATES.rsvpUpdate.subject,
      html: emailContent,
    });

    console.log('Update email sent:', result);
    return { success: true };

  } catch (error) {
    console.error('Failed to send update email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown email error' 
    };
  }
}

/**
 * Send admin notification email for new RSVP
 */
export async function sendAdminNotificationEmail(
  rsvpData: RSVPFormData,
  rsvpId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!resend || !process.env.ADMIN_EMAIL) {
      console.warn('Admin email not configured - skipping notification');
      return { success: true };
    }

    const emailContent = generateAdminNotificationHTML(rsvpData, rsvpId);

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: process.env.ADMIN_EMAIL,
      subject: EMAIL_TEMPLATES.adminNotification.subject,
      html: emailContent,
    });

    console.log('Admin notification sent:', result);
    return { success: true };

  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown email error' 
    };
  }
}

/**
 * Generate RSVP confirmation email HTML
 */
function generateRSVPConfirmationHTML(rsvpData: RSVPFormData, rsvpId: string): string {
  const isAttending = rsvpData.isAttending;
  const guestCount = rsvpData.guests?.length || 0;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RSVP Confirmation</title>
      <style>
        body { font-family: 'Georgia', serif; line-height: 1.6; color: #2D2D2D; background-color: #FFF8F0; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #F8E8E8 0%, #A8B5A0 50%, #FFF8F0 100%); padding: 40px 20px; text-align: center; }
        .content { padding: 40px 20px; }
        .footer { background: #F5F5F5; padding: 20px; text-align: center; font-size: 14px; color: #6B7280; }
        h1 { color: #A8B5A0; margin: 0; font-size: 28px; }
        h2 { color: #A8B5A0; font-size: 22px; margin-top: 30px; }
        .highlight { background: #F8E8E8; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .guest-list { background: #F9FAFB; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .button { display: inline-block; background: #A8B5A0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .divider { height: 1px; background: #E5E7EB; margin: 30px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💕 Sakshi & Lakshay 💕</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; color: #6B7280;">November 12, 2025 • Rosewood Manor</p>
        </div>
        
        <div class="content">
          <h2>Dear ${rsvpData.primaryGuestName},</h2>
          
          ${isAttending ? `
            <p>We're absolutely <strong>thrilled</strong> that you'll be joining us on our special day! 🎉</p>
            
            <div class="highlight">
              <h3 style="margin-top: 0; color: #A8B5A0;">Your RSVP Details:</h3>
              <p><strong>Status:</strong> Attending ✅</p>
              <p><strong>Number of Guests:</strong> ${guestCount}</p>
              ${guestCount > 1 ? `
                <div class="guest-list">
                  <strong>Guest List:</strong>
                  <ul style="margin: 10px 0;">
                    ${rsvpData.guests?.map(guest => `
                      <li>${guest.name} - ${guest.mealPreference} meal${guest.dietaryRestrictions ? ` (${guest.dietaryRestrictions})` : ''}</li>
                    `).join('') || ''}
                  </ul>
                </div>
              ` : ''}
              ${rsvpData.message ? `<p><strong>Your Message:</strong> "${rsvpData.message}"</p>` : ''}
            </div>
            
            <h3>What's Next?</h3>
            <ul>
              <li>Save the date: <strong>November 12, 2025 at 4:00 PM</strong></li>
              <li>Location: <strong>Rosewood Manor, 123 Love Lane, Evergreen, CA</strong></li>
              <li>We'll send more details about parking, accommodations, and the schedule closer to the date</li>
              <li>If you need to make changes, please contact us directly</li>
            </ul>
          ` : `
            <p>Thank you so much for letting us know. While we're sad you can't be there in person, we completely understand and appreciate you taking the time to respond. 💕</p>
            
            <div class="highlight">
              <h3 style="margin-top: 0; color: #A8B5A0;">Your Response:</h3>
              <p><strong>Status:</strong> Unable to Attend</p>
              ${rsvpData.message ? `<p><strong>Your Message:</strong> "${rsvpData.message}"</p>` : ''}
            </div>
            
            <p>Even though you can't be there physically, you'll be in our hearts and thoughts on our special day. We hope to celebrate with you soon! 🌟</p>
          `}
          
          <div class="divider"></div>
          
          <p>With love and gratitude,<br>
          <strong>Sakshi & Lakshay</strong> 💕</p>
          
          <p style="font-size: 14px; color: #6B7280; margin-top: 30px;">
            <strong>RSVP ID:</strong> ${rsvpId}<br>
            <strong>Submitted:</strong> ${new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div class="footer">
          <p>Questions? Contact us at ${EMAIL_CONFIG.replyTo}</p>
          <p>Visit our wedding website: <a href="https://${EMAIL_CONFIG.domain}" style="color: #A8B5A0;">sakshilakshay.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate RSVP update email HTML
 */
function generateRSVPUpdateHTML(rsvpData: RSVPSubmission, rsvpId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RSVP Updated</title>
      <style>
        body { font-family: 'Georgia', serif; line-height: 1.6; color: #2D2D2D; background-color: #FFF8F0; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #F8E8E8 0%, #A8B5A0 50%, #FFF8F0 100%); padding: 40px 20px; text-align: center; }
        .content { padding: 40px 20px; }
        .footer { background: #F5F5F5; padding: 20px; text-align: center; font-size: 14px; color: #6B7280; }
        h1 { color: #A8B5A0; margin: 0; font-size: 28px; }
        h2 { color: #A8B5A0; font-size: 22px; margin-top: 30px; }
        .highlight { background: #F8E8E8; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💕 RSVP Updated 💕</h1>
        </div>
        
        <div class="content">
          <h2>Dear ${rsvpData.primaryGuestName},</h2>
          
          <p>We've received your updated RSVP information. Thank you for keeping us informed! 💕</p>
          
          <div class="highlight">
            <h3 style="margin-top: 0; color: #A8B5A0;">Updated Details:</h3>
            <p><strong>Status:</strong> ${rsvpData.isAttending ? 'Attending ✅' : 'Unable to Attend'}</p>
            <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p>If you need to make any additional changes, please contact us directly.</p>
          
          <p>With love,<br>
          <strong>Sakshi & Lakshay</strong> 💕</p>
        </div>
        
        <div class="footer">
          <p>Questions? Contact us at ${EMAIL_CONFIG.replyTo}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate admin notification email HTML
 */
function generateAdminNotificationHTML(rsvpData: RSVPFormData, rsvpId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New RSVP Received</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>New RSVP Received</h2>
      
      <p><strong>Guest:</strong> ${rsvpData.primaryGuestName}</p>
      <p><strong>Email:</strong> ${rsvpData.primaryGuestEmail}</p>
      <p><strong>Phone:</strong> ${rsvpData.phone || 'Not provided'}</p>
      <p><strong>Status:</strong> ${rsvpData.isAttending ? 'Attending' : 'Not Attending'}</p>
      
      ${rsvpData.isAttending ? `
        <p><strong>Number of Guests:</strong> ${rsvpData.guests?.length || 0}</p>
        ${rsvpData.guests && rsvpData.guests.length > 0 ? `
          <h3>Guest Details:</h3>
          <ul>
            ${rsvpData.guests.map(guest => `
              <li>${guest.name} - ${guest.mealPreference}${guest.dietaryRestrictions ? ` (${guest.dietaryRestrictions})` : ''}</li>
            `).join('')}
          </ul>
        ` : ''}
      ` : ''}
      
      ${rsvpData.message ? `<p><strong>Message:</strong> ${rsvpData.message}</p>` : ''}
      
      <p><strong>RSVP ID:</strong> ${rsvpId}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    </body>
    </html>
  `;
}

// Rate limiting utility (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function rateLimitByIP(
  request: NextRequest,
  maxRequests: number,
  windowMs: number
): Promise<{ success: boolean; remaining?: number }> {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowStart = now - windowMs * 1000;

  const current = rateLimitMap.get(ip);

  if (!current || current.resetTime < now) {
    // Reset or initialize
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs * 1000 });
    return { success: true, remaining: maxRequests - 1 };
  }

  if (current.count >= maxRequests) {
    return { success: false };
  }

  current.count++;
  return { success: true, remaining: maxRequests - current.count };
}
