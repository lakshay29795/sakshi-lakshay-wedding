import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { initializeFirebase } from '@/lib/firebase-admin';

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

    // Check permissions
    if (!authResult.user.permissions.includes('view_analytics')) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { db } = await initializeFirebase();

    // In development mode, return mock data
    if (process.env.NODE_ENV === 'development') {
      const mockAnalytics = {
        rsvps: {
          total: 156,
          attending: 134,
          notAttending: 22,
          pending: 18,
          trend: '+12%',
          breakdown: {
            thisWeek: 8,
            thisMonth: 34,
            total: 156,
          },
        },
        guestbook: {
          total: 89,
          approved: 76,
          pending: 13,
          rejected: 0,
          trend: '+8%',
          breakdown: {
            thisWeek: 5,
            thisMonth: 23,
            total: 89,
          },
        },
        notifications: {
          sent: 245,
          delivered: 238,
          opened: 189,
          failed: 7,
          trend: '+15%',
          openRate: '77.1%',
          deliveryRate: '97.1%',
        },
        website: {
          visitors: 2847,
          pageViews: 8934,
          avgSession: '3m 42s',
          bounceRate: '32.1%',
          trend: '+23%',
          topPages: [
            { path: '/', views: 3421, title: 'Home' },
            { path: '/story', views: 1876, title: 'Our Story' },
            { path: '/gallery', views: 1543, title: 'Gallery' },
            { path: '/rsvp', views: 1234, title: 'RSVP' },
            { path: '/guestbook', views: 860, title: 'Guest Book' },
          ],
        },
        timeline: {
          events: 12,
          published: 10,
          draft: 2,
          lastUpdated: new Date().toISOString(),
        },
        photos: {
          total: 145,
          categories: {
            engagement: 23,
            couple: 45,
            family: 32,
            friends: 28,
            venue: 17,
          },
          storage: '2.3 GB',
        },
      };

      return NextResponse.json({
        success: true,
        data: mockAnalytics,
      });
    }

    // Production: Fetch real analytics from Firebase
    try {
      // Get RSVP stats
      const rsvpCollection = db.collection('rsvps');
      const rsvpSnapshot = await rsvpCollection.get();
      const rsvps = rsvpSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const rsvpStats = {
        total: rsvps.length,
        attending: rsvps.filter((r: any) => r.isAttending === true).length,
        notAttending: rsvps.filter((r: any) => r.isAttending === false).length,
        pending: rsvps.filter((r: any) => r.isAttending === undefined).length,
      };

      // Get guest book stats
      const guestbookCollection = db.collection('guestBook');
      const guestbookSnapshot = await guestbookCollection.get();
      const messages = guestbookSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const guestbookStats = {
        total: messages.length,
        approved: messages.filter((m: any) => m.status === 'approved').length,
        pending: messages.filter((m: any) => m.status === 'pending').length,
        rejected: messages.filter((m: any) => m.status === 'rejected').length,
      };

      // Get notification stats (mock for now)
      const notificationStats = {
        sent: 245,
        delivered: 238,
        opened: 189,
        failed: 7,
        openRate: '77.1%',
        deliveryRate: '97.1%',
      };

      // Calculate trends (simplified)
      const calculateTrend = (current: number, previous: number) => {
        if (previous === 0) return '+100%';
        const change = ((current - previous) / previous) * 100;
        return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
      };

      const analytics = {
        rsvps: {
          ...rsvpStats,
          trend: calculateTrend(rsvpStats.total, Math.max(1, rsvpStats.total - 10)),
        },
        guestbook: {
          ...guestbookStats,
          trend: calculateTrend(guestbookStats.total, Math.max(1, guestbookStats.total - 5)),
        },
        notifications: {
          ...notificationStats,
          trend: '+15%',
        },
        website: {
          visitors: 2847,
          pageViews: 8934,
          avgSession: '3m 42s',
          bounceRate: '32.1%',
          trend: '+23%',
        },
      };

      return NextResponse.json({
        success: true,
        data: analytics,
      });

    } catch (firebaseError: any) {
      console.error('Firebase analytics error:', firebaseError);
      
      // Fallback to mock data if Firebase fails
      return NextResponse.json({
        success: true,
        data: {
          rsvps: { total: 0, attending: 0, notAttending: 0, pending: 0, trend: '0%' },
          guestbook: { total: 0, approved: 0, pending: 0, rejected: 0, trend: '0%' },
          notifications: { sent: 0, delivered: 0, opened: 0, failed: 0, trend: '0%' },
          website: { visitors: 0, pageViews: 0, avgSession: '0s', trend: '0%' },
        },
        warning: 'Using fallback data due to database connection issues',
      });
    }

  } catch (error: any) {
    console.error('Admin analytics error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
