import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { initializeFirebase } from '@/lib/firebase-admin';
import { rateLimiter } from '@/lib/auth/rate-limit';
import { getClientInfo } from '@/lib/utils';

// Validation schema for subscription data
const subscriptionSchema = z.object({
  token: z.string().min(1, 'FCM token is required'),
  preferences: z.object({
    dailyLoveMessages: z.boolean().default(true),
    weddingReminders: z.boolean().default(true),
    guestBookUpdates: z.boolean().default(false),
    rsvpReminders: z.boolean().default(true),
    generalUpdates: z.boolean().default(true),
    quietHours: z.object({
      enabled: z.boolean().default(true),
      start: z.string().regex(/^\d{2}:\d{2}$/).default('22:00'),
      end: z.string().regex(/^\d{2}:\d{2}$/).default('08:00'),
    }),
    timezone: z.string().default('UTC'),
  }),
  userAgent: z.string().optional(),
  timezone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientInfo = getClientInfo(request);
    const rateLimitResult = await rateLimiter.check(request, 'notification-subscribe', 5, '1 m');
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many subscription requests. Please slow down.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = subscriptionSchema.parse(body);

    // Initialize Firebase
    const { db } = initializeFirebase();

    // Check if subscription already exists
    const existingSubscription = await db
      .collection('push-subscriptions')
      .where('token', '==', validatedData.token)
      .get();

    let subscriptionId: string;
    const subscriptionData = {
      token: validatedData.token,
      preferences: validatedData.preferences,
      userAgent: validatedData.userAgent || clientInfo.userAgent,
      timezone: validatedData.timezone || validatedData.preferences.timezone,
      ip: clientInfo.ip,
      country: clientInfo.country,
      lastUsed: new Date(),
      isActive: true,
    };

    if (!existingSubscription.empty) {
      // Update existing subscription
      const doc = existingSubscription.docs[0];
      subscriptionId = doc.id;
      
      await doc.ref.update({
        ...subscriptionData,
        updatedAt: new Date(),
      });
    } else {
      // Create new subscription
      const docRef = await db.collection('push-subscriptions').add({
        ...subscriptionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      subscriptionId = docRef.id;
    }

    // Log subscription
    console.log('Push notification subscription:', {
      id: subscriptionId,
      preferences: validatedData.preferences,
      timezone: subscriptionData.timezone,
      ip: clientInfo.ip,
    });

    // Return subscription details
    return NextResponse.json({
      success: true,
      data: {
        id: subscriptionId,
        token: validatedData.token,
        preferences: validatedData.preferences,
        createdAt: new Date().toISOString(),
      },
      message: 'Successfully subscribed to push notifications',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Push notification subscription error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid subscription data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to subscribe to notifications' },
      { status: 500 }
    );
  }
}
