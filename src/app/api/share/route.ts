import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for share data
const shareDataSchema = z.object({
  title: z.string().optional(),
  text: z.string().optional(),
  url: z.string().url().optional(),
  files: z.array(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse form data from share target
    const formData = await request.formData();
    
    const shareData = {
      title: formData.get('title') as string || '',
      text: formData.get('text') as string || '',
      url: formData.get('url') as string || '',
      files: formData.getAll('files') || [],
    };

    // Validate the share data
    const validatedData = shareDataSchema.parse(shareData);

    // Handle different types of shared content
    if (validatedData.files && validatedData.files.length > 0) {
      // Handle shared images - redirect to gallery with upload capability
      const searchParams = new URLSearchParams({
        shared: 'true',
        type: 'images',
        count: validatedData.files.length.toString(),
      });
      
      return NextResponse.redirect(
        new URL(`/gallery?${searchParams.toString()}`, request.url)
      );
    }

    if (validatedData.url) {
      // Handle shared URLs - redirect to guest book with pre-filled message
      const searchParams = new URLSearchParams({
        shared: 'true',
        type: 'url',
        message: `Check out this link: ${validatedData.url}`,
      });
      
      return NextResponse.redirect(
        new URL(`/guestbook?${searchParams.toString()}`, request.url)
      );
    }

    if (validatedData.text || validatedData.title) {
      // Handle shared text - redirect to guest book with pre-filled message
      const message = [validatedData.title, validatedData.text]
        .filter(Boolean)
        .join('\n\n');
      
      const searchParams = new URLSearchParams({
        shared: 'true',
        type: 'text',
        message: message,
      });
      
      return NextResponse.redirect(
        new URL(`/guestbook?${searchParams.toString()}`, request.url)
      );
    }

    // Default: redirect to home page
    return NextResponse.redirect(new URL('/?shared=true', request.url));

  } catch (error) {
    console.error('Share API error:', error);
    
    // Redirect to home page with error indication
    return NextResponse.redirect(
      new URL('/?shared=true&error=invalid', request.url)
    );
  }
}

// Handle GET requests (fallback)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const handler = searchParams.get('handler');
  
  if (handler) {
    // Handle protocol handler requests
    try {
      const decodedHandler = decodeURIComponent(handler);
      
      // Parse the protocol handler data
      if (decodedHandler.startsWith('web+wedding://')) {
        const action = decodedHandler.replace('web+wedding://', '');
        
        switch (action) {
          case 'rsvp':
            return NextResponse.redirect(new URL('/rsvp', request.url));
          case 'gallery':
            return NextResponse.redirect(new URL('/gallery', request.url));
          case 'guestbook':
            return NextResponse.redirect(new URL('/guestbook', request.url));
          default:
            return NextResponse.redirect(new URL('/', request.url));
        }
      }
    } catch (error) {
      console.error('Protocol handler error:', error);
    }
  }
  
  // Default redirect to home
  return NextResponse.redirect(new URL('/', request.url));
}
