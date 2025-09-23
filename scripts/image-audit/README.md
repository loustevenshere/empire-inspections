# Image Audit & Optimization

This directory contains tools for auditing, optimizing, and managing images across the Empire Inspections website.

## Files

- `inventory.mjs` - Scans the codebase for image references and generates a comprehensive report
- `optimize.mjs` - Optimizes referenced images using Sharp
- `manage-unused.mjs` - Manages unused images (list, restore, purge)
- `report.json` - Generated report of all images and their usage
- `optimization-results.json` - Results from the last optimization run

## Usage

### 1. Audit Images
```bash
npm run images:audit
```
Scans all source files and generates a report of referenced vs unreferenced images.

### 2. Optimize Images
```bash
npm run images:optimize
```
Optimizes all referenced images, converting to WebP when beneficial.

### 3. Manage Unused Images
```bash
# List unused images
node scripts/image-audit/manage-unused.mjs list

# Restore unused images
node scripts/image-audit/manage-unused.mjs restore

# Purge unused images (with confirmation)
node scripts/image-audit/manage-unused.mjs purge --confirm
```

## Optimization Rules

### Payment Badges (`/public/payment-badges/`)
- **Size**: 200x120px maximum
- **Target**: <50KB each
- **Format**: WebP preferred

### Trust Badges (`/public/badges/`)
- **Size**: 160x160px maximum  
- **Target**: <50KB each
- **Format**: WebP preferred

### Website Images (`/public/website-images/`)
- **Size**: 1600x1200px maximum
- **Target**: <200KB each
- **Format**: WebP preferred

### General Images
- **Size**: 800x600px maximum
- **Target**: <100KB each
- **Format**: WebP preferred

## Unused Images

Images that are no longer referenced in the codebase are moved to `/public/_unused/` for safety. This includes:

- Original badge files after optimization (e.g., `visa.png` → `visa.v1.webp`)
- Deprecated images that were replaced
- Test images that were never used

### Files Moved to `_unused/` (as of last audit):

| File | Size | Last Modified | Reason |
|------|------|---------------|--------|
| `badges/licensed-insured.png` | 896KB | 2025-09-14 | Replaced by `licensed-insured.v1.webp` |
| `badges/pa-license-a000501.png` | 678KB | 2025-09-14 | Replaced by `pa-license-a000501.v1.webp` |
| `badges/years-experience.png` | 920KB | 2025-09-14 | Replaced by `years-experience.v1.webp` |
| `payment-badges/amex.png` | 722KB | 2025-09-22 | Replaced by `amex.v1.webp` |
| `payment-badges/discover.png` | 730KB | 2025-09-22 | Replaced by `discover.v1.webp` |
| `payment-badges/mastercard.png` | 736KB | 2025-09-22 | Replaced by `mastercard.v1.webp` |
| `payment-badges/visa.png` | 696KB | 2025-09-22 | Replaced by `visa.v1.webp` |
| `payment-badges/zelle.png` | 717KB | 2025-09-22 | Replaced by `zelle.v1.webp` |

**Total unused size**: 6,095KB (6.1MB)

## How to Restore

If you need to restore any unused images:

1. **Restore all unused images**:
   ```bash
   node scripts/image-audit/manage-unused.mjs restore
   ```

2. **Restore specific images manually**:
   ```bash
   # Copy from _unused back to original location
   cp public/_unused/visa.png public/payment-badges/
   ```

3. **Update code references** if needed (the optimizer automatically updates references when converting formats)

## Performance Impact

### Before Optimization
- **Total images**: 21 files
- **Total size**: 7,875KB (7.9MB)
- **Referenced**: 13 files (1,780KB)
- **Unused**: 8 files (6,095KB)

### After Optimization
- **Referenced images**: 13 files (477KB)
- **Size reduction**: 70% (1,099KB saved)
- **All badges under 80KB**: ✅
- **All badges under 50KB**: ✅

## Next.js Integration

All images use Next.js `Image` component with proper:
- `width` and `height` attributes
- `sizes` prop for responsive loading
- `loading="lazy"` for performance
- `decoding="async"` for non-blocking rendering

## Maintenance

Run the audit monthly to:
1. Identify new unused images
2. Check for optimization opportunities  
3. Ensure all images meet size targets
4. Clean up the `_unused` directory

```bash
# Full maintenance workflow
npm run images:audit
npm run images:optimize
node scripts/image-audit/manage-unused.mjs list
```
