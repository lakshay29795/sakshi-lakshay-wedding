import { NextRequest, NextResponse } from 'next/server';
import { vercelBlobStorage } from '@/lib/storage/vercel-blob';
import { adminAuthMiddleware } from '@/lib/auth/middleware';
import { initializeFirebase } from '@/lib/firebase-admin';

/**
 * Upload gallery images and save metadata to Firestore
 * POST /api/gallery/upload
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

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    const category = formData.get('category') as string || 'general';
    const caption = formData.get('caption') as string || '';
    const tags = formData.get('tags') as string || '';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No images provided' },
        { status: 400 }
      );
    }

    // Upload images to Vercel Blob
    const uploadPromises = files.map(async (file, index) => {
      if (!file.name) {
        throw new Error(`File ${index} has no name`);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `gallery/${category}/${Date.now()}-${file.name}`;
      
      return vercelBlobStorage.uploadImage(filename, buffer, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 85,
        format: 'webp',
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    // Save metadata to Firestore
    const galleryItems = uploadResults.map((result, index) => ({
      id: `gallery_${Date.now()}_${index}`,
      url: result.url,
      pathname: result.pathname,
      filename: files[index].name,
      category,
      caption: caption || files[index].name,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      size: result.size,
      contentType: result.contentType,
      uploadedAt: new Date().toISOString(),
      uploadedBy: authResult.user?.email || 'admin',
      isActive: true,
      order: 0,
    }));

    // Save to Firestore
    const { db } = initializeFirebase();
    const batch = db.batch();
    galleryItems.forEach(item => {
      const docRef = db.collection('gallery').doc(item.id);
      batch.set(docRef, item);
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      data: {
        images: galleryItems,
        count: galleryItems.length,
      },
    });

  } catch (error) {
    console.error('Error uploading gallery images:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to upload gallery images' 
      },
      { status: 500 }
    );
  }
}
