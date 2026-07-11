import { defineConfig, devices } from "@playwright/test";

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
    baseURL: "https://www.gemmicro.com.tw/zh-TW/",
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
