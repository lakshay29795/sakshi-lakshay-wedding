import { getAuth } from 'firebase-admin/auth';
import { initializeFirebase } from '@/lib/firebase-admin';

// Admin user configuration
export interface AdminUser {
  uid: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: AdminPermission[];
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  displayName?: string;
  avatar?: string;
}

export type AdminPermission = 
  | 'manage_users'
  | 'manage_content' 
  | 'manage_rsvp'
  | 'manage_guestbook'
  | 'manage_gallery'
  | 'manage_notifications'
  | 'view_analytics'
  | 'manage_settings'
  | 'moderate_content'
  | 'export_data';

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<string, AdminPermission[]> = {
  super_admin: [
    'manage_users',
    'manage_content',
    'manage_rsvp',
    'manage_guestbook',
    'manage_gallery',
    'manage_notifications',
    'view_analytics',
    'manage_settings',
    'moderate_content',
    'export_data',
  ],
  admin: [
    'manage_content',
    'manage_rsvp',
    'manage_guestbook',
    'manage_gallery',
    'manage_notifications',
    'view_analytics',
    'moderate_content',
    'export_data',
  ],
  moderator: [
    'manage_guestbook',
    'moderate_content',
    'view_analytics',
  ],
};

// Session configuration
export const SESSION_CONFIG = {
  cookieName: 'wedding-admin-session',
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'strict' as const,
  },
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many login attempts. Please try again later.',
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: 'Too many requests. Please slow down.',
  },
  admin: {
    windowMs: 60 * 1000, // 1 minute
    max: 200, // 200 requests per minute for admin users
    message: 'Rate limit exceeded.',
  },
};

// CSRF configuration
export const CSRF_CONFIG = {
  secret: process.env.CSRF_SECRET || 'csrf-secret-key-change-in-production',
  cookieName: '__Host-csrf-token',
  headerName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 60 * 60 * 24, // 24 hours
  },
};

// Security headers configuration
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://firebaseapp.com https://*.firebaseapp.com",
    "frame-ancestors 'none'",
  ].join('; '),
};

// Admin user management
export class AdminUserManager {
  private static instance: AdminUserManager;
  private auth: any;
  private db: any;

  private constructor() {
    const { auth, db } = initializeFirebase();
    this.auth = auth;
    this.db = db;
  }

  static getInstance(): AdminUserManager {
    if (!AdminUserManager.instance) {
      AdminUserManager.instance = new AdminUserManager();
    }
    return AdminUserManager.instance;
  }

  async createAdminUser(email: string, password: string, role: string = 'admin'): Promise<AdminUser> {
    try {
      // Create Firebase user
      const userRecord = await this.auth.createUser({
        email,
        password,
        emailVerified: true,
      });

      // Set custom claims for role-based access
      await this.auth.setCustomUserClaims(userRecord.uid, {
        role,
        isAdmin: true,
        permissions: ROLE_PERMISSIONS[role] || [],
      });

      // Create admin user document
      const adminUser: AdminUser = {
        uid: userRecord.uid,
        email,
        role: role as AdminUser['role'],
        permissions: ROLE_PERMISSIONS[role] || [],
        createdAt: new Date(),
        isActive: true,
      };

      await this.db.collection('admin-users').doc(userRecord.uid).set(adminUser);

      return adminUser;
    } catch (error) {
      console.error('Error creating admin user:', error);
      throw new Error('Failed to create admin user');
    }
  }

  async getAdminUser(uid: string): Promise<AdminUser | null> {
    try {
      const doc = await this.db.collection('admin-users').doc(uid).get();
      
      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLogin: data.lastLogin?.toDate(),
      } as AdminUser;
    } catch (error) {
      console.error('Error getting admin user:', error);
      return null;
    }
  }

  async updateLastLogin(uid: string): Promise<void> {
    try {
      await this.db.collection('admin-users').doc(uid).update({
        lastLogin: new Date(),
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  async hasPermission(uid: string, permission: AdminPermission): Promise<boolean> {
    try {
      const adminUser = await this.getAdminUser(uid);
      
      if (!adminUser || !adminUser.isActive) {
        return false;
      }

      return adminUser.permissions.includes(permission);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  async verifyAdminToken(idToken: string): Promise<{ uid: string; claims: any } | null> {
    try {
      const decodedToken = await this.auth.verifyIdToken(idToken);
      
      // Check if user has admin claims
      if (!decodedToken.isAdmin) {
        return null;
      }

      return {
        uid: decodedToken.uid,
        claims: decodedToken,
      };
    } catch (error) {
      console.error('Error verifying admin token:', error);
      return null;
    }
  }
}

// Default admin users (for initial setup)
export const DEFAULT_ADMIN_USERS = [
  {
    email: process.env.ADMIN_EMAIL || 'admin@wedding.local',
    password: process.env.ADMIN_PASSWORD || 'change-this-password',
    role: 'super_admin',
  },
];

// Utility functions
export function sanitizeInput(input: string): string {
  // Remove HTML tags and dangerous characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
