import type { Locator, Page, Response } from "@playwright/test";

export type PaginationState = {
  start: number;
  end: number;
  total: number;
  raw: string;
};

const PRODUCT_PAGE_URL = "https://www.gemmicro.com.tw/zh-TW/product_mostfet";
const MOSFET_API_URL_PATTERN = /\/zh-TW\/api\/mosfet|\/api\/mosfet/;

export class ProductPage {
  readonly filterRow: Locator;
  readonly filterToggle: Locator;
  readonly resetButton: Locator;
  readonly tableRows: Locator;
  readonly nextPageButton: Locator;
  readonly pageInfo: Locator;

  constructor(private readonly page: Page) {
    this.filterRow = page.locator("#filter-row");
    this.filterToggle = page.locator("#filter-toggle");
    this.resetButton = page.getByText("\u91cd\u7f6e", { exact: false }).first();
    this.tableRows = page.locator("table tbody tr");
    this.nextPageButton = page.getByRole("button", { name: "\u203a" }).first();
    this.pageInfo = page.locator("#page-info");
  }

  async goto(): Promise<Response> {
    const apiResponsePromise = this.page.waitForResponse(
      (response) => MOSFET_API_URL_PATTERN.test(response.url()) && response.status() === 200,
      { timeout: 15000 }
    );

    await this.page.goto(PRODUCT_PAGE_URL);
    return apiResponsePromise;
  }

  parsePagination(text: string): PaginationState | null {
    const normalized = text.replace(/\s+/g, " ");
    const match = normalized.match(/(\d+)\s*[\u2013-]\s*(\d+).*?(\d+)/);

    if (!match) {
      return null;
    }

    return {
      start: Number(match[1]),
      end: Number(match[2]),
      total: Number(match[3]),
      raw: text.trim()
    };
  }

  async getPaginationText() {
    return this.pageInfo.innerText();
  }

  async getPagination() {
    return this.parsePagination(await this.getPaginationText());
  }

  async getTableRowCount() {
    return this.tableRows.count();
  }

  async isNextPageButtonVisible() {
    return this.nextPageButton.isVisible().catch(() => false);
  }

  async clickNextPage() {
    await this.nextPageButton.click();
  }

  async waitForUiUpdate(timeoutMs = 500) {
    await this.page.waitForTimeout(timeoutMs);
  }

  async clickFilterOption(text: string) {
    const candidate = this.page.getByText(text, { exact: true }).first();

    if (!(await candidate.isVisible().catch(() => false))) {
      return false;
    }

    await candidate.click();
    return true;
  }

  async resetFilters() {
    await this.resetButton.click();
  }
}
