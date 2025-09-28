import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
let app;

if (getApps().length === 0) {
  try {
    // Check if we have all required environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey) {
      // Production initialization with service account
      const serviceAccount = {
        projectId,
        clientEmail,
        privateKey,
      };

      app = initializeApp({
        credential: cert(serviceAccount),
        projectId,
      });
      
      console.log('Firebase Admin initialized with service account credentials');
    } else {
      // Development fallback - use default credentials or emulator
      console.warn('Firebase service account credentials not found, using development mode');
      
      if (process.env.NODE_ENV === 'development') {
        // For development, we'll use a mock implementation
        app = null;
      } else {
        // Try to initialize with default credentials
        app = initializeApp({
          projectId: projectId || 'demo-wedding-website',
        });
      }
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    app = null;
  }
} else {
  app = getApps()[0];
}

// Mock Firestore for development
class MockFirestore {
  collection(name: string) {
    return {
      add: async (data: any) => ({ id: `mock-${Date.now()}` }),
      doc: (id: string) => ({
        get: async () => ({
          exists: false,
          data: () => null,
        }),
        update: async (data: any) => {},
        delete: async () => {},
      }),
      where: (field: string, op: string, value: any) => this.collection(name),
      orderBy: (field: string, direction?: string) => this.collection(name),
      limit: (count: number) => this.collection(name),
      get: async () => ({
        docs: [],
        size: 0,
      }),
    };
  }
}

// Mock Auth for development
class MockAuth {
  async verifyIdToken(token: string) {
    return {
      uid: 'mock-admin',
      email: 'admin@example.com',
    };
  }
}

export function initializeFirebase() {
  if (!app && process.env.NODE_ENV === 'development') {
    console.log('Using mock Firebase services for development');
    return {
      db: new MockFirestore() as any,
      auth: new MockAuth() as any,
      app: null,
    };
  }

  if (!app) {
    throw new Error('Firebase Admin not properly initialized. Please check your environment variables.');
  }

  const db = getFirestore(app);
  const auth = getAuth(app);
  
  return { db, auth, app };
}
