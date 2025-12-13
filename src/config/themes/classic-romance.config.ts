/**
 * CLASSIC ROMANCE THEME CONFIGURATION
 * Elegant, timeless design with traditional romantic elements
 */

export const classicRomanceTheme = {
  name: 'Classic Romance',
  slug: 'classic-romance',
  description: 'Timeless elegance with traditional romantic elements',
  
  colors: {
    primary: '#DC143C',       // Crimson Red
    secondary: '#FFB6C1',     // Light Pink
    accent: '#FFD700',        // Gold
    background: '#FFF8F8',    // Rose White
    backgroundAlt: '#FFF0F5', // Lavender Blush
    text: '#4A0E0E',          // Deep Burgundy
    textLight: '#8B4557',     // Medium Rose
  },
  
  typography: {
    heading: '"Playfair Display", serif',
    body: '"Lora", serif',
    accent: '"Great Vibes", cursive',
  },
  
  features: [
    'Elegant Hero Section',
    'Vintage Timeline with Ornate Details',
    'Classic Gallery with Gold Frames',
    'Love Letter with Calligraphy',
    'Music Player with Classical Design',
    'Virtual Gift Box with Rose Petals',
    '14 Days of Love Notes',
    'Interactive Love Map',
    'Romantic Countdown Timer',
  ],
  
  demoContent: {
    couple: {
      name1: 'Alexander',
      name2: 'Isabella',
      tagline: 'A Love Written in the Stars',
    },
    hero: {
      greeting: 'Forever & Always',
      message: 'Two hearts, one beautiful journey',
      date: '2025-02-14T00:00:00',
    },
    timeline: [
      {
        date: '2023-01-15',
        title: 'First Meeting',
        description: 'Our eyes met across a crowded room, and time stood still',
        icon: 'heart',
      },
      {
        date: '2023-03-20',
        title: 'First Date',
        description: 'Coffee and conversation that lasted until midnight',
        icon: 'coffee',
      },
      {
        date: '2023-06-10',
        title: 'Became Official',
        description: 'Under the summer stars, we promised to be each other\'s forever',
        icon: 'star',
      },
      {
        date: '2023-09-05',
        title: 'First Trip Together',
        description: 'Paris in autumn - walking hand in hand through the city of love',
        icon: 'plane',
      },
      {
        date: '2024-12-25',
        title: 'The Engagement',
        description: 'On Christmas morning, a dream became reality',
        icon: 'ring',
      },
    ],
    loveLetter: `My Dearest Isabella,

From the moment our paths crossed, I knew my life would never be the same. You are the poetry in my prose, the melody in my silence, the light that guides me through every darkness.

Every day with you is a blessing I never knew I needed. Your smile brightens my darkest days, your laughter is my favorite symphony, and your love is the greatest gift I've ever received.

As we stand on the threshold of forever, I promise to love you with every breath I take, to cherish you through every season, and to build a life with you that's as beautiful as the love we share.

Forever yours,
Alexander`,
  },
} as const;

export type ClassicRomanceTheme = typeof classicRomanceTheme;

