#!/bin/bash

# Script to rename gallery photos with descriptive names based on dates

cd public/images/gallery

# Create a mapping of old names to new descriptive names
# Format: "oldname.jpg:newname.jpg"

declare -A rename_map=(
  # 2018 - Early relationship
  ["IMG_20180615_235254.jpg"]="2018-06-first-meeting.jpg"
  
  # Random IMG files (assuming various dates from relationship)
  ["IMG_0125.jpg"]="moment-001.jpg"
  ["IMG_1113.jpg"]="moment-002.jpg"
  ["IMG_1524.jpg"]="moment-003.jpg"
  ["IMG_1819.jpg"]="moment-004.jpg"
  ["IMG_1936.jpg"]="moment-005.jpg"
  ["IMG_2057.jpg"]="moment-006.jpg"
  ["IMG_2138.jpg"]="moment-007.jpg"
  ["IMG_2147.jpg"]="moment-008.jpg"
  ["IMG_2150.jpg"]="moment-009.jpg"
  ["IMG_2214.jpg"]="moment-010.jpg"
  ["IMG_2569.jpg"]="moment-011.jpg"
  ["IMG_2847.jpg"]="moment-012.jpg"
  ["IMG_2877.jpg"]="moment-013.jpg"
  ["IMG_3196.jpg"]="moment-014.jpg"
  ["IMG_4329.jpg"]="moment-015.jpg"
  ["IMG_6589.jpg"]="moment-016.jpg"
  ["IMG_7221.jpg"]="moment-017.jpg"
  
  # 2023 - Recent moments
  ["IMG_20231012_014643.jpg"]="2023-10-celebration.jpg"
  ["IMG_20231208_235842.jpg"]="2023-12-winter-evening.jpg"
  
  # 2024 - Recent dates and events
  ["IMG_20240209_145802__01.jpg"]="2024-02-valentines-day.jpg"
  ["IMG_20240209_155903.jpg"]="2024-02-together.jpg"
  ["IMG_20240210_165059.jpg"]="2024-02-weekend.jpg"
  ["IMG_20240224_175955.jpg"]="2024-02-date-night.jpg"
  ["IMG_20240422_130527.jpg"]="2024-04-spring-outing.jpg"
  ["IMG_20240830_145734.jpg"]="2024-08-summer-day.jpg"
  ["IMG_20240901_133908.jpg"]="2024-09-labor-day-1.jpg"
  ["IMG_20240901_133914.jpg"]="2024-09-labor-day-2.jpg"
  ["IMG_20240901_134129.jpg"]="2024-09-labor-day-3.jpg"
  ["IMG_20240901_135521.jpg"]="2024-09-labor-day-4.jpg"
  
  # Numbered photos (likely from phone)
  ["1000049562.jpg"]="memory-001.jpg"
  ["1000049710.jpg"]="memory-002.jpg"
  ["1000058818.jpg"]="memory-003.jpg"
  ["1000067505.jpg"]="memory-004.jpg"
  ["1000101577.jpg"]="memory-005.jpg"
  ["1000110407.jpg"]="memory-006.jpg"
  ["11824.jpg"]="memory-007.jpg"
  ["6997.jpg"]="memory-008.jpg"
  
  # First meeting photo
  ["first-meeting.jpg"]="2018-03-first-meeting-coffee-shop.jpg"
)

# Rename files
echo "🔄 Renaming gallery photos..."
for old_name in "${!rename_map[@]}"; do
  new_name="${rename_map[$old_name]}"
  if [ -f "$old_name" ]; then
    mv "$old_name" "$new_name"
    echo "✓ Renamed: $old_name → $new_name"
  else
    echo "⚠ Not found: $old_name"
  fi
done

echo ""
echo "✅ Renaming complete!"
echo "📝 Now run: ./scripts/generate-gallery-data.sh to update the data file"

