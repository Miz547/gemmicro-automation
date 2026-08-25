import { defineConfig, devices } from "@playwright/test";
import { getBaseUrl } from "./config/env";

export default defineConfig({
  globalSetup: "./global-setup.ts",
  testDir: "./tests",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  retries: 0,
  workers: undefined,
  reporter: [
    ["html", { open: "never" }],
    ["allure-playwright", { resultsDir: "allure-results" }]
  ],
  use: {
    baseURL: getBaseUrl(),
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
