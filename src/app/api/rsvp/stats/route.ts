import { NextRequest, NextResponse } from 'next/server';
import { rsvpService } from '@/lib/services/rsvp';

// GET /api/rsvp/stats - Get RSVP statistics (admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin users
    // const user = await authenticateAdmin(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const stats = await rsvpService.getRSVPStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });

  } catch (error) {
    console.error('Error fetching RSVP stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch RSVP statistics' },
      { status: 500 }
    );
  }
}
