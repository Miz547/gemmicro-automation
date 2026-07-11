import { test, expect } from "../../fixtures/test.fixture";
import * as allure from "allure-js-commons";

async function annotateApplicationNoteCase(caseId: string, story: string, severity: string, description: string) {
  await allure.owner("QA Automation");
  await allure.feature("Application Note");
  await allure.story(story);
  await allure.severity(severity);
  await allure.testCaseId(caseId);
  await allure.description(description);
}

test.describe("Gemmicro application note page cases", () => {
  test("TC-031 @application @application-note @smoke @P0 Application Note page loads and core heading is visible", async ({
    page
  }) => {
    await annotateApplicationNoteCase(
      "TC-031",
      "Application Note page smoke",
      "critical",
      "Verify the zh-TW Application Note page loads and its primary page identity is visible."
    );

    await page.goto("/application-note");

    await expect(page).toHaveURL(/\/zh-TW\/application-note\/?$/);
    await expect(page).toHaveTitle(/產品應用/);
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-TW");
    await expect(page.getByRole("heading", { name: /產品應用/ })).toBeVisible();
    await expect(page.getByText("Application Notes", { exact: false })).toBeVisible();
    await expect(page.getByText("下載各應用場景的技術簡介", { exact: false })).toBeVisible();
  });

  test("TC-032 @application @application-note @content @P0 Application Note cards display expected application names", async ({
    page
  }, testInfo) => {
    await annotateApplicationNoteCase(
      "TC-032",
      "Application Note card content",
      "critical",
      "Verify Application Note cards show expected application names for BMS and LCD TV."
    );

    await page.goto("/application-note");

    await expect(page.getByRole("link", { name: /BMS/ })).toBeVisible();
    await expect(page.getByText("電池管理系統", { exact: false })).toBeVisible();
    await expect(page.getByRole("link", { name: /LCD TV/ })).toBeVisible();
    await expect(page.getByText("LCD 電視顯示器", { exact: false })).toBeVisible();

    const cards = await page.locator('section a[href$=".pdf"]').evaluateAll((links) =>
      links.map((link) => ({
        text: (link as HTMLElement).innerText.trim(),
        href: link.getAttribute("href")
      }))
    );

    await testInfo.attach("application-note-card-list.json", {
      body: Buffer.from(JSON.stringify(cards, null, 2), "utf8"),
      contentType: "application/json"
    });

    expect(cards.length, "Application Note page should expose at least two PDF cards").toBeGreaterThanOrEqual(2);
  });

  test("TC-033 @application @application-note @pdf @link @security @P1 Application Note PDF links use expected external file targets safely", async ({
    page
  }, testInfo) => {
    await annotateApplicationNoteCase(
      "TC-033",
      "Application Note PDF link safety",
      "normal",
      "Verify BMS and LCD TV PDF links point to expected files and use safe external-link attributes."
    );

    await page.goto("/application-note");

    const pdfLinks = await page.locator('section a[href$=".pdf"]').evaluateAll((links) =>
      links.map((link) => ({
        text: (link as HTMLElement).innerText.trim(),
        href: link.getAttribute("href"),
        target: link.getAttribute("target"),
        rel: link.getAttribute("rel")
      }))
    );

    await testInfo.attach("application-note-pdf-links.json", {
      body: Buffer.from(JSON.stringify(pdfLinks, null, 2), "utf8"),
      contentType: "application/json"
    });

    expect(pdfLinks.some((link) => link.href?.endsWith("/application-note/BMS.pdf"))).toBeTruthy();
    expect(pdfLinks.some((link) => link.href?.endsWith("/application-note/LCD_TV.pdf"))).toBeTruthy();
    expect(pdfLinks.every((link) => link.target === "_blank")).toBeTruthy();
    expect(pdfLinks.every((link) => link.rel?.includes("noopener") && link.rel.includes("noreferrer"))).toBeTruthy();
  });

  test("TC-034 @application @application-note @image @accessibility @quality @P1 Application Note card images are loaded and accessible", async ({
    page
  }, testInfo) => {
    await annotateApplicationNoteCase(
      "TC-034",
      "Application Note card image health",
      "normal",
      "Verify Application Note card images are loaded and include expected alt text."
    );

    await page.goto("/application-note");
    await page.waitForLoadState("networkidle");

    const imageStatus = await page.locator("section img").evaluateAll((images) =>
      images.map((image) => {
        const img = image as HTMLImageElement;
        return {
          src: img.currentSrc || img.src,
          alt: img.alt,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight
        };
      })
    );

    await testInfo.attach("application-note-image-status.json", {
      body: Buffer.from(JSON.stringify(imageStatus, null, 2), "utf8"),
      contentType: "application/json"
    });

    expect(imageStatus.some((image) => image.src.endsWith("/application-note/BMS.svg"))).toBeTruthy();
    expect(imageStatus.some((image) => image.src.endsWith("/application-note/LCD_TV.svg"))).toBeTruthy();
    expect(imageStatus.some((image) => image.alt === "電池管理系統")).toBeTruthy();
    expect(imageStatus.some((image) => image.alt === "LCD 電視顯示器")).toBeTruthy();
    expect(imageStatus.filter((image) => !image.complete || image.naturalWidth <= 0)).toEqual([]);
  });
});
