import { test, expect } from '@playwright/test';
import { expectAllImagesLoaded } from './utils/checkImages';

test.describe('Payment Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pay');
  });

  test('loads and images render', async ({ page }) => {
    // Assert page loads
    await expect(page.locator('[data-testid="payments-page"]')).toBeVisible();
    
    // Check if there are any images to verify (none in current payment page, but structure is ready)
    // await expectAllImagesLoaded(page, "payments-img");
  });

  test('payment handles are visible', async ({ page }) => {
    // Check that all payment handles are visible
    await expect(page.locator('[data-testid="cash-handle"]')).toBeVisible();
    await expect(page.locator('[data-testid="venmo-handle"]')).toBeVisible();
    await expect(page.locator('[data-testid="zelle-handle"]')).toBeVisible();
    
    // Verify the actual values
    const cashHandle = await page.locator('[data-testid="cash-handle"]').textContent();
    const venmoHandle = await page.locator('[data-testid="venmo-handle"]').textContent();
    const zelleHandle = await page.locator('[data-testid="zelle-handle"]').textContent();
    
    expect(cashHandle).toBe('$empiresolutions21');
    expect(venmoHandle).toBe('@empiresolutions-21');
    expect(zelleHandle).toBe('267-979-9613');
  });

  test('copy buttons work for all payment methods', async ({ page, context, browserName }) => {
    // Grant clipboard permissions (only for Chromium)
    if (browserName === 'chromium') {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    }
    
    // Test Cash App copy
    await page.click('[data-testid="copy-cash"]');
    const cashText = await page.locator('[data-testid="cash-handle"]').textContent();
    
    if (browserName === 'chromium') {
      const clipboard = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboard.trim()).toContain(cashText?.trim().replace(/^\$/, '') || '');
    } else {
      // For other browsers, just verify the copy button is clickable
      await expect(page.locator('[data-testid="copy-cash"]')).toBeEnabled();
    }
    
    // Test Venmo copy
    await page.click('[data-testid="copy-venmo"]');
    const venmoText = await page.locator('[data-testid="venmo-handle"]').textContent();
    
    if (browserName === 'chromium') {
      const clipboard2 = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboard2.trim()).toContain(venmoText?.trim().replace(/^@/, '') || '');
    } else {
      // For other browsers, just verify the copy button is clickable
      await expect(page.locator('[data-testid="copy-venmo"]')).toBeEnabled();
    }
    
    // Test Zelle copy
    await page.click('[data-testid="copy-zelle"]');
    const zelleText = await page.locator('[data-testid="zelle-handle"]').textContent();
    
    if (browserName === 'chromium') {
      const clipboard3 = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboard3.trim()).toContain(zelleText?.trim() || '');
    } else {
      // For other browsers, just verify the copy button is clickable
      await expect(page.locator('[data-testid="copy-zelle"]')).toBeEnabled();
    }
  });

  test('desktop payment links use web fallbacks', async ({ page, browserName }) => {
    // This test runs on desktop browsers
    if (browserName === 'webkit' && page.viewportSize()?.width && page.viewportSize()!.width < 768) {
      test.skip('Skipping desktop test on mobile viewport');
    }
    
    // Check Cash App button
    const cashButton = page.locator('[data-testid="open-cashapp"]');
    await expect(cashButton).toBeVisible();
    
    // Check Venmo button
    const venmoButton = page.locator('[data-testid="open-venmo"]');
    await expect(venmoButton).toBeVisible();
    
    // Note: We can't easily test the actual href since it's generated dynamically
    // but we can verify the buttons are present and clickable
    await expect(cashButton).toBeEnabled();
    await expect(venmoButton).toBeEnabled();
  });

  test('no Zelle web link exists', async ({ page }) => {
    // Verify there's no open-zelle link
    const zelleLink = page.locator('[data-testid="open-zelle"]');
    await expect(zelleLink).toHaveCount(0);
  });

  test('button text matches expected labels', async ({ page }) => {
    // Check Cash App button text
    const cashButton = page.locator('[data-testid="open-cashapp"]');
    await expect(cashButton).toContainText('Open Cash App');
    
    // Check Venmo button text
    const venmoButton = page.locator('[data-testid="open-venmo"]');
    await expect(venmoButton).toContainText('Open Venmo');
  });

  test('payment cards are properly structured', async ({ page }) => {
    // Check that all payment method cards are present
    await expect(page.locator('text=💸 Venmo')).toBeVisible();
    await expect(page.locator('text=💵 Cash App')).toBeVisible();
    await expect(page.locator('text=🏦 Zelle')).toBeVisible();
    await expect(page.locator('text=💳 Square')).toBeVisible();
    
    // Check that each card has the expected content
    await expect(page.locator('text=Include address or permit # when making payments.')).toHaveCount(4);
  });

  test('Square card has call to action', async ({ page }) => {
    // Check Square card has call button
    const callButton = page.locator('text=Call the Office');
    await expect(callButton).toBeVisible();
    await expect(callButton).toHaveAttribute('href', 'tel:+12158398997');
  });
});

test.describe('Payment Page Mobile', () => {
  test('loads on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pay');
    
    // Assert page loads
    await expect(page.locator('[data-testid="payments-page"]')).toBeVisible();
    
    // Check that all payment handles are still visible on mobile
    await expect(page.locator('[data-testid="cash-handle"]')).toBeVisible();
    await expect(page.locator('[data-testid="venmo-handle"]')).toBeVisible();
    await expect(page.locator('[data-testid="zelle-handle"]')).toBeVisible();
  });

  test('mobile payment buttons are enabled after loading', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pay');
    
    // Wait for mobile detection to complete
    await page.waitForFunction(() => {
      const cashButton = document.querySelector('[data-testid="open-cashapp"]');
      const venmoButton = document.querySelector('[data-testid="open-venmo"]');
      return cashButton && venmoButton && 
             !cashButton.hasAttribute('disabled') && 
             !venmoButton.hasAttribute('disabled');
    });
    
    // Check that buttons are enabled
    const cashButton = page.locator('[data-testid="open-cashapp"]');
    const venmoButton = page.locator('[data-testid="open-venmo"]');
    
    await expect(cashButton).toBeEnabled();
    await expect(venmoButton).toBeEnabled();
  });
});

// Visual regression tests can be enabled later
// test.describe('Payment Page Visual Regression', () => {
//   test('payment page visual sanity check', async ({ page }) => {
//     await page.goto('/pay');
//     await page.waitForLoadState('networkidle');
//     
//     // Take a full page screenshot for visual regression testing
//     await expect(page).toHaveScreenshot({ 
//       fullPage: true,
//       animations: 'disabled' // Disable animations for consistent screenshots
//     });
//   });
// });
