# 🎉 Customer Setup Guide - Wedding Website Template

Welcome! You've received a beautiful, professional wedding website that's **ready to customize**.

## 🚀 Getting Started

### What You'll Need
- ⏰ **Time**: 1-2 hours for full customization
- 📸 **Photos**: Your wedding and relationship photos
- ✍️ **Content**: Your love story and details
- 💻 **Computer**: No coding knowledge required!

### Your Website Includes
- ✅ Beautiful home page with countdown
- ✅ Photo gallery
- ✅ Your love story timeline
- ✅ RSVP system
- ✅ Guest book
- ✅ Video messages from family
- ✅ Daily reveals (30 days before wedding)
- ✅ Love language quiz
- ✅ Mobile app (PWA)
- ✅ Push notifications

## 📝 Step-by-Step Setup

### Step 1: Update Your Information (10 minutes)

Open the file: **`config/website.config.ts`**

Change these lines:

```typescript
// CHANGE THESE:
couple: {
  bride: {
    name: 'YourName',              // ← Put bride's first name here
    fullName: 'Full Legal Name',   // ← Full name
    photo: '/images/couple/bride.jpg',
  },
  groom: {
    name: 'YourName',              // ← Put groom's first name here
    fullName: 'Full Legal Name',   // ← Full name
    photo: '/images/couple/groom.jpg',
  },
},

// CHANGE YOUR WEDDING DATE:
wedding: {
  date: '2025-06-15T16:00:00',    // ← Format: YYYY-MM-DDTHH:mm:ss
  
  // CHANGE YOUR VENUE:
  venue: {
    name: 'Your Venue Name',       // ← Venue name
    address: 'Full Address',       // ← Complete address
    coordinates: {
      lat: 40.7128,                // ← Get from Google Maps
      lng: -74.0060,
    },
  },
}
```

