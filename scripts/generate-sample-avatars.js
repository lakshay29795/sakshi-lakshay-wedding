#!/usr/bin/env node

/**
 * Generate Sample Avatar Images
 * 
 * This script creates sample avatar images for the Custom Couple Avatars feature.
 * It generates placeholder images that can be replaced with real AI-generated avatars.
 */

const fs = require('fs');
const path = require('path');

const styles = ['romantic-cartoon', 'minimalist', 'watercolor', 'vintage'];
const views = ['bride', 'groom', 'couple'];

const generateSVG = (style, view, width = 400, height = 400) => {
  const styleConfigs = {
    'romantic-cartoon': {
      colors: { primary: '#F8E8E8', secondary: '#D53F8C', accent: '#A8B5A0' },
      features: 'hearts, soft colors, romantic elements'
    },
    'minimalist': {
      colors: { primary: '#F5F5F5', secondary: '#6B7280', accent: '#374151' },
      features: 'clean lines, simple shapes, minimal design'
    },
    'watercolor': {
      colors: { primary: '#FEF3E2', secondary: '#F59E0B', accent: '#DC2626' },
      features: 'artistic brushstrokes, flowing colors'
    },
    'vintage': {
      colors: { primary: '#F3F4F6', secondary: '#92400E', accent: '#7C2D12' },
      features: 'classic elements, sepia tones, elegant'
    }
  };

  const config = styleConfigs[style];
  const isCouple = view === 'couple';
  
  if (isCouple) {
    width = 800;
    height = 400;
  }

  return `
<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg-${style}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${config.colors.primary}"/>
      <stop offset="100%" style="stop-color:${config.colors.secondary}"/>
    </radialGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg-${style})" opacity="0.1"/>
  
  ${isCouple ? `
  <!-- Couple Layout -->
  <g transform="translate(50, 50)">
    <!-- Bride -->
    <circle cx="150" cy="150" r="120" fill="${config.colors.primary}" stroke="${config.colors.secondary}" stroke-width="3"/>
    <text x="150" y="160" text-anchor="middle" font-family="serif" font-size="24" fill="${config.colors.accent}">Sakshi</text>
  </g>
  <g transform="translate(450, 50)">
    <!-- Groom -->
    <circle cx="150" cy="150" r="120" fill="${config.colors.primary}" stroke="${config.colors.accent}" stroke-width="3"/>
    <text x="150" y="160" text-anchor="middle" font-family="serif" font-size="24" fill="${config.colors.accent}">Lakshay</text>
  </g>
  <!-- Connection -->
  <path d="M350 200 L450 200" stroke="${config.colors.secondary}" stroke-width="4"/>
  <circle cx="400" cy="200" r="8" fill="${config.colors.secondary}"/>
  ` : `
  <!-- Individual Avatar -->
  <g transform="translate(50, 50)">
    <circle cx="150" cy="150" r="120" fill="${config.colors.primary}" stroke="${config.colors.secondary}" stroke-width="3"/>
    <text x="150" y="160" text-anchor="middle" font-family="serif" font-size="24" fill="${config.colors.accent}">
      ${view === 'bride' ? 'Sakshi' : 'Lakshay'}
    </text>
    <text x="150" y="250" text-anchor="middle" font-family="sans-serif" font-size="12" fill="${config.colors.accent}" opacity="0.7">
      ${style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' ')} Style
    </text>
  </g>
  `}
  
  <!-- Style indicator -->
  <text x="10" y="30" font-family="sans-serif" font-size="14" fill="${config.colors.accent}" opacity="0.5">
    ${config.features}
  </text>
</svg>`;
};

// Generate avatars for each style and view
styles.forEach(style => {
  views.forEach(view => {
    const svg = generateSVG(style, view);
    const filename = `${view}.svg`;
    const filepath = path.join(__dirname, '..', 'public', 'images', 'avatars', style, filename);
    
    fs.writeFileSync(filepath, svg);
    console.log(`Generated: ${style}/${filename}`);
  });
});

// Generate preview images
styles.forEach(style => {
  const previewSVG = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="preview-${style}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#F8F9FA"/>
      <stop offset="100%" style="stop-color:#E9ECEF"/>
    </radialGradient>
  </defs>
  <rect width="200" height="200" fill="url(#preview-${style})"/>
  <circle cx="100" cy="100" r="60" fill="#6C757D" opacity="0.3"/>
  <text x="100" y="105" text-anchor="middle" font-family="serif" font-size="16" fill="#495057">
    ${style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' ')}
  </text>
  <text x="100" y="170" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#6C757D">
    Preview
  </text>
</svg>`;
  
  const previewPath = path.join(__dirname, '..', 'public', 'images', 'avatars', 'previews', `${style}.svg`);
  fs.writeFileSync(previewPath, previewSVG);
  console.log(`Generated preview: ${style}.svg`);
});

console.log('\n✅ Sample avatar images generated successfully!');
console.log('\n📝 Next steps:');
console.log('1. Replace these sample SVGs with real AI-generated images');
console.log('2. Use services like Midjourney, DALL-E, or Stable Diffusion');
console.log('3. Save as PNG files with transparent backgrounds');
console.log('4. Keep the same file structure and naming');
