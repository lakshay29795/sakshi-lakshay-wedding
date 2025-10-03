# 📸 Gallery Photos - Quick Start Guide

## 🎯 Simple 3-Step Process

### Step 1: Add Your Photos

Copy your photos to the gallery folder:

```
wedding-website/public/images/gallery/
├── engagement/     ← Proposal, engagement session photos
├── couple/        ← Date nights, trips, everyday moments
├── family/        ← Family gatherings, holiday photos
├── friends/       ← Photos with friends, group shots
└── misc/         ← Wedding planning, pets, other memories
```

**If photos are from iPhone (HEIC format):**
```bash
cd wedding-website/public/images/gallery
sips -s format jpeg your-photo.heic --out your-photo.jpg
```

### Step 2: Update Gallery Data

Edit: `src/data/gallery-data.ts`

Add each new photo to the `galleryPhotos` array:

```typescript
{
  id: '16',                                      // ← Increment this number
  src: '/images/gallery/couple/beach-date.jpg',  // ← Path to your photo
  alt: 'Sunset at the beach',                    // ← Image description
  caption: 'Perfect evening by the ocean 🌅',    // ← Caption shown in gallery
  category: 'couple',                            // ← Must match folder name
  date: new Date('2024-06-15'),                  // ← When photo was taken
  width: 1920,                                   // ← Image width in pixels
  height: 1080,                                  // ← Image height in pixels
},
```

### Step 3: Save & Refresh

- Save the file
- Refresh your browser
- Your photo appears in the gallery! ✨

---

## 🚀 Quick Add Script (Optional)

Use the helper script to add photos faster:

```bash
# From wedding-website directory
./scripts/add-gallery-photo.sh ~/Desktop/photo.jpg couple "Beach date night" 2024-06-15
```

This will:
1. ✓ Convert to JPG if needed
2. ✓ Copy to the right folder
3. ✓ Show you the code to add

---

## 📋 Example: Adding Your First Photo

Let's say you have a photo `IMG_1234.jpg` on your Desktop and it's from your engagement:

**1. Copy the photo:**
```bash
cp ~/Desktop/IMG_1234.jpg wedding-website/public/images/gallery/engagement/proposal-moment.jpg
```

**2. Get image size:**
```bash
sips -g pixelWidth -g pixelHeight wedding-website/public/images/gallery/engagement/proposal-moment.jpg
```
Output: `pixelWidth: 1600` and `pixelHeight: 1200`

**3. Add to `src/data/gallery-data.ts`:**
```typescript
// Find the last photo entry (currently id: '15')
// Add after it:
{
  id: '16',
  src: '/images/gallery/engagement/proposal-moment.jpg',
  alt: 'The proposal moment',
  caption: 'When Lakshay asked the big question! 💍',
  category: 'engagement',
  date: new Date('2022-12-24'),
  width: 1600,
  height: 1200,
  blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
},
```

**4. Save and refresh browser!**

---

## 💡 Pro Tips

1. **Organize by category** - Makes it easier to find photos later
2. **Use descriptive filenames** - `beach-sunset.jpg` not `IMG_1234.jpg`
3. **Keep originals** - Store originals elsewhere, these get optimized
4. **Add captions** - They tell your love story!
5. **Check image sizes** - Use `sips -g pixelWidth -g pixelHeight photo.jpg`
6. **Batch convert HEIC** - See the timeline conversion example we just did

---

## 🔍 Finding Image Dimensions

**Option 1: Using Terminal**
```bash
sips -g pixelWidth -g pixelHeight your-photo.jpg
```

**Option 2: Using Preview (Mac)**
1. Open image in Preview
2. Tools → Adjust Size...
3. Note the Width and Height

**Option 3: Right-click → Get Info**
Look for "Dimensions" in the file info

---

## 🎨 Categories Explained

| Category | What Goes Here | Examples |
|----------|---------------|----------|
| **engagement** | Proposal, engagement photos, ring shots | Proposal moment, engagement session, ring closeups |
| **couple** | Just the two of you | Date nights, trips, everyday moments |
| **family** | Family gatherings | Holidays, meeting families, family dinners |
| **friends** | Group photos | Friend hangouts, bachelor/bachelorette parties |
| **misc** | Everything else | Pets, wedding planning, venue visits, random fun |

---

## ❓ Common Issues

### "My iPhone photos won't show"
→ Convert HEIC to JPG first (see Step 1)

### "Image is rotated wrong"
→ iPhone photos may have rotation data. The browser will auto-correct this.

### "Image is too large"
→ Next.js automatically optimizes images. Files up to 3MB are fine.

### "I added the photo but it's not showing"
→ Check:
1. File path is correct in `gallery-data.ts`
2. File actually exists in the folder
3. No typos in filename
4. Browser has been refreshed

---

## 📞 Need Help?

See the detailed README in `public/images/gallery/README.md`

Happy photo adding! 📸✨

