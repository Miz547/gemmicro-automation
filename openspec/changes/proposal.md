# Gemmicro Tech Auto 專案完善提案

## Why

目前 `Gemmicro_Tech_Auto` 已具備 Playwright 自動化測試、Allure 報告、截圖與 runtime log 附件能力，但專案文件與架構規格仍不完整。近期已新增 `openspec/changes` 多個 Markdown 檔案，目標是讓後續 AI Agent 或人員接手時，可以快速理解：

- 目前測試專案架構。
- 測試案例與可執行測試的對應關係。
- 報告與 log 產出位置。
- 哪些測試已通過、哪些項目仍待擴充。
- 後續完善方向與執行順序。

## What Changes

- 建立 OpenSpec 風格文件：
  - `agent-rules.md`
  - `proposal.md`
  - `design.md`
  - `tasks.md`
  - `worklog.md`
- 將目前專案架構寫入 `openspec/changes/design.md`。
- 將後續完善任務拆解寫入 `openspec/changes/tasks.md`。
- 將最新工作紀錄、測試結果與報告路徑寫入 `openspec/changes/worklog.md`。
- 補強文件規範，要求後續修改測試時同步維護 `docs/test-cases` 與 OpenSpec 文件。

## Capabilities

### 現有能力

- `homepage-smoke-test`：使用 Playwright 驗證 Gemmicro 首頁與主要 zh-TW 導覽。
- `mosfet-api-check`：檢查 MOSFET API response、欄位型別、重複資料與 UI pagination 一致性。
- `artifact-capture`：每次測試自動附加 screenshot、runtime log，失敗時附加 failure summary。
- `allure-report`：使用 Allure 產生日序號化報告。
- `test-case-docs`：以 Markdown 保存需求層測試案例。

### 本次新增能力

- `openspec-change-docs`：建立可供 AI Agent 延續工作的架構與任務文件。
- `project-handoff`：將目前架構、命令、報告路徑、風險與下一步集中到 `openspec/changes`。
- `agent-operating-rules`：明確規範後續 Agent 應如何讀文件、跑測試、更新 worklog。

### 後續建議能力

- `test-data-centralization`：將導覽文字、URL、API endpoint、pagination 規則集中至 `data/site.data.ts`。
- `page-object-expansion`：把目前散落在 spec 的首頁操作抽入 `pages/HomePage.ts`。
- `product-page-object`：新增 `ProductPage.ts` 管理 MOSFET product page filter、pagination、table row 操作。
- `api-contract-docs`：將 MOSFET API schema 與可接受欄位型別文件化。
- `ci-ready-runner`：補上 CI 執行策略與報告保存方式。

## Impact

- **主要路徑**：`C:\Users\lo762\Gemmicro_Tech_Auto`
- **技術棧**：Node.js、TypeScript、Playwright、Allure。
- **主要測試入口**：`tests/smoke/homepage.smoke.spec.ts`
- **主要報告輸出**：
  - `allure-results/`
  - `allure-reports/yyyyMMdd/###`
  - `playwright-report/`
  - `test-results/`
- **文件輸出**：
  - `openspec/changes/*.md`
  - `docs/test-cases/*.md`

## Non-Goals

- 本次不新增新的網站功能。
- 本次不重構整個測試檔。
- 本次不導入 CI/CD。
- 本次不修改 Gemmicro 線上網站。
- 本次不把 Allure 或 Playwright generated artifacts 納入版本管理。

## Open Questions

- 是否要將目前 `TC-HOME-006~011` API 與 MOSFET product page 測試補成獨立 `docs/test-cases/product-mosfet.md`？
- 是否要新增 `pages/ProductPage.ts`，把 MOSFET filter / pagination 操作從 spec 抽出？
- 是否要建立 `docs/api-contracts/mosfet-api.md`，記錄 MOSFET API 欄位與允許型別？
- 是否要規劃 CI 執行，例如 GitHub Actions 或本機排程？
