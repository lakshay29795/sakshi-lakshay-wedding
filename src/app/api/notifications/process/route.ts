import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/lib/firebase-admin';
import { getMessaging } from 'firebase-admin/messaging';

// This endpoint processes scheduled notifications
// It should be called by a cron job every minute or few minutes

export async function POST(request: NextRequest) {
  try {
    // Verify this is called by a cron job or admin
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize Firebase
    const { db } = initializeFirebase();
    const messaging = getMessaging();

    // Get notifications that should be sent now
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes buffer

    const scheduledNotifications = await db
      .collection('scheduled-notifications')
      .where('status', '==', 'scheduled')
      .where('scheduledFor', '<=', now)
      .where('scheduledFor', '>=', fiveMinutesAgo)
      .limit(100) // Process max 100 notifications at a time
      .get();

    if (scheduledNotifications.empty) {
      return NextResponse.json({
        success: true,
        data: {
          processed: 0,
          message: 'No notifications to process',
        },
      });
    }

    let processedCount = 0;
    let failedCount = 0;
    const batch = db.batch();

    for (const doc of scheduledNotifications.docs) {
      const notification = doc.data();
      
      try {
        // Get active subscriptions for this notification type
        let subscriptionQuery = db.collection('push-subscriptions')
          .where('isActive', '==', true);

        // Filter by preference if specified
        if (notification.targetPreference) {
          subscriptionQuery = subscriptionQuery.where(
            `preferences.${notification.targetPreference}`, 
            '==', 
            true
          );
        }

        const subscriptions = await subscriptionQuery.get();
        
        if (subscriptions.empty) {
          // Mark as completed even if no recipients
          batch.update(doc.ref, {
            status: 'completed',
            processedAt: new Date(),
            recipientCount: 0,
            sentCount: 0,
            failedCount: 0,
          });
          processedCount++;
          continue;
        }

        // Filter by quiet hours and timezone
        const eligibleTokens = subscriptions.docs
          .filter((subDoc) => {
            const subData = subDoc.data();
            const preferences = subData.preferences;
            
            // Check quiet hours
            if (preferences?.quietHours?.enabled) {
              const userTimezone = preferences.timezone || 'UTC';
              const userTime = new Date(now.toLocaleString("en-US", { timeZone: userTimezone }));
              const userHour = userTime.getHours();
              const userMinute = userTime.getMinutes();
              const userTimeMinutes = userHour * 60 + userMinute;

              const startTime = parseTime(preferences.quietHours.start);
              const endTime = parseTime(preferences.quietHours.end);
              
              // Handle quiet hours that span midnight
              if (startTime > endTime) {
                if (userTimeMinutes >= startTime || userTimeMinutes <= endTime) {
                  return false; // In quiet hours
                }
              } else {
                if (userTimeMinutes >= startTime && userTimeMinutes <= endTime) {
                  return false; // In quiet hours
                }
              }
            }
            
            return true;
          })
          .map((subDoc) => subDoc.data().token);

        if (eligibleTokens.length === 0) {
          // Mark as completed but with quiet hours note
          batch.update(doc.ref, {
            status: 'completed',
            processedAt: new Date(),
            recipientCount: subscriptions.docs.length,
            sentCount: 0,
            failedCount: 0,
            note: 'All recipients in quiet hours',
          });
          processedCount++;
          continue;
        }

        // Prepare notification payload
        const notificationPayload = {
          notification: {
            title: notification.title,
            body: notification.body,
            ...(notification.image && { imageUrl: notification.image }),
          },
          data: {
            type: notification.type,
            url: notification.url || '/',
            timestamp: Date.now().toString(),
            scheduleId: notification.scheduleId || '',
          },
          webpush: {
            headers: {
              Urgency: 'normal',
            },
            notification: {
              title: notification.title,
              body: notification.body,
              icon: '/icons/icon-192x192.png',
              badge: '/icons/icon-72x72.png',
              image: notification.image,
              tag: `scheduled-${notification.type}`,
              requireInteraction: notification.type === 'wedding-reminder',
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
              link: notification.url || '/',
            },
          },
        };

        // Send notifications in batches (FCM limit is 500 per batch)
        const batchSize = 500;
        let totalSent = 0;
        let totalFailed = 0;

        for (let i = 0; i < eligibleTokens.length; i += batchSize) {
          const tokenBatch = eligibleTokens.slice(i, i + batchSize);
          
          try {
            const response = await messaging.sendEachForMulticast({
              tokens: tokenBatch,
              ...notificationPayload,
            });

            totalSent += response.successCount;
            totalFailed += response.failureCount;

            // Handle failed tokens (cleanup invalid tokens)
            response.responses.forEach(async (resp, idx) => {
              if (!resp.success && resp.error) {
                const errorCode = resp.error.code;
                if (errorCode === 'messaging/registration-token-not-registered' ||
                    errorCode === 'messaging/invalid-registration-token') {
                  
                  // Mark token as inactive
                  const failedToken = tokenBatch[idx];
                  const tokenQuery = await db
                    .collection('push-subscriptions')
                    .where('token', '==', failedToken)
                    .get();
                  
                  tokenQuery.docs.forEach((tokenDoc) => {
                    batch.update(tokenDoc.ref, {
                      isActive: false,
                      failedAt: new Date(),
                      failureReason: errorCode,
                    });
                  });
                }
              }
            });
          } catch (batchError) {
            console.error('Batch send error:', batchError);
            totalFailed += tokenBatch.length;
          }
        }

        // Update notification status
        batch.update(doc.ref, {
          status: 'completed',
          processedAt: new Date(),
          recipientCount: subscriptions.docs.length,
          eligibleCount: eligibleTokens.length,
          sentCount: totalSent,
          failedCount: totalFailed,
        });

        processedCount++;

        // Log notification processing
        console.log('Scheduled notification processed:', {
          id: doc.id,
          type: notification.type,
          title: notification.title,
          sent: totalSent,
          failed: totalFailed,
          eligible: eligibleTokens.length,
        });

      } catch (error) {
        console.error('Error processing notification:', doc.id, error);
        
        // Mark as failed
        batch.update(doc.ref, {
          status: 'failed',
          processedAt: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        
        failedCount++;
      }
    }

    // Commit all updates
    await batch.commit();

    // Log processing summary
    console.log('Notification processing completed:', {
      total: scheduledNotifications.docs.length,
      processed: processedCount,
      failed: failedCount,
    });

    return NextResponse.json({
      success: true,
      data: {
        total: scheduledNotifications.docs.length,
        processed: processedCount,
        failed: failedCount,
        message: `Processed ${processedCount} notifications`,
      },
    });

  } catch (error: any) {
    console.error('Notification processing error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to process notifications' },
      { status: 500 }
    );
  }
}

// Helper function to parse time string (HH:MM) to minutes since midnight
function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}
