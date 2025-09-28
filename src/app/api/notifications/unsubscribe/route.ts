import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { initializeFirebase } from '@/lib/firebase-admin';
import { rateLimiter } from '@/lib/auth/rate-limit';
import { getClientInfo } from '@/lib/utils';

// Validation schema for unsubscription data
const unsubscribeSchema = z.object({
  token: z.string().min(1, 'FCM token is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimiter.check(request, 'notification-unsubscribe', 10, '1 m');
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many unsubscribe requests. Please slow down.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { token } = unsubscribeSchema.parse(body);

    // Initialize Firebase
    const { db } = initializeFirebase();

    // Find and deactivate subscription
    const subscriptionQuery = await db
      .collection('push-subscriptions')
      .where('token', '==', token)
      .get();

    if (subscriptionQuery.empty) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Deactivate all matching subscriptions
    const batch = db.batch();
    subscriptionQuery.docs.forEach((doc) => {
      batch.update(doc.ref, {
        isActive: false,
        unsubscribedAt: new Date(),
        updatedAt: new Date(),
      });
    });

    await batch.commit();

    // Log unsubscription
    const clientInfo = getClientInfo(request);
    console.log('Push notification unsubscription:', {
      token: token.substring(0, 20) + '...',
      count: subscriptionQuery.docs.length,
      ip: clientInfo.ip,
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from push notifications',
    });

  } catch (error: any) {
    console.error('Push notification unsubscription error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid unsubscription data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to unsubscribe from notifications' },
      { status: 500 }
    );
  }
}
