import { NextRequest, NextResponse } from 'next/server';
import { vercelBlobStorage } from '@/lib/storage/vercel-blob';
import { adminAuthMiddleware } from '@/lib/auth/middleware';

/**
 * Upload images to Vercel Blob Storage
 * POST /api/upload/images
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await adminAuthMiddleware(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be multipart/form-data' },
        { status: 400 }
      );
    }

    // Handle file upload
    const uploadResults = await vercelBlobStorage.handleUpload(request, 'images');

    if (!uploadResults || uploadResults.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No images uploaded' },
        { status: 400 }
      );
    }

    // Return upload results
    return NextResponse.json({
      success: true,
      data: {
        images: uploadResults.map(result => ({
          url: result.url,
          pathname: result.pathname,
          size: result.size,
          contentType: result.contentType,
        })),
        count: uploadResults.length,
      },
    });

  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to upload images' 
      },
      { status: 500 }
    );
  }
}

/**
 * List uploaded images
 * GET /api/upload/images
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await adminAuthMiddleware(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('prefix') || 'images/';
    const limit = parseInt(searchParams.get('limit') || '50');
    const cursor = searchParams.get('cursor') || undefined;

    const result = await vercelBlobStorage.list({
      prefix,
      limit,
      cursor,
    });

    return NextResponse.json({
      success: true,
      data: {
        images: result.blobs,
        cursor: result.cursor,
        hasMore: result.hasMore,
      },
    });

  } catch (error) {
    console.error('Error listing images:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to list images' 
      },
      { status: 500 }
    );
  }
}

/**
 * Delete images from Vercel Blob Storage
 * DELETE /api/upload/images
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await adminAuthMiddleware(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { success: false, error: 'URLs array is required' },
        { status: 400 }
      );
    }

    // Delete files
    await vercelBlobStorage.deleteMultiple(urls);

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: urls.length,
        deletedUrls: urls,
      },
    });

  } catch (error) {
    console.error('Error deleting images:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete images' 
      },
      { status: 500 }
    );
  }
}
