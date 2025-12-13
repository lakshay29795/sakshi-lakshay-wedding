/**
 * MODERN ELEGANCE THEME CONFIGURATION
 * Clean, minimalist design with contemporary elements
 */

export const modernEleganceTheme = {
  name: 'Modern Elegance',
  slug: 'modern-elegance',
  description: 'Clean, minimalist design with contemporary romantic elements',
  
  colors: {
    primary: '#FF69B4',       // Hot Pink
    secondary: '#E8D5F2',     // Lavender
    accent: '#FFC0CB',        // Pale Pink
    background: '#FFFFFF',    // Pure White
    backgroundAlt: '#F8F9FA', // Light Gray
    text: '#2D2D2D',          // Charcoal
    textLight: '#6B7280',     // Gray
    gradient: 'linear-gradient(135deg, #FF69B4 0%, #E8D5F2 100%)',
  },
  
  typography: {
    heading: '"Montserrat", sans-serif',
    body: '"Inter", sans-serif',
    accent: '"Pacifico", cursive',
  },
  
  features: [
    'Full-Screen Modern Hero',
    'Card-Based Clean Layout',
    'Horizontal Scrolling Timeline',
    'Instagram-Style Gallery Grid',
    'Minimalist Navigation',
    'Video Message Player',
    'Spotify-Style Playlist',
    'Love Stats Dashboard',
    'Location Pins on Map',
  ],
  
  demoContent: {
    couple: {
      name1: 'Ryan',
      name2: 'Sophia',
      tagline: 'Modern Love, Timeless Commitment',
    },
    hero: {
      greeting: 'Welcome to Our Story',
      message: 'Where every moment is a new adventure',
      date: '2025-02-14T00:00:00',
    },
    stats: [
      {
        label: 'Days Together',
        value: '732',
        icon: 'calendar',
      },
      {
        label: 'Photos Shared',
        value: '1,247',
        icon: 'camera',
      },
      {
        label: 'Adventures',
        value: '42',
        icon: 'map',
      },
      {
        label: 'Coffee Dates',
        value: '∞',
        icon: 'coffee',
      },
    ],
    timeline: [
      {
        date: '2023-02-14',
        title: 'Matched Online',
        description: 'Right swipe that changed everything',
        icon: 'heart',
      },
      {
        date: '2023-03-01',
        title: 'Video Call #1',
        description: '3 hours flew by in what felt like minutes',
        icon: 'video',
      },
      {
        date: '2023-03-15',
        title: 'First IRL Date',
        description: 'Even better than FaceTime',
        icon: 'sparkles',
      },
      {
        date: '2023-07-20',
        title: 'Road Trip',
        description: 'Pacific Coast Highway adventure',
        icon: 'car',
      },
      {
        date: '2024-01-01',
        title: 'Moved In Together',
        description: 'Started building our home',
        icon: 'home',
      },
    ],
    message: `Hey Sophia,

I still remember the first time I saw your profile. I almost didn't swipe right because you seemed too good to be true. Best decision I ever made.

Every day with you is like discovering a new favorite song, finding a hidden gem in the city, or watching the sunrise after staying up all night talking. You get me in ways I didn't know I needed to be gotten.

Thanks for being my partner in crime, my late-night Uber Eats enabler, my adventure buddy, and my home.

Here's to forever being each other's favorite notification.

Love,
Ryan`,
  },
} as const;

export type ModernEleganceTheme = typeof modernEleganceTheme;

