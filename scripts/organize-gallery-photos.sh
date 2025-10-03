#!/bin/bash

# Script to organize and rename gallery photos chronologically with descriptive names

GALLERY_DIR="public/images/gallery"
cd "$GALLERY_DIR" || exit 1

echo "📸 Organizing gallery photos..."
echo ""

# Create temporary directory for organized photos
mkdir -p temp_organized

# Counter for sequential naming
counter=1

# Process files with embedded dates (YYYYMMDD format)
for img in IMG_2018*.jpg IMG_2023*.jpg IMG_2024*.jpg; do
  if [ -f "$img" ]; then
    # Extract date from filename (YYYYMMDD)
    date_part=$(echo "$img" | grep -oE '[0-9]{8}' | head -1)
    year=${date_part:0:4}
    month=${date_part:4:2}
    day=${date_part:6:2}
    
    new_name="${year}-${month}-${day}-moment-$(printf "%03d" $counter).jpg"
    cp "$img" "temp_organized/$new_name"
    echo "✓ $img → $new_name"
    counter=$((counter + 1))
  fi
done

# Process iPhone-style numbered photos
for img in 1000*.jpg 11*.jpg 69*.jpg; do
  if [ -f "$img" ]; then
    new_name="couple-memory-$(printf "%03d" $counter).jpg"
    cp "$img" "temp_organized/$new_name"
    echo "✓ $img → $new_name"
    counter=$((counter + 1))
  fi
done

# Process IMG_ numbered photos (sorted)
for img in $(ls IMG_[0-9]*.jpg 2>/dev/null | sort); do
  if [ -f "$img" ]; then
    new_name="together-moment-$(printf "%03d" $counter).jpg"
    cp "$img" "temp_organized/$new_name"
    echo "✓ $img → $new_name"
    counter=$((counter + 1))
  fi
done

# Handle special case: first-meeting.jpg
if [ -f "first-meeting.jpg" ]; then
  cp "first-meeting.jpg" "temp_organized/2018-03-14-first-meeting-coffee-shop.jpg"
  echo "✓ first-meeting.jpg → 2018-03-14-first-meeting-coffee-shop.jpg"
fi

echo ""
echo "📋 Organized $((counter - 1)) photos"
echo ""
echo "🔍 Preview of organized photos:"
ls -1 temp_organized/ | head -10
echo "..."
echo ""
read -p "Apply these changes? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  # Backup originals
  mkdir -p ../gallery-backup-$(date +%Y%m%d)
  cp *.jpg ../gallery-backup-$(date +%Y%m%d)/ 2>/dev/null
  
  # Replace with organized files
  rm -f *.jpg
  mv temp_organized/* .
  rmdir temp_organized
  
  echo "✅ Photos renamed successfully!"
  echo "📁 Backup saved to: gallery-backup-$(date +%Y%m%d)/"
else
  rm -rf temp_organized
  echo "❌ Operation cancelled. No changes made."
fi

