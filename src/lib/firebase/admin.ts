import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getMessaging } from 'firebase-admin/messaging';

// Firebase Admin configuration
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Validate required environment variables
const requiredAdminEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
];

const missingAdminEnvVars = requiredAdminEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingAdminEnvVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.warn(
    `Missing Firebase Admin environment variables: ${missingAdminEnvVars.join(', ')}`
  );
}

// Initialize Firebase Admin
let adminApp;

try {
  // Check if Firebase Admin is already initialized
  if (getApps().length === 0) {
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } else {
    adminApp = getApps()[0];
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
  // Create a mock app for development
  adminApp = null;
}

// Export Firebase Admin services
export const adminDb = adminApp ? getFirestore(adminApp) : null;
export const adminAuth = adminApp ? getAuth(adminApp) : null;
export const adminMessaging = adminApp ? getMessaging(adminApp) : null;

// Helper function to check if admin is available
export function isAdminAvailable(): boolean {
  return adminApp !== null && adminDb !== null;
}

// Server-side error handler
export function handleAdminError(error: any): { success: false; error: string } {
  console.error('Firebase Admin Error:', error);
  
  return {
    success: false,
    error: error.message || 'An unexpected server error occurred.',
  };
}

// Batch operation helper
export async function batchWrite(operations: Array<() => Promise<any>>) {
  if (!adminDb) {
    throw new Error('Firebase Admin not available');
  }

  const batch = adminDb.batch();
  const results = [];

  for (const operation of operations) {
    try {
      const result = await operation();
      results.push(result);
    } catch (error) {
      console.error('Batch operation failed:', error);
      throw error;
    }
  }

  await batch.commit();
  return results;
}

// Timestamp helper
export function serverTimestamp() {
  if (!adminDb) {
    return new Date();
  }
  return adminDb.FieldValue.serverTimestamp();
}

export { adminApp };
