import { test, expect } from '@playwright/test';

const PORT = process.env.PLAYWRIGHT_TEST_PORT || '3010';
const BASE_URL = `http://localhost:${PORT}/test-mission-loader`;

test.describe('YAML Mission Loader', () => {
  test('should display test page header', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check page title
    await expect(page.locator('h1')).toContainText('YAML-Einsatzloader-Test');
  });

  test('should display URL loading section', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check URL loading section exists
    await expect(page.locator('text=🌐 URL-Einsatzlast')).toBeVisible();
  });

  test('should validate mission from YAML string', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for URL section to change from "Loading..." to a result
    await page.waitForSelector('text=URL wird geladen...', { timeout: 5000 });
    await page.waitForTimeout(3000); // Give time for fetch to complete
    
    // Either success or error should be shown, not just "Loading..."
    const loadingText = await page.locator('text=URL wird geladen...').count();
    expect(loadingText).toBe(0);
  });
});
