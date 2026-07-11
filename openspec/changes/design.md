# Gemmicro Tech Auto 目前架構設計

## Context

### 專案定位

`Gemmicro_Tech_Auto` 是針對 Gemmicro 官網的 Playwright E2E 自動化測試專案，目前以首頁 smoke、zh-TW 導覽、語系切換、footer、MOSFET product page 與 MOSFET API 檢查為主。

主要測試網站：

- `https://www.gemmicro.com.tw/zh-TW/`

主要專案路徑：

- `C:\Users\lo762\Gemmicro_Tech_Auto`

### 技術棧

| 類別 | 工具 |
|------|------|
| Runtime | Node.js |
| Test Runner | Playwright Test |
| Language | TypeScript |
| Report | Playwright HTML Report、Allure |
| Browser Project | Chromium / Desktop Chrome |
| 文件 | Markdown、OpenSpec style docs |

---

## Goals / Non-Goals

### Goals

- 保留目前可執行 smoke 測試。
- 讓後續 Agent 能讀 `openspec/changes` 快速接手。
- 將測試架構、資料流、報告流與後續任務文件化。
- 讓測試案例文件與 executable tests 保持可追溯。
- 將網站現況與測試期待不一致的地方記錄為風險或待確認事項。

### Non-Goals

- 不在此階段導入新測試框架。
- 不在此階段改寫為大型 Page Object 架構。
- 不在此階段導入 CI/CD。
- 不提交 generated artifacts。

---

## Current Folder Structure

```text
Gemmicro_Tech_Auto/
├── data/
│   └── site.data.ts
├── docs/
│   ├── PROJECT_ARCHITECTURE.md
│   ├── USER_GUIDE.md
│   └── test-cases/
│       ├── README.md
│       ├── _template.md
│       └── gemmicro-homepage.md
├── fixtures/
│   └── test.fixture.ts
├── openspec/
│   ├── config.yaml
│   └── changes/
│       ├── agent-rules.md
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       ├── worklog.md
│       ├── archive/
│       └── log/
├── pages/
│   └── HomePage.ts
├── scripts/
│   ├── allure-generate.ps1
│   ├── allure-generate.mjs
│   ├── allure-generate.cjs
│   ├── allure-open-latest.ps1
│   ├── allure-open-latest.mjs
│   └── allure-open-latest.cjs
├── tests/
│   └── smoke/
│       └── homepage.smoke.spec.ts
├── global-setup.ts
├── package.json
└── playwright.config.ts
```

Generated artifacts：

```text
allure-results/
allure-reports/
playwright-report/
test-results/
.allure-latest
```

---

## Runtime Configuration

### `playwright.config.ts`

目前主要設定：

- `globalSetup: "./global-setup.ts"`
- `testDir: "./tests"`
- `timeout: 30 * 1000`
- `expect.timeout: 5000`
- `fullyParallel: true`
- `reporter`：
  - Playwright HTML report：`open: "never"`
  - Allure：`resultsDir: "allure-results"`
- `use.baseURL: "https://www.gemmicro.com.tw/zh-TW/"`
- `trace: "on-first-retry"`
- `screenshot: "only-on-failure"`
- `video: "retain-on-failure"`
- project：`chromium` with `Desktop Chrome`

### `package.json` scripts

| Script | 用途 |
|--------|------|
| `npm test` | 清空 `allure-results` 後執行全部測試 |
| `npm run test:smoke` | 執行 `@smoke` 測試 |
| `npm run test:p0` | 執行 `@P0` 測試 |
| `npm run test:p1` | 執行 `@P1` 測試 |
| `npm run test:p2` | 執行 `@P2` 測試 |
| `npm run test:headed` | headed 模式執行 |
| `npm run test:ui` | Playwright UI 模式 |
| `npm run report` | 開啟 Playwright HTML report |
| `npm run allure:generate` | 產生 Allure report |
| `npm run allure:open` | 開啟最新 Allure report |

以上 scripts 會先執行 `chcp 65001>nul`，避免 Windows 終端顯示中文測試名稱或 Markdown 內容時出現亂碼。

---

## Test Architecture

### Fixture Layer

檔案：

- `fixtures/test.fixture.ts`

提供：

- `homePage` fixture：封裝 `HomePage` Page Object。
- `autoCaptureArtifacts` auto fixture：
  - 收集 `console.error`
  - 收集 `pageerror`
  - 收集 `requestfailed`
  - 每次測試結束附加 viewport screenshot
  - 每次測試結束附加 runtime log
  - 失敗時附加 failure summary

### Page Object Layer

檔案：

- `pages/HomePage.ts`

目前方法：

- `goto()`：前往 baseURL `/`
- `expectCoreContentVisible()`：檢查首頁核心內容：
  - `GEMMICRO Logo`
  - `Precision Technology Leader`
  - `產品中心`
  - `關於我們`

### Test Layer

檔案：

