import { test, expect } from "../../fixtures/test.fixture";
import * as allure from "allure-js-commons";

async function annotateHomepageCase(caseId: string, story: string, severity: string, description: string) {
  await allure.owner("QA Automation");
  await allure.feature("Homepage");
  await allure.story(story);
  await allure.severity(severity);
  await allure.testCaseId(caseId);
  await allure.description(description);
}

test.describe("Gemmicro homepage smoke cases", () => {
  test("TC-001 @home @smoke @P0 Homepage loads successfully", async ({ homePage }) => {
    await annotateHomepageCase(
      "TC-001",
      "Homepage core content",
      "critical",
      "Verify the zh-TW homepage loads and key brand messages are visible, including hero title and company positioning copy."
    );

    await homePage.goto();
    await homePage.expectCoreContentVisible();
  });

  test("TC-002 @home @smoke @P0 Key navigation items are visible", async ({ page }) => {
    await annotateHomepageCase(
      "TC-002",
      "Homepage navigation visibility",
      "critical",
      "Verify zh-TW and English top navigation entries are visible."
    );

    await page.goto("/");

    const zhTwItems = ["首頁", "產品中心", "產品應用", "關於我們", "聯絡我們", "新聞中心"];
    for (const item of zhTwItems) {
      await expect(page.getByText(item, { exact: false }).first()).toBeVisible();
    }

    await page.getByText("EN", { exact: true }).first().click();

    const englishItems = ["Home", "Products", "Application Note", "About Us", "Contact", "News"];
    for (const item of englishItems) {
      await expect(page.getByText(item, { exact: false }).first()).toBeVisible();
    }
  });

  test("TC-003 @home @navigation @contact @news @product @P1 Key zh-TW navigation redirects are correct", async ({ page }, testInfo) => {
    await annotateHomepageCase(
      "TC-003",
      "Homepage navigation redirects",
      "normal",
      "Verify key zh-TW navigation entries redirect to expected destination URLs."
    );

    const redirects: Array<{ label: string; expectedPath: string; action: () => Promise<void> }> = [
      {
        label: "產品中心 / MOSFET",
        expectedPath: "/zh-TW/product_mostfet",
        action: async () => {
          await page.getByText("產品中心", { exact: false }).first().hover();
          await page.getByRole("link", { name: /MOSFET/i }).first().click();
        }
      },
      {
        label: "產品應用",
        expectedPath: "/zh-TW/application-note",
        action: async () => {
          await page.getByText("產品應用", { exact: false }).first().click();
        }
      },
      {
        label: "關於我們 / 發展歷程",
        expectedPath: "/zh-TW/career",
        action: async () => {
          await page.getByText("關於我們", { exact: false }).first().hover();
          await page.getByText("發展歷程", { exact: false }).first().click();
        }
      },
      {
        label: "聯絡我們",
        expectedPath: "/zh-TW/contact",
        action: async () => {
          await page.getByText("聯絡我們", { exact: false }).first().click();
        }
      },
      {
        label: "新聞中心",
        expectedPath: "/zh-TW/news",
        action: async () => {
          await page.getByText("新聞中心", { exact: false }).first().click();
        }
      }
    ];

    const redirectLog: Array<{ label: string; expectedPath: string; actualUrl: string }> = [];

    for (const redirect of redirects) {
      await page.goto("/");
      await expect(page).toHaveURL(/\/zh-TW\/?$/);

      await redirect.action();
      await page.waitForLoadState("domcontentloaded");
      await expect(page).toHaveURL(new RegExp(`${redirect.expectedPath.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}/?$`));

      redirectLog.push({
        label: redirect.label,
        expectedPath: redirect.expectedPath,
        actualUrl: page.url()
      });
    }

    await testInfo.attach("redirect-log.json", {
      body: Buffer.from(JSON.stringify(redirectLog, null, 2), "utf8"),
      contentType: "application/json"
    });
  });

  test("TC-004 @home @language @P1 Language switch option is visible", async ({ page }) => {
    await annotateHomepageCase(
      "TC-004",
      "Language switch",
      "normal",
      "Verify the language switch entry exists and English content can be opened."
    );

    await page.goto("/");

    await expect(page.getByText("中文", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("EN", { exact: true }).first()).toBeVisible();

    await page.getByText("EN", { exact: true }).first().click();
    await page.waitForLoadState("domcontentloaded");

    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.getByText("Home", { exact: false }).first()).toBeVisible();
  });

  test("TC-005 @home @footer @P2 Footer copyright information appears", async ({ page }, testInfo) => {
    await annotateHomepageCase(
      "TC-005",
      "Footer content",
      "minor",
      "Verify footer copyright text is visible and readable."
    );

    await page.goto("/");

    const footer = page.locator("footer").first();
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toContainText("Gem-micro Semiconductor Inc.");

    await testInfo.attach("footer-screenshot", {
      body: await footer.screenshot(),
      contentType: "image/png"
    });
  });
});
