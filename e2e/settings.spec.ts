import { test, expect } from '@playwright/test';

const PORT = process.env.PLAYWRIGHT_TEST_PORT || '3010';
const BASE_URL = `http://localhost:${PORT}`;

test.describe('Settings Dialog', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should open settings dialog when clicking settings button', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click settings button using aria-label
    const settingsButton = page.getByLabel('Einstellungen');
    await expect(settingsButton).toBeVisible();
    await settingsButton.click();
    
    // Dialog should be visible with title
    await expect(page.getByRole('heading', { name: 'Einstellungen' })).toBeVisible();
  });

  test('should toggle auto-advance setting via switch', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Open settings
    await page.getByLabel('Einstellungen').click();
    
    // Click the switch (it's a button-like element with data-slot="switch")
    const switchEl = page.locator('[data-slot="switch"]');
    await expect(switchEl).toBeVisible();
    await switchEl.click();
    
    // The switch should now be checked (has data-checked attribute)
    await expect(switchEl).toHaveAttribute('data-checked', '');
    
    // Close dialog - press Escape
    await page.keyboard.press('Escape');
  });

  test('should persist settings to localStorage', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Open settings and toggle auto-advance
    await page.getByLabel('Einstellungen').click();
    await page.locator('[data-slot="switch"]').click();
    
    // Close dialog - press Escape
    await page.keyboard.press('Escape');
    
    // Verify in localStorage
    const stored = await page.evaluate(() => localStorage.getItem('einsatzsim-settings'));
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.autoAdvance).toBe(true);
  });

  test('should load persisted settings on page reload', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Open settings and toggle auto-advance
    await page.getByLabel('Einstellungen').click();
    await page.locator('[data-slot="switch"]').click();
    
    // Close dialog - press Escape
    await page.keyboard.press('Escape');
    
    // Reload page
    await page.reload();
    
    // Open settings again - switch should have data-checked
    await page.getByLabel('Einstellungen').click();
    await expect(page.locator('[data-slot="switch"]')).toHaveAttribute('data-checked', '');
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    
    await page.goto(BASE_URL);
    
    // Open settings
    await page.getByLabel('Einstellungen').click();
    
    // Dialog should be visible
    await expect(page.getByRole('heading', { name: 'Einstellungen' })).toBeVisible();
    
    // Toggle should work
    await page.locator('[data-slot="switch"]').click();
    await expect(page.locator('[data-slot="switch"]')).toHaveAttribute('data-checked', '');
  });
});
