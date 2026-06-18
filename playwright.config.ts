import { defineConfig, devices } from "@playwright/test";

// E2E for the v2 portfolio (highlight-to-ask, theme swap, Bella, legal pages).
// Kept separate from `pnpm test` (Vitest). Run with `pnpm test:e2e`.
// First-time setup: `npx playwright install` to fetch the browser binaries.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
