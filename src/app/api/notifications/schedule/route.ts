import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { initializeFirebase } from '@/lib/firebase-admin';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { rateLimiter } from '@/lib/auth/rate-limit';
import { dailyLoveMessages, weddingReminderMessages } from '@/lib/firebase/messaging';

// Validation schema for scheduling notifications
const scheduleNotificationSchema = z.object({
  type: z.enum(['daily-love-messages', 'wedding-reminders', 'custom-schedule']),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  frequency: z.enum(['daily', 'weekly', 'custom']).default('daily'),
  timeOfDay: z.string().regex(/^\d{2}:\d{2}$/).default('09:00'), // HH:MM format
  timezone: z.string().default('UTC'),
  customMessages: z.array(z.object({
    title: z.string(),
    body: z.string(),
    image: z.string().optional(),
    url: z.string().optional(),
    scheduleFor: z.string().datetime(),
  })).optional(),
  enabled: z.boolean().default(true),
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
    const rateLimitResult = await rateLimiter.check(request, 'notification-schedule', 5, '1 m');
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many schedule requests. Please slow down.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = scheduleNotificationSchema.parse(body);

    // Initialize Firebase
    const { db } = initializeFirebase();

    let scheduledNotifications: any[] = [];

    if (validatedData.type === 'daily-love-messages') {
      // Schedule daily love messages
      scheduledNotifications = await scheduleDailyLoveMessages(
        validatedData.startDate ? new Date(validatedData.startDate) : new Date(),
        validatedData.endDate ? new Date(validatedData.endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        validatedData.timeOfDay,
        validatedData.timezone
      );
    } else if (validatedData.type === 'wedding-reminders') {
      // Schedule wedding reminder messages
      const weddingDate = process.env.WEDDING_DATE ? new Date(process.env.WEDDING_DATE) : new Date('2025-11-12');
      scheduledNotifications = await scheduleWeddingReminders(
        weddingDate,
        validatedData.timeOfDay,
        validatedData.timezone
      );
    } else if (validatedData.type === 'custom-schedule' && validatedData.customMessages) {
      // Schedule custom messages
      scheduledNotifications = await scheduleCustomMessages(validatedData.customMessages);
    }

    // Save schedule to database
    const scheduleDoc = await db.collection('notification-schedules').add({
      type: validatedData.type,
      startDate: validatedData.startDate ? new Date(validatedData.startDate) : new Date(),
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      frequency: validatedData.frequency,
      timeOfDay: validatedData.timeOfDay,
      timezone: validatedData.timezone,
      enabled: validatedData.enabled,
      scheduledCount: scheduledNotifications.length,
      createdBy: authResult.user.uid,
      createdAt: new Date(),
    });

    // Save individual scheduled notifications
    const batch = db.batch();
    scheduledNotifications.forEach((notification) => {
      const notificationRef = db.collection('scheduled-notifications').doc();
      batch.set(notificationRef, {
        ...notification,
        scheduleId: scheduleDoc.id,
        status: 'scheduled',
        createdAt: new Date(),
      });
    });
    await batch.commit();

    // Log schedule creation
    console.log('Notification schedule created:', {
      type: validatedData.type,
      scheduleId: scheduleDoc.id,
      count: scheduledNotifications.length,
      admin: authResult.user.email,
    });

    return NextResponse.json({
      success: true,
      data: {
        scheduleId: scheduleDoc.id,
        type: validatedData.type,
        scheduledCount: scheduledNotifications.length,
        nextNotification: scheduledNotifications[0]?.scheduledFor || null,
      },
      message: `Successfully scheduled ${scheduledNotifications.length} notifications`,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Schedule notification error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid schedule data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to schedule notifications' },
      { status: 500 }
    );
  }
}

// Get scheduled notifications
export async function GET(request: NextRequest) {
  try {
    // Admin authentication required
    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status') || 'scheduled';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Initialize Firebase
    const { db } = initializeFirebase();

    // Build query
    let query = db.collection('scheduled-notifications')
      .where('status', '==', status)
      .orderBy('scheduledFor', 'asc')
      .limit(limit);

    if (type) {
      query = query.where('type', '==', type);
    }

    const snapshot = await query.get();
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      scheduledFor: doc.data().scheduledFor?.toDate?.() || doc.data().scheduledFor,
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
    }));

    // Get schedule summaries
    const schedulesSnapshot = await db.collection('notification-schedules')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const schedules = schedulesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate?.toDate?.() || doc.data().startDate,
      endDate: doc.data().endDate?.toDate?.() || doc.data().endDate,
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        schedules,
        total: notifications.length,
      },
    });

  } catch (error: any) {
    console.error('Get scheduled notifications error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to get scheduled notifications' },
      { status: 500 }
    );
  }
}

// Helper function to schedule daily love messages
async function scheduleDailyLoveMessages(
  startDate: Date,
  endDate: Date,
  timeOfDay: string,
  timezone: string
): Promise<any[]> {
  const notifications: any[] = [];
  const [hours, minutes] = timeOfDay.split(':').map(Number);
  
  let currentDate = new Date(startDate);
  let messageIndex = 0;

  while (currentDate <= endDate) {
    const scheduledFor = new Date(currentDate);
    scheduledFor.setHours(hours, minutes, 0, 0);

    // Skip if the date is in the past
    if (scheduledFor > new Date()) {
      const message = dailyLoveMessages[messageIndex % dailyLoveMessages.length];
      
      notifications.push({
        type: 'daily-love-message',
        title: message.title,
        body: message.body,
        image: message.image,
        url: '/',
        scheduledFor,
        timezone,
        targetPreference: 'dailyLoveMessages',
      });
      
      messageIndex++;
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return notifications;
}

// Helper function to schedule wedding reminders
async function scheduleWeddingReminders(
  weddingDate: Date,
  timeOfDay: string,
  timezone: string
): Promise<any[]> {
  const notifications: any[] = [];
  const [hours, minutes] = timeOfDay.split(':').map(Number);
  
  weddingReminderMessages.forEach((reminder) => {
    const scheduledFor = new Date(weddingDate);
    scheduledFor.setDate(scheduledFor.getDate() - reminder.daysUntil);
    scheduledFor.setHours(hours, minutes, 0, 0);

    // Skip if the date is in the past
    if (scheduledFor > new Date()) {
      notifications.push({
        type: 'wedding-reminder',
        title: reminder.title,
        body: reminder.body,
        url: reminder.url,
        scheduledFor,
        timezone,
        targetPreference: 'weddingReminders',
        daysUntilWedding: reminder.daysUntil,
      });
    }
  });

  return notifications.sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
}

// Helper function to schedule custom messages
async function scheduleCustomMessages(customMessages: any[]): Promise<any[]> {
  return customMessages.map((message) => ({
    type: 'custom-message',
    title: message.title,
    body: message.body,
    image: message.image,
    url: message.url || '/',
    scheduledFor: new Date(message.scheduleFor),
    targetPreference: 'generalUpdates',
  }));
}
