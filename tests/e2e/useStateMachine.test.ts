import { test, expect } from "@playwright/test";

test.describe("useStateMachine Hook", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test-machine");
  });

  test("displays the correct initial state (idle)", async ({ page }) => {
    // The state should start at "idle"
    await expect(page.getByRole("heading", { name: "idle" })).toBeVisible();
    await expect(page.getByText("🏠")).toBeVisible();
  });

  test("can navigate to next state", async ({ page }) => {
    // Click Next button
    await page.getByRole("button", { name: "Next →" }).click();

    // Should now be in "calling" state
    await expect(page.getByRole("heading", { name: "calling" })).toBeVisible();
    await expect(page.getByText("📞")).toBeVisible();
  });

  test("can navigate through all states", async ({ page }) => {
    const states = ["idle", "calling", "alerting", "deploying", "arriving", "returning"];
    const icons = ["🏠", "📞", "🔔", "🚑", "🏭", "🏁"];

    for (let i = 0; i < states.length; i++) {
      const state = states[i];
      const icon = icons[i];

      await expect(page.getByRole("heading", { name: state })).toBeVisible();
      await expect(page.getByText(icon)).toBeVisible();

      // Check if we're at the last state
      if (i < states.length - 1) {
        await page.getByRole("button", { name: "Next →" }).click();
      }
    }
  });

  test("can go back to previous state", async ({ page }) => {
    // Go to calling state
    await page.getByRole("button", { name: "Next →" }).click();
    await expect(page.getByRole("heading", { name: "calling" })).toBeVisible();

    // Go back to idle
    await page.getByRole("button", { name: "← Prev" }).click();
    await expect(page.getByRole("heading", { name: "idle" })).toBeVisible();
  });

  test("reset button returns to idle state", async ({ page }) => {
    // Navigate to returning state
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: "Next →" }).click();
    }
    await expect(page.getByRole("heading", { name: "returning" })).toBeVisible();

    // Reset
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page.getByRole("heading", { name: "idle" })).toBeVisible();
  });

  test("skip button works correctly", async ({ page }) => {
    // Skip from idle to calling
    await page.getByRole("button", { name: "Skip" }).click();
    await expect(page.getByRole("heading", { name: "calling" })).toBeVisible();
  });

  test("can jump to specific state", async ({ page }) => {
    // Jump directly to deploying state
    await page.getByRole("button", { name: "deploying" }).click();
    await expect(page.getByRole("heading", { name: "deploying" })).toBeVisible();
    await expect(page.getByText("🚑")).toBeVisible();
  });

  test("history is tracked correctly", async ({ page }) => {
    // Navigate through a few states
    await page.getByRole("button", { name: "Next →" }).click();
    await page.getByRole("button", { name: "Next →" }).click();

    // Check history
    await expect(
      page.getByText(/History: idle → calling → alerting/)
    ).toBeVisible();
  });
});

test.describe("useStateMachine Hook - Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad portrait
    await page.goto("/test-machine");
  });

  test("displays correctly on mobile viewport", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "idle" })).toBeVisible();
    await expect(page.getByText("🏠")).toBeVisible();
  });

  test("buttons are tappable on mobile", async ({ page }) => {
    await page.getByRole("button", { name: "Next →" }).click();
    await expect(page.getByRole("heading", { name: "calling" })).toBeVisible();
  });
});
