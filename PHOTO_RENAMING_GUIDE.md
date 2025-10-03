# 📸 Photo Renaming Guide

I've analyzed your 39 photos and created an organized naming system. However, since I cannot visually see the actual content of the images, here's my recommendation:

## 🎯 Current Photos Analysis

Based on filenames, your photos are from:

### 📅 **2018** (Early Relationship)
- `IMG_20180615_235254.jpg` - June 2018
- `first-meeting.jpg` - Your first meeting

### 📅 **2023** (Recent Moments)
- `IMG_20231012_014643.jpg` - October 2023
- `IMG_20231208_235842.jpg` - December 2023

### 📅 **2024** (Latest Photos)
- `IMG_20240209_145802__01.jpg` - Valentine's Day area (Feb 9)
- `IMG_20240209_155903.jpg` - Valentine's Day
- `IMG_20240210_165059.jpg` - Post-Valentine's
- `IMG_20240224_175955.jpg` - Late February
- `IMG_20240422_130527.jpg` - Spring (April)
- `IMG_20240830_145734.jpg` - Late Summer (Aug)
- `IMG_20240901_133908-135521.jpg` - Labor Day weekend (4 photos)

### 📱 **Phone Gallery Exports**
- Various numbered files: `1000*.jpg`, `11824.jpg`, `6997.jpg`
- Various IMG files: `IMG_####.jpg` series

---

## 💡 **Recommended Naming Convention**

I suggest using descriptive names that tell your love story:

### **Format**: `YYYY-MM-category-description.jpg`

**Examples**:
```
2018-03-first-meeting-coffee-shop.jpg
2018-06-first-date-park.jpg
2019-02-first-valentines.jpg
2020-08-moved-in-together.jpg
2022-12-proposal-moment.jpg
2023-10-date-night.jpg
2024-02-valentines-celebration.jpg
2024-09-labor-day-weekend.jpg
```

---

## 🚀 **How to Rename Your Photos**

### **Option 1: Manual Renaming (Recommended)**

1. Open `public/images/gallery/` folder
2. Look at each photo
3. Rename based on what it shows:
   - First dates
   - Special occasions
   - Trips/vacations
   - Candid moments
   - Family gatherings
   - Celebrations

### **Option 2: Automated Basic Renaming**

Run the organize script I created:
```bash
cd wedding-website
./scripts/organize-gallery-photos.sh
```

This will rename to chronological pattern:
- `2024-02-09-moment-001.jpg`
- `2024-02-09-moment-002.jpg`
- etc.

Then manually update to descriptive names.

---

## 📝 **After Renaming**

Once you've renamed the photos, regenerate the gallery data:

```bash
cd wedding-website
./scripts/generate-gallery-data.sh
```

This will update `src/data/gallery-data.ts` with the new filenames.

---

## 💡 **Pro Tips**

1. **Keep dates in filename** - Makes sorting easy
2. **Use descriptive words** - "proposal", "vacation", "family-dinner"
3. **Be consistent** - Use same format for all
4. **Lowercase with hyphens** - `first-date.jpg` not `First Date.jpg`
5. **No spaces** - Use hyphens instead

---

## 🎨 **Suggested Categories**

Organize by event type:
- `first-meeting` / `first-date`
- `date-night` / `dinner-date`
- `vacation` / `trip` / `beach`
- `celebration` / `party`
- `family` / `friends`
- `proposal` / `engagement`
- `candid` / `selfie`
- `special-occasion`

---

## 📊 **Current Photo Breakdown**

- **Total**: 39 photos
- **With dates**: ~15 (from filename timestamps)
- **Generic names**: ~24 (need descriptive names)

Would you like me to:
1. Run the auto-organize script?
2. Create a specific naming template for your photos?
3. Help you manually rename them with better descriptions?

