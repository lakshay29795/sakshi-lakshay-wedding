import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { initializeFirebase } from '@/lib/firebase-admin';
import { rateLimiter } from '@/lib/auth/rate-limit';

// Import Firebase Admin Messaging
import { getMessaging } from 'firebase-admin/messaging';

// Validation schema for test notifications
const testNotificationSchema = z.object({
  token: z.string().min(1, 'FCM token is required'),
  type: z.enum(['connection', 'daily-love', 'wedding-reminder', 'custom']).default('connection'),
  customTitle: z.string().optional(),
  customBody: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - more restrictive for test notifications
    const rateLimitResult = await rateLimiter.check(request, 'notification-test', 3, '1 m');
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many test notifications. Please wait before trying again.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { token, type, customTitle, customBody } = testNotificationSchema.parse(body);

    // Initialize Firebase
    const { db } = initializeFirebase();
    const messaging = getMessaging();

    // Verify the token exists in our database
    const subscriptionQuery = await db
      .collection('push-subscriptions')
      .where('token', '==', token)
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (subscriptionQuery.empty) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found or inactive' },
        { status: 404 }
      );
    }

    // Prepare test notification based on type
    let notificationPayload: any;

    switch (type) {
      case 'connection':
        notificationPayload = {
          notification: {
            title: '💕 Connection Test',
            body: 'Great! Push notifications are working perfectly.',
          },
          data: {
            type: 'test-connection',
            url: '/',
            timestamp: Date.now().toString(),
          },
        };
        break;

      case 'daily-love':
        notificationPayload = {
          notification: {
            title: '💖 Daily Love Message',
            body: 'Every love story is beautiful, but ours is my favorite.',
            imageUrl: '/images/couple/hero-bg.png',
          },
          data: {
            type: 'test-daily-love',
            url: '/',
            timestamp: Date.now().toString(),
          },
        };
        break;

      case 'wedding-reminder':
        notificationPayload = {
          notification: {
            title: '🎉 Wedding Reminder Test',
            body: 'This is how wedding reminders will look. Exciting!',
            imageUrl: '/images/couple/hero-bg.png',
          },
          data: {
            type: 'test-wedding-reminder',
            url: '/rsvp',
            timestamp: Date.now().toString(),
          },
        };
        break;

      case 'custom':
        notificationPayload = {
          notification: {
            title: customTitle || '🧪 Custom Test',
            body: customBody || 'This is a custom test notification.',
          },
          data: {
            type: 'test-custom',
            url: '/',
            timestamp: Date.now().toString(),
          },
        };
        break;
    }

    // Add web-specific options
    notificationPayload.webpush = {
      headers: {
        Urgency: 'normal',
      },
      notification: {
        title: notificationPayload.notification.title,
        body: notificationPayload.notification.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        image: notificationPayload.notification.imageUrl,
        tag: `test-${type}`,
        requireInteraction: false,
        actions: [
          {
            action: 'view',
            title: 'View',
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
          },
        ],
      },
      fcmOptions: {
        link: notificationPayload.data.url,
      },
    };

    // Send the test notification
    try {
      const response = await messaging.send({
        token,
        ...notificationPayload,
      });

      // Update last used timestamp
      const subscription = subscriptionQuery.docs[0];
      await subscription.ref.update({
        lastUsed: new Date(),
        lastTestAt: new Date(),
      });

      // Log test notification
      console.log('Test notification sent:', {
        type,
        token: token.substring(0, 20) + '...',
        messageId: response,
      });

      return NextResponse.json({
        success: true,
        data: {
          messageId: response,
          type,
          sentAt: new Date().toISOString(),
        },
        message: 'Test notification sent successfully',
      });

    } catch (sendError: any) {
      console.error('Failed to send test notification:', sendError);

      // If token is invalid, mark subscription as inactive
      if (sendError.code === 'messaging/registration-token-not-registered' ||
          sendError.code === 'messaging/invalid-registration-token') {
        
        const subscription = subscriptionQuery.docs[0];
        await subscription.ref.update({
          isActive: false,
          failedAt: new Date(),
          failureReason: sendError.code,
        });

        return NextResponse.json(
          { success: false, error: 'Invalid or expired FCM token. Subscription deactivated.' },
          { status: 400 }
        );
      }

      throw sendError;
    }

  } catch (error: any) {
    console.error('Test notification error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid test notification data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to send test notification' },
      { status: 500 }
    );
  }
}
