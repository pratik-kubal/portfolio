import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Playwright specs live in e2e/ and run via `pnpm test:e2e`, not Vitest.
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
