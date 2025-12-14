# 🎨 Config-Based Architecture Guide

## Overview

The Valentine's showcase platform is now **100% config-driven**, meaning all content, images, colors, and features are controlled through configuration files. No hardcoded data in components!

---

## ✨ Why Config-Based?

### Benefits:
1. **Easy Customization** - Change content without touching code
2. **Reusability** - Same components, different data
3. **Scalability** - Add new themes easily
4. **Client-Friendly** - Non-developers can update content
5. **Consistency** - Single source of truth for all data

---

## 📁 File Structure

```
wedding-website/
└── src/
    └── config/
        └── themes/
            ├── classic-romance.config.ts  (Traditional theme)
            ├── modern-elegance.config.ts  (Contemporary theme)
            └── playful-love.config.ts     (Fun theme) ✅ Fully implemented!
```

---

## 🎯 Playful Love Theme - Complete Config

### What's Included:

#### 1. **Couple Information**
```typescript
couple: {
  name1: 'Jake',
  name2: 'Emma',
  tagline: 'Two Goofballs in Love 🤪❤️',
  photos: {
    hero: 'https://...',      // Main couple photo
    individual1: 'https://...', // His photo
    individual2: 'https://...', // Her photo
    together1: 'https://...',   // Fun photo 1
    together2: 'https://...',   // Fun photo 2
  }
}
```

#### 2. **Hero Section**
```typescript
hero: {
  greeting: 'Hey Babe! 💕',
  message: 'This is our totally awesome love story!',
  date: '2025-02-14T00:00:00',
  backgroundImage: 'https://...',
  confettiEnabled: true,
  animationStyle: 'bouncy',
}
```

#### 3. **Timeline Events** (8 events)
```typescript
timeline: [
  {
    date: '2023-04-01',
    title: 'We Met! 🎉',
    description: 'You laughed at my terrible joke...',
    emoji: '😂',
    image: 'https://...',
    funFact: 'It was April Fools Day!',
    mood: 'excited',
  },
  // ... 7 more events
]
```

#### 4. **Inside Jokes** (5 jokes)
```typescript
insideJokes: [
  {
    joke: 'The Chicken Incident',
    explanation: 'We don\'t talk about the petting zoo...',
    date: '2023-07-04',
    stillFunny: true,
  },
  // ... 4 more jokes
]
```

#### 5. **Bucket List** (10 items)
```typescript
bucketList: [
  {
    item: 'Visit all Disney parks 🏰',
    completed: false,
    priority: 'high',
    category: 'travel',
  },
  // ... 9 more items
]
```

#### 6. **Stats Dashboard** (6 stats)
```typescript
stats: [
  {
    label: 'Days Together',
    value: '623',
    emoji: '📅',
    color: '#FF6B6B',
  },
  // ... 5 more stats
]
```

#### 7. **Photo Gallery**
```typescript
gallery: {
  title: 'Our Awesome Moments! 📸',
  categories: [
    {
      name: 'Silly Faces',
      emoji: '🤪',
      photos: [
        {
          url: 'https://...',
          caption: 'When we tried to be serious',
          date: '2023-05-10',
        },
        // ... more photos
      ],
    },
    // ... more categories
  ],
}
```

#### 8. **Love Message**
```typescript
message: {
  title: 'A Message for My Favorite Weirdo',
  emoji: '💌',
  paragraphs: [
    'Yo Emma! 👋',
    'Remember when we first met...',
    // ... all paragraphs
  ],
}
```

#### 9. **Music Playlist**
```typescript
playlist: {
  title: 'Our Jam Sessions 🎵',
  songs: [
    {
      title: 'Shut Up and Dance',
      artist: 'WALK THE MOON',
      reason: 'Our unofficial anthem',
      emoji: '💃',
      spotifyUrl: 'https://...',
    },
    // ... more songs
  ],
}
```

#### 10. **Interactive Games**
```typescript
games: {
  fortuneTeller: {
    enabled: true,
    options: [
      'Date night at that new taco place!',
      'Movie marathon with snacks!',
      // ... 6 more options
    ],
  },
  bingo: {
    enabled: true,
    squares: ['First Kiss 💋', 'Met the Parents 👨‍👩‍👧', ...],
  },
  quiz: {
    enabled: true,
    questions: [...],
  },
}
```

---

## 🖼️ Image URLs - All from Unsplash

### Why Unsplash?
- ✅ **Free** high-quality photos
- ✅ **No attribution required** for online use
- ✅ **CDN-hosted** (fast loading)
- ✅ **Optimized** URLs with parameters

