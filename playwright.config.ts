import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: {
    command: "npm run dev -- --port 3005",
    url: "http://localhost:3005",
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
  use: {
    baseURL: "http://localhost:3005",
  },
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 1,
  workers: 1,
  reporter: "list",
});
