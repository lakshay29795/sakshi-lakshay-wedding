# ✅ Social URLs Now Centralized in Config!

## 🎯 Problem Solved

**Issue**: Instagram, Facebook, and social media URLs were hardcoded in multiple components  
**Solution**: All social URLs now configured in ONE place: `config/website.config.ts`

---

## ✅ What I Added to Config

### Updated `config/website.config.ts`:

```typescript
social: {
  // Handles (for display)
  instagram: '@janeandjohn2025',
  facebook: 'janeandjohnwedding',
  twitter: '@janeandjohn',
  hashtag: '#JaneAndJohn2025',
  
  // Full URLs (for links) ✨ NEW!
  instagramUrl: 'https://instagram.com/janeandjohn2025',
  facebookUrl: 'https://facebook.com/janeandjohnwedding',
  twitterUrl: 'https://twitter.com/janeandjohn',
}
```

---

## 🔧 Files Updated

### 1. **Gallery Page** (`src/app/gallery/page.tsx`)

**Before**:
```typescript
<a href="https://www.instagram.com/taashi.surbhi/followers/">
  Tag Us on Instagram
</a>

<a href="mailto:sarah.michael.wedding@example.com">
  Email Us Photos
</a>
```

**After**:
```typescript
<a href={websiteConfig.social.instagramUrl}>
  Tag Us on Instagram
</a>

<a href={`mailto:${websiteConfig.contact.email}?subject=Photo Submission`}>
  Email Us Photos
</a>
```

---

### 2. **Footer** (`src/components/layout/footer.tsx`)

**Before**:
```typescript
const socialLinks = [
  {
    href: 'https://instagram.com/sarahandmichael',  // ❌ Hardcoded
    label: 'Instagram',
    icon: Instagram,
  },
  // ...
];
```

**After**:
```typescript
// Inside component to access config
const socialLinks = [
  {
    href: websiteConfig.social.instagramUrl,  // ✅ From config
    label: 'Instagram',
    icon: Instagram,
  },
  {
    href: websiteConfig.social.facebookUrl,   // ✅ From config
    label: 'Facebook',
    icon: Facebook,
  },
  {
    href: `mailto:${websiteConfig.contact.email}`,  // ✅ From config
    label: 'Email',
    icon: Mail,
  },
];
```

---

## 📊 Summary of Changes

| Component | What Changed | Status |
|-----------|-------------|--------|
| **Config** | Added `instagramUrl`, `facebookUrl`, `twitterUrl` | ✅ |
| **Gallery Page** | Instagram link from config | ✅ |
| **Gallery Page** | Email link from config | ✅ |
| **Footer** | Instagram link from config | ✅ |
| **Footer** | Facebook link from config | ✅ |
| **Footer** | Email link from config | ✅ |

---

## 🎯 How It Works Now

### Single Source of Truth

```
Edit ONE place:
config/website.config.ts
    ↓
social: {
  instagramUrl: 'https://instagram.com/yourusername'
}
    ↓
Automatically updates:
  ✅ Footer social icons
  ✅ Gallery "Tag Us on Instagram" button
  ✅ Any other social links
```

---

## ✨ Benefits

### For You:
✅ **One place to edit** - Change URL in config only  
✅ **No hardcoded URLs** - All dynamic from config  
✅ **Easy to update** - Change social handles anytime  
✅ **Consistent links** - Same URL everywhere  

### For Template:
✅ **Configurable** - Each client sets their own  
✅ **Professional** - No leftover URLs  
✅ **Maintainable** - Single source of truth  
✅ **Flexible** - Easy to add new platforms  

### For Clients:
✅ **Simple setup** - Edit one config file  
✅ **Clear structure** - Obvious what to change  
✅ **Type-safe** - TypeScript prevents errors  
✅ **Fast deployment** - Update and restart  

---

## 🎨 How to Customize

### Update Social URLs

**Edit `config/website.config.ts`:**

```typescript
social: {
  // Display handles
  instagram: '@yourwedding',
  facebook: 'yourweddingpage',
  
  // Full URLs for links
  instagramUrl: 'https://instagram.com/yourwedding',      // ← Change this
  facebookUrl: 'https://facebook.com/yourweddingpage',    // ← Change this
  twitterUrl: 'https://twitter.com/yourwedding',           // ← Change this
  
  // Wedding hashtag
  hashtag: '#YourWedding2025',
}
```

---

## 🚀 Quick Test

### 1. Edit Config

```bash
# Open config
vim config/website.config.ts

# Update instagramUrl to your Instagram
instagramUrl: 'https://instagram.com/YOUR_USERNAME',
```

