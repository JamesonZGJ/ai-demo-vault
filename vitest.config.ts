import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    clearMocks: true,
    restoreMocks: true,
    include: [
      "tests/unit/**/*.{test,spec}.{ts,tsx,mjs}",
      "**/*.{unit.test,unit.spec}.{ts,tsx}",
    ],
    exclude: ["node_modules/**", ".next/**", "tests/e2e/**"],
  },
});