**How to get coordinates:**
1. Go to [Google Maps](https://www.google.com/maps)
2. Find your venue
3. Right-click on the location
4. Click the coordinates (they'll copy automatically)
5. Paste into the config file

### Step 2: Add Your Photos (30 minutes)

#### Photo Checklist

Create these folders in `public/images/`:

```
public/images/
  ├── couple/
  │   ├── hero.jpg        ← Main photo (both of you)
  │   ├── bride.jpg       ← Bride photo
  │   ├── groom.jpg       ← Groom photo
  │   └── together.jpg    ← Another couple photo
  │
  ├── timeline/
  │   ├── first-date.jpg      ← Your first date
  │   ├── proposal.jpg        ← Proposal photo
  │   ├── engagement.jpg      ← Engagement
  │   └── ... (add more!)
  │
  └── gallery/
      ├── photo-001.jpg
      ├── photo-002.jpg
      └── ... (all your photos!)
```

#### Photo Requirements

| Type | Recommended Size | Format |
|------|-----------------|--------|
| Hero/Main | 1920x1080px | JPG |
| Couple Photos | 800x800px | JPG |
| Timeline | 1200x800px | JPG |
| Gallery | Any size | JPG |

**💡 Tip**: Use [TinyPNG.com](https://tinypng.com) to compress photos before uploading!

### Step 3: Write Your Love Story (30 minutes)

Open the file: **`config/content.config.ts`**

Find the `timeline` section and add your events:

```typescript
timeline: [
  {
    id: '1',
    date: new Date('2020-01-15'),         // ← Date of event
    title: 'First Date',                   // ← Event name
    description: 'Write your story here... Tell guests about this special moment!',
    image: '/images/timeline/first-date.jpg',
    location: {
      name: 'Restaurant Name',
      coordinates: { lat: 0.0, lng: 0.0 },
    },
  },
  {
    id: '2',
    date: new Date('2021-12-24'),
    title: 'The Proposal',
    description: 'Write about your proposal...',
    image: '/images/timeline/proposal.jpg',
    location: {
      name: 'Proposal Location',
      coordinates: { lat: 0.0, lng: 0.0 },
    },
  },
  // Add more events!
]
```

**Story Writing Tips:**
- Be personal and genuine
- Include funny moments
- Mention specific details
- Keep it concise but meaningful
- Use emojis if you like! 💕

### Step 4: Customize Wedding Schedule (10 minutes)

In **`config/website.config.ts`**, update the schedule:

```typescript
schedule: [
  {
    time: '3:00 PM',
    event: 'Guest Arrival',
    description: 'Welcome drinks',
  },
  {
    time: '4:00 PM',
    event: 'Ceremony',
    description: 'Exchange of vows',
  },
  // Add all your events...
]
```

### Step 5: Optional Features

#### Video Messages (Optional)

If you want family video messages:

1. **Record videos** (1-2 minutes each)
2. **Save as MP4** files
3. **Place in**: `public/videos/messages/`
4. **Take a photo** for thumbnail
5. **Update** `config/content.config.ts`:

```typescript
videoMessages: [
  {
    id: '1',
    name: 'Mom',
    relationship: 'Mother',
    thumbnail: '/images/messages/mom-thumbnail.jpg',
    videoUrl: '/videos/messages/mom-message.mp4',
    message: 'A special message from mom',
  },
]
```

#### Daily Reveals (Optional)

30 days of countdown content! Edit in **`config/daily-reveals.config.ts`**

#### Quiz (Optional)

Customize the love language quiz in **`config/quiz.config.ts`**

### Step 6: Choose Your Theme (5 minutes)

In **`config/website.config.ts`**, pick colors:

```typescript
theme: {
  colors: {
    primary: '#FF69B4',    // Main color
    secondary: '#FFB6C1',  // Secondary color
    accent: '#C71585',     // Accent color
  },
  style: 'romantic',       // Options: romantic, celestial, modern, classic
}
```

**Color Picker**: Use [HTML Color Codes](https://htmlcolorcodes.com) to choose colors!

### Step 7: Security Settings

**⚠️ IMPORTANT**: Change admin password!

In **`config/website.config.ts`**:

```typescript
site: {
  admin: {
    username: 'your-username',     // ← Change this!
    password: 'secure-password',   // ← Change this!
  },
}
```

## 🎨 Customization Options

### Enable/Disable Features

Don't want certain features? Turn them off!

```typescript
features: {
  countdown: true,        // Countdown timer
  gallery: true,          // Photo gallery
  timeline: true,         // Your story
  rsvp: true,            // RSVP form
  guestbook: true,       // Guest messages
  dailyReveals: false,   // Turn off daily reveals
  videoMessages: false,  // Turn off videos
  quiz: false,           // Turn off quiz
}
```

### Theme Styles

Choose from 4 beautiful themes:

1. **Romantic** (default) - Soft pinks, elegant, fairy-tale
2. **Celestial** - Blues, purples, starry night
3. **Modern** - Clean, minimalist, contemporary
4. **Classic** - Traditional, timeless, elegant

### Wedding Details

Update all your information:
- Contact email
- Phone number
- Social media
- Wedding hashtag

## 📱 Testing Your Website

### Test Locally

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Visit: `http://localhost:3000`

### Test on Mobile

1. Open website on your phone
2. Check all photos load
3. Test RSVP form
4. Try guest book
5. View on different screen sizes

## 🚀 Publishing Your Website

### Option 1: Vercel (Recommended - Free!)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your project
4. Deploy!

### Option 2: Netlify (Also Free!)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your `build` folder
3. Done!

### Custom Domain

Both Vercel and Netlify offer free custom domains:
- `yourwedding.vercel.app` (free)
- Buy custom domain: `www.yourwedding.com`

## ✅ Pre-Launch Checklist

Before sharing with guests:

### Information
- [ ] Couple names are correct
- [ ] Wedding date is correct
- [ ] Venue address is accurate
- [ ] Contact info updated
- [ ] Schedule is complete

### Content
- [ ] Love story written
- [ ] All text proofread
- [ ] Timeline events complete
- [ ] Video messages added (if using)

### Photos
- [ ] All couple photos uploaded
- [ ] Timeline photos added
- [ ] Gallery photos uploaded
- [ ] Photos compressed (<2MB each)
- [ ] All photos display correctly

### Settings
- [ ] Admin password changed
- [ ] Theme colors chosen
- [ ] Features enabled/disabled
- [ ] Contact email set

### Testing
- [ ] Tested on phone
- [ ] Tested on tablet
- [ ] Tested on desktop
- [ ] RSVP form works
- [ ] Guest book works
- [ ] All links work
- [ ] Photos load fast

## 🆘 Common Issues & Solutions

### "My photos aren't showing"
✅ Check file names (case-sensitive!)
✅ Make sure photos are in `/public/images/`
✅ Verify paths in config match file names

### "Changes aren't appearing"
✅ Save all files
✅ Restart server (stop with Ctrl+C, run `npm run dev` again)
✅ Clear browser cache (Ctrl+Shift+R)

### "I get an error"
✅ Check for typos in config files
✅ Make sure all commas are in place
✅ Verify date format: `'YYYY-MM-DDTHH:mm:ss'`
✅ Look at error message in terminal

### "How do I get coordinates?"
1. Open [Google Maps](https://www.google.com/maps)
2. Search for your location
3. Right-click on the map
4. Click the coordinates (they copy automatically)
5. Paste in config: `lat: 40.7128, lng: -74.0060`

## 💡 Pro Tips

1. **Start Simple**: Add basic info first, then add features
2. **Compress Photos**: Use [TinyPNG.com](https://tinypng.com) before uploading
3. **Mobile First**: Always check on phone
4. **Backup**: Save copies of your config files
5. **Test RSVPs**: Send test RSVPs to yourself
6. **Share Early**: Get feedback from friends/family
7. **Update Often**: Add photos as you take them

## 📞 Need Help?

### Documentation
- 📖 **Quick Start**: `QUICK_START.md`
- 📚 **Complete Guide**: `CONFIGURATION_GUIDE.md`
- 🔧 **Config Details**: `config/README.md`

### Configuration Files
- `config/website.config.ts` - Main settings
- `config/content.config.ts` - Your story and text
- `config/assets.config.ts` - Photo/video paths
- `config/quiz.config.ts` - Quiz questions
- `config/daily-reveals.config.ts` - Daily reveals

### Common Questions

**Q: Do I need coding knowledge?**
A: No! Just edit text files with your information.

**Q: How long does setup take?**
A: 1-2 hours for complete customization.

**Q: Can I change things later?**
A: Yes! Update config files anytime and redeploy.

**Q: What if I don't want certain features?**
A: Turn them off in the features section!

**Q: Can I add more photos later?**
A: Absolutely! Just add to the gallery folder.

## 🎉 You're Ready!

Your wedding website is waiting for your personal touch!

### Quick Recap:
1. ✏️ Update couple info
2. 📸 Add photos
3. 💕 Write your story
4. 🎨 Choose theme
5. 🔐 Change password
6. 🧪 Test everything
7. 🚀 Deploy!

### What You'll Have:
- Professional wedding website
- RSVP system
- Photo gallery
- Guest book
- Mobile app
- And so much more!

---

**Congratulations on your wedding! 💒✨**

**Questions?** Check the full documentation in `CONFIGURATION_GUIDE.md`

*Made with ❤️ for your special day*

