#!/usr/bin/env node
/**
 * QR code generator for the ForeverLink Gifts marketing landing page.
 *
 * Usage:
 *   node scripts/generate-qr.js                          # uses default URL below
 *   node scripts/generate-qr.js https://your-url/promo   # uses custom URL
 *
 * Generates three sizes in /public/qr/:
 *   - qr-small.png        (300x300) — for web / Instagram stories
 *   - qr-medium.png       (800x800) — for social posts / flyers
 *   - qr-large-print.png  (1500x1500) — for print / large signage
 */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Default: the Vercel production-alias pattern for this project.
// When you redeploy this code, /promo will be live at this URL.
// If your stable URL is different, pass it as a CLI argument.
const DEFAULT_URL =
  'https://romantic-wedding-website-lakshays-projects-f80e8e4d.vercel.app/promo';

const url = process.argv[2] || DEFAULT_URL;

const sizes = [
  { name: 'qr-small.png', width: 300 },
  { name: 'qr-medium.png', width: 800 },
  { name: 'qr-large-print.png', width: 1500 },
];

const outputDir = path.join(__dirname, '..', 'public', 'qr');

async function main() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('\n💕 ForeverLink Gifts — QR Code Generator\n');
  console.log(`   URL: ${url}\n`);

  for (const { name, width } of sizes) {
    const outputPath = path.join(outputDir, name);
    await QRCode.toFile(outputPath, url, {
      width,
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#1a0b14',
        light: '#FFF8E7',
      },
    });
    const sizeKb = (fs.statSync(outputPath).size / 1024).toFixed(1);
    console.log(`   ✓ ${name.padEnd(22)} ${width}x${width}px   ${sizeKb} KB`);
  }

  // Also save a plain-text reference file
  const infoPath = path.join(outputDir, 'qr-info.txt');
  fs.writeFileSync(
    infoPath,
    `ForeverLink Gifts — QR Code\n` +
      `===========================\n\n` +
      `Target URL: ${url}\n` +
      `Generated:  ${new Date().toISOString()}\n\n` +
      `Sizes:\n` +
      sizes.map((s) => `  - ${s.name} (${s.width}x${s.width}px)`).join('\n') +
      `\n\nTo regenerate with a different URL:\n` +
      `  node scripts/generate-qr.js https://your-new-url/promo\n`,
  );

  console.log(`\n   ✓ qr-info.txt          (reference file)\n`);
  console.log(`   📁 Output: public/qr/\n`);
  console.log('   📱 Test it: open the QR in your phone camera to verify it opens the URL.\n');
}

main().catch((err) => {
  console.error('❌ Error generating QR:', err);
  process.exit(1);
});
