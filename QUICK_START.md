# 🎉 Wedding Website - Quick Start Guide

Your wedding website is now **fully configurable**! Everything can be customized through simple configuration files.

## ⚡ 5-Minute Setup

### 1. Open Configuration Files

Navigate to the `/config` folder:

```
/config/
  ├── website.config.ts       ← Start here!
  ├── content.config.ts
  ├── assets.config.ts
  └── README.md               ← Full documentation
```

### 2. Update Your Information

**File: `config/website.config.ts`**

```typescript
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
wedding: {
  date: '2025-06-15T16:00:00',      // ← Your wedding date
  venue: {
    name: 'Grand Ballroom',          // ← Venue name
    address: '123 Main St',          // ← Address
  },
}
```

### 3. Add Your Photos

Place photos in `/public/images/`:

```
/public/images/
  /couple/      ← Your couple photos
  /timeline/    ← Relationship story photos
  /gallery/     ← All wedding photos
```

### 4. Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

## 📋 What Can You Customize?

### ✅ Basic Information
- Couple names and photos
- Wedding date and time
- Venue details
- Contact information

### ✅ Content
- Your love story timeline
- Video messages from family
- Page text and descriptions
- Photo gallery

### ✅ Features
- Quiz questions and answers
- 30 days of daily reveals
- Wedding schedule
- Enable/disable features

### ✅ Design
- Theme colors
- Style (romantic, modern, classic)
- Layout options

### ✅ Media
- All image paths
- Video locations
- Background music

## 📚 Documentation

- **Quick Setup**: This file
- **Full Guide**: See `/config/README.md`
- **Complete Documentation**: See `CONFIGURATION_GUIDE.md`
- **Template**: See `/config/TEMPLATE.config.ts`

## 🎯 Configuration Files Explained

| File | What It Does |
|------|--------------|
| `website.config.ts` | Names, date, venue, settings |
| `content.config.ts` | Your story, messages, text |
| `assets.config.ts` | Photo and video paths |
| `quiz.config.ts` | Quiz questions (optional) |
| `daily-reveals.config.ts` | Daily countdown (optional) |

## 🚀 Next Steps

1. ✅ Update couple information
2. ✅ Set wedding date
3. ✅ Upload photos
4. ✅ Write your story
5. ✅ Test website
6. ✅ Deploy!

## 🆘 Need Help?

### Images Not Showing?
- Check file paths (case-sensitive!)
- Ensure files are in `/public/images/`
- Restart dev server

### Changes Not Appearing?
- Save all files
- Restart server: Stop (Ctrl+C) and run `npm run dev` again
- Clear browser cache

### TypeScript Errors?
- Check for missing commas
- Verify date format: `'YYYY-MM-DDTHH:mm:ss'`
- Review error message in terminal

## 📖 Full Documentation

For complete customization options, see:
- **`CONFIGURATION_GUIDE.md`** - Complete guide
- **`/config/README.md`** - Detailed config docs
- **`/config/TEMPLATE.config.ts`** - All options

## ✨ Features

Your website includes:
- ⏰ Live countdown timer
- 📸 Photo gallery
- 💕 Love story timeline
- 🎥 Video messages
- 📝 RSVP system
- 💬 Guest book
- 🎁 Daily reveals (30 days before wedding)
- 🎯 Love language quiz
- 📱 Mobile responsive
- 🔔 Push notifications

## 🎨 Customization Examples

### Change Theme Colors
```typescript
theme: {
  colors: {
    primary: '#FF69B4',    // Your color
    secondary: '#FFB6C1',
    accent: '#C71585',
  },
}
```

### Add Timeline Event
```typescript
timeline: [
  {
    id: '1',
    date: new Date('2020-01-15'),
    title: 'First Date',
    description: 'Our story...',
    image: '/images/timeline/first-date.jpg',
  },
]
```

### Enable/Disable Features
```typescript
features: {
  countdown: true,
  gallery: true,
  rsvp: true,
  quiz: false,      // Disable quiz
}
```

## 🔐 Important Security

**Change admin credentials!**

```typescript
site: {
  admin: {
    username: 'your-username',  // ← Change!
    password: 'secure-password', // ← Change!
  },
}
```

## 🎊 You're Ready!

Your customizable wedding website is all set! Update the config files, add your photos, and make it yours!

**Questions?** Check the full documentation in `CONFIGURATION_GUIDE.md`

---

**Congratulations on your wedding! 💒✨**

