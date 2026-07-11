import { test, expect } from "../../fixtures/test.fixture";
import * as allure from "allure-js-commons";

async function annotateHomeQualityCase(caseId: string, story: string, severity: string, description: string) {
  await allure.owner("QA Automation");
  await allure.feature("Homepage");
  await allure.story(story);
  await allure.severity(severity);
  await allure.testCaseId(caseId);
  await allure.description(description);
}

test.describe("Gemmicro homepage quality cases", () => {
  test("TC-012 @home @seo @P1 @quality Homepage basic SEO metadata is present", async ({ page }) => {
    await annotateHomeQualityCase(
      "TC-012",
      "Homepage basic SEO metadata",
      "normal",
      "Verify homepage has basic document metadata such as title, lang, viewport, and favicon."
    );

    await page.goto("/");

    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-TW");

    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveCount(1);
    await expect(viewport).toHaveAttribute("content", /width=device-width/);

    const favicon = page.locator('link[rel~="icon"]').first();
    await expect(favicon).toHaveAttribute("href", /.+/);
  });

  test("TC-013 @home @image @P1 @ui @quality Homepage image resources are healthy", async ({ page }, testInfo) => {
    await annotateHomeQualityCase(
      "TC-013",
      "Homepage image resource health",
      "normal",
      "Verify homepage image resources are successfully loaded and no rendered image is broken, preventing invalid src, failed CDN resource, or deployment path errors."
    );

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const imageStatus = await page.locator("img").evaluateAll((images) =>
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

    const brokenImages = imageStatus.filter((image) => !image.src || !image.complete || image.naturalWidth <= 0);

    await testInfo.attach("homepage-image-status.json", {
      body: Buffer.from(JSON.stringify({ imageStatus, brokenImages }, null, 2), "utf8"),
      contentType: "application/json"
    });

    expect(imageStatus.length, "Homepage should render at least one image").toBeGreaterThan(0);
    expect(brokenImages, "Homepage should not contain broken images").toEqual([]);
  });

  test("TC-014 @home @runtime @network @P1 @quality Homepage has no critical console or network errors", async ({ page }, testInfo) => {
    await annotateHomeQualityCase(
      "TC-014",
      "Homepage runtime health",
      "normal",
      "Verify homepage load has no critical console errors, page errors, request failures, or HTTP 5xx responses."
    );

    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const requestFailures: Array<{ url: string; failure: string | null }> = [];
    const serverErrors: Array<{ url: string; status: number }> = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });
    page.on("requestfailed", (request) => {
      requestFailures.push({
        url: request.url(),
        failure: request.failure()?.errorText ?? null
      });
    });
    page.on("response", (response) => {
      if (response.status() >= 500) {
        serverErrors.push({
          url: response.url(),
          status: response.status()
        });
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const runtimeHealth = { consoleErrors, pageErrors, requestFailures, serverErrors };
    await testInfo.attach("homepage-runtime-health.json", {
      body: Buffer.from(JSON.stringify(runtimeHealth, null, 2), "utf8"),
      contentType: "application/json"
    });

    expect(runtimeHealth).toEqual({
      consoleErrors: [],
      pageErrors: [],
      requestFailures: [],
      serverErrors: []
    });
  });

  test("TC-015 @home @mobile @navigation @P1 @ui @responsive Homepage mobile menu can open and close", async ({ page }) => {
    await annotateHomeQualityCase(
      "TC-015",
      "Homepage mobile navigation",
      "normal",
      "Verify mobile menu button opens and closes the homepage mobile navigation panel."
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const mobileButton = page.locator("#mobile-menu-btn");
    const mobileMenu = page.locator("#mobile-menu");

    await expect(mobileButton).toBeVisible();
    await expect(mobileMenu).toBeHidden();

    await mobileButton.click();
    await expect(mobileMenu).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "首頁" })).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "產品中心" })).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "聯絡我們" })).toBeVisible();

    await mobileButton.click();
    await expect(mobileMenu).toBeHidden();
  });

  test("TC-016 @home @accessibility @P1 @quality Homepage basic accessibility signals are present", async ({
    page
  }, testInfo) => {
    await annotateHomeQualityCase(
      "TC-016",
      "Homepage basic accessibility signals",
      "normal",
      "Verify homepage has a visible heading, image alt text, and accessible names for visible links and buttons."
    );

    await page.goto("/");

    const visibleHeadingCount = await page.locator("h1:visible").count();
    const accessibilityIssues = await page.evaluate(() => {
      const isVisible = (element: Element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
      };

      const visibleImagesMissingAlt = [...document.querySelectorAll("img")]
        .filter(isVisible)
        .filter((image) => !image.getAttribute("alt")?.trim())
        .map((image) => ({
          tag: "img",
          src: (image as HTMLImageElement).currentSrc || (image as HTMLImageElement).src
        }));

      const visibleControlsMissingName = [...document.querySelectorAll("a, button")]
        .filter(isVisible)
        .filter((element) => {
          const imageAlt = [...element.querySelectorAll("img")]
            .map((image) => image.getAttribute("alt")?.trim())
            .find(Boolean);
          const name =
            element.textContent?.trim() ||
            element.getAttribute("aria-label")?.trim() ||
            element.getAttribute("title")?.trim() ||
            imageAlt;
          return !name;
        })
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          id: element.id,
          href: element.getAttribute("href")
        }));

      return {
        visibleImagesMissingAlt,
        visibleControlsMissingName
      };
    });

    await testInfo.attach("homepage-accessibility-signals.json", {
      body: Buffer.from(JSON.stringify({ visibleHeadingCount, accessibilityIssues }, null, 2), "utf8"),
      contentType: "application/json"
    });

    expect(visibleHeadingCount, "Homepage should have at least one visible h1").toBeGreaterThan(0);
    expect(accessibilityIssues.visibleImagesMissingAlt, "Visible images should have alt text").toEqual([]);
    expect(accessibilityIssues.visibleControlsMissingName, "Visible links and buttons should have accessible names").toEqual([]);
  });

  test("TC-017 @home @contact @product @cta @P1 @functional Homepage hero CTA links navigate to expected destinations", async ({
    page
  }, testInfo) => {
    await annotateHomeQualityCase(
      "TC-017",
      "Homepage hero CTA navigation",
      "normal",
      "Verify the homepage hero commercial CTA links route users to the expected product and contact destinations."
    );

    const ctaLog: Array<{ cta: string; expectedPath: string; actualUrl: string }> = [];

    await page.goto("/");
    const hero = page.locator("header").first();

    const productCta = hero.locator('a[href="/zh-TW/product_mostfet"]').first();
    await expect(productCta).toBeVisible();
    await productCta.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/zh-TW\/product_mostfet\/?$/);
    ctaLog.push({
      cta: "hero-product",
      expectedPath: "/zh-TW/product_mostfet",
      actualUrl: page.url()
    });

    await page.goto("/");
    const contactCta = page.locator("header").first().locator('a[href="/zh-TW/contact"]').first();
    await expect(contactCta).toBeVisible();
    await contactCta.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/zh-TW\/contact\/?$/);
    ctaLog.push({
      cta: "hero-contact",
      expectedPath: "/zh-TW/contact",
      actualUrl: page.url()
    });

    await testInfo.attach("hero-cta-navigation-log.json", {
      body: Buffer.from(JSON.stringify(ctaLog, null, 2), "utf8"),
      contentType: "application/json"
    });
  });
});
