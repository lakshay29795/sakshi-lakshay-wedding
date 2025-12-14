# 🔍 Debug Guide - Clickable Cards Not Working

## Current Issue
Cards in "Cool Stuff Included!" section are not opening modals when clicked.

## 🔧 Debugging Steps

### Step 1: Restart Everything
```bash
cd /Users/ltanwar/repos/planning-proj/wedding-website

# Stop the server (Ctrl+C)

# Clear everything
rm -rf .next
rm -rf node_modules/.cache

# Restart
npm run dev
```

### Step 2: Open Browser Console
1. Navigate to `http://localhost:3000/demo/playful-love`
2. Open Developer Tools (F12 or Cmd+Option+I on Mac)
3. Go to Console tab
4. Scroll to "Cool Stuff Included!" section
5. Click any feature card
6. Check console for:
   - `Feature clicked: [object]` - This means onClick is working
   - Any error messages
   - Any warnings

### Step 3: Check Debug Indicator
When you click a card, you should see:
- **Red box in top-right corner** with text "Debug: Feature selected - [Name]"
- If you see this → State is updating correctly
- If you don't → onClick handler not firing

### Step 4: Check Modal Rendering
If debug indicator appears but modal doesn't:
- Check if `detailedContent` exists in config
- Check browser console for errors
- Check if modal is behind other elements (z-index issue)

---

## 🐛 Common Issues & Fixes

### Issue 1: Nothing Happens on Click
**Symptoms:**
- No debug indicator
- No console log
- Card doesn't respond

**Possible Causes:**
1. **JavaScript not loading**
   - Check console for errors
   - Look for "Failed to compile" messages

2. **Event handler not attached**
   - Verify page has `'use client'` at top
   - Check React hydration errors

3. **Overlay blocking clicks**
   - Inspect element in DevTools
   - Check z-index values
   - Look for transparent overlays

**Fix:**
```bash
# Hard refresh
# Mac: Cmd + Shift + R
# Windows: Ctrl + Shift + R

# If that doesn't work:
rm -rf .next
npm run dev
```

---

### Issue 2: Debug Indicator Shows, Modal Doesn't
**Symptoms:**
- Red debug box appears
- Console shows "Feature clicked"
- But no modal

**Possible Causes:**
1. **detailedContent is undefined**
   - Check config structure
   - Verify all features have detailedContent

2. **AnimatePresence issue**
   - Framer Motion not working
   - Animation conflict

3. **Modal z-index too low**
   - Modal rendering but hidden behind other elements

**Fix:**
Check console for:
```javascript
console.log('Feature clicked:', feature);
// Should show: { name: "...", emoji: "...", detailedContent: {...} }
```

If detailedContent is missing, check config file.

---

### Issue 3: TypeScript/Build Errors
**Symptoms:**
- Page loads but features broken
- Console shows compilation errors
- TypeScript errors in terminal

**Fix:**
```bash
# Check for TypeScript errors
npm run build

# If errors, check:
# 1. Config file syntax
# 2. Missing imports
# 3. Type mismatches
```

---

## 🧪 Manual Test Steps

### Test 1: Click Handler
1. Open `src/app/demo/playful-love/page.tsx`
2. Find the onClick handler (around line 500)
3. Verify it looks like this:
```typescript
onClick={() => {
  console.log('Feature clicked:', feature);
  setSelectedFeature(feature);
}}
```

### Test 2: State Check
Add this after the useState line:
```typescript
const [selectedFeature, setSelectedFeature] = useState<any>(null);

// Add this:
console.log('Current selectedFeature:', selectedFeature);
```

### Test 3: Config Structure
Open browser console and type:
```javascript
// This should show the features array
console.log(playfulLoveTheme.features);
```

---

## 🔍 What to Look For in Console

### Good Signs ✅:
```
Feature clicked: { name: "Animated Character Avatars", emoji: "🎨", ... }
```

### Bad Signs ❌:
```
Uncaught TypeError: Cannot read properties of undefined
```
```
Warning: Failed prop type
```
```
Error: Element type is invalid
```

---

## 🛠️ Quick Fixes to Try

