# Wedding Website Configuration Guide

Welcome to your customizable wedding website! This guide will help you configure every aspect of your website to make it truly yours.

## 📁 Configuration Files Overview

All configuration files are located in the `/config` folder:

```
/config/
  ├── website.config.ts       # Main website settings
  ├── content.config.ts        # All text content and messages
  ├── assets.config.ts         # Image and video paths
  ├── quiz.config.ts           # Quiz questions and results
  ├── daily-reveals.config.ts  # Daily countdown reveals
  ├── index.ts                 # Exports all configs
  └── README.md                # This file
```

## 🚀 Quick Start

### Step 1: Update Basic Information

Open `config/website.config.ts` and update:

1. **Couple Names**: Change bride and groom names
2. **Wedding Date**: Update to your wedding date (format: 'YYYY-MM-DDTHH:mm:ss')
3. **Venue Information**: Your wedding location
4. **Wedding Schedule**: Your ceremony timeline

```typescript
// Example:
couple: {
  bride: {
    name: 'Jane',
    fullName: 'Jane Marie Smith',
    photo: '/images/couple/bride.jpg',
  },
  groom: {
    name: 'John',
    fullName: 'John Michael Doe',
    photo: '/images/couple/groom.jpg',
  },
},
wedding: {
  date: '2025-06-15T16:00:00',
  venue: {
    name: 'Grand Hotel Ballroom',
    address: '123 Main St, City, State',
    coordinates: { lat: 40.7128, lng: -74.0060 },
  },
}
```

### Step 2: Add Your Content

Open `config/content.config.ts` and customize:

1. **Hero Messages**: Welcome text on homepage
2. **Timeline Events**: Your relationship story
3. **Video Messages**: Messages from family/friends
4. **Page Content**: RSVP, guestbook, gallery descriptions

### Step 3: Configure Your Assets

Open `config/assets.config.ts` and update paths to your media files:

1. **Couple Photos**: Main photos of you both
2. **Timeline Images**: Photos for each timeline event
3. **Gallery**: Wedding and relationship photos
4. **Video Messages**: Paths to video files
5. **Daily Reveals**: Images for countdown

### Step 4: Customize Quiz (Optional)

Open `config/quiz.config.ts` to customize the Love Language Quiz or create your own quiz.

### Step 5: Set Up Daily Reveals

Open `config/daily-reveals.config.ts` to configure 30 days of unlockable content leading up to your wedding.

## 📂 Asset Organization

### Recommended Folder Structure

```
/public/
  /images/
    /couple/
      - bride.jpg
      - groom.jpg
      - together.jpg
      - hero.jpg
    /timeline/
      - first-date.jpg
      - proposal.jpg
      - engagement.jpg
    /gallery/
      - photo-001.jpg
      - photo-002.jpg
      (all your gallery photos)
    /messages/
      - mom-thumbnail.jpg
      - dad-thumbnail.jpg
      (thumbnails for video messages)
    /daily-reveals/
      - day-01.jpg
      - day-02.jpg
      (30 images for daily reveals)
  /videos/
    /messages/
      - mom-message.mp4
      - dad-message.mp4
      (video message files)
  /audio/
    /songs/
      - our-song.mp3
      (background music)
```

## 🎨 Customization Guide

### 1. Website Information (`website.config.ts`)

#### Couple Information
```typescript
couple: {
  bride: {
    name: 'FirstName',           // Short name for display
    fullName: 'Full Legal Name', // Full name for formal sections
    photo: '/images/couple/bride.jpg',
  },
  groom: { /* same structure */ },
}
```

#### Wedding Details
```typescript
wedding: {
  date: 'YYYY-MM-DDTHH:mm:ss',  // ISO 8601 format
  venue: {
    name: 'Venue Name',
    address: 'Full Address',
    coordinates: {
      lat: 0.0000,  // Latitude for map
      lng: 0.0000,  // Longitude for map
    },
  },
  schedule: [
    {
      time: '3:00 PM',
      event: 'Event Name',
      description: 'Event description',
    },
    // Add more events...
  ],
}
```

