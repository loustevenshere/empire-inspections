import { test, expect } from "@playwright/test";

test("phone numbers in footer", async ({ page }) => {
  await page.goto("/");
  const primaryHref = 'tel:+12158398997';

  // Footer (primary) - use footer context
  const footerPrimary = page.locator('footer a[href="tel:+12158398997"]').first();
  await expect(footerPrimary).toHaveAttribute("href", primaryHref);

  // Footer (secondary)
  const footerSecondary = page.locator('footer a[href="tel:+18884199559"]');
  await expect(footerSecondary).toHaveAttribute("href", "tel:+18884199559");
});

test("mobile call now button", async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");

  // Check mobile call now button - use more specific selector
  const mobileCallButton = page.locator('a[href="tel:+12158398997"]:has-text("Call Now")');
  await expect(mobileCallButton).toHaveAttribute("href", "tel:+12158398997");
});

test("contact page phone section", async ({ page }) => {
  await page.goto("/contact");

  // Check primary phone in contact page
  const primaryPhone = page.locator('[data-testid="contact-page"] a[href="tel:+12158398997"]').first();
  await expect(primaryPhone).toHaveAttribute("href", "tel:+12158398997");

  // Check secondary phone in contact page
  const secondaryPhone = page.locator('[data-testid="contact-page"] a[href="tel:+18884199559"]');
  await expect(secondaryPhone).toHaveAttribute("href", "tel:+18884199559");

  // Check mobile hint text exists (it's hidden on desktop)
  const mobileHint = page.getByText("Tap a number to call");
  await expect(mobileHint).toHaveCount(1);
});

test("payment page phone", async ({ page }) => {
  await page.goto("/pay");

  // Check Square card phone
  const squarePhone = page.locator('[data-testid="payments-page"] a[href="tel:+12158398997"]');
  await expect(squarePhone).toHaveAttribute("href", "tel:+12158398997");

  // Check phone number display in Square card
  const phoneDisplay = page.locator('[data-testid="payments-page"] .font-mono:has-text("215-839-8997")');
  await expect(phoneDisplay).toBeVisible();
});
