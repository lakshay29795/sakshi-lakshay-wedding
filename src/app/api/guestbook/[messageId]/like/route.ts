import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { initializeFirebase } from '@/lib/firebase-admin';

// Firebase will be initialized when needed

// Rate limiting: 20 likes per minute per IP
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

function getClientInfo(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
  return { ip };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;
    const { ip } = getClientInfo(request);

    // Rate limiting
    const { success } = await limiter.check(20, ip);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please slow down.' },
        { status: 429 }
      );
    }

    if (process.env.NODE_ENV === 'development') {
      // Mock like functionality for development
      console.log('Mock message liked:', {
        messageId,
        ip,
      });

      return NextResponse.json({
        success: true,
        data: {
          messageId,
          likes: Math.floor(Math.random() * 20) + 1, // Random like count for demo
        },
      });
    }

    // Get message document
    const { db } = initializeFirebase();
    const messageRef = db.collection('guestbook').doc(messageId);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    const messageData = messageDoc.data();
    
    // Only allow liking approved messages
    if (messageData?.status !== 'approved') {
      return NextResponse.json(
        { success: false, error: 'Cannot like this message' },
        { status: 403 }
      );
    }

    // Check if already liked by this IP
    const likedBy = messageData.likedBy || [];
    if (likedBy.includes(ip)) {
      return NextResponse.json(
        { success: false, error: 'Already liked this message' },
        { status: 400 }
      );
    }

    // Update message with new like
    await messageRef.update({
      likes: (messageData.likes || 0) + 1,
      likedBy: [...likedBy, ip],
      updatedAt: new Date(),
    });

    console.log('Message liked:', {
      messageId,
      ip,
      newLikeCount: (messageData.likes || 0) + 1,
    });

    return NextResponse.json({
      success: true,
      data: {
        messageId,
        likes: (messageData.likes || 0) + 1,
      },
    });

  } catch (error: any) {
    console.error('Error liking message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to like message' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;
    const { ip } = getClientInfo(request);

    // Rate limiting
    const { success } = await limiter.check(20, ip);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please slow down.' },
        { status: 429 }
      );
    }

    if (process.env.NODE_ENV === 'development') {
      // Mock unlike functionality for development
      console.log('Mock message unliked:', {
        messageId,
        ip,
      });

      return NextResponse.json({
        success: true,
        data: {
          messageId,
          likes: Math.max(Math.floor(Math.random() * 20) - 1, 0), // Random like count for demo
        },
      });
    }

    // Get message document
    const { db } = initializeFirebase();
    const messageRef = db.collection('guestbook').doc(messageId);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    const messageData = messageDoc.data();
    const likedBy = messageData?.likedBy || [];

    // Check if liked by this IP
    if (!likedBy.includes(ip)) {
      return NextResponse.json(
        { success: false, error: 'Have not liked this message' },
        { status: 400 }
      );
    }

    // Update message to remove like
    const newLikedBy = likedBy.filter((likerIp: string) => likerIp !== ip);
    await messageRef.update({
      likes: Math.max((messageData?.likes || 0) - 1, 0),
      likedBy: newLikedBy,
      updatedAt: new Date(),
    });

    console.log('Message unliked:', {
      messageId,
      ip,
      newLikeCount: Math.max((messageData?.likes || 0) - 1, 0),
    });

    return NextResponse.json({
      success: true,
      data: {
        messageId,
        likes: Math.max((messageData?.likes || 0) - 1, 0),
      },
    });

  } catch (error: any) {
    console.error('Error unliking message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unlike message' },
      { status: 500 }
    );
  }
}
