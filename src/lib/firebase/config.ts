import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
// Firebase Storage removed - using Vercel Blob Storage instead
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';

// Firebase configuration with development fallbacks
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDkSlFn8Ya1H1I42oQFggLBvRcHX8hiWDk',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'wedding-project-3525f.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'wedding-project-3525f',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '133500127923',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:133500127923:web:59c9618046fd74a9d7fec6',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-VQYMXP7FJC',
};

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.warn(
    `Missing Firebase environment variables: ${missingEnvVars.join(', ')}. Using demo configuration.`
  );
}

// Log warning in development if using fallback values
if (missingEnvVars.length > 0 && process.env.NODE_ENV === 'development') {
  console.warn(
    `⚠️  Using fallback Firebase configuration for development. Missing: ${missingEnvVars.join(', ')}`
  );
}

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
// Firebase Storage removed - using Vercel Blob Storage instead
// let storage: FirebaseStorage;
let messaging: Messaging | null = null;

// Check if Firebase is already initialized
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize services
  db = getFirestore(app);
  auth = getAuth(app);
  // Firebase Storage removed - using Vercel Blob Storage instead
} catch (error) {
  console.error('Firebase initialization error:', error);
  
  // In development, create mock services to prevent crashes
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️  Firebase failed to initialize. Using mock services for development.');
    // Create a minimal mock app for development
    app = { name: '[DEFAULT]', options: firebaseConfig } as FirebaseApp;
    // Note: db, auth will be undefined, but we handle this in the services
  } else {
    throw error;
  }
}

// Initialize messaging only in browser environment and if supported
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

// Export Firebase services
export { app, db, auth, messaging };
// Note: storage removed - using Vercel Blob Storage instead

// Export Firebase configuration for admin SDK
export { firebaseConfig };

// Collection names
export const COLLECTIONS = {
  RSVPS: 'rsvps',
  GUESTS: 'guests',
  GUEST_BOOK: 'guestBook',
  TIMELINE_EVENTS: 'timelineEvents',
  PHOTOS: 'photos',
  NOTIFICATIONS: 'notifications',
  ADMIN_SETTINGS: 'adminSettings',
  EMAIL_QUEUE: 'emailQueue',
} as const;

// Firestore converter helper
export function createConverter<T>() {
  return {
    toFirestore: (data: T) => data,
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      return { id: snapshot.id, ...data } as T & { id: string };
    },
  };
}

// Error handling helper
export function handleFirebaseError(error: any): string {
  console.error('Firebase Error:', error);
  
  switch (error.code) {
    case 'permission-denied':
      return 'You do not have permission to perform this action.';
    case 'not-found':
      return 'The requested resource was not found.';
    case 'already-exists':
      return 'This resource already exists.';
    case 'failed-precondition':
      return 'The operation failed due to a precondition.';
    case 'aborted':
      return 'The operation was aborted due to a conflict.';
    case 'out-of-range':
      return 'The operation was attempted past the valid range.';
    case 'unimplemented':
      return 'This operation is not implemented or supported.';
    case 'internal':
      return 'An internal error occurred. Please try again later.';
    case 'unavailable':
      return 'The service is currently unavailable. Please try again later.';
    case 'data-loss':
      return 'Unrecoverable data loss or corruption occurred.';
    case 'unauthenticated':
      return 'You must be authenticated to perform this action.';
    case 'invalid-argument':
      return 'Invalid data provided. Please check your input.';
    case 'deadline-exceeded':
      return 'The operation took too long to complete. Please try again.';
    case 'resource-exhausted':
      return 'Resource quota exceeded. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}
