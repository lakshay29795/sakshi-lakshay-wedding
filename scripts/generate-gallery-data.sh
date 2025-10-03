#!/bin/bash

# Script to generate gallery data from images in public/images/gallery

GALLERY_DIR="public/images/gallery"
OUTPUT_FILE="src/data/gallery-data-generated.ts"

echo "import type { PhotoGalleryItem } from '@/types';" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "export const galleryPhotos: PhotoGalleryItem[] = [" >> "$OUTPUT_FILE"

ID=1
for img in "$GALLERY_DIR"/*.jpg; do
  if [ -f "$img" ]; then
    filename=$(basename "$img")
    
    # Get dimensions
    dimensions=$(sips -g pixelWidth -g pixelHeight "$img" 2>/dev/null | grep -E "pixelWidth|pixelHeight" | awk '{print $2}')
    width=$(echo "$dimensions" | head -1)
    height=$(echo "$dimensions" | tail -1)
    
    # Default values if sips fails
    if [ -z "$width" ]; then width=800; fi
    if [ -z "$height" ]; then height=600; fi
    
    echo "  {" >> "$OUTPUT_FILE"
    echo "    id: '$ID'," >> "$OUTPUT_FILE"
    echo "    src: '/images/gallery/$filename'," >> "$OUTPUT_FILE"
    echo "    alt: 'Sakshi and Lakshay - $filename'," >> "$OUTPUT_FILE"
    echo "    caption: 'Beautiful moment together'," >> "$OUTPUT_FILE"
    echo "    category: 'couple'," >> "$OUTPUT_FILE"
    echo "    date: new Date('2024-01-01')," >> "$OUTPUT_FILE"
    echo "    width: $width," >> "$OUTPUT_FILE"
    echo "    height: $height," >> "$OUTPUT_FILE"
    echo "    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='" >> "$OUTPUT_FILE"
    echo "  }," >> "$OUTPUT_FILE"
    
    ID=$((ID + 1))
  fi
done

echo "];" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "Generated $OUTPUT_FILE with $((ID - 1)) photos!"

