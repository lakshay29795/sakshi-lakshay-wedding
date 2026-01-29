/**
 * WEBSITE CONFIGURATION
 * 
 * This is the main configuration file for your wedding website.
 * Customize all the details here to personalize your website.
 * 
 * ⚠️ IMPORTANT: After changing this file, restart your development server.
 */

export const websiteConfig = {
  // ====================
  // COUPLE INFORMATION
  // ====================
  couple: {
    bride: {
      name: 'Roshni',
      fullName: 'Roshni',
      // Path to bride's photo (relative to /public folder)
      photo: '/images/couple/bride.jpg',
    },
    groom: {
      name: 'Karan',
      fullName: 'Karan Singh',
      // Path to groom's photo (relative to /public folder)
      photo: '/images/couple/groom.jpg',
    },
  },

  // ====================
  // WEDDING DETAILS
  // ====================
  wedding: {
    // Wedding date and time (format: 'YYYY-MM-DDTHH:mm:ss')
    // date: '2026-02-14T16:00:00', // Uncomment this to set a specific date
    
    // Venue information
    venue: {
      name: 'Grand Ballroom Hotel',
      address: '123 Main Street, New York, NY 10001',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060,
      },
    },

    // Wedding schedule
    schedule: [
      {
        time: '3:00 PM',
        event: 'Guest Arrival & Cocktail Hour',
        description: 'Welcome drinks and light appetizers in the garden',
      },
      {
        time: '4:00 PM',
        event: 'Wedding Ceremony',
        description: 'Exchange of vows in the rose garden',
      },
      {
        time: '4:30 PM',
        event: 'Cocktail Hour Continues',
        description: 'Photos with the wedding party, more mingling',
      },
      {
        time: '6:00 PM',
        event: 'Reception Dinner',
        description: 'Three-course dinner in the main hall',
      },
      {
        time: '8:00 PM',
        event: 'First Dance & Speeches',
        description: 'Our first dance followed by toasts from family',
      },
      {
        time: '9:00 PM',
        event: 'Dancing & Celebration',
        description: 'Dance the night away with our favorite songs',
      },
      {
        time: '11:00 PM',
        event: 'Send-off',
        description: 'Sparkler send-off under the stars',
      },
    ],
  },

  // ====================
  // WEBSITE SETTINGS
  // ====================
  site: {
    // Website title (shown in browser tab)
    title: 'Jane & John\'s Wedding',
    
    // Website description (for SEO)
    description: 'Join us as we celebrate our love and begin our journey together',
    
    // Website URL (for sharing)
    url: 'https://yourwedding.example.com',
    
    // Admin credentials (for admin dashboard)
    admin: {
      // Change these for security!
      username: 'admin',
      password: 'wedding2025',
    },
  },

  // ====================
  // FEATURES TOGGLE
  // ====================
  features: {
    // Enable/disable features as needed
    countdown: true,
    gallery: true,
    timeline: true,
    rsvp: true,
    guestbook: true,
    dailyReveals: true,
    videoMessages: true,
    quiz: true,
    dreamsBoard: true,
    notifications: true,
  },

  // ====================
  // THEME & STYLING
  // ====================
  theme: {
    // Primary colors for the website
    colors: {
      primary: '#FF69B4',    // Hot pink
      secondary: '#FFB6C1',  // Light pink
      accent: '#C71585',     // Medium violet red
    },
    
    // Theme style
    style: 'romantic', // Options: 'romantic', 'celestial', 'modern', 'classic'
  },

  // ====================
  // SOCIAL MEDIA
  // ====================
  social: {
    // Add your social media handles (optional)
    instagram: '@janeandjohn2025',
    instagramUrl: 'https://www.instagram.com/foreverlink.gifts/', // Full Instagram profile URL
    facebook: 'janeandjohnwedding',
    facebookUrl: 'https://facebook.com/janeandjohnwedding', // Full Facebook page URL
    twitter: '@janeandjohn',
    twitterUrl: 'https://twitter.com/janeandjohn', // Full Twitter profile URL
    hashtag: '#JaneAndJohn2025',
  },

  // ====================
  // CONTACT INFORMATION
  // ====================
  contact: {
    // Contact email for RSVP and inquiries
    email: 'hello@janeandjohn.wedding',
    phone: '+1 (555) 123-4567',
  },
} as const;

// Note: Import getWeddingDate from src/lib/wedding-date.ts
// If the date above is set, it will be used. Otherwise, it falls back to 15 days from today.

