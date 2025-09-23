#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const projectRoot = process.cwd();

// Configuration
const AUDIT_DIR = path.join(projectRoot, "scripts", "image-audit");
const REPORT_PATH = path.join(AUDIT_DIR, "report.json");
const PUBLIC_DIR = path.join(projectRoot, "public");

// Image extensions to scan
const IMAGE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".ico",
];
const SOURCE_EXTENSIONS = [
  ".tsx",
  ".ts",
  ".jsx",
  ".js",
  ".css",
  ".scss",
  ".md",
  ".json",
];

console.log("🔍 Starting comprehensive image audit...\n");

// Helper function to get file size in KB
function getFileSizeKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return Math.round(stats.size / 1024);
  } catch {
    return 0;
  }
}

// Helper function to get last modified date
function getLastModified(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString();
  } catch {
    return null;
  }
}

// Recursively find all image files in public directory
function findImageFiles(dir) {
  const images = [];

  function scanDir(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else {
          const ext = path.extname(item).toLowerCase();
          if (IMAGE_EXTENSIONS.includes(ext)) {
            const relativePath = path.relative(PUBLIC_DIR, fullPath);
            images.push({
              path: relativePath,
              fullPath: fullPath,
              size: getFileSizeKB(fullPath),
              lastModified: getLastModified(fullPath),
              extension: ext,
            });
          }
        }
      }
    } catch (error) {
      console.warn(
        `Warning: Could not scan directory ${currentDir}:`,
        error.message
      );
    }
  }

  scanDir(dir);
  return images;
}

// Find all source files to scan
function findSourceFiles(dir) {
  const sourceFiles = [];

  function scanDir(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Skip node_modules and .next
          if (!["node_modules", ".next", ".git"].includes(item)) {
            scanDir(fullPath);
          }
        } else {
          const ext = path.extname(item).toLowerCase();
          if (SOURCE_EXTENSIONS.includes(ext)) {
            sourceFiles.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(
        `Warning: Could not scan directory ${currentDir}:`,
        error.message
      );
    }
  }

  scanDir(dir);
  return sourceFiles;
}

// Extract image references from file content
function extractImageReferences(filePath, content) {
  const references = [];
  const relativePath = path.relative(projectRoot, filePath);

  // Patterns to match image references
  const patterns = [
    // Next.js Image src
    /src\s*=\s*["']([^"']*\.(?:png|jpg|jpeg|gif|webp|svg|ico))["']/gi,
    // Regular img src
    /<img[^>]+src\s*=\s*["']([^"']*\.(?:png|jpg|jpeg|gif|webp|svg|ico))["']/gi,
    // CSS background-image
    /background-image\s*:\s*url\(["']?([^"')]*\.(?:png|jpg|jpeg|gif|webp|svg|ico))["']?\)/gi,
    // CSS url()
    /url\(["']?([^"')]*\.(?:png|jpg|jpeg|gif|webp|svg|ico))["']?\)/gi,
    // Import statements
    /import.*from\s*["']([^"']*\.(?:png|jpg|jpeg|gif|webp|svg|ico))["']/gi,
    // Require statements
    /require\(["']([^"']*\.(?:png|jpg|jpeg|gif|webp|svg|ico))["']\)/gi,
    // JSON references
    /"([^"]*\.(?:png|jpg|jpeg|gif|webp|svg|ico))"/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      let imagePath = match[1];

      // Normalize paths
      if (imagePath.startsWith("/")) {
        imagePath = imagePath.substring(1); // Remove leading slash
      }

      // Skip external URLs
      if (imagePath.startsWith("http") || imagePath.startsWith("//")) {
        continue;
      }

      // Skip data URLs
      if (imagePath.startsWith("data:")) {
        continue;
      }

      references.push({
        path: imagePath,
        sourceFile: relativePath,
        match: match[0],
        isDynamic:
          imagePath.includes("${") ||
          imagePath.includes("{{") ||
          imagePath.includes("+"),
      });
    }
  }

  return references;
}

// Main audit function
async function runAudit() {
  console.log("📁 Scanning public directory for images...");
  const allImages = findImageFiles(PUBLIC_DIR);
  console.log(`Found ${allImages.length} image files`);

  console.log("\n📄 Scanning source files for references...");
  const sourceFiles = findSourceFiles(projectRoot);
  console.log(`Scanning ${sourceFiles.length} source files`);

  const allReferences = [];
  const referencesByFile = {};

  for (const filePath of sourceFiles) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const references = extractImageReferences(filePath, content);

      if (references.length > 0) {
        referencesByFile[path.relative(projectRoot, filePath)] = references.map(
          (r) => r.path
        );
        allReferences.push(...references);
      }
    } catch (error) {
      console.warn(`Warning: Could not read file ${filePath}:`, error.message);
    }
  }

  // Get unique referenced image paths
  const referencedPaths = [...new Set(allReferences.map((r) => r.path))];

  // Categorize images
  const referencedImages = [];
  const unreferencedImages = [];

  for (const image of allImages) {
    if (referencedPaths.includes(image.path)) {
      referencedImages.push(image);
    } else {
      unreferencedImages.push(image);
    }
  }

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalImages: allImages.length,
      referenced: referencedImages.length,
      unreferenced: unreferencedImages.length,
      totalSizeKB: allImages.reduce((sum, img) => sum + img.size, 0),
      referencedSizeKB: referencedImages.reduce(
        (sum, img) => sum + img.size,
        0
      ),
      unreferencedSizeKB: unreferencedImages.reduce(
        (sum, img) => sum + img.size,
        0
      ),
    },
    referenced: referencedImages.map((img) => ({
      path: img.path,
      size: img.size,
      lastModified: img.lastModified,
      extension: img.extension,
    })),
    unreferenced: unreferencedImages.map((img) => ({
      path: img.path,
      size: img.size,
      lastModified: img.lastModified,
      extension: img.extension,
    })),
    byFile: referencesByFile,
    largestImages: allImages
      .sort((a, b) => b.size - a.size)
      .slice(0, 20)
      .map((img) => ({
        path: img.path,
        size: img.size,
        extension: img.extension,
      })),
  };

  // Write report
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  // Print summary
  console.log("\n📊 Image Audit Summary:");
  console.log(`  • Total images: ${report.summary.totalImages}`);
  console.log(
    `  • Referenced: ${report.summary.referenced} (${report.summary.referencedSizeKB}KB)`
  );
  console.log(
    `  • Unreferenced: ${report.summary.unreferenced} (${report.summary.unreferencedSizeKB}KB)`
  );
  console.log(`  • Total size: ${report.summary.totalSizeKB}KB`);

  console.log("\n🔝 Top 10 Largest Images:");
  report.largestImages.slice(0, 10).forEach((img, i) => {
    console.log(`  ${i + 1}. ${img.path} (${img.size}KB)`);
  });

  if (report.summary.unreferenced > 0) {
    console.log("\n🗑️  Unreferenced Images:");
    report.unreferenced.forEach((img) => {
      console.log(`  • ${img.path} (${img.size}KB)`);
    });
  }

  console.log(`\n📄 Report saved to: ${REPORT_PATH}`);
  console.log("✅ Image audit complete!");

  return report;
}

// Run the audit
runAudit().catch((error) => {
  console.error("❌ Audit failed:", error);
  process.exit(1);
});
