/**
 * ASSETS CONFIGURATION
 * 
 * This file defines where all images, videos, and other media assets are stored.
 * Update these paths to point to your own media files.
 * 
 * 📁 FOLDER STRUCTURE:
 * All paths are relative to the /public folder
 * 
 * /public/
 *   /images/
 *     /couple/          - Photos of the couple
 *     /timeline/        - Timeline event photos
 *     /gallery/         - Photo gallery images
 *     /messages/        - Video message thumbnails
 *     /daily-reveals/   - Daily reveal images
 *   /videos/
 *     /messages/        - Video messages
 *   /audio/
 *     /songs/           - Background music
 */

export const assetsConfig = {
  // ====================
  // COUPLE PHOTOS
  // ====================
  couple: {
    // Main couple photos
    hero: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    bride: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8',
    groom: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    together: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a',
    
    // Additional couple photos
    engagement: 'https://images.unsplash.com/photo-1606800052052-a08af7148866',
    casual: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
  },

  // ====================
  // TIMELINE IMAGES
  // ====================
  // These correspond to the timeline events in content.config.ts
  timeline: {
    'first-meeting': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
    'birthday': 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3',
    'nanital-3': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    'proposal-1': 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486',
    'lavi-wedding': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed',
    'pool-party': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    'our-flat': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    'first-international-trip': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05',
    'party': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
  },

  // ====================
  // GALLERY FOLDERS
  // ====================
  gallery: {
    // Main gallery folder
    folder: '/images/gallery/',
    
    // Individual gallery photos (using online images for demo)
    photos: [
      'https://images.unsplash.com/photo-1606800052052-a08af7148866', // couple 1
      'https://images.unsplash.com/photo-1519741497674-611481863552', // couple 2
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a', // couple 3
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486', // couple 4
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc', // couple 5
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e', // couple 6
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', // travel 1
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05', // travel 2
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', // travel 3
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3', // celebration 1
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30', // celebration 2
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3', // celebration 3
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a', // couple 7
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6', // couple 8
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2', // couple 9
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23', // couple 10
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed', // ceremony 1
      'https://images.unsplash.com/photo-1594552072238-b8be436e3ada', // preparation
      'https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d', // dance
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330', // reception
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622', // family
      'https://images.unsplash.com/photo-1523438885200-e635ba2c371e', // friends
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce', // group
      'https://images.unsplash.com/photo-1543807535-eceef0bc6599', // family 2
      'https://images.unsplash.com/photo-1452457005517-a0dd81caca2a', // details
      'https://images.unsplash.com/photo-1487530811176-3780de880c2d', // couple 11
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf', // couple 12
      'https://images.unsplash.com/photo-1474552226712-ac0f0961a954', // couple 13
      'https://images.unsplash.com/photo-1504890001746-a9a68eda46e2', // couple 14
      'https://images.unsplash.com/photo-1516589091380-5d8e87df6999', // couple 15
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6', // travel 4
      'https://images.unsplash.com/photo-1519167758481-83f29da8c9b0', // venue
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3', // celebration 4
      'https://images.unsplash.com/photo-1460978812857-470ed1c77af0', // couple 16
      'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46', // love note
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8', // ring
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', // honeymoon
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3', // party 2
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c', // celebration 5
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc', // coffee shop
    ],
    
    // If you want to organize by categories, list them here
    categories: {
      couple: '/images/gallery/couple/',
      family: '/images/gallery/family/',
      friends: '/images/gallery/friends/',
      travel: '/images/gallery/travel/',
    },
    
    // Thumbnail settings
    thumbnailSize: {
      width: 400,
      height: 300,
    },
  },

  // ====================
  // VIDEO MESSAGES
  // ====================
  videoMessages: {
    // Folder for video files
    videosFolder: '/videos/messages/',
    
    // Folder for thumbnail images
    thumbnailsFolder: '/images/messages/',
    
    // Individual video messages (corresponds to content.config.ts)
    videos: {
      'mom': {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      },
      'sister': {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      },
      'brother': {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      },
      'bestfriend': {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      },
      'dad': {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      },
      'friend': {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
      },
    },
  },

  // ====================
  // DAILY REVEALS
  // ====================
  dailyReveals: {
    // Folder for daily reveal images
    folder: 'https://images.unsplash.com/photo-',
    
    // Individual images (30 days worth) - Using Unsplash placeholder images
    images: {
      'first': 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486',
      'ring-shopping': 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8',
      'love-note-1': 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46',
      'venue-visit': 'https://images.unsplash.com/photo-1519167758481-83f29da8c9b0',
      'family-dinner': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
      'surprise-weekend': 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6',
      'dance-lessons': 'https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d',
      'love-note-2': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2',
      'friends-approval': 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e',
      'cake-tasting': 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3',
      'our-song': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
      'proposal-planning': 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0',
    },
  },

  // ====================
  // BACKGROUND MUSIC
  // ====================
  audio: {
    // Background songs
    songs: [
      '/audio/songs/perfect.mp3',
      '/audio/songs/thinking-out-loud.mp3',
      '/audio/songs/a-thousand-years.mp3',
    ],
    
    // Default volume (0.0 to 1.0)
    defaultVolume: 0.3,
  },

  // ====================
  // ICONS & LOGOS
  // ====================
  branding: {
    // App icon/logo
    logo: '/icons/new-app-logo.jpg',
    favicon: '/favicon.ico',
    
    // PWA icons (different sizes)
    icons: {
      '72': '/icons/icon-72x72.png',
      '96': '/icons/icon-96x96.png',
      '128': '/icons/icon-128x128.png',
      '144': '/icons/icon-144x144.png',
      '152': '/icons/icon-152x152.png',
      '192': '/icons/icon-192x192.png',
      '384': '/icons/icon-384x384.png',
      '512': '/icons/icon-512x512.png',
    },
  },

  // ====================
  // AVATARS (for AI avatars feature)
  // ====================
  avatars: {
    folder: '/images/avatars/',
    // Placeholder avatars if user hasn't uploaded their own
    placeholders: [
      '/images/avatars/avatar-1.svg',
      '/images/avatars/avatar-2.svg',
      '/images/avatars/avatar-3.svg',
    ],
  },

  // ====================
  // SECRETS/SPECIAL CONTENT
  // ====================
  secrets: {
    // Hidden or locked content
    folder: '/images/secret/',
    giftReveal: '/videos/gift-reveal.mp4',
  },
} as const;

// Helper function to get asset path
export const getAssetPath = (path: string) => {
  // Ensure path starts with /
  return path.startsWith('/') ? path : `/${path}`;
};

// Helper to get full URL for sharing (needs base URL from website config)
export const getAssetUrl = (path: string, baseUrl: string) => {
  return `${baseUrl}${getAssetPath(path)}`;
};

