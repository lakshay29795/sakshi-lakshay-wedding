#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Files to update with couple names from config
const filesToUpdate = [
  'src/components/features/love-language-quiz.tsx',
  'src/app/interactive/page.tsx',
  'src/lib/services/email.ts',
  'src/components/rsvp/steps/AttendanceStep.tsx',
  'src/components/features/hero-section.tsx',
  'src/components/features/romantic-hero.tsx',
  'src/app/gallery/page.tsx',
  'src/app/messages/page.tsx',
  'src/components/features/our-songs-playlist.tsx',
  'src/app/secrets/page.tsx',
  'src/components/features/secret-sections.tsx',
  'src/components/features/easter-eggs.tsx',
  'src/components/features/couple-avatars.tsx',
  'src/components/features/avatar-photo-upload.tsx',
  'src/app/demo-avatars/page.tsx',
  'src/components/gallery/PhotoLightbox.tsx',
  'src/app/offline/page.tsx',
  'src/app/guestbook/layout.tsx',
  'src/app/notifications/layout.tsx',
  'src/app/rsvp/layout.tsx',
  'src/app/story/page.tsx',
  'src/app/guestbook/page.tsx',
];

const replacements = [
  // Direct name replacements
  { from: /\bSakshi\b/g, to: '{websiteConfig.couple.bride.name}', addImport: true },
  { from: /\bLakshay\b/g, to: '{websiteConfig.couple.groom.name}', addImport: true },
  
  // Common patterns
  { from: /'Sakshi'/g, to: '{websiteConfig.couple.bride.name}' },
  { from: /"Sakshi"/g, to: '{websiteConfig.couple.bride.name}' },
  { from: /'Lakshay'/g, to: '{websiteConfig.couple.groom.name}' },
  { from: /"Lakshay"/g, to: '{websiteConfig.couple.groom.name}' },
  
  // Combined patterns
  { from: /Sakshi & Lakshay/g, to: '{websiteConfig.couple.bride.name} & {websiteConfig.couple.groom.name}' },
  { from: /Sakshi and Lakshay/g, to: '{websiteConfig.couple.bride.name} and {websiteConfig.couple.groom.name}' },
];

const importStatement = "import { websiteConfig } from '@/config/website.config';\n";

function addConfigImport(content) {
  // Check if import already exists
  if (content.includes("from '@/config/website.config'")) {
    return content;
  }
  
  // Find where to add the import (after other imports)
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ') || lines[i].startsWith("import{")) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, importStatement.trim());
    return lines.join('\n');
  }
  
  // If no imports found, add at the beginning
  return importStatement + content;
}

console.log('🔄 Updating all hardcoded names to use config...\n');

let updatedCount = 0;
let errorCount = 0;

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipped: ${file} (not found)`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    let needsImport = false;
    
    // Check if file has names to replace
    if (content.match(/\b(Sakshi|Lakshay)\b/)) {
      // Apply replacements
      replacements.forEach(({ from, to, addImport }) => {
        if (content.match(from)) {
          // For JSX, we need to wrap in {}
          if (filePath.endsWith('.tsx')) {
            // Convert plain text to JSX expression
            content = content.replace(from, to);
          } else {
            content = content.replace(from, to.replace(/[{}]/g, ''));
          }
          hasChanges = true;
          if (addImport) needsImport = true;
        }
      });
      
      // Add import if needed
      if (needsImport && hasChanges) {
        content = addConfigImport(content);
      }
      
      if (hasChanges) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${file}`);
        updatedCount++;
      }
    }
  } catch (error) {
    console.log(`❌ Error updating ${file}:`, error.message);
    errorCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   ✅ Files updated: ${updatedCount}`);
console.log(`   ❌ Errors: ${errorCount}`);
console.log(`\n✨ Done! Names are now dynamic.`);
console.log(`\n🔄 Please restart your dev server: npm run dev`);


