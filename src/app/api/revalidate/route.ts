import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Revalidate all main pages
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/gallery');
    revalidatePath('/story');
    revalidatePath('/guestbook');
    
    return NextResponse.json({
      success: true,
      message: 'Pages revalidated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate pages' },
      { status: 500 }
    );
  }
}

