# Gallery Images Guide

This directory contains all photos for the photo gallery page.

## 📁 Directory Structure

```
gallery/
├── engagement/      # Engagement photos
├── couple/         # Couple photos and date pictures
├── family/         # Family photos
├── friends/        # Photos with friends
└── misc/          # Other memorable moments
```

## 📸 Adding New Photos

### Method 1: Direct File Copy (Easiest)
1. Copy your photos to the appropriate category folder
2. Use descriptive names (e.g., `beach-sunset.jpg`, `proposal-moment.jpg`)
3. **IMPORTANT**: If copying from iPhone, convert HEIC to JPG first!

### Method 2: Convert and Copy iPhone Photos
```bash
# Navigate to gallery folder
cd wedding-website/public/images/gallery

# Convert HEIC to JPG (for iPhone photos)
sips -s format jpeg your-photo.heic --out your-photo.jpg
```

## ⚙️ Update Gallery Data

After adding photos, update the gallery configuration in:
**`src/data/gallery-data.ts`**

Add a new entry for each photo:

```typescript
{
  id: '16',                                    // Unique ID (increment)
  src: '/images/gallery/engagement/photo1.jpg', // Path to your photo
  alt: 'Description of the photo',            // Alt text for accessibility
  caption: 'A memorable caption',              // Caption shown in gallery
  category: 'engagement',                      // Category: engagement, couple, family, friends, misc
  date: new Date('2024-01-15'),               // Date photo was taken
  width: 800,                                  // Original width (pixels)
  height: 600,                                 // Original height (pixels)
  blurDataURL: 'data:image/jpeg;base64,...'   // Optional: Placeholder blur
}
```

## 📏 Image Requirements

- **Format**: JPG, JPEG, PNG, or WebP (JPG recommended)
- **Size**: Maximum 2-3 MB per image (will be auto-optimized)
- **Resolution**: 1200-2400px on longest side recommended
- **Aspect Ratio**: Any (4:3, 16:9, 1:1, portrait all work)

## 🎨 Categories

- **engagement** - Proposal, engagement photos, ring shots
- **couple** - Date nights, trips, everyday moments together
- **family** - Photos with parents, siblings, extended family
- **friends** - Group photos, celebrations with friends
- **misc** - Wedding planning, pets, special memories

## 🔄 Quick Add Workflow

1. **Copy photos** to the appropriate folder
2. **Convert HEIC** if needed: `sips -s format jpeg input.heic --out output.jpg`
3. **Edit** `src/data/gallery-data.ts`
4. **Add new entries** following the format above
5. **Refresh** the browser - hot reload will show your photos!

## 💡 Tips

- Use descriptive filenames (no spaces, use hyphens)
- Keep original aspect ratios
- Photos will be automatically optimized by Next.js
- Landscape photos look best in most layouts
- Add meaningful captions - they tell your story!

## 🚀 Example: Adding 3 Photos

1. Copy photos to folders:
   - `engagement/proposal-moment.jpg`
   - `couple/beach-date.jpg`
   - `family/thanksgiving-2024.jpg`

2. Add to `gallery-data.ts`:
```typescript
{
  id: '16',
  src: '/images/gallery/engagement/proposal-moment.jpg',
  alt: 'The proposal moment',
  caption: 'When Lakshay asked the big question! 💍',
  category: 'engagement',
  date: new Date('2022-12-24'),
  width: 1600,
  height: 1200,
},
{
  id: '17',
  src: '/images/gallery/couple/beach-date.jpg',
  alt: 'Beach sunset date',
  caption: 'Watching the sunset at our favorite beach',
  category: 'couple',
  date: new Date('2024-06-15'),
  width: 1920,
  height: 1080,
},
{
  id: '18',
  src: '/images/gallery/family/thanksgiving-2024.jpg',
  alt: 'Family Thanksgiving dinner',
  caption: 'Grateful for our families coming together',
  category: 'family',
  date: new Date('2024-11-28'),
  width: 1800,
  height: 1200,
}
```

3. Save and refresh - done! ✨

