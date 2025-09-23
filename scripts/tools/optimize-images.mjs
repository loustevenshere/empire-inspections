#!/usr/bin/env node

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const projectRoot = process.cwd();

// Configuration
const VERSION = "v1";
const PAYMENT_BADGE_SIZE = { width: 200, height: 120 };
const TRUST_BADGE_SIZE = { width: 160, height: 160 };
const WEBP_QUALITY = 80;
const PNG_QUALITY = 85;

// Directories
const PAYMENT_BADGES_DIR = path.join(projectRoot, "public", "payment-badges");
const TRUST_BADGES_DIR = path.join(projectRoot, "public", "badges");

console.log("🖼️  Starting image optimization...\n");

// Helper function to get file size in KB
function getFileSizeKB(filePath) {
  const stats = fs.statSync(filePath);
  return Math.round(stats.size / 1024);
}

// Helper function to optimize a single image
async function optimizeImage(inputPath, outputDir, config) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const originalSize = getFileSizeKB(inputPath);

  console.log(`Processing ${filename} (${originalSize}KB)...`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Don't upscale if image is smaller than target
    const targetWidth = Math.min(config.width, metadata.width);
    const targetHeight = Math.min(config.height, metadata.height);

    // Resize and center on canvas
    const resized = image.resize(targetWidth, targetHeight, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 }, // Transparent background
    });

    // Generate WebP version
    const webpPath = path.join(outputDir, `${filename}.${VERSION}.webp`);
    await resized.webp({ quality: WEBP_QUALITY }).toFile(webpPath);

    // Generate PNG version
    const pngPath = path.join(outputDir, `${filename}.${VERSION}.png`);
    await resized
      .png({ quality: PNG_QUALITY, compressionLevel: 9 })
      .toFile(pngPath);

    const webpSize = getFileSizeKB(webpPath);
    const pngSize = getFileSizeKB(pngPath);

    // Choose the smaller file and remove the larger one
    let finalSize, finalFormat;
    if (webpSize <= pngSize) {
      fs.unlinkSync(pngPath);
      finalSize = webpSize;
      finalFormat = "webp";
    } else {
      fs.unlinkSync(webpPath);
      finalSize = pngSize;
      finalFormat = "png";
    }

    const reduction = Math.round(
      ((originalSize - finalSize) / originalSize) * 100
    );
    console.log(
      `  ✅ ${filename}.${VERSION}.${finalFormat} (${finalSize}KB, -${reduction}%)`
    );

    return {
      filename: `${filename}.${VERSION}.${finalFormat}`,
      size: finalSize,
      format: finalFormat,
      reduction: reduction,
    };
  } catch (error) {
    console.error(`  ❌ Error processing ${filename}:`, error.message);
    return null;
  }
}

// Process payment badges
async function processPaymentBadges() {
  console.log("📱 Processing payment badges (200x120)...");
  const files = fs
    .readdirSync(PAYMENT_BADGES_DIR)
    .filter((file) => file.endsWith(".png") && !file.includes(VERSION));

  const results = [];
  for (const file of files) {
    const inputPath = path.join(PAYMENT_BADGES_DIR, file);
    const result = await optimizeImage(
      inputPath,
      PAYMENT_BADGES_DIR,
      PAYMENT_BADGE_SIZE
    );
    if (result) results.push(result);
  }

  return results;
}

// Process trust badges
async function processTrustBadges() {
  console.log("\n🏆 Processing trust badges (160x160)...");
  const files = fs
    .readdirSync(TRUST_BADGES_DIR)
    .filter((file) => file.endsWith(".png") && !file.includes(VERSION));

  const results = [];
  for (const file of files) {
    const inputPath = path.join(TRUST_BADGES_DIR, file);
    const result = await optimizeImage(
      inputPath,
      TRUST_BADGES_DIR,
      TRUST_BADGE_SIZE
    );
    if (result) results.push(result);
  }

  return results;
}

// Main execution
async function main() {
  try {
    const paymentResults = await processPaymentBadges();
    const trustResults = await processTrustBadges();

    const allResults = [...paymentResults, ...trustResults];

    if (allResults.length === 0) {
      console.log("\n⚠️  No images found to optimize.");
      return;
    }

    // Summary
    console.log("\n📊 Optimization Summary:");
    const totalOriginalSize = allResults.reduce((sum, r) => sum + r.size, 0);
    const avgReduction = Math.round(
      allResults.reduce((sum, r) => sum + r.reduction, 0) / allResults.length
    );

    console.log(`  • ${allResults.length} images optimized`);
    console.log(`  • Total size: ${totalOriginalSize}KB`);
    console.log(`  • Average reduction: ${avgReduction}%`);
    console.log(
      `  • All files under 80KB: ${
        allResults.every((r) => r.size < 80) ? "✅" : "❌"
      }`
    );

    console.log("\n🎉 Image optimization complete!");
  } catch (error) {
    console.error("❌ Optimization failed:", error);
    process.exit(1);
  }
}

main();
