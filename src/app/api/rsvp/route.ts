import { NextRequest, NextResponse } from 'next/server';
import { rsvpService } from '@/lib/services/rsvp';
import { rsvpFormSchema } from '@/lib/validations/rsvp';
import { sendRSVPConfirmationEmail } from '@/lib/services/email';
import { rateLimitByIP } from '@/lib/utils/rate-limit';

// POST /api/rsvp - Submit new RSVP
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimitByIP(request, 5, 60); // 5 requests per minute
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate request data
    const validation = rsvpFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid form data',
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const formData = validation.data;

    // Check if RSVP already exists for this email
    const existingRSVP = await rsvpService.getRSVPByEmail(formData.primaryGuestEmail);
    if (existingRSVP) {
      return NextResponse.json(
        {
          success: false,
          error: 'An RSVP already exists for this email address. Please contact us if you need to make changes.',
        },
        { status: 409 }
      );
    }

    // Submit RSVP
    const result = await rsvpService.submitRSVP(formData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Send confirmation email (don't wait for it to complete)
    sendRSVPConfirmationEmail(formData, result.id).catch(error => {
      console.error('Failed to send confirmation email:', error);
    });

    return NextResponse.json({
      success: true,
      message: 'RSVP submitted successfully!',
      rsvpId: result.id,
    });

  } catch (error) {
    console.error('RSVP submission error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// GET /api/rsvp - Get RSVPs (admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin users
    // const user = await authenticateAdmin(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search');

    let result;

    if (search) {
      // Search RSVPs
      const rsvps = await rsvpService.searchRSVPs(search);
      result = {
        rsvps,
        hasMore: false,
        currentPage: 1,
        totalPages: 1,
      };
    } else {
      // Get paginated RSVPs
      const { rsvps, hasMore, lastDoc } = await rsvpService.getAllRSVPs(limit);
      result = {
        rsvps,
        hasMore,
        currentPage: page,
        totalPages: hasMore ? page + 1 : page,
      };
    }

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}
