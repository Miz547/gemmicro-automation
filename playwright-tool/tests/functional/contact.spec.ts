import { test, expect } from "../../fixtures/test.fixture";
import * as allure from "allure-js-commons";

async function annotateContactCase(caseId: string, story: string, severity: string, description: string) {
  await allure.owner("QA Automation");
  await allure.feature("Contact");
  await allure.story(story);
  await allure.severity(severity);
  await allure.testCaseId(caseId);
  await allure.description(description);
}

test.describe("Gemmicro contact page cases", () => {
  test("TC-018 @contact @smoke @P0 Contact page loads and core heading is visible", async ({ page }) => {
    await annotateContactCase(
      "TC-018",
      "Contact page smoke",
      "critical",
      "Verify the zh-TW contact page loads and its primary page identity is visible."
    );

    await page.goto("/contact");

    await expect(page).toHaveURL(/\/zh-TW\/contact\/?$/);
    await expect(page).toHaveTitle(/聯絡我們/);
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-TW");
    await expect(page.getByRole("heading", { name: "聯絡我們", level: 1 })).toBeVisible();
    await expect(page.getByText("歡迎與我們的專業團隊取得聯繫", { exact: false })).toBeVisible();
  });

  test("TC-019 @contact @content @P0 Contact information cards show company names and required contact details", async ({
    page
  }, testInfo) => {
    await annotateContactCase(
      "TC-019",
      "Contact information cards",
      "critical",
      "Verify contact information cards expose company names, addresses, email, phone, and distributor recruiting content."
    );

    await page.goto("/contact");

    const requiredTexts = [
      "深圳市晶宏電科技有限公司（深圳）",
      "深圳市宝安区石岩街道塘头一号路创维创新谷2#楼B座南区8层808",
      "晶群科技有限公司",
      "235603 新北市中和區建八路197號14樓",
      "誠徵代理商",
      "sales_gem@gemmicro.com.tw",
      "+86-755-23030602"
    ];

    for (const text of requiredTexts) {
      await expect(page.getByText(text, { exact: false }).first()).toBeVisible();
    }

    const contactSnapshot = await page.locator("section").first().innerText();
    await testInfo.attach("contact-information-snapshot.txt", {
      body: Buffer.from(contactSnapshot, "utf8"),
      contentType: "text/plain"
    });
  });

  test("TC-020 @contact @link @email @phone @P1 Contact email and phone links use correct mailto and tel targets", async ({
    page
  }, testInfo) => {
    await annotateContactCase(
      "TC-020",
      "Contact actionable links",
      "normal",
      "Verify contact email and phone entries are actionable and use expected mailto/tel targets."
    );

    await page.goto("/contact");

    const emailLinks = await page.locator('a[href^="mailto:"]').evaluateAll((links) =>
      links.map((link) => ({
        text: link.textContent?.trim() ?? "",
        href: link.getAttribute("href")
      }))
    );
    const phoneLinks = await page.locator('a[href^="tel:"]').evaluateAll((links) =>
      links.map((link) => ({
        text: link.textContent?.trim() ?? "",
        href: link.getAttribute("href")
      }))
    );

    await testInfo.attach("contact-actionable-links.json", {
      body: Buffer.from(JSON.stringify({ emailLinks, phoneLinks }, null, 2), "utf8"),
      contentType: "application/json"
    });

    expect(emailLinks.length, "Contact page should expose at least one mailto link").toBeGreaterThan(0);
    expect(phoneLinks.length, "Contact page should expose at least one tel link").toBeGreaterThan(0);
    expect(emailLinks.every((link) => link.href === "mailto:sales_gem@gemmicro.com.tw")).toBeTruthy();
    expect(phoneLinks.some((link) => link.href === "tel:+86-755-23030602")).toBeTruthy();
  });

  test("TC-021 @contact @navigation @mobile @responsive @P1 Contact page navigation shell and mobile menu remain usable", async ({
    page
  }) => {
    await annotateContactCase(
      "TC-021",
      "Contact responsive navigation",
      "normal",
      "Verify the contact page mobile navigation menu can open and close under a mobile viewport."
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contact");

    const mobileButton = page.locator("#mobile-menu-btn");
    const mobileMenu = page.locator("#mobile-menu");

    await expect(mobileButton).toBeVisible();
    await expect(mobileMenu).toBeHidden();

    await mobileButton.click();
    await expect(mobileMenu).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "首頁" })).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "產品應用" })).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "新聞中心" })).toBeVisible();

    await mobileButton.click();
    await expect(mobileMenu).toBeHidden();
  });
});
