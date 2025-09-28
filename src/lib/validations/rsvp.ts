import { z } from 'zod';
import type { MealPreference } from '@/types/rsvp';

// Base schemas
export const mealPreferenceSchema = z.enum(['vegetarian', 'vegan', 'gluten-free', 'regular'] as const);

export const guestSchema = z.object({
  id: z.string().min(1, 'Guest ID is required'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  mealPreference: mealPreferenceSchema,
  dietaryRestrictions: z.string()
    .max(200, 'Dietary restrictions must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  isChild: z.boolean().optional(),
  age: z.number()
    .min(0, 'Age must be positive')
    .max(120, 'Age must be realistic')
    .optional(),
});

// Step 1: Basic Information
export const basicInfoSchema = z.object({
  primaryGuestName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  primaryGuestEmail: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
});

// Step 2: Attendance
export const attendanceSchema = z.object({
  isAttending: z.boolean(),
});

// Step 3: Guest Details
export const guestDetailsSchema = z.object({
  guests: z.array(guestSchema)
    .min(1, 'At least one guest is required')
    .max(10, 'Maximum 10 guests allowed'),
  totalGuests: z.number()
    .min(1, 'At least one guest is required')
    .max(10, 'Maximum 10 guests allowed'),
}).refine((data) => data.guests.length === data.totalGuests, {
  message: 'Number of guests must match the total count',
  path: ['totalGuests'],
});

// Step 4: Additional Information
export const additionalInfoSchema = z.object({
  message: z.string()
    .max(500, 'Message must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  songRequest: z.string()
    .max(100, 'Song request must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  accommodationNeeded: z.boolean().optional(),
  transportationNeeded: z.boolean().optional(),
});

// Complete RSVP Form Schema
export const rsvpFormSchema = z.object({
  // Step 1
  ...basicInfoSchema.shape,
  
  // Step 2
  ...attendanceSchema.shape,
  
  // Step 3 (conditional on attendance)
  ...guestDetailsSchema.shape,
  
  // Step 4
  ...additionalInfoSchema.shape,
  
  // Metadata
  submittedAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).refine((data) => {
  // If not attending, guests array should be empty or contain only primary guest
  if (!data.isAttending) {
    return true; // Skip guest validation if not attending
  }
  return data.guests.length >= 1;
}, {
  message: 'Guest information is required when attending',
  path: ['guests'],
});

// Step-specific validation schemas
export const stepSchemas = {
  1: basicInfoSchema,
  2: attendanceSchema,
  3: guestDetailsSchema,
  4: additionalInfoSchema,
} as const;

// Utility functions for validation
export function validateStep(step: number, data: any) {
  const schema = stepSchemas[step as keyof typeof stepSchemas];
  if (!schema) {
    throw new Error(`Invalid step: ${step}`);
  }
  return schema.safeParse(data);
}

export function validateCompleteForm(data: any) {
  return rsvpFormSchema.safeParse(data);
}

// Type exports
export type RSVPFormInput = z.infer<typeof rsvpFormSchema>;
export type BasicInfoInput = z.infer<typeof basicInfoSchema>;
export type AttendanceInput = z.infer<typeof attendanceSchema>;
export type GuestDetailsInput = z.infer<typeof guestDetailsSchema>;
export type AdditionalInfoInput = z.infer<typeof additionalInfoSchema>;
export type GuestInput = z.infer<typeof guestSchema>;
