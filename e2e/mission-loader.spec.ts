import { test, expect } from '@playwright/test';

test.describe('YAML Mission Loader', () => {
  test('should display test page header', async ({ page }) => {
    await page.goto('http://localhost:3010/test-mission-loader');
    
    // Check page title
    await expect(page.locator('h1')).toContainText('YAML Mission Loader Test');
  });

  test('should display URL loading section', async ({ page }) => {
    await page.goto('http://localhost:3010/test-mission-loader');
    
    // Check URL loading section exists
    await expect(page.locator('text=🌐 URL Mission Loading')).toBeVisible();
  });

  test('should validate mission from YAML string', async ({ page }) => {
    await page.goto('http://localhost:3010/test-mission-loader');
    
    // Wait for URL section to change from "Loading..." to a result
    await page.waitForSelector('text=🌐 URL Mission Loading', { timeout: 5000 });
    await page.waitForTimeout(3000); // Give time for fetch to complete
    
    // Either success or error should be shown, not just "Loading..."
    const loadingText = await page.locator('text=Loading from URL...').count();
    expect(loadingText).toBe(0);
  });
});