#### Feature Toggles
Enable or disable features:
```typescript
features: {
  countdown: true,      // Show countdown timer
  gallery: true,        // Enable photo gallery
  timeline: true,       // Show relationship timeline
  rsvp: true,          // Enable RSVP form
  guestbook: true,     // Enable guestbook
  dailyReveals: true,  // Enable daily reveals
  videoMessages: true, // Enable video messages
  quiz: true,          // Enable quiz feature
  dreamsBoard: true,   // Enable dreams board
  notifications: true, // Enable push notifications
}
```

### 2. Content Configuration (`content.config.ts`)

#### Timeline Events
Add your relationship milestones:
```typescript
timeline: [
  {
    id: '1',
    date: new Date('2020-01-15'),
    title: 'First Date',
    description: 'Our amazing first date story...',
    image: '/images/timeline/first-date.jpg',
    location: {
      name: 'Restaurant Name',
      coordinates: { lat: 0.0, lng: 0.0 },
    },
  },
  // Add more events...
]
```

#### Video Messages
Configure family/friend video messages:
```typescript
videoMessages: [
  {
    id: '1',
    name: 'Mom',
    relationship: 'Mother',
    thumbnail: '/images/messages/mom-thumbnail.jpg',
    videoUrl: '/videos/messages/mom-message.mp4',
    message: 'Short description of the message',
    isLocked: false,  // Set to true to lock until wedding day
  },
  // Add more messages...
]
```

### 3. Assets Configuration (`assets.config.ts`)

#### Image Paths
All paths are relative to the `/public` folder:
```typescript
couple: {
  hero: '/images/couple/hero.jpg',
  bride: '/images/couple/bride.jpg',
  groom: '/images/couple/groom.jpg',
}
```

#### Video Paths
```typescript
videoMessages: {
  videos: {
    'mom': {
      video: '/videos/messages/mom.mp4',
      thumbnail: '/images/messages/mom-thumb.jpg',
    },
  },
}
```

### 4. Quiz Configuration (`quiz.config.ts`)

#### Add Questions
```typescript
questions: [
  {
    id: 1,
    question: "Your question here?",
    options: [
      { 
        id: 'a', 
        text: "Option A text", 
        loveLanguage: 'words',  // or 'acts', 'gifts', 'time', 'touch'
        rating: 1  // 1-5, where 1 is best match
      },
      // Add 4-5 options per question...
    ]
  },
  // Add more questions...
]
```

#### Customize Results
```typescript
results: {
  words: {
    name: 'Words of Affirmation',
    description: 'Result description...',
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    tips: [
      'Tip 1',
      'Tip 2',
      // Add more tips...
    ],
  },
  // Configure other love languages...
}
```

### 5. Daily Reveals Configuration (`daily-reveals.config.ts`)

#### Configure Reveals
Each reveal unlocks on a specific day before the wedding:
```typescript
reveals: [
  {
    day: 30,  // Days before wedding
    title: "Reveal Title",
    description: "Short description",
    image: "/images/daily-reveals/day-30.jpg",
    message: "Full message that shows when unlocked...",
    category: 'memory',  // or 'preparation', 'love-note', 'surprise', 'family', 'friends'
    isSpecial: true,  // Highlights this as a special day
  },
  // Add 30 reveals total (one for each day)
]
```

## 📸 Adding Your Photos

### Photo Requirements

#### General Guidelines
- **Format**: JPG, PNG, or WebP
- **File Size**: Under 2MB per photo (compressed)
- **Quality**: High quality but web-optimized

#### Specific Requirements

**Hero/Banner Images:**
- Size: 1920x1080px (16:9 ratio)
- Landscape orientation

**Couple Photos:**
- Size: 800x800px (1:1 ratio) or larger
- Square or portrait orientation

**Timeline Images:**
- Size: 1200x800px (3:2 ratio)
- Landscape orientation

**Gallery Photos:**
- Size: Variable (will be automatically resized)
- Any orientation

**Daily Reveal Images:**
- Size: 1200x800px (3:2 ratio)
- Landscape orientation

**Video Message Thumbnails:**
- Size: 640x480px (4:3 ratio)
- Portrait or square photos work best

### How to Add Photos

1. **Place files in appropriate folders** (see folder structure above)
2. **Name files descriptively** (e.g., `first-date.jpg`, not `IMG_1234.jpg`)
3. **Update config files** with correct paths
4. **Test on website** to ensure images load correctly

### Image Optimization Tips

- Use tools like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/) to compress images
- Convert large PNGs to JPG when possible
- Use WebP format for better compression (modern browsers support it)
- Resize images to recommended dimensions before uploading

