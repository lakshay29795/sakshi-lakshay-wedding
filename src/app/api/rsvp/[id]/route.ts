import { NextRequest, NextResponse } from 'next/server';
import { rsvpService } from '@/lib/services/rsvp';
import { rsvpFormSchema } from '@/lib/validations/rsvp';
import { sendRSVPUpdateEmail } from '@/lib/services/email';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/rsvp/[id] - Get specific RSVP
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'RSVP ID is required' },
        { status: 400 }
      );
    }

    const rsvp = await rsvpService.getRSVP(id);

    if (!rsvp) {
      return NextResponse.json(
        { success: false, error: 'RSVP not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rsvp,
    });

  } catch (error) {
    console.error('Error fetching RSVP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch RSVP' },
      { status: 500 }
    );
  }
}

// PUT /api/rsvp/[id] - Update RSVP
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'RSVP ID is required' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate request data (partial validation for updates)
    const validation = rsvpFormSchema.partial().safeParse(body);
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

    const updateData = validation.data;

    // Check if RSVP exists
    const existingRSVP = await rsvpService.getRSVP(id);
    if (!existingRSVP) {
      return NextResponse.json(
        { success: false, error: 'RSVP not found' },
        { status: 404 }
      );
    }

    // Update RSVP
    const result = await rsvpService.updateRSVP(id, updateData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Send update confirmation email (don't wait for it to complete)
    if (updateData.primaryGuestEmail || existingRSVP.primaryGuestEmail) {
      const updatedRSVP = { ...existingRSVP, ...updateData };
      sendRSVPUpdateEmail(updatedRSVP, id).catch(error => {
        console.error('Failed to send update confirmation email:', error);
      });
    }

    return NextResponse.json({
      success: true,
      message: 'RSVP updated successfully!',
    });

  } catch (error) {
    console.error('RSVP update error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// DELETE /api/rsvp/[id] - Delete RSVP (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Add authentication check for admin users
    // const user = await authenticateAdmin(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'RSVP ID is required' },
        { status: 400 }
      );
    }

    // Check if RSVP exists
    const existingRSVP = await rsvpService.getRSVP(id);
    if (!existingRSVP) {
      return NextResponse.json(
        { success: false, error: 'RSVP not found' },
        { status: 404 }
      );
    }

    // Delete RSVP
    const result = await rsvpService.deleteRSVP(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'RSVP deleted successfully!',
    });

  } catch (error) {
    console.error('RSVP deletion error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
