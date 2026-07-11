import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ProductPage } from "../pages/ProductPage";

type AppFixtures = {
  homePage: HomePage;
  productPage: ProductPage;
  autoCaptureArtifacts: void;
};

export const test = base.extend<AppFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  autoCaptureArtifacts: [
    async ({ page }, use, testInfo) => {
      const errorLogs: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errorLogs.push(`[console.error] ${msg.text()}`);
        }
      });

      page.on("pageerror", (err) => {
        errorLogs.push(`[pageerror] ${err.message}`);
      });

      page.on("requestfailed", (req) => {
        const failure = req.failure();
        errorLogs.push(
          `[requestfailed] ${req.method()} ${req.url()} - ${failure?.errorText ?? "unknown"}`
        );
      });

      await use();

      const screenshot = await page.screenshot({ fullPage: false });
      const statusLabel = testInfo.status ?? "unknown";
      await testInfo.attach(`screenshot-${statusLabel}`, {
        body: screenshot,
        contentType: "image/png"
      });

      const combinedLogs = errorLogs.length
        ? errorLogs.join("\n")
        : "No console/page/request failure log captured.";

      await testInfo.attach("runtime-log", {
        body: Buffer.from(combinedLogs, "utf8"),
        contentType: "text/plain"
      });

      if (testInfo.status !== testInfo.expectedStatus) {
        await testInfo.attach("failure-summary", {
          body: Buffer.from(
            `title: ${testInfo.title}\nstatus: ${testInfo.status}\nexpected: ${testInfo.expectedStatus}`,
            "utf8"
          ),
          contentType: "text/plain"
        });
      }
    },
    { auto: true }
  ]
});

export { expect } from "@playwright/test";