## 🎥 Adding Videos

### Video Requirements

- **Format**: MP4 (H.264 codec recommended)
- **File Size**: Under 50MB per video
- **Resolution**: 1080p or 720p
- **Length**: 1-3 minutes recommended

### How to Add Videos

1. **Place video files** in `/public/videos/messages/`
2. **Create thumbnail images** (frame from video or separate photo)
3. **Update `content.config.ts`** with video details
4. **Test playback** on website

### Video Optimization

- Use [HandBrake](https://handbrake.fr/) to compress videos
- Target bitrate: 2-5 Mbps for good quality/size balance
- Consider using a video hosting service (YouTube, Vimeo) for large files

## 🎵 Adding Music

### Audio Requirements

- **Format**: MP3 or AAC
- **File Size**: Under 10MB per song
- **Bitrate**: 128-192 kbps recommended

### How to Add Music

1. **Place audio files** in `/public/audio/songs/`
2. **Update `assets.config.ts`**:
```typescript
audio: {
  songs: [
    '/audio/songs/our-song.mp3',
    '/audio/songs/ceremony-music.mp3',
  ],
  defaultVolume: 0.3,  // 0.0 to 1.0
}
```

## 🎨 Theme Customization

### Change Color Scheme

In `website.config.ts`:
```typescript
theme: {
  colors: {
    primary: '#FF69B4',    // Main color
    secondary: '#FFB6C1',  // Secondary color
    accent: '#C71585',     // Accent color
  },
  style: 'romantic',  // or 'celestial', 'modern', 'classic'
}
```

### Available Themes

- **romantic**: Soft pinks, elegant, fairy-tale style
- **celestial**: Blues, purples, starry night theme
- **modern**: Clean, minimalist, contemporary
- **classic**: Traditional, timeless, elegant

## 🔐 Admin Settings

### Change Admin Credentials

⚠️ **IMPORTANT**: Change default admin credentials!

In `website.config.ts`:
```typescript
site: {
  admin: {
    username: 'your-username',  // Change this!
    password: 'secure-password', // Change this!
  },
}
```

## 🌐 Deployment Checklist

Before deploying your website:

- [ ] Update all couple information
- [ ] Set correct wedding date
- [ ] Upload all photos to correct folders
- [ ] Upload all videos
- [ ] Test all image paths
- [ ] Test all video paths
- [ ] Change admin credentials
- [ ] Test RSVP form
- [ ] Test guestbook
- [ ] Verify daily reveals unlock correctly
- [ ] Test on mobile devices
- [ ] Check all links work
- [ ] Proofread all text content

## 🆘 Troubleshooting

### Images Not Showing

1. Check file path is correct (case-sensitive!)
2. Ensure file is in `/public` folder
3. Check file extension matches config
4. Clear browser cache and refresh

### Videos Not Playing

1. Confirm video is in MP4 format
2. Check file size (under 50MB)
3. Test video plays locally first
4. Check browser console for errors

### Daily Reveals Not Unlocking

1. Verify wedding date is set correctly
2. Check reveal `day` numbers are correct
3. Ensure array has correct number of reveals
4. Check your system date/time is correct

### Configuration Changes Not Showing

1. Restart development server
2. Clear browser cache
3. Check for TypeScript errors in console
4. Verify config file syntax is correct

## 💡 Tips & Best Practices

1. **Start with sample data**: Test with the provided examples first
2. **Back up your work**: Keep copies of your config files
3. **Use version control**: Commit changes regularly with git
4. **Test frequently**: Check website after each major change
5. **Mobile-first**: Test on mobile devices throughout development
6. **Compress assets**: Optimize all images and videos before uploading
7. **Proofread**: Have someone else review text content
8. **Test RSVP**: Send test RSVPs to ensure form works
9. **Privacy**: Be mindful of photo permissions for guests
10. **Backup plan**: Have website URL on physical invitation cards

## 📞 Support

If you need help:

1. Check this documentation
2. Review example configurations
3. Check browser console for errors
4. Review TypeScript type errors
5. Test with sample data first

## 🎉 Final Notes

Remember to:
- Have fun customizing your website!
- Make it personal and unique to your love story
- Don't stress about perfection
- Your guests will love whatever you create

**Congratulations on your wedding! 🎊💒**

