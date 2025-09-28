import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { initializeFirebase } from '@/lib/firebase-admin';

interface ActivityItem {
  id: string;
  type: 'rsvp' | 'guestbook' | 'notification' | 'system' | 'timeline' | 'photo';
  message: string;
  time: string;
  status: 'success' | 'warning' | 'info' | 'error';
  timestamp: Date;
  metadata?: any;
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // In development mode, return mock data
    if (process.env.NODE_ENV === 'development') {
      const mockActivity: ActivityItem[] = [
        {
          id: '1',
          type: 'rsvp',
          message: 'New RSVP from Priya Sharma (attending with +1)',
          time: '2 minutes ago',
          status: 'success',
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          metadata: { guestName: 'Priya Sharma', attending: true, guestCount: 2 },
        },
        {
          id: '2',
          type: 'guestbook',
          message: 'Guest message from Arjun Patel pending approval',
          time: '15 minutes ago',
          status: 'warning',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          metadata: { guestName: 'Arjun Patel', messageLength: 156 },
        },
        {
          id: '3',
          type: 'notification',
          message: 'Daily love message sent to 156 guests',
          time: '1 hour ago',
          status: 'success',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          metadata: { recipientCount: 156, deliveryRate: '97.1%' },
        },
        {
          id: '4',
          type: 'system',
          message: 'System backup completed successfully',
          time: '2 hours ago',
          status: 'info',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          metadata: { backupSize: '2.3 GB', duration: '45s' },
        },
        {
          id: '5',
          type: 'timeline',
          message: 'Timeline event "First Date" updated by admin',
          time: '3 hours ago',
          status: 'info',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          metadata: { eventTitle: 'First Date', action: 'updated' },
        },
        {
          id: '6',
          type: 'photo',
          message: '12 new photos uploaded to "Engagement" gallery',
          time: '4 hours ago',
          status: 'success',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          metadata: { photoCount: 12, category: 'Engagement' },
        },
        {
          id: '7',
          type: 'rsvp',
          message: 'RSVP updated by Emma Wilson (changed to not attending)',
          time: '5 hours ago',
          status: 'info',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          metadata: { guestName: 'Emma Wilson', attending: false, previousAttending: true },
        },
        {
          id: '8',
          type: 'guestbook',
          message: 'Guest message from David Lee approved and published',
          time: '6 hours ago',
          status: 'success',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          metadata: { guestName: 'David Lee', action: 'approved' },
        },
        {
          id: '9',
          type: 'notification',
          message: 'Wedding reminder sent to 23 guests who haven\'t RSVP\'d',
          time: '1 day ago',
          status: 'success',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          metadata: { recipientCount: 23, type: 'reminder' },
        },
        {
          id: '10',
          type: 'system',
          message: 'Security scan completed - no vulnerabilities found',
          time: '1 day ago',
          status: 'success',
          timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
          metadata: { scanType: 'security', duration: '2m 15s' },
        },
      ];

      // Apply pagination
      const paginatedActivity = mockActivity.slice(offset, offset + limit);

      return NextResponse.json({
        success: true,
        data: {
          activities: paginatedActivity,
          total: mockActivity.length,
          hasMore: offset + limit < mockActivity.length,
        },
      });
    }

    // Production: Fetch real activity from Firebase
    const { db } = await initializeFirebase();
    
    try {
      const activities: ActivityItem[] = [];
      
      // Get recent RSVPs
      const recentRsvps = await db.collection('rsvps')
        .orderBy('submittedAt', 'desc')
        .limit(5)
        .get();
      
      recentRsvps.docs.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: `rsvp-${doc.id}`,
          type: 'rsvp',
          message: `New RSVP from ${data.primaryGuest?.name || 'Unknown'} (${data.isAttending ? 'attending' : 'not attending'})`,
          time: formatTimeAgo(data.submittedAt?.toDate() || new Date()),
          status: 'success',
          timestamp: data.submittedAt?.toDate() || new Date(),
          metadata: {
            guestName: data.primaryGuest?.name,
            attending: data.isAttending,
            guestCount: data.additionalGuests?.length + 1 || 1,
          },
        });
      });

      // Get recent guest book messages
      const recentMessages = await db.collection('guestBook')
        .orderBy('submittedAt', 'desc')
        .limit(5)
        .get();
      
      recentMessages.docs.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: `guestbook-${doc.id}`,
          type: 'guestbook',
          message: `Guest message from ${data.guestName || 'Anonymous'} ${data.status === 'pending' ? 'pending approval' : data.status}`,
          time: formatTimeAgo(data.submittedAt?.toDate() || new Date()),
          status: data.status === 'pending' ? 'warning' : 'success',
          timestamp: data.submittedAt?.toDate() || new Date(),
          metadata: {
            guestName: data.guestName,
            messageLength: data.message?.length || 0,
            status: data.status,
          },
        });
      });

      // Sort by timestamp and apply pagination
      activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      const paginatedActivity = activities.slice(offset, offset + limit);

      return NextResponse.json({
        success: true,
        data: {
          activities: paginatedActivity,
          total: activities.length,
          hasMore: offset + limit < activities.length,
        },
      });

    } catch (firebaseError: any) {
      console.error('Firebase activity error:', firebaseError);
      
      // Fallback to empty activity if Firebase fails
      return NextResponse.json({
        success: true,
        data: {
          activities: [],
          total: 0,
          hasMore: false,
        },
        warning: 'Unable to fetch recent activity due to database connection issues',
      });
    }

  } catch (error: any) {
    console.error('Admin activity error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity data' },
      { status: 500 }
    );
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}
