import { test, expect } from "../../fixtures/test.fixture";
import * as allure from "allure-js-commons";

async function annotateAboutCase(caseId: string, story: string, severity: string, description: string) {
  await allure.owner("QA Automation");
  await allure.feature("About");
  await allure.story(story);
  await allure.severity(severity);
  await allure.testCaseId(caseId);
  await allure.description(description);
}

test.describe("Gemmicro about page cases", () => {
  test("TC-027 @about @smoke @P0 About page loads and core heading is visible", async ({ page }) => {
    await annotateAboutCase(
      "TC-027",
      "About page smoke",
      "critical",
      "Verify the zh-TW about page loads and its primary page identity is visible."
    );

    await page.goto("/about");

    await expect(page).toHaveURL(/\/zh-TW\/about\/?$/);
    await expect(page).toHaveTitle(/關於我們/);
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-TW");
    await expect(page.getByRole("heading", { name: "關於我們", level: 1 })).toBeVisible();
  });

  test("TC-028 @about @content @brand @P0 About page company introduction contains core brand facts", async ({
    page
  }, testInfo) => {
    await annotateAboutCase(
      "TC-028",
      "Company profile content",
      "critical",
      "Verify the company introduction contains core brand facts and business positioning."
    );

    await page.goto("/about");

    const expectedTexts = [
      "公司簡介",
      "晶群科技有限公司",
      "Gem-micro semiconductor Inc.",
      "成立於 2006 年 3 月",
      "MOSFET",
      "鋰電池保護",
      "LED 恆流",
      "電源管理",
      "全球主要電源及類比產品供應商"
    ];

    const pageContent = page.locator("body");
    for (const text of expectedTexts) {
      await expect(pageContent).toContainText(text);
    }

    await testInfo.attach("about-company-profile-snapshot.txt", {
      body: Buffer.from(await page.locator("section").first().innerText(), "utf8"),
      contentType: "text/plain"
    });
  });

  test("TC-029 @about @content @fab @P1 About page competitive advantages and FAB partners are visible", async ({
    page
  }, testInfo) => {
    await annotateAboutCase(
      "TC-029",
      "Competitive advantages and FAB partners",
      "normal",
      "Verify the About page shows competitive advantages and FAB partner names."
    );

    await page.goto("/about");

    const expectedTexts = ["競爭優勢", "自主研發", "創新技術", "本地化服務", "XFAB", "ASMC", "HHG", "MXIC", "SMIC"];
    for (const text of expectedTexts) {
      await expect(page.getByText(text, { exact: false }).first()).toBeVisible();
    }

    const evidence = await page.evaluate(() => ({
      headings: [...document.querySelectorAll("h1, h2, h3")].map((heading) => heading.textContent?.trim()),
      bodyIncludesFabPartners: ["XFAB", "ASMC", "HHG", "MXIC", "SMIC"].every((partner) =>
        document.body.innerText.includes(partner)
      )
    }));

    await testInfo.attach("about-competitive-advantage-evidence.json", {
      body: Buffer.from(JSON.stringify(evidence, null, 2), "utf8"),
      contentType: "application/json"
    });
  });

  test("TC-030 @about @career @cta @navigation @P1 About page history CTA navigates to career page", async ({
    page
  }, testInfo) => {
    await annotateAboutCase(
      "TC-030",
      "About history CTA navigation",
      "normal",
      "Verify the About page history CTA routes users to the career/history page."
    );

    await page.goto("/about");

    const historyCta = page.locator('section a[href="/zh-TW/career"]').first();
    await expect(historyCta).toBeVisible();
    await expect(historyCta).toContainText("了解我們的歷程");

    await historyCta.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/zh-TW\/career\/?$/);

    await testInfo.attach("about-history-cta-navigation.json", {
      body: Buffer.from(
        JSON.stringify({ expectedPath: "/zh-TW/career", actualUrl: page.url() }, null, 2),
        "utf8"
      ),
      contentType: "application/json"
    });
  });
});