### Image URL Format:
```
https://images.unsplash.com/photo-[ID]?w=[width]&q=[quality]
```

### Current Images Used:

**Couple Photos:**
- Hero: `photo-1516589178581-6cd7833ae3b2` (Fun couple)
- Together 1: `photo-1522673607200-164d1b6ce486` (Playful)
- Together 2: `photo-1518568814500-bf0f8d125f46` (Happy moment)

**Timeline Events:**
- Meeting: `photo-1511285560929-80b456fea0bc`
- First Date: `photo-1414235077428-338989a2e8c0` (Restaurant)
- Official: `photo-1522673607200-164d1b6ce486`
- Pizza: `photo-1513104890138-7c749659a591`
- Halloween: `photo-1509557965875-b88c97052f0e`
- Onesies: `photo-1576090396341-245289991acb`
- Valentine's: `photo-1518568814500-bf0f8d125f46`
- Road Trip: `photo-1469854523086-cc02fe5d8800`

---

## 🎨 How to Customize for a Real Client

### Step 1: Copy the Config
```bash
cp src/config/themes/playful-love.config.ts src/config/themes/client-name.config.ts
```

### Step 2: Update Couple Info
```typescript
couple: {
  name1: 'John',          // Client's name
  name2: 'Sarah',         // Partner's name
  tagline: 'Their tagline here',
  photos: {
    hero: 'CLIENT_PHOTO_URL',
    // ... client's actual photos
  }
}
```

### Step 3: Update Timeline
```typescript
timeline: [
  {
    date: 'ACTUAL_DATE',
    title: 'Their actual story',
    description: 'Their words',
    image: 'THEIR_PHOTO',
    // ...
  }
]
```

### Step 4: Personalize Everything
- Replace all dummy content with client's real information
- Update image URLs with their photos
- Customize inside jokes, bucket list, etc.
- Adjust colors if requested

### Step 5: Create Demo Page
```typescript
// src/app/demo/client-name/page.tsx
import { clientNameTheme } from '@/config/themes/client-name.config';
```

---

## 🔄 How to Add a New Theme

### 1. Create Config File
```bash
touch src/config/themes/new-theme.config.ts
```

### 2. Copy Structure
Use `playful-love.config.ts` as template - it has ALL the fields!

### 3. Customize
```typescript
export const newTheme = {
  name: 'New Theme Name',
  slug: 'new-theme',
  description: 'Description here',
  
  colors: {
    primary: '#YOUR_COLOR',
    // ...
  },
  
  demoContent: {
    // Copy all sections from playful-love
    // Update with new content
  },
}
```

### 4. Create Demo Page
```bash
mkdir src/app/demo/new-theme
touch src/app/demo/new-theme/page.tsx
```

Copy `playful-love/page.tsx` and update imports.

### 5. Add to Landing Page
In `src/app/page.tsx`, add a new theme card.

---

## 📝 Config Field Reference

### Required Fields:

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `name` | string | Theme display name | "Playful Love" |
| `slug` | string | URL-friendly name | "playful-love" |
| `description` | string | Short description | "Fun, energetic design" |
| `colors` | object | Color scheme | `{ primary: '#FF1744' }` |
| `typography` | object | Font settings | `{ heading: '"Fredoka One"' }` |
| `features` | array | Feature list | `['Feature 1', ...]` |
| `demoContent` | object | All content data | See below |

### Demo Content Structure:

```typescript
demoContent: {
  couple: {
    name1: string,
    name2: string,
    tagline: string,
    photos: {
      hero: string (URL),
      individual1: string (URL),
      individual2: string (URL),
      together1: string (URL),
      together2: string (URL),
    }
  },
  
  hero: {
    greeting: string,
    message: string,
    subtext?: string,
    date: string (ISO format),
    backgroundImage?: string (URL),
    confettiEnabled?: boolean,
    animationStyle?: string,
  },
  
  timeline: Array<{
    date: string (ISO format),
    title: string,
    description: string,
    emoji: string,
    image: string (URL),
    funFact?: string,
    mood?: string,
  }>,
  
  insideJokes: Array<{
    joke: string,
    explanation: string,
    date: string,
    stillFunny: boolean,
  }>,
  
  bucketList: Array<{
    item: string,
    completed: boolean,
    completedDate?: string,
    priority?: 'high' | 'medium' | 'low',
    category?: string,
  }>,
  
  gallery: {
    title: string,
    description: string,
    categories: Array<{
      name: string,
      emoji: string,
      photos: Array<{
        url: string,
        caption: string,
        date: string,
      }>,
    }>,
  },
  
  stats: Array<{
    label: string,
    value: string,
    emoji: string,
    color: string (hex),
  }>,
  
  message: {
    title: string,
    emoji: string,
    paragraphs: string[],
    backgroundImage?: string (URL),
  },
  
  playlist?: {
    title: string,
    description: string,
    songs: Array<{
      title: string,
      artist: string,
      reason: string,
      emoji: string,
      spotifyUrl?: string,
    }>,
  },
  
  games?: {
    fortuneTeller: {
      enabled: boolean,
      options: string[],
    },
    bingo: {
      enabled: boolean,
      squares: string[],
    },
    quiz: {
      enabled: boolean,
      questions: Array<{
        question: string,
        options: string[],
        correctAnswer: number,
      }>,
    },
  },
  
  footer: {
    tagline: string,
    links: Array<{ label: string, url: string }>,
    socialMedia?: {
      instagram?: string,
      tiktok?: string,
      facebook?: string,
    },
  },
}
```

