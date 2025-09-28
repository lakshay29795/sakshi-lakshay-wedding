import { NextRequest } from 'next/server';
import { initializeFirebase } from './firebase-admin';

const { auth } = initializeFirebase();

export interface AdminAuthResult {
  success: boolean;
  adminId?: string;
  error?: string;
}

export async function verifyAdminAuth(request: NextRequest): Promise<AdminAuthResult> {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        error: 'Missing or invalid authorization header',
      };
    }

    // Extract token
    const token = authHeader.substring(7);
    
    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Check if user has admin role
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    if (!adminEmails.includes(decodedToken.email || '')) {
      return {
        success: false,
        error: 'Insufficient permissions',
      };
    }

    return {
      success: true,
      adminId: decodedToken.uid,
    };

  } catch (error: any) {
    console.error('Admin auth verification failed:', error);
    return {
      success: false,
      error: 'Invalid or expired token',
    };
  }
}