### 2. Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### 3. Check Links

Visit these pages and click social links:

- [ ] **Homepage Footer** - Instagram, Facebook, Email icons
- [ ] **Gallery Page** - "Tag Us on Instagram" button

All should open your configured URLs! ✅

---

## 🧪 What Links Are Now Dynamic

### Footer Social Icons:
- ✅ Instagram → Opens `websiteConfig.social.instagramUrl`
- ✅ Facebook → Opens `websiteConfig.social.facebookUrl`
- ✅ Email → Opens `mailto:${websiteConfig.contact.email}`

### Gallery Page:
- ✅ "Tag Us on Instagram" → Opens `websiteConfig.social.instagramUrl`
- ✅ "Email Us Photos" → Opens `mailto:${websiteConfig.contact.email}`

---

## 📝 TypeScript Safety

### Type-Safe Configuration

```typescript
// ✅ This works
websiteConfig.social.instagramUrl

// ❌ This fails at compile time
websiteConfig.social.instagramLink  // Error: property doesn't exist
```

**No runtime errors from typos!**

---

## 🔍 Where Social URLs Are Used

### Current Usage:
1. **Footer** (`src/components/layout/footer.tsx`)
   - Instagram icon link
   - Facebook icon link
   - Email icon link

2. **Gallery** (`src/app/gallery/page.tsx`)
   - "Tag Us on Instagram" button
   - "Email Us Photos" button

### Easy to Add More:
```typescript
// Any component can now use:
import { websiteConfig } from '@/config/website.config';

<a href={websiteConfig.social.instagramUrl}>
  Follow us!
</a>
```

---

## 💡 Pro Tips

### Tip 1: Use Instagram Web URLs

```typescript
// ✅ Good - Works on all devices
instagramUrl: 'https://instagram.com/username'

// ❌ Avoid - May not work on desktop
instagramUrl: 'instagram://user?username=...'
```

### Tip 2: Include Query Parameters

```typescript
// Open Instagram to specific tab
instagramUrl: 'https://instagram.com/username?tab=posts'

// Pre-fill email subject
email: 'hello@wedding.com?subject=RSVP'
```

### Tip 3: Add More Social Platforms

```typescript
social: {
  // Existing
  instagramUrl: 'https://instagram.com/...',
  facebookUrl: 'https://facebook.com/...',
  
  // Add new platforms
  tiktokUrl: 'https://tiktok.com/@yourwedding',
  youtubeUrl: 'https://youtube.com/@yourwedding',
  pinterestUrl: 'https://pinterest.com/yourwedding',
}
```

Then update Footer to include them!

---

## 🎊 Complete!

**All social media URLs are now centralized in config!**

### What's Configurable:
- ✅ Instagram URL
- ✅ Facebook URL
- ✅ Twitter URL
- ✅ Email address
- ✅ Social handles
- ✅ Wedding hashtag

### What to Do Next:

1. ✅ **Edit** `config/website.config.ts`
2. ✅ **Update** your Instagram URL
3. ✅ **Update** your Facebook URL
4. ✅ **Update** your contact email
5. ✅ **Restart** server
6. ✅ **Test** all social links

---

## 📊 Impact Summary

### Before:
- ❌ Instagram URL hardcoded in 2 places
- ❌ Facebook URL hardcoded in footer
- ❌ Email addresses hardcoded
- ❌ Had to find and replace manually

### After:
- ✅ All URLs in `websiteConfig.social`
- ✅ Edit once, updates everywhere
- ✅ Type-safe with TypeScript
- ✅ Perfect for templates

---

## 🔄 Easy Updates

### When You Change Social Media:

**Old Way** (❌):
1. Search entire codebase for old URL
2. Replace in gallery page
3. Replace in footer
4. Hope you didn't miss any
5. Test everything

**New Way** (✅):
1. Edit `config/website.config.ts`
2. Update `instagramUrl`
3. Restart server
4. Done! ✅

---

## 📚 Related Config

### Other Contact Info in Config:

```typescript
contact: {
  email: 'hello@janeandjohn.wedding',  // Used in footer & gallery
  phone: '+1 (555) 123-4567',           // Can be used anywhere
}
```

All contact information is centralized!

---

**🎉 Your wedding website now has fully configurable social media links! No more hardcoded URLs! 💒✨**

---

*Last Updated: December 11, 2025*  
*Files Changed: 3 (config + 2 components)*  
*Status: ✅ COMPLETE*  
*TypeScript Errors: None ✅*


