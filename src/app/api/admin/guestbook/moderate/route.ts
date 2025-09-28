import { NextRequest, NextResponse } from 'next/server';
import { moderationActionSchema } from '@/lib/validations/guestbook';
import { initializeFirebase } from '@/lib/firebase-admin';
import { verifyAdminAuth } from '@/lib/admin-auth';

// Firebase will be initialized when needed

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { messageId, action, reason } = moderationActionSchema.parse(body);

    // Initialize Firebase
    const { db } = initializeFirebase();

    // Get message document
    const messageRef = db.collection('guestbook').doc(messageId);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    const messageData = messageDoc.data();
    const updateData: any = {
      updatedAt: new Date(),
      moderatedBy: authResult.adminId,
      moderatedAt: new Date(),
    };

    // Apply moderation action
    switch (action) {
      case 'approve':
        updateData.status = 'approved';
        break;
      case 'reject':
        updateData.status = 'rejected';
        if (reason) {
          updateData.rejectionReason = reason;
        }
        break;
      case 'highlight':
        if (messageData?.status !== 'approved') {
          return NextResponse.json(
            { success: false, error: 'Can only highlight approved messages' },
            { status: 400 }
          );
        }
        updateData.isHighlighted = true;
        break;
      case 'unhighlight':
        updateData.isHighlighted = false;
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid moderation action' },
          { status: 400 }
        );
    }

    // Update message
    await messageRef.update(updateData);

    // Log moderation action
    await db.collection('moderationLogs').add({
      messageId,
      action,
      reason: reason || null,
      moderatedBy: authResult.adminId,
      moderatedAt: new Date(),
      previousStatus: messageData?.status,
      newStatus: updateData.status || messageData?.status,
      messagePreview: messageData?.message?.substring(0, 100) || '',
      guestName: messageData?.guestName || '',
    });

    console.log('Message moderated:', {
      messageId,
      action,
      moderatedBy: authResult.adminId,
      previousStatus: messageData?.status,
      newStatus: updateData.status || messageData?.status,
    });

    return NextResponse.json({
      success: true,
      data: {
        messageId,
        action,
        status: updateData.status || messageData?.status,
        isHighlighted: updateData.isHighlighted ?? messageData?.isHighlighted,
      },
    });

  } catch (error: any) {
    console.error('Error moderating message:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid moderation data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to moderate message' },
      { status: 500 }
    );
  }
}

// Get moderation queue
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Initialize Firebase
    const { db } = initializeFirebase();

    // Get messages for moderation
    let query = db.collection('guestbook');
    
    if (status !== 'all') {
      query = query.where('status', '==', status);
    }

    const snapshot = await query
      .orderBy('submittedAt', 'desc')
      .limit(limit)
      .get();

    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
      moderatedAt: doc.data().moderatedAt?.toDate(),
    }));

    // Get moderation stats
    const statsSnapshot = await db.collection('guestbook').get();
    const allMessages = statsSnapshot.docs.map(doc => doc.data());
    
    const stats = {
      total: allMessages.length,
      pending: allMessages.filter(m => m.status === 'pending').length,
      approved: allMessages.filter(m => m.status === 'approved').length,
      rejected: allMessages.filter(m => m.status === 'rejected').length,
      highlighted: allMessages.filter(m => m.isHighlighted).length,
    };

    return NextResponse.json({
      success: true,
      data: {
        messages,
        stats,
        status,
        limit,
      },
    });

  } catch (error: any) {
    console.error('Error fetching moderation queue:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch moderation queue' },
      { status: 500 }
    );
  }
}
