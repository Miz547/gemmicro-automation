import { test, expect } from "../../fixtures/test.fixture";
import * as allure from "allure-js-commons";

async function annotateNewsCase(caseId: string, story: string, severity: string, description: string) {
  await allure.owner("QA Automation");
  await allure.feature("News");
  await allure.story(story);
  await allure.severity(severity);
  await allure.testCaseId(caseId);
  await allure.description(description);
}

test.describe("Gemmicro news page cases", () => {
  test("TC-022 @news @smoke @P0 News page loads and core heading is visible", async ({ page }) => {
    await annotateNewsCase(
      "TC-022",
      "News page smoke",
      "critical",
      "Verify the zh-TW news page loads and its primary page identity is visible."
    );

    await page.goto("/news");

    await expect(page).toHaveURL(/\/zh-TW\/news\/?$/);
    await expect(page).toHaveTitle(/新聞中心/);
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-TW");
    await expect(page.getByRole("heading", { name: "新聞中心", level: 1 })).toBeVisible();
  });

  test("TC-023 @news @content @P0 News list displays required card fields", async ({ page }, testInfo) => {
    await annotateNewsCase(
      "TC-023",
      "News card content",
      "critical",
      "Verify the news list renders at least one card with category, date, title, summary, and read-more link."
    );

    await page.goto("/news");

    const firstCard = page.locator(".news-card").first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.getByText("行業動態", { exact: false })).toBeVisible();
    await expect(firstCard.getByText(/\d{4}-\d{2}-\d{2}/)).toBeVisible();
    await expect(firstCard.getByRole("heading", { level: 2 })).toContainText("羅姆");
    await expect(firstCard.getByText("...", { exact: true })).toBeVisible();
    await expect(firstCard.getByRole("link", { name: /閱讀更多/ })).toBeVisible();

    const cardSnapshot = await firstCard.innerText();
    await testInfo.attach("news-first-card-snapshot.txt", {
      body: Buffer.from(cardSnapshot, "utf8"),
      contentType: "text/plain"
    });
  });

  test("TC-024 @news @filter @P1 News category filter keeps matching news visible", async ({ page }, testInfo) => {
    await annotateNewsCase(
      "TC-024",
      "News category filter",
      "normal",
      "Verify current PROD single-category filtering keeps matching cards visible and restores all cards when switching back to All."
    );

    await page.goto("/news");

    const allButton = page.locator(".filter-btn", { hasText: "全部" });
    const categoryButton = page.locator(".filter-btn", { hasText: "行業動態" });
    const cards = page.locator(".news-card");

    await expect(allButton).toHaveClass(/active/);
    await expect(cards.first()).toBeVisible();

    await categoryButton.click();
    await expect(categoryButton).toHaveClass(/active/);

    const categoryState = await page.locator(".news-card").evaluateAll((cardElements) =>
      cardElements.map((card) => {
        const element = card as HTMLElement;
        return {
          category: element.dataset.category,
          hidden: element.classList.contains("hidden"),
          text: element.innerText.trim()
        };
      })
    );

    await testInfo.attach("news-filter-state.json", {
      body: Buffer.from(JSON.stringify(categoryState, null, 2), "utf8"),
      contentType: "application/json"
    });

    expect(categoryState.filter((card) => !card.hidden).every((card) => card.category === "行業動態")).toBeTruthy();

    await allButton.click();
    await expect(allButton).toHaveClass(/active/);
    await expect(cards.first()).toBeVisible();
  });

  test("TC-025 @news @link @external @security @P1 News read-more link opens external article safely", async ({
    page
  }, testInfo) => {
    await annotateNewsCase(
      "TC-025",
      "News external link safety",
      "normal",
      "Verify the news read-more link points to the expected external article and uses safe external-link attributes."
    );

    await page.goto("/news");

    const readMore = page.getByRole("link", { name: /閱讀更多/ }).first();
    await expect(readMore).toBeVisible();

    const linkSnapshot = {
      href: await readMore.getAttribute("href"),
      target: await readMore.getAttribute("target"),
      rel: await readMore.getAttribute("rel")
    };

    await testInfo.attach("news-read-more-link.json", {
      body: Buffer.from(JSON.stringify(linkSnapshot, null, 2), "utf8"),
      contentType: "application/json"
    });

    expect(linkSnapshot.href).toContain("https://technews.tw/");
    expect(linkSnapshot.target).toBe("_blank");
    expect(linkSnapshot.rel).toContain("noopener");
    expect(linkSnapshot.rel).toContain("noreferrer");
  });

  test("TC-026 @news @pagination @empty-state @P2 News empty state and pagination state are consistent with result count", async ({
    page
  }, testInfo) => {
    await annotateNewsCase(
      "TC-026",
      "News list state consistency",
      "minor",
      "Verify current PROD news result count, empty-state visibility, and hidden pagination state are consistent."
    );

    await page.goto("/news");

    const state = await page.evaluate(() => {
      const cards = [...document.querySelectorAll<HTMLElement>(".news-card")];
      const empty = document.querySelector<HTMLElement>("#news-empty");
      const pagination = document.querySelector<HTMLElement>("#pagination");
      const visibleCards = cards.filter((card) => !card.classList.contains("hidden"));

      return {
        totalCards: cards.length,
        visibleCards: visibleCards.length,
        emptyHidden: empty?.classList.contains("hidden") ?? false,
        paginationText: pagination?.innerText.trim() ?? "",
        paginationHtml: pagination?.innerHTML.trim() ?? ""
      };
    });

    await testInfo.attach("news-list-state.json", {
      body: Buffer.from(JSON.stringify(state, null, 2), "utf8"),
      contentType: "application/json"
    });

    expect(state.totalCards, "Current PROD should have at least one news card").toBeGreaterThan(0);
    expect(state.visibleCards, "At least one news card should be visible").toBeGreaterThan(0);
    expect(state.emptyHidden, "Empty state should be hidden when news results exist").toBeTruthy();

    if (state.totalCards <= 10) {
      expect(state.paginationHtml, "Pagination should be hidden when result count fits on one page").toBe("");
    }
  });
});
