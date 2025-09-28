import { z } from 'zod';

export const guestMessageSchema = z.object({
  guestName: z
    .string()
    .min(1, 'Your name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  guestEmail: z
    .union([
      z.string().email('Please enter a valid email address'),
      z.literal('')
    ])
    .optional(),
  
  message: z
    .string()
    .min(1, 'Please write a message')
    .min(10, 'Message must be at least 10 characters long')
    .max(1000, 'Message must be less than 1000 characters')
    .refine(
      (message) => {
        // Basic spam detection
        const spamWords = ['viagra', 'casino', 'lottery', 'winner', 'click here', 'free money'];
        const lowerMessage = message.toLowerCase();
        return !spamWords.some(word => lowerMessage.includes(word));
      },
      'Message contains inappropriate content'
    )
    .refine(
      (message) => {
        // Check for excessive repetition
        const words = message.split(/\s+/);
        const uniqueWords = new Set(words.map(w => w.toLowerCase()));
        return uniqueWords.size / words.length > 0.3; // At least 30% unique words
      },
      'Message appears to be spam'
    ),
});

export const guestBookFiltersSchema = z.object({
  status: z.enum(['all', 'approved', 'pending', 'rejected']).optional(),
  sortBy: z.enum(['newest', 'oldest', 'mostLiked']).optional(),
  search: z.string().max(100).optional(),
});

export const moderationActionSchema = z.object({
  messageId: z.string().min(1, 'Message ID is required'),
  action: z.enum(['approve', 'reject', 'highlight', 'unhighlight']),
  reason: z.string().max(500).optional(),
});

export type GuestMessageFormInput = z.infer<typeof guestMessageSchema>;
export type GuestBookFiltersInput = z.infer<typeof guestBookFiltersSchema>;
export type ModerationActionInput = z.infer<typeof moderationActionSchema>;
