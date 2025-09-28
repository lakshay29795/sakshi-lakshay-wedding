import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { initializeFirebase } from '@/lib/firebase-admin';
import { rateLimiter } from '@/lib/auth/rate-limit';

// Validation schema for preference updates
const preferencesSchema = z.object({
  token: z.string().min(1, 'FCM token is required'),
  preferences: z.object({
    dailyLoveMessages: z.boolean().optional(),
    weddingReminders: z.boolean().optional(),
    guestBookUpdates: z.boolean().optional(),
    rsvpReminders: z.boolean().optional(),
    generalUpdates: z.boolean().optional(),
    quietHours: z.object({
      enabled: z.boolean().optional(),
      start: z.string().regex(/^\d{2}:\d{2}$/).optional(),
      end: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    }).optional(),
    timezone: z.string().optional(),
  }),
});

export async function PUT(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimiter.check(request, 'notification-preferences', 20, '1 m');
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many preference update requests. Please slow down.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { token, preferences } = preferencesSchema.parse(body);

    // Initialize Firebase
    const { db } = initializeFirebase();

    // Find subscription
    const subscriptionQuery = await db
      .collection('push-subscriptions')
      .where('token', '==', token)
      .where('isActive', '==', true)
      .get();

    if (subscriptionQuery.empty) {
      return NextResponse.json(
        { success: false, error: 'Active subscription not found' },
        { status: 404 }
      );
    }

    // Update preferences for all matching subscriptions
    const batch = db.batch();
    const updatedSubscriptions: any[] = [];

    subscriptionQuery.docs.forEach((doc) => {
      const currentData = doc.data();
      const updatedPreferences = {
        ...currentData.preferences,
        ...preferences,
      };

      batch.update(doc.ref, {
        preferences: updatedPreferences,
        updatedAt: new Date(),
        lastUsed: new Date(),
      });

      updatedSubscriptions.push({
        id: doc.id,
        preferences: updatedPreferences,
      });
    });

    await batch.commit();

    // Log preference update
    console.log('Push notification preferences updated:', {
      token: token.substring(0, 20) + '...',
      preferences,
      count: subscriptionQuery.docs.length,
    });

    return NextResponse.json({
      success: true,
      data: {
        subscriptions: updatedSubscriptions,
        updatedAt: new Date().toISOString(),
      },
      message: 'Notification preferences updated successfully',
    });

  } catch (error: any) {
    console.error('Push notification preferences update error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid preference data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update notification preferences' },
      { status: 500 }
    );
  }
}

// Get current preferences
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'FCM token is required' },
        { status: 400 }
      );
    }

    // Initialize Firebase
    const { db } = initializeFirebase();

    // Find subscription
    const subscriptionQuery = await db
      .collection('push-subscriptions')
      .where('token', '==', token)
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (subscriptionQuery.empty) {
      return NextResponse.json(
        { success: false, error: 'Active subscription not found' },
        { status: 404 }
      );
    }

    const subscription = subscriptionQuery.docs[0].data();

    return NextResponse.json({
      success: true,
      data: {
        preferences: subscription.preferences,
        lastUsed: subscription.lastUsed?.toDate?.() || subscription.lastUsed,
        createdAt: subscription.createdAt?.toDate?.() || subscription.createdAt,
      },
    });

  } catch (error: any) {
    console.error('Get notification preferences error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to get notification preferences' },
      { status: 500 }
    );
  }
}
