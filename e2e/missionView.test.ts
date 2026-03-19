import { test, expect } from "@playwright/test";

test.describe("MissionView Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/mission");
  });

  test("displays the correct initial state (idle)", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "idle" })).toBeVisible();
    await expect(page.getByText("🏠")).toBeVisible();
  });

  test("can navigate to next state", async ({ page }) => {
    await page.getByRole("button", { name: "Weiter →" }).click();
    await expect(page.getByRole("heading", { name: "calling" })).toBeVisible();
    await expect(page.getByText("📞")).toBeVisible();
  });

  test("can navigate through all states", async ({ page }) => {
    const states = ["idle", "calling", "alerting", "deploying", "arriving", "returning"];

    for (let i = 0; i < states.length; i++) {
      const state = states[i];
      await expect(page.getByRole("heading", { name: state })).toBeVisible();

      if (i < states.length - 1) {
        await page.getByRole("button", { name: "Weiter →" }).click();
      }
    }
  });

  test("can go back to previous state", async ({ page }) => {
    await page.getByRole("button", { name: "Weiter →" }).click();
    await expect(page.getByRole("heading", { name: "calling" })).toBeVisible();

    await page.getByRole("button", { name: "Zurück" }).click();
    await expect(page.getByRole("heading", { name: "idle" })).toBeVisible();
  });

  test("reset button returns to idle state", async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: "Weiter →" }).click();
    }
    await expect(page.getByRole("heading", { name: "returning" })).toBeVisible();

    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page.getByRole("heading", { name: "idle" })).toBeVisible();
  });

  test("skip button works correctly", async ({ page }) => {
    await page.getByRole("button", { name: "Überspringen" }).click();
    await expect(page.getByRole("heading", { name: "calling" })).toBeVisible();
  });

  test("can jump to specific state", async ({ page }) => {
    await page.getByRole("button", { name: "deploying" }).click();
    await expect(page.getByRole("heading", { name: "deploying" })).toBeVisible();
    await expect(page.getByText("🚑")).toBeVisible();
  });

  test("history is tracked correctly", async ({ page }) => {
    await page.getByRole("button", { name: "Weiter →" }).click();
    await page.waitForSelector('h2:has-text("Calling")');
    await page.getByRole("button", { name: "Weiter →" }).click();
    await page.waitForSelector('h2:has-text("Alerting")');

    // Wait for the history text to update
    await page.waitForTimeout(500);
    
    // Check that history text is visible
    await expect(page.locator("p:has-text('Verlauf:')")).toBeVisible();
  });
});

test.describe("MissionView Component - Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad portrait
    await page.goto("/mission");
  });

  test("displays correctly on mobile viewport", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "idle" })).toBeVisible();
    await expect(page.getByText("🏠")).toBeVisible();
  });

  test("buttons are tappable on mobile", async ({ page }) => {
    await page.getByRole("button", { name: "Weiter →" }).click();
    await expect(page.getByRole("heading", { name: "calling" })).toBeVisible();
  });
});
