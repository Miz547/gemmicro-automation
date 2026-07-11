# Gemmicro QA Automation Contributing Guide

## 正式執行目錄

Playwright 自動化正式執行目錄固定為：

```powershell
cd C:\Users\lo762\Gemmicro_Tech_Auto\playwright-tool
```

常用指令：

```powershell
npm install
npx playwright install
npm run test
npm run allure:generate
npm run allure:open
npm run test:report
```

`npm run test:report` 會依序執行測試、產生 Allure report、開啟最新 Allure report。因為最後一步會啟動報告服務，終端可能會維持執行狀態，這是正常行為。

## Case 與 Spec 關係

`test-cases/*.md` 是業務邏輯與測試設計來源，Playwright spec 是自動化執行層。

兩者只用 Case ID 建立弱關聯，不要求 Markdown 步驟與 spec 程式碼逐字同步。當需求或測試意圖改變時，先更新 Markdown，再調整對應 spec。

規則：

- 一個 Case ID 對應一個 Playwright `test()`。
- Case ID 使用全專案唯一流水號：`TC-001`、`TC-002`、`TC-003`。
- Case ID 只負責唯一識別，不負責分類。
- 不使用 `TC-HOME-*`、`TC-MOSFET-*`、`TC-NEWS-*` 這類 domain-based ID。
- 功能分類改由 `Feature`、`Area`、`Type`、`Tags` 控制。
- 是否加入 smoke 流程，透過 `Smoke: true` 與 `@smoke` tag 控制，不透過 Case ID 控制。
- 一個 case 若同時覆蓋多個功能，使用 `Area` 與多個 tags 表示，例如 `Area: Home, Contact, News` 與 `@home @contact @news`。

## Case Metadata 規則

每條 Markdown case 都應包含以下 metadata：

```markdown
- Case ID: `TC-001`
- Feature: Navigation
- Area: Home, Contact, News
- Type: Functional
- Priority: P0
- Smoke: true
- Tags: @home @navigation @contact @news @smoke @P0
- Automation: Yes
```

欄位定義：

- `Case ID`：全專案唯一流水號，例如 `TC-001`、`TC-002`、`TC-003`；不可重複、不可重用。
- `Feature`：主要測試功能，例如 `Home`、`Navigation`、`MOSFET`、`Contact`、`News`。
- `Area`：實際覆蓋範圍，可多選，例如 `Home, Contact, News, Product`。
- `Type`：測試主要型態，例如 `Smoke`、`API`、`Functional`、`UI`、`Data Quality`。
- `Priority`：重要程度，使用 `P0`、`P1`、`P2`。
- `Smoke`：是否加入快速健康檢查流程，使用 `true` 或 `false`。
- `Tags`：Playwright 執行篩選用 tag，例如 `@smoke`、`@P0`、`@home`、`@mosfet`、`@contact`、`@news`。
- `Automation`：是否適合自動化，使用 `Yes`、`No`、`Partial`。

Priority 定義：

- `P0`：最高優先級，壞了要立刻處理，通常會進 smoke 或每日必跑。
- `P1`：重要功能回歸，適合常規 regression。
- `P2`：補充情境、邊界條件或低頻功能。

`Priority` 與 `Smoke` 是不同概念：

- `Priority` 控制重要程度。
- `Smoke` 控制是否納入快速健康檢查流程。

Playwright spec 至少要保留 Case ID 與 tags，例如：

```ts
test('TC-001 @mosfet @smoke @P0 [MOSFET] 產品頁可正常載入', async ({ productPage }) => {
  // ...
});
```

## 測試分類決策樹

新增 case 時先判斷測試目的，再放入對應資料夾：

- `tests/smoke`：首頁載入、核心導覽、主流程是否活著。
- `tests/api`：API status、schema、欄位型別、response contract。
- `tests/functional`：使用者流程、filter、pagination、reset、跨 UI/API 的功能一致性。
- `tests/ui`：RWD、版面、純 UI 狀態與互動，不以資料正確性為主。
- `tests/data-quality`：重複資料、空值、資料一致性、資料異常統計。

如果一個 case 同時像 API 與資料品質，優先看驗證目標：

- 驗證 API 是否可用與欄位是否符合 contract，放 `tests/api`。
- 驗證資料是否重複、缺漏或異常，放 `tests/data-quality`。

## Page Object 與 Fixture 規則

Page Object 負責 locator、頁面動作與資料讀取 helper。斷言留在 spec。

可放在 Page Object：

- `goto()`
- locator getter
- `clickFilterOption()`
- `resetFilters()`
- `parsePagination()`
- `getTableRowCount()`

不要放在 Page Object：

- `expect()`
- case-specific assertion
- Allure metadata
- 測試案例判斷邏輯

Page Object 需要透過 `fixtures/test.fixture.ts` 註冊，例如目前已有 `homePage` 與 `productPage`。

## Assertion 原則

自動化測試不能靜默略過核心驗證。

例如 pagination：

- 若 API total 大於單頁筆數，下一頁按鈕必須存在且可點擊。
- 若條件不滿足，應明確 fail，而不是直接 pass。
- 若某 UI 元素在資料不足時本來不該存在，spec 需要先用業務條件說明再判斷。

Filter 與 reset 類 case 應逐步補強：

- Filter 不只檢查仍有資料，應驗證資料真的符合條件。
- Reset 不只檢查 total，應檢查 filter state、URL query、row count 或 API query 是否回復。

## Allure Metadata 規則

每個測試案例都應補 Allure metadata，讓報表可追蹤：

- `owner`
- `feature`
- `story`
- `severity`
- `testCaseId`
- `description`

API 或資料品質測試若發現異常，應附上 evidence，例如 raw response、anomaly list 或關鍵統計資料。

## Baseline 保護

目前已建立 `TC-001~017` 的可執行 baseline。後續調整架構時，優先保持既有測試可穩定通過。

禁止只為了美觀做下列異動：

- 搬動已穩定通過的舊 spec。
- 把 Markdown 與 spec 強制做逐字同步。

可以做的務實改善：

- 新 case 使用下一個可用流水號。
- 新 case 放入正確分類資料夾。
- 透過 metadata、Allure feature/story、tags 改善可讀性。
- 逐步抽 Page Object，降低 spec 重複程式碼。

## 不進版控的輸出

以下為本機安裝或測試輸出，不應提交：

- `node_modules/`
- `playwright-report/`
- `test-results/`
- `allure-results/`
- `allure-reports/`
- `.allure-latest`


