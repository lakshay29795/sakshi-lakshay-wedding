import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { initializeFirebase } from '@/lib/firebase-admin';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { rateLimiter } from '@/lib/auth/rate-limit';

// Import Firebase Admin Messaging
import { getMessaging } from 'firebase-admin/messaging';

// Validation schema for sending notifications
const sendNotificationSchema = z.object({
  type: z.enum(['daily-love-message', 'wedding-reminder', 'general-update', 'rsvp-reminder', 'guestbook-update']),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  body: z.string().min(1, 'Body is required').max(500, 'Body too long'),
  image: z.string().url().optional(),
  icon: z.string().url().optional(),
  url: z.string().optional(),
  data: z.record(z.string()).optional(),
  targetPreference: z.string().optional(), // Which preference controls this notification
  scheduleFor: z.string().datetime().optional(), // ISO datetime string
  testMode: z.boolean().default(false),
  testToken: z.string().optional(), // For testing specific devices
});

export async function POST(request: NextRequest) {
  try {
    // Admin authentication required
    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Rate limiting
    const rateLimitResult = await rateLimiter.check(request, 'notification-send', 10, '1 m');
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many send requests. Please slow down.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = sendNotificationSchema.parse(body);

    // Initialize Firebase
    const { db } = initializeFirebase();
    const messaging = getMessaging();

    let targetTokens: string[] = [];

    if (validatedData.testMode && validatedData.testToken) {
      // Test mode - send to specific token
      targetTokens = [validatedData.testToken];
    } else {
      // Get active subscriptions based on preferences
      let query = db.collection('push-subscriptions')
        .where('isActive', '==', true);

      // Filter by preference if specified
      if (validatedData.targetPreference) {
        query = query.where(`preferences.${validatedData.targetPreference}`, '==', true);
      }

      const subscriptions = await query.get();
      
      // Filter by quiet hours if applicable
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = currentHour * 60 + currentMinute; // Minutes since midnight

      targetTokens = subscriptions.docs
        .filter((doc) => {
          const data = doc.data();
          const preferences = data.preferences;
          
          // Check quiet hours
          if (preferences?.quietHours?.enabled) {
            const startTime = parseTime(preferences.quietHours.start);
            const endTime = parseTime(preferences.quietHours.end);
            
            // Handle quiet hours that span midnight
            if (startTime > endTime) {
              if (currentTime >= startTime || currentTime <= endTime) {
                return false; // In quiet hours
              }
            } else {
              if (currentTime >= startTime && currentTime <= endTime) {
                return false; // In quiet hours
              }
            }
          }
          
          return true;
        })
        .map((doc) => doc.data().token);
    }

    if (targetTokens.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          sent: 0,
          failed: 0,
          message: 'No eligible recipients found',
        },
      });
    }

    // Prepare notification payload
    const notificationPayload = {
      notification: {
        title: validatedData.title,
        body: validatedData.body,
        ...(validatedData.image && { imageUrl: validatedData.image }),
      },
      data: {
        type: validatedData.type,
        url: validatedData.url || '/',
        timestamp: Date.now().toString(),
        ...validatedData.data,
      },
      webpush: {
        headers: {
          Urgency: 'normal',
        },
        notification: {
          title: validatedData.title,
          body: validatedData.body,
          icon: validatedData.icon || '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          image: validatedData.image,
          tag: `wedding-${validatedData.type}`,
          requireInteraction: validatedData.type === 'wedding-reminder',
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
          link: validatedData.url || '/',
        },
      },
    };

    // Send notifications in batches (FCM limit is 500 per batch)
    const batchSize = 500;
    const batches = [];
    
    for (let i = 0; i < targetTokens.length; i += batchSize) {
      batches.push(targetTokens.slice(i, i + batchSize));
    }

    let totalSent = 0;
    let totalFailed = 0;
    const failedTokens: string[] = [];

    for (const batch of batches) {
      try {
        const response = await messaging.sendEachForMulticast({
          tokens: batch,
          ...notificationPayload,
        });

        totalSent += response.successCount;
        totalFailed += response.failureCount;

        // Collect failed tokens for cleanup
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(batch[idx]);
            console.error('Failed to send notification:', resp.error);
          }
        });
      } catch (error) {
        console.error('Batch send error:', error);
        totalFailed += batch.length;
        failedTokens.push(...batch);
      }
    }

    // Clean up invalid tokens
    if (failedTokens.length > 0) {
      const cleanupBatch = db.batch();
      
      for (const token of failedTokens) {
        const subscriptionQuery = await db
          .collection('push-subscriptions')
          .where('token', '==', token)
          .get();
        
        subscriptionQuery.docs.forEach((doc) => {
          cleanupBatch.update(doc.ref, {
            isActive: false,
            failedAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }
      
      await cleanupBatch.commit();
    }

    // Log notification send
    console.log('Push notification sent:', {
      type: validatedData.type,
      title: validatedData.title,
      sent: totalSent,
      failed: totalFailed,
      testMode: validatedData.testMode,
      admin: authResult.user.email,
    });

    // Store notification in history
    await db.collection('notification-history').add({
      type: validatedData.type,
      title: validatedData.title,
      body: validatedData.body,
      image: validatedData.image,
      url: validatedData.url,
      targetPreference: validatedData.targetPreference,
      sent: totalSent,
      failed: totalFailed,
      testMode: validatedData.testMode,
      sentBy: authResult.user.uid,
      sentAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: {
        sent: totalSent,
        failed: totalFailed,
        total: targetTokens.length,
        message: `Notification sent to ${totalSent} devices`,
      },
    });

  } catch (error: any) {
    console.error('Send notification error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid notification data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// Helper function to parse time string (HH:MM) to minutes since midnight
function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}
