# PWA App Icons Setup

This folder contains all the icons needed for your Progressive Web App (PWA) to display properly on Android home screens, iOS devices, and other platforms.

## Quick Start

1. **Get your logo ready**
   - Use a square image (PNG recommended)
   - Minimum size: 512x512 pixels
   - Transparent background works best
   - High resolution for best quality

2. **Generate all icon sizes**
   - Option 1: Use the automated script (see below)
   - Option 2: Use an online PWA icon generator
   - Option 3: Manually create each size

## Required Icon Sizes

Your PWA needs these icon sizes:

- **72x72** - Android devices (small)
- **96x96** - Android devices (medium)
- **128x128** - Chrome Web Store, Progressive Web Apps
- **144x144** - Windows, Android (high-res)
- **152x152** - iPad home screen
- **192x192** - Android home screen (standard)
- **384x384** - Android home screen (high-res)
- **512x512** - Android splash screen, app install prompt

## Method 1: Automated Script (Recommended)

### Using ImageMagick (Mac/Linux)

```bash
# Install ImageMagick if not already installed
# Mac: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Run from the icons directory
cd public/icons

# Place your logo as 'logo.png' (512x512 or larger)
# Then run this script:

#!/bin/bash
sizes=(72 96 128 144 152 192 384 512)
for size in "${sizes[@]}"; do
  convert logo.png -resize ${size}x${size} icon-${size}x${size}.png
done

echo "✅ All icons generated!"
```

### Using sips (Mac only - Built-in)

```bash
#!/bin/bash
cd public/icons

sizes=(72 96 128 144 152 192 384 512)
for size in "${sizes[@]}"; do
  sips -z $size $size logo.png --out icon-${size}x${size}.png
done

echo "✅ All icons generated!"
```

## Method 2: Online Tools (Easiest)

### Recommended Online Generators:

1. **PWA Asset Generator**
   - https://www.pwabuilder.com/imageGenerator
   - Upload your logo
   - Download all sizes
   - Extract to this folder

2. **RealFaviconGenerator**
   - https://realfavicongenerator.net/
   - Upload logo
   - Choose PWA option
   - Download package
   - Extract icons to this folder

3. **Favicon.io**
   - https://favicon.io/favicon-converter/
   - Upload logo
   - Generate all sizes
   - Download and extract

## Method 3: Manual Creation (Photoshop/Figma)

1. Open your logo in Photoshop/Figma/GIMP
2. For each size:
   - Create a new square canvas (e.g., 192x192)
   - Center your logo
   - Export as PNG
   - Name: `icon-{size}x{size}.png`
3. Save all files to this directory

## File Naming Convention

All icons must follow this naming pattern:
```
icon-72x72.png
icon-96x96.png
icon-128x128.png
icon-144x144.png
icon-152x152.png
icon-192x192.png
icon-384x384.png
icon-512x512.png
```

## Design Tips

### For Best Results:

✅ **DO:**
- Use a square logo (1:1 aspect ratio)
- Keep important elements centered
- Use high contrast for visibility
- Test on both light and dark backgrounds
- Use transparent background if possible
- Keep design simple and recognizable

❌ **DON'T:**
- Use text-heavy designs (hard to read at small sizes)
- Place important elements near edges
- Use very thin lines (may not be visible)
- Use overly complex details

### Safe Zone:

For maskable icons (Android adaptive icons):
- Keep main content within center 80% of canvas
- Outer 20% may be masked on some devices
- Test with circular and rounded-square masks

## Maskable Icons (Android Adaptive)

Your manifest is already configured with `"purpose": "maskable any"` which means your icons will adapt to different shapes on Android.

To ensure they look good:
1. Place logo in center 80% of canvas
2. Add padding around edges
3. Use solid background color if needed
4. Test with different mask shapes

## Testing Your Icons

### On Android:
1. Open your website in Chrome
2. Tap menu (3 dots)
3. Tap "Add to Home screen"
4. Check the icon preview
5. Add to home screen
6. Check how it looks

### On iOS:
1. Open in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Check icon preview
5. Add and verify

### On Desktop:
1. Open in Chrome
2. Look for install prompt
3. Click install
4. Check icon in apps menu

## Shortcuts Icons (Optional)

Your manifest also references shortcut icons:
- `rsvp-icon.png` (96x96)
- `gallery-icon.png` (96x96)
- `story-icon.png` (96x96)

These are optional but enhance the PWA experience.

## Current Status

Run this command to check which icons you have:
```bash
ls -la public/icons/*.png
```

## Quick Icon Generator Script

Save this as `generate-icons.sh` in the icons folder:

```bash
#!/bin/bash

# Check if logo.png exists
if [ ! -f "logo.png" ]; then
  echo "❌ Error: logo.png not found in current directory"
  echo "📝 Please place your logo as 'logo.png' (512x512 or larger) in this folder"
  exit 1
fi

echo "🎨 Generating PWA icons from logo.png..."

sizes=(72 96 128 144 152 192 384 512)

for size in "${sizes[@]}"; do
  echo "  Creating icon-${size}x${size}.png..."
  sips -z $size $size logo.png --out icon-${size}x${size}.png > /dev/null 2>&1
done

echo ""
echo "✅ All ${#sizes[@]} icons generated successfully!"
echo "📱 Your PWA is ready for Android home screen installation!"
echo ""
echo "🧪 Test by:"
echo "  1. Deploy to Vercel"
echo "  2. Open on Android Chrome"
echo "  3. Menu → Add to Home screen"
echo "  4. Check the icon!"
```

Make it executable:
```bash
chmod +x generate-icons.sh
```

Run it:
```bash
./generate-icons.sh
```

## Troubleshooting

### Icons not showing:
1. Clear browser cache
2. Uninstall PWA and reinstall
3. Check manifest.json is accessible at `/manifest.json`
4. Verify icon paths are correct
5. Check file permissions (should be readable)

### Icons look blurry:
- Use higher resolution source image
- Ensure proper resizing algorithm
- Use PNG format, not JPEG

### Wrong icon showing:
- Clear cache and reinstall
- Check manifest.json icon paths
- Verify all icon sizes exist

## Next Steps

1. Place your logo as `logo.png` in this folder
2. Run the generation script
3. Commit and deploy
4. Test on Android device
5. Enjoy your branded PWA! 🎉

