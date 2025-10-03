#!/bin/bash

# Helper script to add photos to the gallery
# Usage: ./scripts/add-gallery-photo.sh <image-file> <category> <caption> <date>

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check arguments
if [ "$#" -lt 3 ]; then
    echo -e "${RED}Usage: $0 <image-file> <category> <caption> [date]${NC}"
    echo ""
    echo "Categories: engagement, couple, family, friends, misc"
    echo ""
    echo "Example:"
    echo "  $0 ~/Desktop/photo.jpg engagement 'Our engagement day!' 2024-01-15"
    exit 1
fi

IMAGE_FILE="$1"
CATEGORY="$2"
CAPTION="$3"
DATE="${4:-$(date +%Y-%m-%d)}"  # Default to today if not provided

# Validate category
if [[ ! "$CATEGORY" =~ ^(engagement|couple|family|friends|misc)$ ]]; then
    echo -e "${RED}Error: Invalid category. Must be: engagement, couple, family, friends, or misc${NC}"
    exit 1
fi

# Check if file exists
if [ ! -f "$IMAGE_FILE" ]; then
    echo -e "${RED}Error: File not found: $IMAGE_FILE${NC}"
    exit 1
fi

# Get filename and extension
FILENAME=$(basename "$IMAGE_FILE")
EXTENSION="${FILENAME##*.}"
FILENAME_NO_EXT="${FILENAME%.*}"

# Convert spaces and special chars to hyphens
CLEAN_NAME=$(echo "$FILENAME_NO_EXT" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')

# Target paths
GALLERY_DIR="public/images/gallery/$CATEGORY"
TARGET_FILE="$GALLERY_DIR/$CLEAN_NAME.jpg"

# Create directory if it doesn't exist
mkdir -p "$GALLERY_DIR"

echo -e "${BLUE}Processing image...${NC}"

# Convert to JPG if needed (handles HEIC, PNG, etc.)
if [[ "$EXTENSION" =~ ^(heic|HEIC|png|PNG|webp|WEBP)$ ]]; then
    echo "Converting $EXTENSION to JPG..."
    sips -s format jpeg "$IMAGE_FILE" --out "$TARGET_FILE"
else
    echo "Copying JPG file..."
    cp "$IMAGE_FILE" "$TARGET_FILE"
fi

# Get image dimensions
DIMENSIONS=$(sips -g pixelWidth -g pixelHeight "$TARGET_FILE" | tail -2 | awk '{print $2}')
WIDTH=$(echo "$DIMENSIONS" | head -1)
HEIGHT=$(echo "$DIMENSIONS" | tail -1)

echo -e "${GREEN}✓ Image added: $TARGET_FILE${NC}"
echo -e "${GREEN}✓ Dimensions: ${WIDTH}x${HEIGHT}${NC}"
echo ""
echo -e "${BLUE}Add this to src/data/gallery-data.ts:${NC}"
echo ""
echo "  {"
echo "    id: 'NEW_ID',  // Replace with next available number"
echo "    src: '/images/gallery/$CATEGORY/$CLEAN_NAME.jpg',"
echo "    alt: '$CAPTION',"
echo "    caption: '$CAPTION',"
echo "    category: '$CATEGORY',"
echo "    date: new Date('$DATE'),"
echo "    width: $WIDTH,"
echo "    height: $HEIGHT,"
echo "    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='"
echo "  },"
echo ""
echo -e "${BLUE}Don't forget to update the 'id' field!${NC}"

