import { put, del, list, head } from '@vercel/blob';
import { NextRequest } from 'next/server';

export interface UploadResult {
  url: string;
  pathname: string;
  contentType: string;
  contentDisposition: string;
  size: number;
}

export interface BlobFile {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
  contentType?: string;
}

/**
 * Upload a file to Vercel Blob Storage
 */
export async function uploadFile(
  filename: string,
  file: File | Buffer | Uint8Array | string,
  options: {
    contentType?: string;
    addRandomSuffix?: boolean;
    cacheControlMaxAge?: number;
  } = {}
): Promise<UploadResult> {
  try {
    const {
      contentType = 'application/octet-stream',
      addRandomSuffix = true,
      cacheControlMaxAge = 31536000, // 1 year
    } = options;

    const blob = await put(filename, file, {
      access: 'public',
      contentType,
      addRandomSuffix,
      cacheControlMaxAge,
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType || contentType,
      contentDisposition: blob.contentDisposition || '',
      size: blob.size,
    };
  } catch (error) {
    console.error('Error uploading file to Vercel Blob:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Upload multiple files to Vercel Blob Storage
 */
export async function uploadFiles(
  files: Array<{
    filename: string;
    file: File | Buffer | Uint8Array | string;
    contentType?: string;
  }>,
  options: {
    addRandomSuffix?: boolean;
    cacheControlMaxAge?: number;
  } = {}
): Promise<UploadResult[]> {
  const uploadPromises = files.map(({ filename, file, contentType }) =>
    uploadFile(filename, file, { ...options, contentType })
  );

  return Promise.all(uploadPromises);
}

/**
 * Delete a file from Vercel Blob Storage
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error('Error deleting file from Vercel Blob:', error);
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete multiple files from Vercel Blob Storage
 */
export async function deleteFiles(urls: string[]): Promise<void> {
  try {
    await del(urls);
  } catch (error) {
    console.error('Error deleting files from Vercel Blob:', error);
    throw new Error(`Failed to delete files: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * List files in Vercel Blob Storage
 */
export async function listFiles(options: {
  prefix?: string;
  limit?: number;
  cursor?: string;
} = {}): Promise<{
  blobs: BlobFile[];
  cursor?: string;
  hasMore: boolean;
}> {
  try {
    const { prefix, limit = 100, cursor } = options;

    const result = await list({
      prefix,
      limit,
      cursor,
    });

    const blobs: BlobFile[] = result.blobs.map(blob => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
      contentType: blob.contentType,
    }));

    return {
      blobs,
      cursor: result.cursor,
      hasMore: result.hasMore,
    };
  } catch (error) {
    console.error('Error listing files from Vercel Blob:', error);
    throw new Error(`Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get file metadata from Vercel Blob Storage
 */
export async function getFileMetadata(url: string): Promise<{
  url: string;
  size: number;
  uploadedAt: Date;
  contentType?: string;
  cacheControl?: string;
} | null> {
  try {
    const metadata = await head(url);
    
    return {
      url: metadata.url,
      size: metadata.size,
      uploadedAt: metadata.uploadedAt,
      contentType: metadata.contentType,
      cacheControl: metadata.cacheControl,
    };
  } catch (error) {
    console.error('Error getting file metadata from Vercel Blob:', error);
    return null;
  }
}

/**
 * Upload image with optimization
 */
export async function uploadImage(
  filename: string,
  file: File | Buffer,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): Promise<UploadResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 85,
    format = 'webp',
  } = options;

  // For now, upload as-is. In the future, we could add image processing here
  // or use Vercel's built-in image optimization
  const contentType = format === 'webp' ? 'image/webp' : 
                     format === 'jpeg' ? 'image/jpeg' : 'image/png';

  return uploadFile(filename, file, {
    contentType,
    addRandomSuffix: true,
    cacheControlMaxAge: 31536000, // 1 year for images
  });
}

/**
 * Generate a presigned upload URL for client-side uploads
 */
export async function generateUploadUrl(
  filename: string,
  options: {
    contentType?: string;
    maxSize?: number;
  } = {}
): Promise<{
  url: string;
  fields: Record<string, string>;
}> {
  // Note: Vercel Blob doesn't support presigned URLs like S3
  // This would need to be implemented as an API route that handles the upload
  throw new Error('Presigned URLs not supported with Vercel Blob. Use API routes for uploads.');
}

/**
 * Utility function to handle file uploads from form data
 */
export async function handleFileUpload(
  request: NextRequest,
  fieldName: string = 'file'
): Promise<UploadResult[]> {
  try {
    const formData = await request.formData();
    const files = formData.getAll(fieldName) as File[];
    
    if (!files || files.length === 0) {
      throw new Error('No files provided');
    }

    const uploadPromises = files.map(async (file) => {
      if (!file.name) {
        throw new Error('File name is required');
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      return uploadFile(file.name, buffer, {
        contentType: file.type,
        addRandomSuffix: true,
      });
    });

    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error handling file upload:', error);
    throw new Error(`Failed to handle file upload: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Storage service interface for compatibility with existing code
 */
export const vercelBlobStorage = {
  upload: uploadFile,
  uploadMultiple: uploadFiles,
  delete: deleteFile,
  deleteMultiple: deleteFiles,
  list: listFiles,
  getMetadata: getFileMetadata,
  uploadImage,
  handleUpload: handleFileUpload,
};

export default vercelBlobStorage;
