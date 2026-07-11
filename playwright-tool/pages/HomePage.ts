import { expect, type Page } from "@playwright/test";

export class HomePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  async expectCoreContentVisible() {
    await expect(this.page.getByRole("img", { name: "GEMMICRO Logo" })).toBeVisible();
    await expect(this.page.getByText("Precision Technology Leader", { exact: true })).toBeVisible();
    const heroHeading = this.page.getByRole("heading", { level: 1 });
    await expect(heroHeading).toContainText("專業．卓越");
    await expect(heroHeading).toContainText("引領半導體未來");
    await expect(this.page.getByText("半導體設備與關鍵組件", { exact: false })).toBeVisible();
    await expect(this.page.getByText("專業的服務團隊", { exact: false })).toBeVisible();
    await expect(this.page.getByText("產品中心", { exact: false }).first()).toBeVisible();
    await expect(this.page.getByText("關於我們", { exact: false }).first()).toBeVisible();
  }
}
