// Core Wedding Website Types

export interface WeddingCouple {
  bride: {
    name: string;
    fullName: string;
    photo?: string;
  };
  groom: {
    name: string;
    fullName: string;
    photo?: string;
  };
  weddingDate: Date;
  venue: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  image?: string;
  audioMessage?: string;
  location?: {
    name: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export interface PhotoGalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: 'engagement' | 'couple' | 'family' | 'friends' | 'misc';
  date: Date;
  width: number;
  height: number;
  blurDataURL?: string;
  photographer?: string;
}

export interface RSVPGuest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  relationship: string;
  isAttending: boolean;
  mealPreference?: 'vegetarian' | 'vegan' | 'gluten-free' | 'regular';
  dietaryRestrictions?: string;
  plusOne?: {
    name: string;
    mealPreference?: 'vegetarian' | 'vegan' | 'gluten-free' | 'regular';
    dietaryRestrictions?: string;
  };
}

export interface RSVP {
  id: string;
  primaryGuest: RSVPGuest;
  additionalGuests: RSVPGuest[];
  totalGuests: number;
  message?: string;
  submittedAt: Date;
  updatedAt?: Date;
}

export interface GuestBookMessage {
  id: string;
  name: string;
  email?: string;
  message: string;
  photo?: string;
  isApproved: boolean;
  submittedAt: Date;
  likes: number;
}

export interface CountdownTimer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface NotificationPreferences {
  dailyLoveMessages: boolean;
  weddingReminders: boolean;
  guestBookUpdates: boolean;
  rsvpDeadlines: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'guest';
  notificationPreferences: NotificationPreferences;
  createdAt: Date;
  lastLoginAt?: Date;
}

// Animation and UI Types
export interface AnimationVariants {
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: Record<string, unknown>;
}

export interface MotionProps {
  variants?: AnimationVariants;
  initial?: string | Record<string, unknown>;
  animate?: string | Record<string, unknown>;
  exit?: string | Record<string, unknown>;
  transition?: Record<string, unknown>;
  whileHover?: Record<string, unknown>;
  whileTap?: Record<string, unknown>;
  whileInView?: Record<string, unknown>;
}

// Form Types
export interface FormFieldError {
  message: string;
  type: string;
}

export interface FormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: Record<string, FormFieldError>;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Firebase Types
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// PWA Types
export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps {
  params: Record<string, string>;
  searchParams: Record<string, string | string[] | undefined>;
}

export interface LayoutProps {
  children: React.ReactNode;
  params?: Record<string, string>;
}
