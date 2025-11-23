/**
 * PWA Icon Generator Script
 * Generates all required PWA icons from the source SVG
 *
 * Usage: node scripts/generate-icons.js
 *
 * Requirements: npm install sharp (or use online SVG to PNG converter)
 */

/* eslint-env node */
const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
  console.log('✓ Sharp library found. Will generate PNG icons.\n');
} catch (error) {
  console.log('⚠ Sharp library not found. Install it with: npm install sharp\n');
  console.log('Or use an online converter:');
  console.log('1. Go to https://cloudconvert.com/svg-to-png');
  console.log('2. Upload: frontend/public/icons/icon-source.svg');
  console.log('3. Convert to PNG at these sizes:', ICON_SIZES.join(', '));
  console.log('4. Save files as: icon-{size}x{size}.png in frontend/public/icons/\n');

  // Create placeholder instructions file
  const iconsDir = path.join(__dirname, '../public/icons');
  const instructionsPath = path.join(iconsDir, 'GENERATE_ICONS.txt');

  const instructions = `
PWA ICONS GENERATION INSTRUCTIONS
===================================

Required Icon Sizes:
${ICON_SIZES.map(size => `- ${size}x${size}px`).join('\n')}

Method 1: Using Sharp (Recommended)
------------------------------------
1. Install sharp: npm install sharp
2. Run: node scripts/generate-icons.js

Method 2: Online Converter
---------------------------
1. Go to: https://cloudconvert.com/svg-to-png
2. Upload: frontend/public/icons/icon-source.svg
3. For each size in the list above:
   - Set dimensions to {size}x{size}
   - Download as icon-{size}x{size}.png
   - Save to: frontend/public/icons/

Method 3: Using ImageMagick
----------------------------
If you have ImageMagick installed:

${ICON_SIZES.map(size =>
    `convert -background none -resize ${size}x${size} icon-source.svg icon-${size}x${size}.png`
  ).join('\n')}

Maskable Icons:
---------------
For icon-192x192-maskable.png and icon-512x512-maskable.png:
- Use the same icons but ensure the design is centered
- Add 10% padding (safe zone) around the icon content

After generating icons, delete this file.
`;

  fs.writeFileSync(instructionsPath, instructions);
  console.log(`Created instructions file: ${instructionsPath}\n`);
  process.exit(0);
}

// Generate icons using sharp
async function generateIcons() {
  const iconsDir = path.join(__dirname, '../public/icons');
  const sourceSvg = path.join(iconsDir, 'icon-source.svg');

  if (!fs.existsSync(sourceSvg)) {
    console.error(`❌ Source SVG not found: ${sourceSvg}`);
    process.exit(1);
  }

  console.log('🎨 Generating PWA icons from SVG...\n');

  // Generate standard icons
  for (const size of ICON_SIZES) {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);

    try {
      await sharp(sourceSvg)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Failed to generate icon-${size}x${size}.png:`, error.message);
    }
  }

  // Generate maskable icons (with safe zone padding)
  console.log('\n🎭 Generating maskable icons...\n');

  for (const size of [192, 512]) {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}-maskable.png`);

    try {
      // For maskable icons, we render at a larger size then add padding
      const paddedSize = Math.floor(size * 0.8); // 20% padding (10% each side)
      const padding = Math.floor((size - paddedSize) / 2);

      await sharp(sourceSvg)
        .resize(paddedSize, paddedSize)
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 255, g: 153, b: 51, alpha: 1 }
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated: icon-${size}x${size}-maskable.png`);
    } catch (error) {
      console.error(`❌ Failed to generate maskable icon:`, error.message);
    }
  }

  // Generate shortcut icons
  console.log('\n🔗 Generating shortcut icons...\n');

  const shortcuts = ['feed', 'explore', 'post'];
  for (const shortcut of shortcuts) {
    const outputPath = path.join(iconsDir, `shortcut-${shortcut}.png`);

    try {
      // Use the main icon for shortcuts at 96x96
      await sharp(sourceSvg)
        .resize(96, 96)
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated: shortcut-${shortcut}.png`);
    } catch (error) {
      console.error(`❌ Failed to generate shortcut icon:`, error.message);
    }
  }

  console.log('\n✨ Icon generation complete!\n');
  console.log('Generated icons:');
  const icons = fs.readdirSync(iconsDir).filter(f => f.endsWith('.png'));
  icons.forEach(icon => console.log(`  - ${icon}`));
}

// Run the generator
generateIcons().catch(error => {
  console.error('❌ Icon generation failed:', error);
  process.exit(1);
});
