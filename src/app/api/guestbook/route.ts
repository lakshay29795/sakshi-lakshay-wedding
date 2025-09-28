import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { guestMessageSchema, guestBookFiltersSchema } from '@/lib/validations/guestbook';
import { initializeFirebase } from '@/lib/firebase-admin';
import { generateId } from '@/lib/utils';
import type { GuestMessage, GuestBookStats } from '@/types/guestbook';

// Firebase will be initialized when needed

// Rate limiting: 5 messages per hour per IP
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
});

// Spam detection keywords
const SPAM_KEYWORDS = [
  'viagra', 'casino', 'lottery', 'winner', 'click here', 'free money',
  'make money fast', 'work from home', 'get rich quick', 'lose weight fast'
];

function detectSpam(message: string, name: string): boolean {
  const text = `${message} ${name}`.toLowerCase();
  
  // Check for spam keywords
  if (SPAM_KEYWORDS.some(keyword => text.includes(keyword))) {
    return true;
  }
  
  // Check for excessive repetition
  const words = message.split(/\s+/);
  const wordCount = new Map<string, number>();
  
  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length > 2) {
      wordCount.set(cleanWord, (wordCount.get(cleanWord) || 0) + 1);
    }
  });
  
  // If any word appears more than 30% of the time, it's likely spam
  const totalWords = words.length;
  for (const [, count] of wordCount) {
    if (count / totalWords > 0.3) {
      return true;
    }
  }
  
  // Check for excessive capitalization
  const capsCount = (message.match(/[A-Z]/g) || []).length;
  if (capsCount / message.length > 0.5 && message.length > 20) {
    return true;
  }
  
  return false;
}

