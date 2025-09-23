#!/usr/bin/env node

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const projectRoot = process.cwd();

// Configuration
const DRY_RUN = process.argv.includes("--dry-run");
const AUDIT_DIR = path.join(projectRoot, "scripts", "image-audit");
const REPORT_PATH = path.join(AUDIT_DIR, "report.json");
const PUBLIC_DIR = path.join(projectRoot, "public");

// Size limits based on usage patterns
const SIZE_LIMITS = {
  // Payment badges (landscape)
  "payment-badges": { maxWidth: 200, maxHeight: 120, targetKB: 50 },
  // Trust badges (square)
  badges: { maxWidth: 160, maxHeight: 160, targetKB: 50 },
  // Website images (hero/content)
  "website-images": { maxWidth: 1600, maxHeight: 1200, targetKB: 200 },
  // Default limits
  default: { maxWidth: 800, maxHeight: 600, targetKB: 100 },
};

// Quality settings
const QUALITY_SETTINGS = {
  webp: 80,
  jpeg: 85,
  png: 90,
};

console.log(
  `🖼️  Starting comprehensive image optimization${
    DRY_RUN ? " (DRY RUN)" : ""
  }...\n`
);

// Helper functions
function getFileSizeKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return Math.round(stats.size / 1024);
  } catch {
    return 0;
  }
}

function getSizeLimits(imagePath) {
  const dir = path.dirname(imagePath);
  const dirName = path.basename(dir);

  if (SIZE_LIMITS[dirName]) {
    return SIZE_LIMITS[dirName];
  }

  return SIZE_LIMITS.default;
}

async function optimizeImage(inputPath, outputPath) {
  const originalSize = getFileSizeKB(inputPath);
  const limits = getSizeLimits(inputPath);
  const ext = path.extname(inputPath).toLowerCase();

  console.log(
    `Processing ${path.relative(PUBLIC_DIR, inputPath)} (${originalSize}KB)...`
  );

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Don't upscale
    const targetWidth = Math.min(limits.maxWidth, metadata.width);
    const targetHeight = Math.min(limits.maxHeight, metadata.height);

    // Skip if already small enough
    if (
      originalSize <= limits.targetKB &&
      metadata.width <= limits.maxWidth &&
      metadata.height <= limits.maxHeight
    ) {
      console.log(`  ⏭️  Skipping (already optimized)`);
      return { optimized: false, reason: "already_optimized" };
    }

    let processed = image;

    // Resize if needed
    if (
      metadata.width > limits.maxWidth ||
      metadata.height > limits.maxHeight
    ) {
      processed = processed.resize(targetWidth, targetHeight, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Determine output format
    let outputPathFinal = outputPath;

    // For PNG/JPG, try WebP first
    if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
      const webpPath = outputPath.replace(/\.[^.]+$/, ".webp");

      // Generate WebP version
      const webpBuffer = await processed
        .webp({ quality: QUALITY_SETTINGS.webp })
        .toBuffer();
      const webpSize = Math.round(webpBuffer.length / 1024);

      // Generate original format version
      let originalBuffer;
      if (ext === ".png") {
        originalBuffer = await processed
          .png({ quality: QUALITY_SETTINGS.png })
          .toBuffer();
      } else {
        originalBuffer = await processed
          .jpeg({ quality: QUALITY_SETTINGS.jpeg, progressive: true })
          .toBuffer();
      }
      const originalSize = Math.round(originalBuffer.length / 1024);

      // Choose the smaller format
      if (webpSize < originalSize && webpSize < originalSize) {
        outputFormat = ".webp";
        outputPathFinal = webpPath;
        if (!DRY_RUN) {
          fs.writeFileSync(outputPathFinal, webpBuffer);
        }
        console.log(
          `  ✅ ${path.basename(outputPathFinal)} (${webpSize}KB, WebP)`
        );
        return {
          optimized: true,
          newPath: path.relative(PUBLIC_DIR, outputPathFinal),
          originalPath: path.relative(PUBLIC_DIR, inputPath),
          size: webpSize,
          format: "webp",
        };
      } else {
        if (!DRY_RUN) {
          fs.writeFileSync(outputPathFinal, originalBuffer);
        }
        console.log(
          `  ✅ ${path.basename(outputPathFinal)} (${originalSize}KB, ${ext})`
        );
        return {
          optimized: true,
          newPath: path.relative(PUBLIC_DIR, outputPathFinal),
          originalPath: path.relative(PUBLIC_DIR, inputPath),
          size: originalSize,
          format: ext.substring(1),
        };
      }
    }

    // For other formats, just optimize in place
    const optimizedBuffer = await processed.toBuffer();
    const optimizedSize = Math.round(optimizedBuffer.length / 1024);

    if (optimizedSize < originalSize) {
      if (!DRY_RUN) {
        fs.writeFileSync(outputPathFinal, optimizedBuffer);
      }
      console.log(
        `  ✅ ${path.basename(outputPathFinal)} (${optimizedSize}KB)`
      );
      return {
        optimized: true,
        newPath: path.relative(PUBLIC_DIR, outputPathFinal),
        originalPath: path.relative(PUBLIC_DIR, inputPath),
        size: optimizedSize,
        format: ext.substring(1),
      };
    } else {
      console.log(`  ⏭️  Skipping (optimization didn't reduce size)`);
      return { optimized: false, reason: "no_improvement" };
    }
  } catch (error) {
    console.error(
      `  ❌ Error processing ${path.basename(inputPath)}:`,
      error.message
    );
    return { optimized: false, error: error.message };
  }
}

async function optimizeReferencedImages() {
  if (!fs.existsSync(REPORT_PATH)) {
    console.error("❌ Report not found. Run inventory.mjs first.");
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));
  const referencedImages = report.referenced;

  console.log(
    `📱 Optimizing ${referencedImages.length} referenced images...\n`
  );

  const results = [];
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const image of referencedImages) {
    const fullPath = path.join(PUBLIC_DIR, image.path);
    const outputPath = fullPath; // Optimize in place

    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  File not found: ${image.path}`);
      continue;
    }

    const result = await optimizeImage(fullPath, outputPath);
    results.push({ ...result, originalSize: image.size });

    if (result.optimized) {
      totalOriginalSize += image.size;
      totalOptimizedSize += result.size;
    }
  }

  // Summary
  const optimizedCount = results.filter((r) => r.optimized).length;
  const skippedCount = results.filter((r) => !r.optimized).length;
  const totalSaved = totalOriginalSize - totalOptimizedSize;
  const reductionPercent =
    totalOriginalSize > 0
      ? Math.round((totalSaved / totalOriginalSize) * 100)
      : 0;

  console.log(`\n📊 Optimization Summary:`);
  console.log(`  • Images processed: ${results.length}`);
  console.log(`  • Optimized: ${optimizedCount}`);
  console.log(`  • Skipped: ${skippedCount}`);
  console.log(`  • Original total: ${totalOriginalSize}KB`);
  console.log(`  • Optimized total: ${totalOptimizedSize}KB`);
  console.log(`  • Total saved: ${totalSaved}KB (${reductionPercent}%)`);

  // Save results for reference updates
  const resultsPath = path.join(AUDIT_DIR, "optimization-results.json");
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  console.log(`\n📄 Results saved to: ${resultsPath}`);

  if (DRY_RUN) {
    console.log("\n🔍 This was a dry run. No files were modified.");
  } else {
    console.log("\n🎉 Image optimization complete!");
  }

  return results;
}

// Main execution
async function main() {
  try {
    await optimizeReferencedImages();
  } catch (error) {
    console.error("❌ Optimization failed:", error);
    process.exit(1);
  }
}

main();