### Fix 1: Force Re-render
```typescript
// In page.tsx, change:
const [selectedFeature, setSelectedFeature] = useState<any>(null);

// To:
const [selectedFeature, setSelectedFeature] = useState<any>(null);
const [forceUpdate, setForceUpdate] = useState(0);

// Then in onClick:
onClick={() => {
  setSelectedFeature(feature);
  setForceUpdate(prev => prev + 1); // Force re-render
}}
```

### Fix 2: Simplify Modal Check
```typescript
// Change:
{selectedFeature && selectedFeature.detailedContent && (

// To temporarily:
{selectedFeature && (
```

### Fix 3: Remove Animation
```typescript
// Change:
<AnimatePresence>
  {selectedFeature && (
    <motion.div ...>

// To:
{selectedFeature && (
  <div ...>
```

---

## 📊 Checklist

Run through this checklist:

### Code Checks:
- [ ] `'use client'` at top of page.tsx
- [ ] `useState` imported from 'react'
- [ ] `AnimatePresence` imported from 'framer-motion'
- [ ] onClick handler on motion.div
- [ ] `setSelectedFeature(feature)` being called
- [ ] Modal code exists after features section

### Config Checks:
- [ ] `playful-love.config.ts` exists
- [ ] Features array has 9 items
- [ ] Each feature has `detailedContent` object
- [ ] detailedContent has `title` field
- [ ] Config exports `playfulLoveTheme`

### Browser Checks:
- [ ] No console errors
- [ ] Page fully loaded
- [ ] JavaScript enabled
- [ ] No ad blockers interfering
- [ ] Browser DevTools open

### Visual Checks:
- [ ] Feature cards visible
- [ ] Cards have hover effect
- [ ] "Click to explore →" text visible
- [ ] Cursor changes to pointer on hover

---

## 🎯 Expected Behavior

### When Working Correctly:

1. **Before Click:**
   - 9 colorful feature cards visible
   - Hover shows scale/rotate animation
   - Cursor becomes pointer

2. **On Click:**
   - Console logs "Feature clicked: ..."
   - Red debug box appears top-right
   - Modal fades in with overlay
   - Modal shows feature details

3. **Modal Content:**
   - Gradient header with emoji
   - Feature title
   - Description paragraph
   - Benefits list
   - Category-specific content
   - "How It Works" section
   - CTA button

4. **Close Modal:**
   - Click X button → modal closes
   - Click outside → modal closes
   - Fade out animation

---

## 📞 Still Not Working?

### Last Resort Fixes:

1. **Complete Reset:**
```bash
cd /Users/ltanwar/repos/planning-proj/wedding-website
rm -rf node_modules
rm -rf .next
rm package-lock.json
npm install
npm run dev
```

2. **Check File Saved:**
- Make sure `page.tsx` is saved
- Make sure `config.ts` is saved
- Try closing and reopening files

3. **Browser Issue:**
- Try different browser
- Try incognito/private mode
- Clear all browser cache
- Disable extensions

4. **Port Conflict:**
```bash
# Kill anything on port 3000
lsof -ti:3000 | xargs kill -9

# Restart
npm run dev
```

---

## 🔬 Advanced Debugging

### Add Extensive Logging:

```typescript
// In page.tsx
const [selectedFeature, setSelectedFeature] = useState<any>(null);

// Add useEffect
useEffect(() => {
  console.log('selectedFeature changed:', selectedFeature);
  if (selectedFeature) {
    console.log('Has detailedContent?', !!selectedFeature.detailedContent);
    console.log('detailedContent:', selectedFeature.detailedContent);
  }
}, [selectedFeature]);
```

### Check Rendering:

```typescript
// Add before return statement
console.log('Rendering with features:', playfulLoveTheme.features.length);
console.log('selectedFeature:', selectedFeature);
```

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Click card → console shows "Feature clicked"
- ✅ Red debug box appears with feature name
- ✅ Modal slides in with black overlay
- ✅ All content displays correctly
- ✅ Can close modal
- ✅ Can click other cards

---

**Once working, remember to remove the debug indicator!**

```typescript
// Remove this:
{selectedFeature && (
  <div className="fixed top-4 right-4 bg-red-500...">
    Debug: Feature selected
  </div>
)}
```

---

*Debugging Guide for Clickable Feature Cards*
*Last Updated: December 13, 2025*