function getClientInfo(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return { ip, userAgent };
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const { ip } = getClientInfo(request);
    const { success } = await limiter.check(5, ip);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Too many messages. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = guestMessageSchema.parse(body);
    
    // Spam detection
    const isSpam = detectSpam(validatedData.message, validatedData.guestName);
    
    // Create message document
    const messageData: Omit<GuestMessage, 'id'> = {
      guestName: validatedData.guestName.trim(),
      guestEmail: validatedData.guestEmail?.trim() || undefined,
      message: validatedData.message.trim(),
      submittedAt: new Date(),
      status: isSpam ? 'rejected' : 'approved', // Auto-reject spam, otherwise auto-approve
      isHighlighted: false,
      likes: 0,
      likedBy: [],
      ...getClientInfo(request),
    };

    let savedMessage: GuestMessage;

    // Check if Firebase admin is configured
    const useFirebase = process.env.FIREBASE_PROJECT_ID && 
                       process.env.FIREBASE_CLIENT_EMAIL && 
                       process.env.FIREBASE_PRIVATE_KEY;

    if (!useFirebase) {
      // Create a mock saved message when Firebase is not configured
      const mockId = `mock-${Date.now()}`;
      savedMessage = {
        id: mockId,
        ...messageData,
      };
      
      console.log('Mock guest book message submitted (Firebase not configured):', {
        id: mockId,
        guestName: validatedData.guestName,
        status: messageData.status,
        isSpam,
        ip,
      });
    } else {
      try {
        // Save to Firestore in production
        const { db } = initializeFirebase();
        const docRef = await db.collection('guestbook').add(messageData);
        savedMessage = {
          id: docRef.id,
          ...messageData,
        };

        // Log the submission
        console.log('Guest book message submitted:', {
          id: docRef.id,
          guestName: validatedData.guestName,
          status: messageData.status,
          isSpam,
          ip,
        });
      } catch (error) {
        console.error('Firebase error, creating mock message:', error);
        // Fallback to mock message
        const mockId = `mock-${Date.now()}`;
        savedMessage = {
          id: mockId,
          ...messageData,
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: savedMessage,
      message: isSpam 
        ? 'Message flagged for review due to content policy.'
        : 'Thank you for your message! It has been published.',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating guest book message:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid message data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to save message. Please try again.' },
      { status: 500 }
    );
  }
}

// Sample data for development
const sampleMessages: GuestMessage[] = [
  {
    id: 'sample-1',
    guestName: 'Emma Johnson',
    guestEmail: 'emma@example.com',
    message: 'Congratulations to the beautiful couple! Wishing you a lifetime of love, laughter, and happiness together. Your love story is truly inspiring! 💕',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'approved',
    isHighlighted: true,
    likes: 12,
    likedBy: [],
  },
  {
    id: 'sample-2',
    guestName: 'Arjun Patel',
    message: 'So happy to celebrate this special day with you both! May your marriage be filled with endless joy and adventure.',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: 'approved',
    likes: 8,
    likedBy: [],
  },
  {
    id: 'sample-3',
    guestName: 'Priya Sharma',
    message: 'What a perfect match you two are! Looking forward to dancing the night away at your wedding! 💃🕺',
    submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    status: 'approved',
    likes: 15,
    likedBy: [],
  },
  {
    id: 'sample-4',
    guestName: 'David Rodriguez',
    message: 'Cheers to love, laughter, and happily ever after! Can\'t wait to see you tie the knot!',
    submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: 'approved',
    likes: 6,
    likedBy: [],
  },
  {
    id: 'sample-5',
    guestName: 'Lisa Thompson',
    message: 'Your love story gives me all the feels! Wishing you both a magical wedding day and a beautiful future together.',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'pending',
    likes: 0,
    likedBy: [],
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = guestBookFiltersSchema.parse({
      status: searchParams.get('status') || 'approved',
      sortBy: searchParams.get('sortBy') || 'newest',
      search: searchParams.get('search') || '',
    });

    let messages: GuestMessage[];
    let allMessages: any[];

    // Check if we're in development mode or Firebase admin is not configured
    const useFirebase = process.env.FIREBASE_PROJECT_ID && 
                       process.env.FIREBASE_CLIENT_EMAIL && 
                       process.env.FIREBASE_PRIVATE_KEY;

    if (!useFirebase) {
      console.log('Using sample guest book data (Firebase admin not configured)');
      messages = [...sampleMessages];
      allMessages = [...sampleMessages];
    } else {
      try {
        // Initialize Firebase for production
        const { db } = initializeFirebase();
        
        // Build Firestore query
        let query = db.collection('guestbook');

        // Filter by status
        if (filters.status && filters.status !== 'all') {
          query = query.where('status', '==', filters.status);
        }

        // Execute query
        const snapshot = await query.get();
        messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          submittedAt: doc.data().submittedAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate(),
        } as GuestMessage));

        // Get all messages for stats
        const allMessagesSnapshot = await db.collection('guestbook').get();
        allMessages = allMessagesSnapshot.docs.map(doc => doc.data());
      } catch (error) {
        console.error('Firebase error, falling back to sample data:', error);
        messages = [...sampleMessages];
        allMessages = [...sampleMessages];
      }
    }

    // Filter by status for sample data
    if (!useFirebase && filters.status && filters.status !== 'all') {
      messages = messages.filter(message => message.status === filters.status);
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      messages = messages.filter(message =>
        message.guestName.toLowerCase().includes(searchTerm) ||
        message.message.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'oldest':
        messages.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
        break;
      case 'mostLiked':
        messages.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'newest':
      default:
        messages.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        break;
    }

    // Calculate stats
    const stats: GuestBookStats = {
      totalMessages: allMessages.length,
      approvedMessages: allMessages.filter(m => m.status === 'approved').length,
      pendingMessages: allMessages.filter(m => m.status === 'pending').length,
      rejectedMessages: allMessages.filter(m => m.status === 'rejected').length,
      totalLikes: allMessages.reduce((sum, m) => sum + (m.likes || 0), 0),
    };

    return NextResponse.json({
      success: true,
      data: {
        messages,
        stats,
        filters,
      },
    });

  } catch (error: any) {
    console.error('Error fetching guest book messages:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid filter parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