- `tests/smoke/homepage.smoke.spec.ts`

目前共有 11 個 smoke 測試：

| ID | 類型 | Priority | 目的 |
|----|------|----------|------|
| `TC-HOME-001` | Smoke | P0 | 首頁可載入，核心 logo 與 hero 文字可見 |
| `TC-HOME-002` | Smoke | P0 | zh-TW 與英文主要導覽項目可見 |
| `TC-HOME-003` | Functional | P1 | zh-TW 主要導覽跳轉正確 |
| `TC-HOME-004` | UI | P1 | 語系切換入口可見，EN 可切換 |
| `TC-HOME-005` | UI | P2 | footer copyright 可見 |
| `TC-HOME-006` | API/UI | P0 | MOSFET API total 與 UI pagination total / rows 一致 |
| `TC-HOME-007` | API | P0 | MOSFET API 欄位型別合法 |
| `TC-HOME-008` | UI/API | P0 | MOSFET product page 單一與多重 filter 結果正確 |
| `TC-HOME-009` | UI/API | P0 | 多重 filter 後 reset 可恢復完整結果 |
| `TC-HOME-010` | Responsive UI | P0 | product page filter row 隨 viewport 寬度顯示/隱藏 |
| `TC-HOME-011` | API | P0 | MOSFET API duplicate check by `pn` and `pn+type` |

---

## Data and Constants

### `data/site.data.ts`

目前只放首頁預期選單：

```ts
expectedMenuItems: ["產品中心", "關於我們", "聯絡我們"]
```

### Inline constants in spec

目前 `homepage.smoke.spec.ts` 仍有 inline constants：

```ts
const MOSFET_API_URL = "https://www.gemmicro.com.tw/zh-TW/api/mosfet";
const PRODUCT_PAGE_URL = "https://www.gemmicro.com.tw/zh-TW/product_mostfet";
```

建議後續移入 `data/site.data.ts` 或新增 `data/endpoints.ts`。

---

## Report Flow

```text
npm run test:smoke
      │
      ▼
Playwright executes tests
      │
      ├── playwright-report/
      ├── test-results/
      └── allure-results/
              │
              ▼
npm run allure:generate
              │
              ▼
allure-reports/yyyyMMdd/###
              │
              ▼
.allure-latest
```

最新已確認報告：

- `C:\Users\lo762\Gemmicro_Tech_Auto\allure-reports\20260709\002`

---

## Decisions

### 1. 以目前網站真實狀態為測試期待

測試應對齊目前線上網站，而不是舊版文案。

近期已調整：

- 首頁核心檢查改為 `GEMMICRO Logo` 與 `Precision Technology Leader`。
- 導覽項目改為 `產品應用 / Application Note`，不再期待 `解決方案 / Solutions` 是主要可見項。
- footer 公司名改為 `Gem-micro Semiconductor Inc.`。

### 2. API 欄位型別允許 boolean

MOSFET API 目前包含 `hasDatasheet: boolean`，因此 `TC-HOME-007` 合法型別為：

- `string`
- `number`
- `boolean`
- `null`

### 3. 可見可點才納入 smoke redirect

首頁 DOM 內有些連結存在但不是目前可見可點入口，例如部分 product / about dropdown 子項。Smoke redirect 測試只納入目前使用者可見可操作的入口。

### 4. Generated artifacts 不納入架構核心

`allure-results`、`allure-reports`、`playwright-report`、`test-results` 是執行結果，不應作為手動維護文件或原始碼。

---

## Risks / Trade-offs

- **線上網站內容會變動**：導覽文字、footer、API 欄位若變更，測試會失敗。
  - 建議：失敗時先用 error-context 或實際頁面 snapshot 確認網站現況，再更新測試。
- **spec 檔目前偏大**：`homepage.smoke.spec.ts` 同時包含首頁、product page、API 檢查。
  - 建議：後續拆成 `homepage.smoke.spec.ts`、`product-mosfet.spec.ts`、`api-mosfet.spec.ts`。
- **Page Object 覆蓋不足**：很多操作仍散落在 spec。
  - 建議：擴充 `HomePage.ts`，新增 `ProductPage.ts`。
- **測試資料分散**：URL、文字、API endpoint 目前部分 inline。
  - 建議：集中到 `data/site.data.ts` 或 `data/endpoints.ts`。
- **PowerShell execution policy**：直接執行 `npx` 可能被擋。
  - 建議：使用 `cmd /c npx playwright ...` 或專案 npm script。

---

## Open Questions

- 是否要把 `TC-HOME-006~011` 從 homepage 文件拆到 `docs/test-cases/gemmicro-mosfet.md`？
- 是否要新增 `ProductPage.ts` 並將 filter / pagination 操作抽出？
- 是否要建立 API contract 文件，固定 MOSFET API 欄位型別與 duplicate 判斷規則？
- 是否要加入 CI 執行與 report 保存策略？
