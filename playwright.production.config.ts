import { defineConfig, devices } from "@playwright/test";

import { parseProductionOrigin } from "./scripts/production-config.mjs";

const baseUrl = parseProductionOrigin(
  process.env.PRODUCTION_BASE_URL,
  "PRODUCTION_BASE_URL",
);
const browserChannel = process.env.PLAYWRIGHT_CHANNEL?.trim();

export default defineConfig({
  testDir: "./tests/production",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: "line",
  use: {
    ...devices["Desktop Chrome"],
    ...(browserChannel ? { channel: browserChannel } : {}),
    baseURL: baseUrl.origin,
    locale: "zh-CN",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});
