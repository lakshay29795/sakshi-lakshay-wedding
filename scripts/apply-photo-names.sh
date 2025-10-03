#!/bin/bash

# Script to apply photo names from the template CSV

GALLERY_DIR="public/images/gallery"
TEMPLATE_FILE="PHOTO_RENAMING_TEMPLATE.csv"

cd "$(dirname "$0")/.." || exit 1

if [ ! -f "$TEMPLATE_FILE" ]; then
  echo "❌ Template file not found: $TEMPLATE_FILE"
  exit 1
fi

echo "📸 Photo Renaming Tool"
echo "====================="
echo ""
echo "🔍 Reading template: $TEMPLATE_FILE"
echo ""

# Create backup
BACKUP_DIR="photo-backups/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp "$GALLERY_DIR"/*.jpg "$BACKUP_DIR/" 2>/dev/null
echo "✅ Backup created: $BACKUP_DIR"
echo ""

# Preview changes
echo "📋 Preview of Changes:"
echo "----------------------"
tail -n +5 "$TEMPLATE_FILE" | grep -v "^#" | grep -v "^$" | while IFS=, read -r number current new notes; do
  if [ -n "$current" ] && [ -n "$new" ] && [ "$current" != "CURRENT_NAME" ]; then
    if [ "$current" != "$new" ]; then
      if [ -f "$GALLERY_DIR/$current" ]; then
        echo "  $current"
        echo "    → $new"
      fi
    fi
  fi
done

echo ""
read -p "Apply these changes? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Operation cancelled."
  exit 0
fi

# Apply renames
echo ""
echo "🔄 Renaming photos..."
renamed_count=0
skipped_count=0

tail -n +5 "$TEMPLATE_FILE" | grep -v "^#" | grep -v "^$" | while IFS=, read -r number current new notes; do
  if [ -n "$current" ] && [ -n "$new" ] && [ "$current" != "CURRENT_NAME" ]; then
    if [ "$current" != "$new" ]; then
      if [ -f "$GALLERY_DIR/$current" ]; then
        mv "$GALLERY_DIR/$current" "$GALLERY_DIR/$new"
        echo "✓ Renamed: $current → $new"
        renamed_count=$((renamed_count + 1))
      else
        echo "⚠ Skipped (not found): $current"
        skipped_count=$((skipped_count + 1))
      fi
    fi
  fi
done

echo ""
echo "✅ Renaming complete!"
echo "📊 Summary:"
echo "   - Photos renamed: Check output above"
echo "   - Backup location: $BACKUP_DIR"
echo ""
echo "📝 Next step: Run ./scripts/generate-gallery-data.sh to update gallery data"

