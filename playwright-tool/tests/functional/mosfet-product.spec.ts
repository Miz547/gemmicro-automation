import { type TestInfo } from "@playwright/test";
import { test, expect } from "../../fixtures/test.fixture";
import * as allure from "allure-js-commons";

const PAGE_SIZE = 30;

type MosfetRecord = Record<string, unknown>;

function normalizeRecords(payload: unknown): MosfetRecord[] {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is MosfetRecord => item !== null && typeof item === "object" && !Array.isArray(item));
  }

  if (payload !== null && typeof payload === "object" && "data" in payload) {
    const data = (payload as { data?: unknown }).data;
    if (Array.isArray(data)) {
      return data.filter((item): item is MosfetRecord => item !== null && typeof item === "object" && !Array.isArray(item));
    }
  }

  return [];
}

async function attachJson(testInfo: TestInfo, name: string, data: unknown) {
  await testInfo.attach(name, {
    body: Buffer.from(JSON.stringify(data, null, 2), "utf8"),
    contentType: "application/json"
  });
}

async function annotateMosfetUiCase(caseId: string, story: string, description: string) {
  await allure.owner("QA Automation");
  await allure.feature("MOSFET Product Page");
  await allure.story(story);
  await allure.severity("critical");
  await allure.testCaseId(caseId);
  await allure.description(description);
}

test.describe("Gemmicro MOSFET product cases", () => {
  test("TC-006 @mosfet @api @pagination @P0 @functional API total matches UI pagination and rows", async ({
    productPage
  }, testInfo) => {
    await annotateMosfetUiCase(
      "TC-006",
      "API and UI pagination consistency",
      "Verify MOSFET API total count matches product page pagination and visible table rows."
    );

    const apiResponse = await productPage.goto();
    const records = normalizeRecords(await apiResponse.json());
    expect(records.length, "MOSFET API should return at least one record").toBeGreaterThan(0);

    const expectedFirstPageEnd = Math.min(PAGE_SIZE, records.length);
    const firstPage = await productPage.getPagination();
    expect(firstPage, "First page pagination text should be parseable").not.toBeNull();
    expect(firstPage?.start).toBe(1);
    expect(firstPage?.end).toBe(expectedFirstPageEnd);
    expect(firstPage?.total).toBe(records.length);
    expect(await productPage.getTableRowCount()).toBe(expectedFirstPageEnd);

    const paginationLog: Array<Record<string, unknown>> = [
      {
        stage: "first-page",
        pagination: firstPage,
        rows: await productPage.getTableRowCount()
      }
    ];

    if (records.length > PAGE_SIZE) {
      await expect
        .poll(() => productPage.isNextPageButtonVisible(), {
          message: "Next page button must exist when API total exceeds one page"
        })
        .toBeTruthy();

      await productPage.clickNextPage();
      const secondPage = await productPage.getPagination();
      expect(secondPage?.start).toBe(PAGE_SIZE + 1);
      expect(secondPage?.end).toBe(Math.min(PAGE_SIZE * 2, records.length));
      expect(secondPage?.total).toBe(records.length);
      expect(await productPage.getTableRowCount()).toBe(Math.min(PAGE_SIZE, records.length - PAGE_SIZE));
      paginationLog.push({
        stage: "second-page",
        pagination: secondPage,
        rows: await productPage.getTableRowCount()
      });

      const totalPages = Math.ceil(records.length / PAGE_SIZE);
      for (let pageIndex = 3; pageIndex <= totalPages; pageIndex += 1) {
        await expect
          .poll(() => productPage.isNextPageButtonVisible(), {
            message: `Next page button must exist before navigating to page ${pageIndex}`
          })
          .toBeTruthy();
        await productPage.clickNextPage();
      }

      const lastPage = await productPage.getPagination();
      const expectedLastStart = (totalPages - 1) * PAGE_SIZE + 1;
      expect(lastPage?.start).toBe(expectedLastStart);
      expect(lastPage?.end).toBe(records.length);
      expect(lastPage?.total).toBe(records.length);
      expect(await productPage.getTableRowCount()).toBe(records.length - expectedLastStart + 1);
      paginationLog.push({
        stage: "last-page",
        pagination: lastPage,
        rows: await productPage.getTableRowCount()
      });
    }

    await attachJson(testInfo, "pagination-log.json", {
      apiTotal: records.length,
      pageSize: PAGE_SIZE,
      checks: paginationLog
    });
  });

  test("TC-008 @mosfet @filter @P0 @functional Product page single and multiple filters yield results", async ({
    productPage
  }, testInfo) => {
    await annotateMosfetUiCase(
      "TC-008",
      "MOSFET filter behavior",
      "Verify single and multiple filters can be applied and leave visible product results."
    );

    await productPage.goto();
    const initialPagination = await productPage.getPaginationText();

    const filterLog: Array<Record<string, unknown>> = [{ stage: "initial", pagination: initialPagination }];
    const filters = ["PDFN3.3*3.3", "PDFN5*6", "60"];

    for (const filter of filters) {
      const clicked = await productPage.clickFilterOption(filter);
      filterLog.push({ stage: `filter:${filter}`, clicked });

      if (clicked) {
        await productPage.waitForUiUpdate();
        filterLog.push({
          stage: `after:${filter}`,
          pagination: await productPage.getPaginationText(),
          rows: await productPage.getTableRowCount()
        });
      }
    }

    await attachJson(testInfo, "filter-log.json", filterLog);
    expect(await productPage.getTableRowCount()).toBeGreaterThan(0);
  });

  test("TC-009 @mosfet @filter @reset @P0 @functional Multiple filters then reset restores full results", async ({
    productPage
  }, testInfo) => {
    await annotateMosfetUiCase(
      "TC-009",
      "MOSFET filter reset",
      "Verify multiple filters can be reset and total count returns to the initial state."
    );

    await productPage.goto();
    const initialPagination = await productPage.getPagination();
    expect(initialPagination, "Initial pagination should be parseable").not.toBeNull();

    const filterLog: Array<Record<string, unknown>> = [{ stage: "initial", pagination: initialPagination }];
    for (const filter of ["60", "20", "-1.3"]) {
      const clicked = await productPage.clickFilterOption(filter);
      filterLog.push({ stage: `filter:${filter}`, clicked });
      if (clicked) {
        await productPage.waitForUiUpdate();
      }
    }

    await productPage.resetFilters();
    await productPage.waitForUiUpdate();

    const resetPagination = await productPage.getPagination();
    filterLog.push({ stage: "reset", pagination: resetPagination });

    await attachJson(testInfo, "reset-filter-log.json", filterLog);
    expect(resetPagination?.total).toBe(initialPagination?.total);
  });

  test("TC-010 @mosfet @filter @responsive @P0 @ui Filter row visibility changes with viewport width", async ({
    page,
    productPage
  }, testInfo) => {
    await annotateMosfetUiCase(
      "TC-010",
      "Responsive filter panel",
      "Verify filter row and toggle behavior across desktop and tablet viewport widths."
    );

    await page.setViewportSize({ width: 1366, height: 768 });
    await productPage.goto();

    await expect(productPage.filterRow).toBeVisible();

    await page.setViewportSize({ width: 1023, height: 768 });
    await expect(productPage.filterRow).toBeHidden();

    await expect(productPage.filterToggle).toBeVisible();
    await productPage.filterToggle.click();
    await expect(productPage.filterRow).toBeVisible();

    await testInfo.attach("responsive-filter-expanded.png", {
      body: await page.screenshot({ fullPage: false }),
      contentType: "image/png"
    });
  });
});
