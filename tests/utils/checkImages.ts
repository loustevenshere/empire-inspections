import { Page } from "@playwright/test";

export async function expectAllImagesLoaded(page: Page, testId: string) {
  const imgs = page.locator(`[data-testid="${testId}"] img, img[data-testid="${testId}"]`);
  const count = await imgs.count();
  for (let i = 0; i < count; i++) {
    const img = imgs.nth(i);
    await img.waitFor();
    // Validate browser thinks it's complete and has size
    await img.evaluate((el: HTMLImageElement) => {
      if (!(el.complete && el.naturalWidth > 0 && el.naturalHeight > 0)) {
        throw new Error(`Image not loaded: ${el.src}`);
      }
    });
  }
}






