#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const projectRoot = process.cwd();

const UNUSED_DIR = path.join(projectRoot, "public", "_unused");
const REPORT_PATH = path.join(
  projectRoot,
  "scripts",
  "image-audit",
  "report.json"
);

console.log("🗑️  Managing unused images...\n");

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

// List unused images
function listUnusedImages() {
  if (!fs.existsSync(UNUSED_DIR)) {
    console.log("No unused images directory found.");
    return;
  }

  const files = fs.readdirSync(UNUSED_DIR);
  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico"].includes(
      ext
    );
  });

  if (imageFiles.length === 0) {
    console.log("No unused images found.");
    return;
  }

  console.log(`Found ${imageFiles.length} unused images:`);
  let totalSize = 0;

  imageFiles.forEach((file) => {
    const fullPath = path.join(UNUSED_DIR, file);
    const size = getFileSizeKB(fullPath);
    const lastModified = getLastModified(fullPath);
    totalSize += size;

    console.log(
      `  • ${file} (${size}KB, modified: ${lastModified?.split("T")[0]})`
    );
  });

  console.log(`\nTotal unused size: ${totalSize}KB`);
}

// Purge unused images (with confirmation)
function purgeUnusedImages() {
  if (!fs.existsSync(UNUSED_DIR)) {
    console.log("No unused images directory found.");
    return;
  }

  const files = fs.readdirSync(UNUSED_DIR);
  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico"].includes(
      ext
    );
  });

  if (imageFiles.length === 0) {
    console.log("No unused images to purge.");
    return;
  }

  console.log(
    `⚠️  This will permanently delete ${imageFiles.length} unused images:`
  );
  imageFiles.forEach((file) => {
    const fullPath = path.join(UNUSED_DIR, file);
    const size = getFileSizeKB(fullPath);
    console.log(`  • ${file} (${size}KB)`);
  });

  console.log("\nThis action cannot be undone!");
  console.log("To proceed, run: npm run images:purge-unused -- --confirm");
}

// Restore unused images
function restoreUnusedImages() {
  if (!fs.existsSync(REPORT_PATH)) {
    console.log("Report not found. Cannot restore images.");
    return;
  }

  const report = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));
  const unreferencedImages = report.unreferenced;

  console.log(
    `Found ${unreferencedImages.length} images that were moved to _unused:`
  );

  for (const image of unreferencedImages) {
    const sourcePath = path.join(UNUSED_DIR, path.basename(image.path));
    const targetPath = path.join(projectRoot, "public", image.path);

    if (fs.existsSync(sourcePath)) {
      // Create target directory if it doesn't exist
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      fs.copyFileSync(sourcePath, targetPath);
      console.log(`  ✅ Restored ${image.path}`);
    } else {
      console.log(`  ⚠️  Source not found: ${image.path}`);
    }
  }

  console.log("\nImages restored. You may need to update code references.");
}

// Main execution
const command = process.argv[2];

switch (command) {
  case "list":
    listUnusedImages();
    break;
  case "purge":
    if (process.argv.includes("--confirm")) {
      if (fs.existsSync(UNUSED_DIR)) {
        fs.rmSync(UNUSED_DIR, { recursive: true, force: true });
        console.log("✅ Unused images purged successfully!");
      } else {
        console.log("No unused images directory found.");
      }
    } else {
      purgeUnusedImages();
    }
    break;
  case "restore":
    restoreUnusedImages();
    break;
  default:
    console.log("Usage:");
    console.log(
      "  node scripts/image-audit/manage-unused.mjs list     - List unused images"
    );
    console.log(
      "  node scripts/image-audit/manage-unused.mjs purge    - Show purge preview"
    );
    console.log(
      "  node scripts/image-audit/manage-unused.mjs purge --confirm - Purge unused images"
    );
    console.log(
      "  node scripts/image-audit/manage-unused.mjs restore - Restore unused images"
    );
    break;
}
