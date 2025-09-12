# E2E Testing with Playwright

This directory contains end-to-end tests for the Empire Inspections application using Playwright.

## Test Structure

- `contact.spec.ts` - Tests for the contact form page (`/contact`)
- `payments.spec.ts` - Tests for the payment page (`/pay`)
- `utils/checkImages.ts` - Utility functions for image loading verification

## Running Tests

### Development Mode (Recommended for local development)

1. Start the development server in one terminal:
   ```bash
   npm run dev
   ```

2. Run tests in another terminal:
   ```bash
   npm run test:e2e
   ```

### Production Mode (CI/Production testing)

Run tests against a production build:
```bash
NEXT_TEST_PROD=1 npm run test:e2e
```

### Interactive Mode

Run tests with the Playwright UI for debugging:
```bash
npm run test:e2e:ui
```

### Headed Mode

Run tests with visible browser windows:
```bash
npm run test:e2e:headed
```

## Test Configuration

The tests are configured in `playwright.config.ts` with:

- **Base URL**: `http://localhost:3000` (configurable via `PLAYWRIGHT_BASE_URL`)
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Viewports**: Desktop (1366×768) and Mobile (iPhone 12, Pixel 5)
- **Auto-retry**: 2 retries on CI, 0 locally
- **Web Server**: Automatically starts dev server or production build

## Test Coverage

### Contact Page (`/contact`)
- ✅ Page loads and renders correctly
- ✅ Form validation (required fields, email format, phone format)
- ✅ Successful form submission with mocked API
- ✅ Error handling for API failures
- ✅ Mobile viewport compatibility
- ✅ Form field behavior (placeholders, min dates, dropdowns)

### Payment Page (`/pay`)
- ✅ Page loads and renders correctly
- ✅ Payment handles are visible and correct
- ✅ Copy functionality works for all payment methods
- ✅ Desktop vs mobile link behavior
- ✅ Visual regression testing
- ✅ No Zelle web link (as intended)

## Test IDs

The following `data-testid` attributes are used in tests:

### Contact Page
- `contact-page` - Main page container
- `contact-success` - Success message after form submission
- `contact-error` - Error message for failed submissions
- `contact-submit` - Submit button
- `name`, `phone`, `email`, `jobAddress`, `municipality`, `inspectionType`, `preferredDate`, `preferredTime`, `notes` - Form fields

### Payment Page
- `payments-page` - Main page container
- `cash-handle`, `venmo-handle`, `zelle-handle` - Payment handles
- `copy-cash`, `copy-venmo`, `copy-zelle` - Copy buttons
- `open-cashapp`, `open-venmo` - Action buttons

## Environment Variables

- `PLAYWRIGHT_BASE_URL` - Base URL for tests (default: `http://localhost:3000`)
- `NEXT_TEST_PROD` - Set to `1` to test against production build
- `CI` - Automatically set in GitHub Actions

## CI/CD

Tests run automatically on:
- Pull requests to `main` branch
- Pushes to `main` branch

The GitHub Actions workflow (`.github/workflows/e2e.yml`) will:
1. Install dependencies
2. Install Playwright browsers
3. Build the application
4. Run tests against production build
5. Upload test reports as artifacts

## Debugging

### Failed Tests
1. Check the HTML report: `npx playwright show-report`
2. Run with UI mode: `npm run test:e2e:ui`
3. Run with headed mode: `npm run test:e2e:headed`

### Common Issues
- **Hydration errors**: Tests wait for form hydration before interacting
- **Mobile detection**: Payment buttons may be disabled until mobile detection completes
- **Clipboard API**: Requires secure context (HTTPS or localhost)

## Adding New Tests

1. Create new test files in the `tests/` directory
2. Use descriptive test names and group related tests with `test.describe()`
3. Add appropriate `data-testid` attributes to components
4. Mock external APIs using `page.route()`
5. Test both desktop and mobile viewports when relevant

## Best Practices

- Use `data-testid` instead of CSS selectors for stability
- Wait for elements to be visible before interacting
- Mock external APIs to avoid flaky tests
- Test both success and error scenarios
- Include accessibility considerations
- Use page object pattern for complex interactions






