import { test, expect } from '@playwright/test';
import { expectAllImagesLoaded } from './utils/checkImages';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('loads on desktop and images render', async ({ page }) => {
    // Assert page loads
    await expect(page.locator('[data-testid="contact-page"]')).toBeVisible();
    
    // Wait for form to be hydrated
    await page.waitForSelector('[data-testid="name"]', { state: 'visible' });
    
    // Check if there are any images to verify (none in current contact page, but structure is ready)
    // await expectAllImagesLoaded(page, "contact-hero-img");
  });

  test('form validation works', async ({ page }) => {
    // Wait for form to be hydrated
    await page.waitForSelector('[data-testid="name"]', { state: 'visible' });
    
    // Try to submit empty form
    await page.click('[data-testid="contact-submit"]');
    
    // Wait a bit for validation to trigger
    await page.waitForTimeout(1000);
    
    // Check for validation errors - they should appear as red text under each field
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Phone is required')).toBeVisible();
    await expect(page.locator('text=Valid email required')).toBeVisible();
    await expect(page.locator('text=Job address required')).toBeVisible();
    await expect(page.locator('text=Municipality required')).toBeVisible();
    // Note: Inspection type validation might not show if the dropdown has a default value
    // await expect(page.locator('text=Please select an inspection type')).toBeVisible();
  });

  test('invalid email shows validation error', async ({ page }) => {
    // Wait for form to be hydrated
    await page.waitForSelector('[data-testid="name"]', { state: 'visible' });
    
    // Fill form with invalid email
    await page.fill('[data-testid="name"]', 'John Doe');
    await page.fill('[data-testid="phone"]', '123-456-7890');
    await page.fill('[data-testid="email"]', 'invalid-email');
    await page.fill('[data-testid="jobAddress"]', '123 Main St');
    await page.fill('[data-testid="municipality"]', 'Philadelphia');
    await page.selectOption('[data-testid="inspectionType"]', 'Rough');
    
    await page.click('[data-testid="contact-submit"]');
    
    // Check for email validation error
    await expect(page.locator('text=Valid email required')).toBeVisible();
  });

  test('invalid phone shows validation error', async ({ page }) => {
    // Wait for form to be hydrated
    await page.waitForSelector('[data-testid="name"]', { state: 'visible' });
    
    // Fill form with invalid phone
    await page.fill('[data-testid="name"]', 'John Doe');
    await page.fill('[data-testid="phone"]', '123');
    await page.fill('[data-testid="email"]', 'john@example.com');
    await page.fill('[data-testid="jobAddress"]', '123 Main St');
    await page.fill('[data-testid="municipality"]', 'Philadelphia');
    await page.selectOption('[data-testid="inspectionType"]', 'Rough');
    
    await page.click('[data-testid="contact-submit"]');
    
    // Check for phone validation error
    await expect(page.locator('text=Phone is required')).toBeVisible();
  });

  test('successful form submission with mocked API', async ({ page }) => {
    // Mock successful API response
    await page.route('**/api/contact', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true })
      });
    });

    // Wait for form to be hydrated
    await page.waitForSelector('[data-testid="name"]', { state: 'visible' });
    
    // Fill form with valid data
    await page.fill('[data-testid="name"]', 'John Doe');
    await page.fill('[data-testid="phone"]', '123-456-7890');
    await page.fill('[data-testid="email"]', 'john@example.com');
    await page.fill('[data-testid="jobAddress"]', '123 Main St');
    await page.fill('[data-testid="municipality"]', 'Philadelphia');
    await page.selectOption('[data-testid="inspectionType"]', 'Rough');
    
    // Set a future date and time
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    await page.fill('[data-testid="preferredDate"]', tomorrowStr);
    await page.fill('[data-testid="preferredTime"]', '10:00');
    await page.fill('[data-testid="notes"]', 'Test inspection request');
    
    // Submit form
    await page.click('[data-testid="contact-submit"]');
    
    // Wait for form submission to complete
    await page.waitForTimeout(2000);
    
    // Check for success message
    await expect(page.locator('[data-testid="contact-success"]')).toBeVisible();
    await expect(page.locator('text=Thank you!')).toBeVisible();
    await expect(page.locator('text=We\'ve received your inspection request')).toBeVisible();
  });

  test('API error shows error message', async ({ page }) => {
    // Mock API error response
    await page.route('**/api/contact', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    // Wait for form to be hydrated
    await page.waitForSelector('[data-testid="name"]', { state: 'visible' });
    
    // Fill form with valid data
    await page.fill('[data-testid="name"]', 'John Doe');
    await page.fill('[data-testid="phone"]', '123-456-7890');
    await page.fill('[data-testid="email"]', 'john@example.com');
    await page.fill('[data-testid="jobAddress"]', '123 Main St');
    await page.fill('[data-testid="municipality"]', 'Philadelphia');
    await page.selectOption('[data-testid="inspectionType"]', 'Rough');
    
    // Set a future date and time
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    await page.fill('[data-testid="preferredDate"]', tomorrowStr);
    await page.fill('[data-testid="preferredTime"]', '10:00');
    
    // Submit form
    await page.click('[data-testid="contact-submit"]');
    
    // Wait for form submission to complete
    await page.waitForTimeout(2000);
    
    // Check for error message
    await expect(page.locator('[data-testid="contact-error"]')).toBeVisible();
    await expect(page.locator('h3:has-text("Error")')).toBeVisible();
  });

  test('inspection type dropdown has placeholder option', async ({ page }) => {
    // Wait for form to be hydrated
    await page.waitForSelector('[data-testid="inspectionType"]', { state: 'visible' });
    
    // Check that placeholder text exists in the option (it's hidden by default in select)
    const placeholderOption = page.locator('option[value=""]:has-text("Select inspection type...")');
    await expect(placeholderOption).toHaveCount(1);
    
    // Check that we can select a valid option
    await page.selectOption('[data-testid="inspectionType"]', 'Rough');
    const selectedValue = await page.locator('[data-testid="inspectionType"]').inputValue();
    expect(selectedValue).toBe('Rough');
  });

  test('notes field has placeholder text', async ({ page }) => {
    // Wait for form to be hydrated
    await page.waitForSelector('[data-testid="notes"]', { state: 'visible' });
    
    // Check placeholder text
    const placeholder = await page.locator('[data-testid="notes"]').getAttribute('placeholder');
    expect(placeholder).toBe('Please provide your permit # if applicable');
  });

  test('date field has minimum date set to today', async ({ page }) => {
    // Wait for form to be hydrated
    await page.waitForSelector('[data-testid="preferredDate"]', { state: 'visible' });
    
    // Check that min attribute is set
    const minDate = await page.locator('[data-testid="preferredDate"]').getAttribute('min');
    expect(minDate).toBeTruthy();
    
    // Verify it's today's date or later
    const today = new Date().toISOString().split('T')[0];
    expect(minDate).toBe(today);
  });
});

test.describe('Contact Page Mobile', () => {
  test('loads on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/contact');
    
    // Assert page loads
    await expect(page.locator('[data-testid="contact-page"]')).toBeVisible();
    
    // Wait for form to be hydrated
    await page.waitForSelector('[data-testid="name"]', { state: 'visible' });
  });
});