---

## 🚀 Quick Client Workflow

### For Each New Client:

```bash
# 1. Copy template
cp src/config/themes/playful-love.config.ts src/config/themes/john-sarah.config.ts

# 2. Create demo page folder
mkdir src/app/demo/john-sarah
cp src/app/demo/playful-love/page.tsx src/app/demo/john-sarah/page.tsx

# 3. Update imports in page.tsx
# Change: import { playfulLoveTheme } from '@/config/themes/playful-love.config';
# To: import { johnSarahTheme } from '@/config/themes/john-sarah.config';

# 4. Update config with client data
# Edit john-sarah.config.ts with their information

# 5. Test
npm run dev
# Visit: http://localhost:3000/demo/john-sarah

# 6. Deploy when approved
# Deploy to client's subdomain or custom domain
```

---

## 💡 Pro Tips

### 1. **Image Optimization**
```typescript
// Use Unsplash parameters for optimization
const imageUrl = 'https://images.unsplash.com/photo-ID';

// Add parameters:
`${imageUrl}?w=800&q=80&fit=crop&crop=faces`
//              ↑     ↑    ↑        ↑
//           width quality fit  crop-area
```

### 2. **Color Consistency**
Keep all colors in the `colors` object and reference them:
```typescript
style={{ color: colors.primary }}
```

### 3. **Type Safety**
Export theme type for better TypeScript support:
```typescript
export type PlayfulLoveTheme = typeof playfulLoveTheme;
```

### 4. **Validation**
Add validation for required fields:
```typescript
const validateConfig = (config: any) => {
  if (!config.demoContent.couple.name1) {
    throw new Error('Couple name1 is required');
  }
  // ... more validation
};
```

### 5. **Default Values**
Provide defaults for optional fields:
```typescript
const confettiEnabled = demoContent.hero.confettiEnabled ?? true;
```

---

## 🔍 Troubleshooting

### Issue: Images Not Loading
**Solution:** Check URL format and make sure it's accessible
```typescript
// Test URL in browser first
// Make sure it returns an image
```

### Issue: Config Changes Not Showing
**Solution:** Restart dev server
```bash
# Stop server (Ctrl+C)
rm -rf .next
npm run dev
```

### Issue: TypeScript Errors
**Solution:** Make sure all required fields are present
```typescript
// Check against the type definition
// All fields in PlayfulLoveTheme are required unless marked optional (?)
```

---

## 📊 Current Status

### ✅ Playful Love Theme
- **Config**: 100% complete with dummy data
- **Demo Page**: Fully config-driven
- **Images**: All using Unsplash URLs
- **Tested**: Yes
- **Production Ready**: Yes!

### ⏳ Classic Romance Theme
- **Status**: Basic config exists
- **TODO**: Expand like playful-love with all sections

### ⏳ Modern Elegance Theme
- **Status**: Basic config exists
- **TODO**: Expand like playful-love with all sections

---

## 🎯 Next Steps

1. **Expand Other Themes**: Apply same structure to Classic and Modern themes
2. **Add Validation**: Create schema validation for configs
3. **Create Generator**: Build tool to generate configs from forms
4. **Documentation**: Add inline comments in config files
5. **Testing**: Unit tests for config structure

---

## 🎉 Summary

You now have a **fully config-based Valentine's website platform** where:
- ✅ All content is in config files
- ✅ No hardcoded data in components
- ✅ Easy to customize for clients
- ✅ Images from Unsplash (free, high-quality)
- ✅ Type-safe with TypeScript
- ✅ Scalable and maintainable

**Ready to create unlimited custom sites!** 🚀💝

---

*Last Updated: December 13, 2025*
*Status: Playful Love Theme - 100% Config-Based ✅*

