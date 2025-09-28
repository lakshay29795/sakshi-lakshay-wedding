// RSVP System Types

export type MealPreference = 'vegetarian' | 'vegan' | 'gluten-free' | 'regular';

export interface Guest {
  id: string;
  name: string;
  email?: string;
  mealPreference: MealPreference;
  dietaryRestrictions?: string;
  isChild?: boolean;
  age?: number;
}

export interface RSVPFormData {
  // Step 1: Basic Information
  primaryGuestName: string;
  primaryGuestEmail: string;
  phone?: string;
  
  // Step 2: Attendance
  isAttending: boolean;
  
  // Step 3: Guest Details (if attending)
  guests: Guest[];
  totalGuests: number;
  
  // Step 4: Additional Information
  message?: string;
  songRequest?: string;
  accommodationNeeded?: boolean;
  transportationNeeded?: boolean;
  
  // Metadata
  submittedAt?: Date;
  updatedAt?: Date;
}

export interface RSVPSubmission extends RSVPFormData {
  id: string;
  status: 'pending' | 'confirmed' | 'declined';
  submittedAt: Date;
  updatedAt: Date;
}

export interface RSVPFormStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  isValid: boolean;
}

export interface RSVPFormState {
  currentStep: number;
  totalSteps: number;
  steps: RSVPFormStep[];
  formData: Partial<RSVPFormData>;
  isLoading: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

export interface RSVPStats {
  totalInvited: number;
  totalResponded: number;
  totalAttending: number;
  totalDeclined: number;
  responseRate: number;
  mealBreakdown: Record<MealPreference, number>;
  childrenCount: number;
  adultsCount: number;
}
