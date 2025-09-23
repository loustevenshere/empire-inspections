#!/usr/bin/env node

import fs from "fs";
import path from "path";

const requiredBadges = [
  "visa.v1.webp",
  "mastercard.v1.webp",
  "amex.v1.webp",
  "discover.v1.webp",
  "zelle.v1.webp",
];

const badgesDir = path.join(process.cwd(), "public", "payment-badges");

console.log("🔍 Validating payment badge files...");

let allExist = true;
const missing = [];

for (const badge of requiredBadges) {
  const filePath = path.join(badgesDir, badge);
  if (!fs.existsSync(filePath)) {
    allExist = false;
    missing.push(badge);
    console.error(`❌ Missing: ${badge}`);
  } else {
    console.log(`✅ Found: ${badge}`);
  }
}

if (!allExist) {
  console.error(
    `\n❌ Build failed: Missing ${missing.length} payment badge file(s):`
  );
  missing.forEach((badge) => console.error(`   - ${badge}`));
  console.error(
    "\nPlease ensure all payment badge files exist in /public/payment-badges/"
  );
  process.exit(1);
}

console.log("\n✅ All payment badge files validated successfully!");
process.exit(0);
