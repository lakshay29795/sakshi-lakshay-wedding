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
  // All images feature Indian couples in traditional attire for visual consistency
  couple: {
    // Main couple photos - Indian wedding couple in traditional attire
    hero: '/demo-content/images/demo-proposal.jpg',
    bride: 'https://images.pexels.com/photos/1589216/pexels-photo-1589216.jpeg?auto=compress&cs=tinysrgb&w=800',
    groom: 'https://images.pexels.com/photos/2474307/pexels-photo-2474307.jpeg?auto=compress&cs=tinysrgb&w=800',
    together: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200',
    
    // Additional couple photos
    engagement: 'https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg?auto=compress&cs=tinysrgb&w=1200',
    casual: 'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },

  // ====================
  // TIMELINE IMAGES
  // ====================
  // These correspond to the timeline events in content.config.ts
  // Using Indian couple and wedding-themed images for consistency
  timeline: {
    'first-meeting': 'https://images.pexels.com/photos/4312831/pexels-photo-4312831.jpeg',
    'birthday': '/demo-content/images/demo-birthday.png',
    'nanital-3': '/demo-content/images/demo-trip.png',
    'proposal-1': '/demo-content/images/demo-proposal.jpg',
    'lavi-wedding': 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
    'pool-party': 'https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg?auto=compress&cs=tinysrgb&w=800',
    'our-flat': 'https://images.pexels.com/photos/3014853/pexels-photo-3014853.jpeg?auto=compress&cs=tinysrgb&w=800',
    'first-international-trip': 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800',
    'party': 'https://images.pexels.com/photos/1157559/pexels-photo-1157559.jpeg?auto=compress&cs=tinysrgb&w=800',
  },

  // ====================
  // GALLERY FOLDERS
  // ====================
  gallery: {
    // Main gallery folder
    folder: '/images/gallery/',
    
    // Individual gallery photos - Curated Indian couple wedding photos for visual consistency
    photos: [
      'https://images.pexels.com/photos/4308024/pexels-photo-4308024.jpeg',
      'https://images.pexels.com/photos/4307719/pexels-photo-4307719.jpeg',
      'https://images.pexels.com/photos/4312847/pexels-photo-4312847.jpeg',
      'https://images.pexels.com/photos/4307789/pexels-photo-4307789.jpeg',
      'https://images.pexels.com/photos/4307635/pexels-photo-4307635.jpeg',
      'https://images.pexels.com/photos/4312833/pexels-photo-4312833.jpeg',
      'https://images.pexels.com/photos/4307633/pexels-photo-4307633.jpeg',
      'https://images.pexels.com/photos/4307920/pexels-photo-4307920.jpeg',
      'https://images.pexels.com/photos/4312830/pexels-photo-4312830.jpeg',
      'https://images.pexels.com/photos/4307799/pexels-photo-4307799.jpeg',
      'https://images.pexels.com/photos/4307644/pexels-photo-4307644.jpeg',
      'https://images.pexels.com/photos/4307730/pexels-photo-4307730.jpeg',
      'https://images.pexels.com/photos/4312831/pexels-photo-4312831.jpeg',
      'https://images.pexels.com/photos/4308015/pexels-photo-4308015.jpeg',
      'https://images.pexels.com/photos/4308050/pexels-photo-4308050.jpeg',
      'https://images.pexels.com/photos/4307734/pexels-photo-4307734.jpeg',
      'https://images.pexels.com/photos/4307801/pexels-photo-4307801.jpeg',
      'https://images.pexels.com/photos/4307907/pexels-photo-4307907.jpeg',
      'https://images.pexels.com/photos/29187418/pexels-photo-29187418.jpeg',
      'https://images.pexels.com/photos/4308014/pexels-photo-4308014.jpeg',
      'https://images.pexels.com/photos/4308099/pexels-photo-4308099.jpeg',
      'https://images.pexels.com/photos/4308011/pexels-photo-4308011.jpeg',
      'https://images.pexels.com/photos/4308044/pexels-photo-4308044.jpeg',
      'https://images.pexels.com/photos/4308016/pexels-photo-4308016.jpeg',
      'https://images.pexels.com/photos/4307905/pexels-photo-4307905.jpeg',
      'https://images.pexels.com/photos/4307925/pexels-photo-4307925.jpeg',
      'https://images.pexels.com/photos/4307698/pexels-photo-4307698.jpeg',
      'https://images.pexels.com/photos/4308013/pexels-photo-4308013.jpeg',
      'https://images.pexels.com/photos/4307646/pexels-photo-4307646.jpeg',
      'https://images.pexels.com/photos/4307965/pexels-photo-4307965.jpeg',
      'https://images.pexels.com/photos/4308199/pexels-photo-4308199.jpeg',
      'https://images.pexels.com/photos/4307939/pexels-photo-4307939.jpeg',
      'https://images.pexels.com/photos/4307819/pexels-photo-4307819.jpeg',
      'https://images.pexels.com/photos/4307967/pexels-photo-4307967.jpeg',


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
    // Using Indian family member photos for authenticity
    videos: {
      'mom': {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://images.pexels.com/photos/3768114/pexels-photo-3768114.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
      'sister': {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail: 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
      'brother': {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
      'bestfriend': {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnail: 'https://images.pexels.com/photos/3765114/pexels-photo-3765114.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
      'dad': {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnail: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
      'friend': {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        thumbnail: 'https://images.pexels.com/photos/2474311/pexels-photo-2474311.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
    },
  },

  // ====================
  // DAILY REVEALS
  // ====================
  dailyReveals: {
    // Folder for daily reveal images
    folder: 'https://images.pexels.com/photos/',
    
    // Individual images (30 days worth) - Using consistent Indian couple themed images
    images: {
      'first': 'https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg?auto=compress&cs=tinysrgb&w=800',
      'ring-shopping': 'https://images.pexels.com/photos/1537636/pexels-photo-1537636.jpeg?auto=compress&cs=tinysrgb&w=800',
      'love-note-1': 'https://images.pexels.com/photos/1024990/pexels-photo-1024990.jpeg?auto=compress&cs=tinysrgb&w=800',
      'venue-visit': 'https://images.pexels.com/photos/1721943/pexels-photo-1721943.jpeg?auto=compress&cs=tinysrgb&w=800',
      'family-dinner': 'https://images.pexels.com/photos/1730877/pexels-photo-1730877.jpeg?auto=compress&cs=tinysrgb&w=800',
      'surprise-weekend': 'https://images.pexels.com/photos/2387876/pexels-photo-2387876.jpeg?auto=compress&cs=tinysrgb&w=800',
      'dance-lessons': 'https://images.pexels.com/photos/1488315/pexels-photo-1488315.jpeg?auto=compress&cs=tinysrgb&w=800',
      'love-note-2': 'https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg?auto=compress&cs=tinysrgb&w=800',
      'friends-approval': 'https://images.pexels.com/photos/1730878/pexels-photo-1730878.jpeg?auto=compress&cs=tinysrgb&w=800',
      'cake-tasting': 'https://images.pexels.com/photos/1405528/pexels-photo-1405528.jpeg?auto=compress&cs=tinysrgb&w=800',
      'our-song': 'https://images.pexels.com/photos/1488312/pexels-photo-1488312.jpeg?auto=compress&cs=tinysrgb&w=800',
      'proposal-planning': 'https://images.pexels.com/photos/1024989/pexels-photo-1024989.jpeg?auto=compress&cs=tinysrgb&w=800',
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

