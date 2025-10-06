#!/bin/bash

echo "🎨 PWA Icon Generator"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if logo.png exists
if [ ! -f "logo.png" ]; then
  echo "❌ Error: logo.png not found"
  echo ""
  echo "📝 INSTRUCTIONS:"
  echo "   1. Place your logo as 'logo.png' in this folder"
  echo "   2. Recommended size: 512x512 or larger"
  echo "   3. Use PNG format with transparent background"
  echo "   4. Re-run this script"
  echo ""
  exit 1
fi

# Get logo dimensions
dimensions=$(sips -g pixelWidth -g pixelHeight logo.png 2>/dev/null | grep -E "pixelWidth|pixelHeight" | awk '{print $2}')
width=$(echo "$dimensions" | sed -n '1p')
height=$(echo "$dimensions" | sed -n '2p')

echo "📐 Source logo dimensions: ${width}x${height}"

if [ "$width" -lt 512 ] || [ "$height" -lt 512 ]; then
  echo "⚠️  Warning: Logo is smaller than recommended (512x512)"
  echo "   This may result in lower quality icons"
  echo ""
fi

if [ "$width" -ne "$height" ]; then
  echo "⚠️  Warning: Logo is not square (${width}x${height})"
  echo "   Icons will be generated but may be stretched"
  echo ""
fi

echo ""
echo "🔨 Generating PWA icons..."
echo ""

# Define all required sizes
sizes=(72 96 128 144 152 192 384 512)

# Generate each icon size
success_count=0
for size in "${sizes[@]}"; do
  output_file="icon-${size}x${size}.png"
  
  printf "  %-20s" "Creating ${output_file}..."
  
  if sips -z $size $size logo.png --out $output_file > /dev/null 2>&1; then
    echo "✅"
    ((success_count++))
  else
    echo "❌"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $success_count -eq ${#sizes[@]} ]; then
  echo "✅ SUCCESS! Generated all ${success_count} icons!"
  echo ""
  echo "📱 Your PWA is ready for installation!"
  echo ""
  echo "🧪 TESTING:"
  echo "   1. Commit and deploy: git add . && git commit -m 'Add PWA icons' && git push"
  echo "   2. Open website on Android Chrome"
  echo "   3. Menu (⋮) → 'Add to Home screen'"
  echo "   4. See your custom icon! 🎉"
  echo ""
  echo "📁 Generated files:"
  ls -lh icon-*.png 2>/dev/null | awk '{print "   • " $9 " (" $5 ")"}'
else
  echo "⚠️  Warning: Only ${success_count}/${#sizes[@]} icons generated successfully"
  echo "   Please check for errors above"
fi

echo ""

