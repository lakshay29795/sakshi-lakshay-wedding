# Wedding Website - Complete Configuration Guide

## 🎉 Welcome to Your Customizable Wedding Website!

This wedding website is now fully configurable through simple configuration files. No need to edit multiple components - everything is centralized in the `/config` folder!

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Configuration Files](#configuration-files)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Asset Management](#asset-management)
5. [Advanced Customization](#advanced-customization)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd wedding-website
npm install
```

### 2. Update Basic Information

Navigate to `/config` folder and update these files:

1. **`website.config.ts`** - Couple names, wedding date, venue
2. **`content.config.ts`** - Your love story, messages, timeline
3. **`assets.config.ts`** - Paths to your photos and videos

### 3. Add Your Photos

Place your photos in the `/public/images` folder following this structure:

```
/public/images/
  /couple/           ← Photos of you both
  /timeline/         ← Photos for your relationship timeline
  /gallery/          ← Wedding and relationship photos
  /messages/         ← Thumbnails for video messages
  /daily-reveals/    ← Images for countdown reveals
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your personalized website!

---

## 📁 Configuration Files

### Overview

| File | Purpose | What to Customize |
|------|---------|-------------------|
| `website.config.ts` | Main settings | Names, dates, venue, schedule |
| `content.config.ts` | Text content | Timeline, messages, page content |
| `assets.config.ts` | Media paths | Image and video locations |
| `quiz.config.ts` | Quiz setup | Questions, answers, results |
| `daily-reveals.config.ts` | Countdown | 30 days of reveals |

### File Locations

```
/wedding-website/
  /config/
    ├── website.config.ts       ← Start here!
    ├── content.config.ts        ← Your story
    ├── assets.config.ts         ← Photo/video paths
    ├── quiz.config.ts           ← Quiz customization
    ├── daily-reveals.config.ts  ← Daily reveals
    ├── index.ts                 ← Exports (don't edit)
    └── README.md                ← Detailed documentation
```

---

## 📝 Step-by-Step Setup

### Step 1: Basic Information

**File**: `config/website.config.ts`

```typescript
// 1. Update couple names
couple: {
  bride: {
    name: 'Jane',                    // ← Change this
    fullName: 'Jane Marie Smith',    // ← Change this
    photo: '/images/couple/bride.jpg',
  },
  groom: {
    name: 'John',                    // ← Change this
    fullName: 'John Michael Doe',    // ← Change this
    photo: '/images/couple/groom.jpg',
  },
},

// 2. Set your wedding date
wedding: {
  date: '2025-06-15T16:00:00',      // ← Change this (YYYY-MM-DDTHH:mm:ss)
  
  // 3. Update venue
  venue: {
    name: 'Grand Ballroom',          // ← Change this
    address: '123 Main St, City',    // ← Change this
    coordinates: {
      lat: 40.7128,                  // ← Change this
      lng: -74.0060,                 // ← Change this
    },
  },
}
```

### Step 2: Your Love Story

**File**: `config/content.config.ts`

```typescript
timeline: [
  {
    id: '1',
    date: new Date('2020-01-15'),     // ← Your first date
    title: 'First Date',               // ← Event name
    description: 'Your story here...', // ← Your description
    image: '/images/timeline/first-date.jpg',
    location: {
      name: 'Restaurant Name',
      coordinates: { lat: 0.0, lng: 0.0 },
    },
  },
  // Add more timeline events...
]
```

### Step 3: Photo Gallery

**File**: `config/assets.config.ts`

```typescript
couple: {
  hero: '/images/couple/hero.jpg',       // ← Main photo
  bride: '/images/couple/bride.jpg',     // ← Bride photo
  groom: '/images/couple/groom.jpg',     // ← Groom photo
  together: '/images/couple/together.jpg', // ← Together photo
}
```

### Step 4: Video Messages (Optional)

**File**: `config/content.config.ts`

```typescript
videoMessages: [
  {
    id: '1',
    name: 'Mom',
    relationship: 'Mother',
    thumbnail: '/images/messages/mom-thumbnail.jpg',
    videoUrl: '/videos/messages/mom-message.mp4',
    message: 'A special message...',
    isLocked: false,
  },
  // Add more video messages...
]
```

### Step 5: Quiz Customization (Optional)

**File**: `config/quiz.config.ts`

Customize the Love Language Quiz or create your own quiz with custom questions and results.

### Step 6: Daily Reveals (Optional)

**File**: `config/daily-reveals.config.ts`

Configure 30 days of countdown content that unlocks each day leading to your wedding.

---

## 📸 Asset Management

### Photo Requirements

#### File Formats
- **Recommended**: JPG, WebP
- **Also supported**: PNG
- **Avoid**: BMP, TIFF (too large)

#### Image Sizes

| Type | Size | Ratio | Example |
|------|------|-------|---------|
| Hero/Banner | 1920x1080px | 16:9 | Main page banner |
| Couple Photos | 800x800px | 1:1 | Profile-style photos |
| Timeline | 1200x800px | 3:2 | Story photos |
| Gallery | Variable | Any | All memories |
| Thumbnails | 400x300px | 4:3 | Video previews |

#### File Size Limits
- **Photos**: Under 2MB each
- **Videos**: Under 50MB each
- **Total gallery**: Keep under 100MB for best performance

### Folder Structure

```
/public/
  /images/
    /couple/
      - hero.jpg          (1920x1080) Main banner
      - bride.jpg         (800x800)   Bride photo
      - groom.jpg         (800x800)   Groom photo
      - together.jpg      (800x800)   Together photo
    
    /timeline/
      - first-date.jpg    (1200x800)  Timeline event 1
      - proposal.jpg      (1200x800)  Timeline event 2
      - engagement.jpg    (1200x800)  Timeline event 3
      (add more...)
    
    /gallery/
      - photo-001.jpg
      - photo-002.jpg
      - photo-003.jpg
      (all your wedding/relationship photos)
    
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
      (video files)
  
  /audio/
    /songs/
      - our-song.mp3
      (background music)
```

### Adding Photos - Step by Step

1. **Prepare your photos**
   - Rename files descriptively (e.g., `first-date.jpg` not `IMG_1234.jpg`)
   - Resize to recommended dimensions
   - Compress using [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)

2. **Upload to correct folder**
   ```bash
   # Place in public/images/couple/
   hero.jpg
   bride.jpg
   groom.jpg
   ```

3. **Update config file**
   ```typescript
   // In assets.config.ts
   couple: {
     hero: '/images/couple/hero.jpg',
     bride: '/images/couple/bride.jpg',
     groom: '/images/couple/groom.jpg',
   }
   ```

4. **Test**
   - Restart dev server
   - Check images load on website
   - View on mobile for responsiveness

---

## 🎨 Advanced Customization

### Theme Colors

**File**: `config/website.config.ts`

```typescript
theme: {
  colors: {
    primary: '#FF69B4',    // ← Main color (pink)
    secondary: '#FFB6C1',  // ← Secondary (light pink)
    accent: '#C71585',     // ← Accent (dark pink)
  },
  style: 'romantic',       // ← romantic, celestial, modern, classic
}
```

### Feature Toggles

Enable/disable features:

```typescript
features: {
  countdown: true,        // Countdown timer
  gallery: true,          // Photo gallery
  timeline: true,         // Relationship timeline
  rsvp: true,            // RSVP form
  guestbook: true,       // Guest messages
  dailyReveals: true,    // Daily countdown reveals
  videoMessages: true,   // Family video messages
  quiz: true,            // Love language quiz
  dreamsBoard: true,     // Future dreams board
  notifications: true,   // Push notifications
}
```

### Wedding Schedule

Customize your ceremony timeline:

```typescript
schedule: [
  {
    time: '3:00 PM',
    event: 'Guest Arrival',
    description: 'Welcome drinks in the garden',
  },
  {
    time: '4:00 PM',
    event: 'Ceremony',
    description: 'Exchange of vows',
  },
  // Add more events...
]
```

### Admin Access

**⚠️ IMPORTANT**: Change default admin credentials!

```typescript
site: {
  admin: {
    username: 'your-username',    // ← Change this!
    password: 'secure-password',  // ← Change this!
  },
}
```

---

## 🔧 Troubleshooting

### Images Not Showing

**Problem**: Photos don't appear on website

**Solutions**:
1. ✅ Check file path is correct (case-sensitive!)
2. ✅ Ensure file is in `/public` folder
3. ✅ Verify file extension matches config (`.jpg` vs `.JPG`)
4. ✅ Restart development server
5. ✅ Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Configuration Changes Not Applying

**Problem**: Updates to config don't show

**Solutions**:
1. ✅ Restart development server (`npm run dev`)
2. ✅ Check for TypeScript errors in terminal
3. ✅ Verify config file syntax (check commas, brackets)
4. ✅ Clear browser cache
5. ✅ Check file is saved

### Wedding Date Issues

**Problem**: Countdown shows wrong time

**Solutions**:
1. ✅ Use correct format: `'YYYY-MM-DDTHH:mm:ss'`
2. ✅ Example: `'2025-06-15T16:00:00'` = June 15, 2025 at 4:00 PM
3. ✅ Check timezone settings
4. ✅ Verify system date is correct

### Videos Not Playing

**Problem**: Video messages won't play

**Solutions**:
1. ✅ Confirm video is MP4 format (H.264 codec)
2. ✅ Check file size (under 50MB)
3. ✅ Test video plays locally first
4. ✅ Check browser console for errors
5. ✅ Consider using video hosting service for large files

### Daily Reveals Not Unlocking

**Problem**: Reveals stay locked

**Solutions**:
1. ✅ Verify wedding date is set correctly
2. ✅ Check reveal `day` numbers (30, 29, 28...1)
3. ✅ Ensure array has 30 reveals
4. ✅ Check your computer date/time is correct
5. ✅ Restart server after config changes

### TypeScript Errors

**Problem**: Red underlines in config files

**Solutions**:
1. ✅ Check object structure matches types
2. ✅ Ensure all required fields are present
3. ✅ Verify date format: `new Date('YYYY-MM-DD')`
4. ✅ Check for missing commas
5. ✅ Review error message in terminal

---

## 📋 Pre-Launch Checklist

Before sharing your website with guests:

### Content
- [ ] All couple information updated
- [ ] Wedding date and time correct
- [ ] Venue address and coordinates accurate
- [ ] Timeline events complete
- [ ] All text content proofread

### Media
- [ ] All photos uploaded
- [ ] All photos optimized (under 2MB each)
- [ ] All videos uploaded
- [ ] Video thumbnails added
- [ ] Photos display correctly on mobile

### Features
- [ ] RSVP form tested
- [ ] Guest book tested
- [ ] Gallery loads properly
- [ ] Timeline displays correctly
- [ ] Video messages play
- [ ] Daily reveals unlock correctly
- [ ] Quiz works properly

### Settings
- [ ] Admin credentials changed
- [ ] Theme colors set
- [ ] Features enabled/disabled as desired
- [ ] Contact information updated
- [ ] Social media links (if using)

### Testing
- [ ] Tested on mobile phone
- [ ] Tested on tablet
- [ ] Tested on desktop
- [ ] Tested in different browsers
- [ ] All links work
- [ ] Images load quickly
- [ ] No console errors

### Deployment
- [ ] Environment variables set
- [ ] Firebase configured (if using)
- [ ] Domain name set up
- [ ] SSL certificate active
- [ ] Analytics configured (optional)

---

## 🎓 Learning Resources

### Editing Config Files
- Files use TypeScript syntax
- Arrays use `[...]` brackets
- Objects use `{...}` braces
- Strings use `'...'` quotes
- Don't forget commas between items!

### Example Structure
```typescript
// This is a comment
property: 'value',              // String
number: 42,                     // Number
enabled: true,                  // Boolean
date: new Date('2025-06-15'),   // Date
array: ['item1', 'item2'],      // Array
object: {                       // Object
  nested: 'value',
},
```

### Image Optimization Tools
- [TinyPNG](https://tinypng.com/) - Compress images
- [Squoosh](https://squoosh.app/) - Resize and compress
- [HandBrake](https://handbrake.fr/) - Compress videos
- [CloudConvert](https://cloudconvert.com/) - Convert formats

### Color Pickers
- [HTML Color Codes](https://htmlcolorcodes.com/)
- [Coolors](https://coolors.co/) - Color palette generator
- [Adobe Color](https://color.adobe.com/) - Color wheel

### Coordinate Finders
- [Google Maps](https://www.google.com/maps) - Right-click → Coordinates
- [LatLong.net](https://www.latlong.net/) - Address to coordinates

---

## 💡 Tips & Best Practices

### General Tips
1. **Start Simple**: Begin with basic info, add features gradually
2. **Back Up**: Keep copies of config files
3. **Test Early**: Check website frequently during setup
4. **Mobile First**: Always test on phone/tablet
5. **Ask for Help**: Have someone review before launch

### Photo Tips
1. Choose high-quality photos
2. Mix portrait and landscape orientations
3. Include variety (close-ups, wide shots, candid, posed)
4. Compress before uploading
5. Use consistent editing style

### Content Tips
1. Keep descriptions concise but meaningful
2. Proofread everything multiple times
3. Use emojis sparingly
4. Write from the heart
5. Include personal touches and inside jokes

### Performance Tips
1. Optimize all images
2. Limit total gallery size
3. Use video hosting for large files
4. Enable lazy loading (built-in)
5. Test loading speed regularly

### Privacy Tips
1. Consider photo permissions
2. Don't share private addresses publicly
3. Use strong admin password
4. Be mindful of guest privacy in photos
5. Decide who can access website

---

## 🎉 You're Ready!

Your wedding website is now fully configurable and ready to personalize!

### Next Steps:
1. Update `/config/website.config.ts` with your basic info
2. Add your photos to `/public/images/`
3. Customize your love story in `/config/content.config.ts`
4. Run `npm run dev` to see your changes
5. Share with guests!

### Need Help?
- Review `/config/README.md` for detailed documentation
- Check terminal for error messages
- Test with sample data first
- Make one change at a time

---

**Congratulations on your wedding! 🎊💒✨**

*Made with ❤️ for your special day*

