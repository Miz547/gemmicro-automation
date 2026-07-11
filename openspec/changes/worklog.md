# Worklog

## 2026-07-09

### 紀錄者 AI Agent

- Codex

### 今日重點

- 續做 Gemmicro 官網自動化測試專案。
- 先確認 log/report 與 Markdown 測試案例資料夾。
- 修正目前 smoke 測試與線上網站現況不一致的地方。
- 產生最新 Allure report。
- 依 user 指示參考 OPENSPEC 範例，將目前專案架構寫入 `openspec/changes` 內的 Markdown 文件。

### 已確認

- 專案路徑：`C:\Users\lo762\Gemmicro_Tech_Auto`
- 需求層測試案例路徑：`C:\Users\lo762\Gemmicro_Tech_Auto\docs\test-cases`
- OpenSpec 文件路徑：`C:\Users\lo762\Gemmicro_Tech_Auto\openspec\changes`
- 主要測試檔：`tests/smoke/homepage.smoke.spec.ts`
- 主要 Page Object：`pages/HomePage.ts`
- 共用 fixture：`fixtures/test.fixture.ts`
- Allure 最新報告 marker：`.allure-latest`

### 已完成

- 確認 `docs/test-cases` 內既有文件：
  - `README.md`
  - `_template.md`
  - `gemmicro-homepage.md`
- 確認測試輸出資料夾：
  - `allure-results/`
  - `allure-reports/`
  - `playwright-report/`
  - `test-results/`
- 修正 `TC-HOME-001`：
  - 首頁核心檢查改為 `GEMMICRO Logo` 與 `Precision Technology Leader`。
- 修正 `TC-HOME-002`：
  - zh-TW 導覽項目改為目前網站實際項目。
  - 英文導覽改為 `Application Note`，不再期待 `Solutions`。
- 修正 `TC-HOME-003`：
  - 移除舊版 Diodes / Transistors / Protection 跳轉。
  - 保留目前可見可點的首頁、MOSFET、產品應用、發展歷程、聯絡我們、新聞中心。
- 修正 `TC-HOME-005`：
  - footer expected text 改為 `Gem-micro Semiconductor Inc.`。
- 修正 `TC-HOME-007`：
  - MOSFET API 合法型別加入 `boolean`，因 API 目前包含 `hasDatasheet`。
- 更新 `docs/test-cases/gemmicro-homepage.md`：
  - 對齊目前 `TC-HOME-001~005` 測試期待。
- 新增並填寫 OpenSpec 文件：
  - `openspec/changes/agent-rules.md`
  - `openspec/changes/proposal.md`
  - `openspec/changes/design.md`
  - `openspec/changes/tasks.md`
  - `openspec/changes/worklog.md`
- 修正 Windows PowerShell 終端中文顯示亂碼問題：
  - 將含中文且常在終端讀取的 Markdown / TypeScript 檔案轉為 UTF-8 BOM。
  - 更新 `package.json`，讓 `npm run test:*`、`npm run report`、`npm run allure:*` 先執行 `chcp 65001`。
- 修復 XMind 測試案例檔：
  - 問題檔案：`QA-Agents/case-design/outputs/gemmicro-current-test-cases.xmind`
  - Xmind 錯誤：`Invalid attempt to iterate non-iterable instance`
  - 判斷原因：`.xmind` 內部 `content.json` 頂層是單一物件，但 Xmind 需要可迭代的 sheet 陣列。
  - 修復方式：將 `content.json` 頂層包成陣列。
  - 原始檔備份：`QA-Agents/case-design/outputs/gemmicro-current-test-cases.xmind.bak`

### 驗證結果

執行目錄：

```powershell
C:\Users\lo762\Gemmicro_Tech_Auto
```

受影響案例驗證：

```powershell
cmd /c npx playwright test -g "TC-HOME-00[357]"
```

結果：

```text
3 passed
```

完整 smoke 驗證：

```powershell
cmd /c npx playwright test -g "@smoke"
```

結果：

```text
11 passed
```

編碼修正後 smoke 驗證：

```powershell
npm run test:smoke
```

結果：

```text
11 passed
```

Allure report 產生：

```powershell
npm run allure:generate
```

最新報告：

```text
C:\Users\lo762\Gemmicro_Tech_Auto\allure-reports\20260709\002
```

### 本次補充紀錄

- 確認 Windows 終端目前可正常顯示中文：`cmd /c chcp` 回傳 `Active code page: 65001`。
- 確認使用 `Get-Content -Raw -Encoding UTF8` 可正常讀取中文 Markdown，不是文件內容損壞。
- 新增測試用例架構師產物：`docs/test-cases/ai-design_case.md`。
  - 覆蓋 `TC-HOME-006~011`。
  - 內容包含 MOSFET API/UI pagination、API 欄位型別、filter、reset、responsive UI、duplicate data check。
  - 文件定位為可交給 UI 自動化工程師實作的設計案例。
- 釐清 `agent-rules.md` 與 `agent.md` 的分工：
  - `agent-rules.md` 是長期 Agent 操作規則。
  - `agent.md` 適合作為下一位 AI Agent 的單次任務交接 prompt。

### 本次待確認

- 是否要將 `docs/test-cases/ai-design_case.md` 正式改名或整理為 `docs/test-cases/gemmicro-mosfet.md`？
- 是否要新增 `openspec/changes/agent.md`，交接下一位 Agent 實作 `ProductPage.ts` 與 spec 拆分？
### QA Agent 文件補充

- 新增測試用例架構師 Agent 說明文件：`QA-Agents/case-design/agents/test-case-master.md`。
- 文件參考使用者提供截圖內容撰寫，採繁體中文。
- 文件定義內容包含：
  - 角色定位：測試用例架構師 / 用例大師。
  - 擅長領域：多源文件分析、完整測試場景生成、結構化用例輸出、格式檢查、用例統計。
  - 分析框架：閱讀輸入、交叉分析、識別測試重點、產生測試案例、格式驗證、匯出與回報。
  - 資料取得方式：主理人訊息、OpenSpec、docs、tests、reports、截圖與 log。
  - 與 UI 自動化工程師、API 自動化工程師的分工。
- 此文件可作為後續 case-design Agent 的說明文檔與任務啟動依據。
### 測試案例範本修正

- 修正 `docs/test-cases/_template.md` 的 Example Case ID。
- 原本 `TC-HOME-001(Example))` 仍可能被 regex 掃描工具誤判為正式 `TC-HOME-001`，且 Markdown 反引號格式不完整。
- 已改為 `TC-EXAMPLE-001`，避免與正式 `TC-HOME-001~011` 案例衝突。
- 確認 `_template.md` 不再包含 `TC-HOME-*`，目前 XMind 輸出仍維持 11 筆正式案例。
### 待確認

- 是否要將 `TC-HOME-006~011` 從 `gemmicro-homepage.md` 拆出，新增 `docs/test-cases/gemmicro-mosfet.md`？
- 是否接受新增 `pages/ProductPage.ts`，將 MOSFET product page 的 pagination / filter / reset 操作集中？
- 是否要將 URL、導覽文字、API endpoint 與合法型別集中到 `data/site.data.ts` 或新增 `data/endpoints.ts`？
- 是否要把 `homepage.smoke.spec.ts` 拆成 homepage / mosfet product / mosfet api 多個 spec？
- 此專案目前不是 git repository；若後續要 CI/CD，需先確認版本管理位置。

### 下一步

建議優先順序：

1. 補 `docs/test-cases/gemmicro-mosfet.md`，讓 `TC-HOME-006~011` 有完整需求層文件。
2. 將 inline constants 移至 `data/site.data.ts` 或 `data/endpoints.ts`。
3. 新增 `pages/ProductPage.ts`，逐步抽出 MOSFET 頁面操作。
4. 視 user 決策拆分 spec 檔與測試 ID。
5. 若後續重新產生 `.xmind`，需確認 `content.json` 頂層為 array，例如 `[ { sheet... } ]`。

## 2026-07-10

### 紀錄者 AI Agent

- Codex

### 今日重點

- 將 Playwright 正式執行範圍集中到 `playwright-tool`。
- 重新整理 `tests` 分類資料夾。
- 生成並執行 `TC-HOME-001~011`。
- 補齊 Playwright browser binaries。
- 產生並開啟最新 Allure report。
- 修正 Allure report 可讀性，補上 testcase metadata 與 API raw response evidence。

### 已確認

- 正式執行目錄：`C:\Users\lo762\Gemmicro_Tech_Auto\playwright-tool`
- Playwright 設定檔：`playwright-tool/playwright.config.ts`
- 測試案例文件：
  - `test-cases/gemmicro-homepage.md`
  - `test-cases/ai-design_case.md`
- Playwright 可執行測試路徑：`playwright-tool/tests`
- Allure latest marker：`playwright-tool/.allure-latest`

### 已完成

- 執行 `npm install` 後，確認 `playwright-tool/node_modules` 與 `playwright-tool/package-lock.json` 已建立。
- 建立測試分類資料夾：
  - `tests/smoke`
  - `tests/api`
  - `tests/functional`
  - `tests/ui`
  - `tests/data-quality`
- 新增 `tests/smoke/homepage.smoke.spec.ts`：
  - 覆蓋 `TC-HOME-001~005`。
  - 保留每個 case ID 對應一個 Playwright `test()`。
- 新增 `tests/api/mosfet-api.spec.ts`：
  - 覆蓋 `TC-HOME-007` MOSFET API 欄位型別檢查。
  - 覆蓋 `TC-HOME-011` MOSFET API duplicate data 檢查。
- 新增 `tests/functional/mosfet-product.spec.ts`：
  - 覆蓋 `TC-HOME-006` MOSFET API/UI pagination 一致性。
  - 覆蓋 `TC-HOME-008` MOSFET filter 行為。
  - 覆蓋 `TC-HOME-009` filter reset 行為。
  - 覆蓋 `TC-HOME-010` responsive filter row 行為。
- 修正 Playwright browser 缺失：
  - 問題：`chromium_headless_shell.exe` 不存在。
  - 修正：執行 `npx playwright install`。
  - 補齊位置：`C:\Users\lo762\AppData\Local\ms-playwright\chromium_headless_shell-1228`
- 修正 Allure report 可讀性：
  - `TC-HOME-001~011` 補 `owner`、`feature`、`story`、`severity`、`testCaseId`、`description`。
  - API cases 補 `raw-api-response.json` 附件。

### 驗證結果

執行目錄：

```powershell
C:\Users\lo762\Gemmicro_Tech_Auto\playwright-tool
```

測試清單確認：

```powershell
cmd /c npx playwright test --list
```

結果：

```text
Total: 11 tests in 3 files
```

全量測試：

```powershell
npm run test
```

結果：

```text
11 passed
```

Allure report 產生：

```powershell
npm run allure:generate
```

最新報告：

```text
C:\Users\lo762\Gemmicro_Tech_Auto\playwright-tool\allure-reports\20260710\005
```

Allure summary：

```text
passed: 11
total: 11
```

Allure report 開啟：

```powershell
npm run allure:open
```

### 已知待補強

- `TC-HOME-008` 目前仍偏功能 smoke，尚未逐列驗證 filter 後每筆資料的欄位值完全符合條件。
- `TC-HOME-006` 翻頁按鈕驗證目前較保守，若按鈕 locator 不存在會略過下一頁/最後頁的嚴格驗證。
- `TC-HOME-009` reset 後已檢查 total 回復，但尚未檢查 selected filter state、URL query、第一頁 row count 是否完全回復。
- `TC-HOME-007` 與 `TC-HOME-011` 已補 raw API JSON 附件，但尚未補 raw API browser screenshot。
- 尚未抽出 `pages/ProductPage.ts`；目前 MOSFET product helper 仍在 spec 檔內。
- 尚未自訂 Allure `categories.json`；目前全量通過時 Categories 無內容屬正常現象。

### 架構師討論後代辦共識

- 不破壞目前 `TC-HOME-001~011` 的 11 passed baseline。
- 舊 case 暫時不搬檔、不改 ID，避免影響 Allure 歷史趨勢與既有追蹤。
- `TC-HOME-006~011` 保留既有 ID，但可在 test title / Allure feature / story 中標示 `[MOSFET]`。
- 新增 MOSFET case 時，啟用新 ID 命名空間，例如 `TC-MOSFET-001`。
- `test-cases/*.md` 保留為業務邏輯與測試設計來源，Playwright spec 保留為執行層；兩者以 Case ID 弱關聯，不追求文字逐字同步。

#### P0

1. 修正 `TC-HOME-006` false positive 風險：
   - 若 API total > 30，下一頁按鈕必須存在且可點擊。
   - 若 API total > 30，第二頁 pagination 必須顯示 `31-60` 或等價範圍。
   - 若 API total > 30，最後頁按鈕必須存在，或需建立明確且可 fail 的替代定位策略。
   - 不可再使用「找不到下一頁 / 最後頁按鈕就略過」的邏輯。
2. 抽出 `pages/ProductPage.ts` 並註冊 fixture：
   - Page object 只放 locator 與 action/helper。
   - `expect()` 斷言保留在 spec 內。
   - 預計抽出：`goto()`、`parsePagination()`、`getTableRowCount()`、`clickNextPage()`、`clickLastPage()`、`applyFilter()`、`resetFilters()`。

#### P1

3. 新增 `CONTRIBUTING.md`：
   - 說明新 case 命名規則。
   - 說明 `smoke` / `api` / `functional` / `ui` / `data-quality` 決策樹。
   - 說明 Markdown case 與 Playwright spec 的同步規則。
   - 說明 Allure metadata 必填欄位。
   - 說明常用 npm 指令與報告產生流程。
4. 檢查或補強 `.gitignore`：
   - `node_modules/`
   - `allure-results/`
   - `allure-reports/`
   - `playwright-report/`
   - `test-results/`
5. 新增 `npm run test:report`：
   - 串接 `npm run test`、`npm run allure:generate`、`npm run allure:open`。
   - 降低人工漏跑 Allure generate/open 的機率。

#### P2

6. 強化 `TC-HOME-008` filter 驗證：
   - 不只檢查 filter 後仍有資料。
   - 應逐列驗證資料欄位真的符合 filter 條件，或以 API response 驗證 filter 結果。
7. 強化 `TC-HOME-009` reset 驗證：
   - 除 total 回復外，補 selected filter state、URL query、第一頁 row count 檢查。
8. 視需要建立 `case-registry.md`：
   - 用 Case ID 對應 Markdown 路徑、spec 路徑、分類、狀態。
   - 先用 Markdown table，不急著導入 JSON 或自動生成。
9. 等出現穩定失敗分類需求後，再補 Allure `categories.json`。

### 2026-07-10 P0 實作進度更新

- 已新增 `playwright-tool/pages/ProductPage.ts`。
  - 集中 MOSFET product page 的 locator 與 action/helper。
  - 已包含 `goto()`、`parsePagination()`、`getPaginationText()`、`getPagination()`、`getTableRowCount()`、`isNextPageButtonVisible()`、`clickNextPage()`、`clickFilterOption()`、`resetFilters()`、`waitForUiUpdate()`。
- 已在 `playwright-tool/fixtures/test.fixture.ts` 註冊 `productPage` fixture。
- 已重構 `playwright-tool/tests/functional/mosfet-product.spec.ts`。
  - `TC-HOME-006` 改用 `productPage` fixture。
  - `TC-HOME-008~010` 也改用 `productPage` fixture。
- 已修正 `TC-HOME-006` false positive 風險。
  - API total > 30 時，會明確檢查下一頁按鈕必須存在。
  - 透過連續點擊下一頁驗證最後頁，不再以找不到最後頁按鈕作為靜默略過條件。
  - pagination 文字改用穩定 DOM `#page-info`，避免抓到頁面其他數字文字。
- 驗證：
  - `cmd /c npx playwright test functional/mosfet-product.spec.ts` -> `4 passed`
  - `npm run test` -> `11 passed`
  - `npm run allure:generate` -> `playwright-tool/allure-reports/20260710/007`

### 2026-07-10 P1 流程規範更新

- 已新增根目錄 `CONTRIBUTING.md`。
  - 明確指定 Playwright 正式執行目錄為 `playwright-tool`。
  - 補齊 case 與 spec 的弱關聯規則：Markdown 作為測試設計來源，spec 作為執行層，兩者用 Case ID 對應。
  - 補齊新 case 分類決策樹：`smoke`、`api`、`functional`、`ui`、`data-quality`。
  - 補齊 Case ID 規則：保留既有 `TC-HOME-001~011`，新 MOSFET case 使用 `TC-MOSFET-*`。
  - 補齊 POM / fixture / assertion / Allure metadata / baseline 保護規範。
- 已更新 `playwright-tool/package.json`。
  - 新增 `npm run test:report`。
  - 指令會依序執行 `npm run test`、`npm run allure:generate`、`npm run allure:open`。
- `.gitignore` 先前已涵蓋 `node_modules/`、`playwright-report/`、`test-results/`、`allure-results/`、`allure-reports/`、`.allure-latest`，本次不需調整。

### 2026-07-10 Agent 角色卡補充

- 已新增 `QA-Agents/case-design/agents/automation-architect.md`。
  - 定位為 QA 自動化架構分析師角色卡。
  - 用途是給其他 Agent 分析目前流程是否合理、如何產生新 case、如何 handle 原有 case。
  - 明確要求先閱讀根目錄 `CONTRIBUTING.md`，再分析 `test-cases`、`playwright-tool/tests`、`pages`、`fixtures`、`package.json` 與 worklog。
  - 補齊分析輸出格式：架構現況、風險評估、P0/P1/P2、New Case 決策、原有 Case Handle、建議落地順序、待確認事項。
  - 與 `test-case-master.md` 分工：`test-case-master.md` 負責測試用例設計，`automation-architect.md` 負責自動化流程與架構分析。
- 已同步優化 `QA-Agents/case-design/agents/test-case-master.md`。
  - 補上必讀 `CONTRIBUTING.md`。
  - 將舊路徑 `docs/test-cases` 校正為 `test-cases`。
  - 將測試實作路徑校正為 `playwright-tool/tests`、`playwright-tool/pages`、`playwright-tool/fixtures`。
  - 補上與 `automation-architect.md` 的角色分工。
  - 補上既有 `TC-HOME-001~011` 不改 ID、新 MOSFET case 使用 `TC-MOSFET-*`、產生新 case 前需掃描既有 case 與 spec 避免重複。

### 2026-07-10 Case Metadata 規則補充

- 已更新 `CONTRIBUTING.md`、`QA-Agents/case-design/agents/test-case-master.md`、`QA-Agents/case-design/agents/automation-architect.md`。
- 補齊 case metadata 規則：
  - `Case ID`：功能領域與流水號，例如 `TC-HOME-*`、`TC-MOSFET-*`。
  - `Feature`：功能領域，例如 `Home`、`MOSFET`。
  - `Type`：測試主要型態，例如 `Smoke`、`API`、`Functional`、`UI`、`Data Quality`。
  - `Priority`：重要程度，使用 `P0`、`P1`、`P2`。
  - `Smoke`：是否加入快速健康檢查流程，使用 `true` 或 `false`。
  - `Tags`：Playwright 執行篩選用，例如 `@smoke`、`@P0`、`@mosfet`。
  - `Automation`：是否適合自動化，使用 `Yes`、`No`、`Partial`。
- 明確規則：
  - Case ID 不用來控制執行流程。
  - `Priority` 控制重要程度。
  - `Smoke` / `@smoke` 控制是否加入 smoke 流程。
  - Playwright spec 至少保留 Case ID 與 tags，方便用 `grep` 或 npm script 執行。

### 2026-07-10 TC-HOME-001~011 Metadata 對齊

- 已將 `test-cases/gemmicro-homepage.md` 的 `TC-HOME-001~005` 補齊新版 metadata：
  - `Feature`
  - `Smoke`
  - `Tags`
- 已將 `test-cases/ai-design_case.md` 的 `TC-HOME-006~011` 補齊新版 metadata：
  - `Feature`
  - `Smoke`
  - `Tags`
- 已同步更新 Playwright spec title tags：
  - `TC-HOME-001~005` 補 `@home`
  - `TC-HOME-006~011` 補 `@mosfet`
- 保留既有 Case ID，不改 `TC-HOME-001~011`。
- 依目前實際執行設定，只有 `TC-HOME-001~002` 標記 `Smoke: true` / `@smoke`；其餘先維持 `Smoke: false`。

### 2026-07-10 TC-HOME-012~016 Home Quality Cases

- 已新增 Home 品質類測試案例到 `test-cases/gemmicro-homepage.md`：
  - `TC-HOME-012`：Homepage basic SEO metadata is present
  - `TC-HOME-013`：Homepage image resources are healthy
  - `TC-HOME-014`：Homepage has no critical console or network errors
  - `TC-HOME-015`：Homepage mobile menu can open and close
  - `TC-HOME-016`：Homepage basic accessibility signals are present
- 已新增 Playwright spec：`playwright-tool/tests/ui/homepage-quality.spec.ts`。
- 新增 cases 定位：
  - 不重複既有 `TC-HOME-001~005` 的首頁可見性與導覽檢查。
  - 聚焦 SEO 基礎 metadata、圖片資源健康、前端 runtime health、mobile RWD menu、accessibility 基礎訊號。
- 驗證：
  - `cmd /c npx playwright test --list` -> `Total: 16 tests in 4 files`
  - `cmd /c npx playwright test tests/ui/homepage-quality.spec.ts` -> `5 passed`
  - `npm run test` -> `16 passed`
  - `npm run allure:generate` -> `playwright-tool/allure-reports/20260710/008`
- 已啟動 `npm run allure:open` 開啟最新 Allure report。
- 已修正 `TC-HOME-013` 命名與 Goal，明確定位為 image resource health check，而非單純圖片可見性檢查。

### 2026-07-10 Homepage Brand / CTA 強化

- 已強化 `TC-HOME-001`。
  - 除 logo 與 `Precision Technology Leader` 外，補驗證首頁 H1：
    - `專業．卓越`
    - `引領半導體未來`
  - 補驗證品牌描述關鍵字：
    - `半導體設備與關鍵組件`
    - `專業的服務團隊`
- 已新增 `TC-HOME-017`。
  - Title：Homepage hero CTA links navigate to expected destinations
  - 驗證首頁 Hero CTA：
    - product CTA -> `/zh-TW/product_mostfet`
    - contact CTA -> `/zh-TW/contact`
  - 定位：補首頁商業轉換入口，不與 `TC-HOME-003` 的 top navigation redirect 重複。
- 驗證：
  - `cmd /c npx playwright test -g "TC-HOME-001"` -> `1 passed`
  - `cmd /c npx playwright test -g "TC-HOME-017"` -> `1 passed`
  - `cmd /c npx playwright test --list` -> `Total: 17 tests in 4 files`
  - `npm run test` -> `17 passed`
  - `npm run allure:generate` -> `playwright-tool/allure-reports/20260710/009`

### 2026-07-10 Allure Report 開啟方式修正

- 確認不應使用 `file://.../index.html` 直接開 Allure report。
  - 原因：Allure 前端會載入 `data/`、`widgets/` 等 JSON 資源，直接用 file protocol 容易出現 500、空白或資源讀取失敗。
- 已更新 `playwright-tool/scripts/allure-open-latest.ps1`。
  - 固定使用 HTTP server 開啟 latest report。
  - 固定 URL：`http://127.0.0.1:8888`
  - 指令來源仍是 `npm run allure:open`。

### 2026-07-11 Case ID 命名規則改為 TC-001 + Metadata

- 主理人確認：舊測試資料不保留，不再沿用 `TC-HOME-*` / `TC-MOSFET-*` domain-based ID。
- 新規則：
  - `Case ID` 使用全專案唯一流水號，例如 `TC-001`、`TC-002`、`TC-003`。
  - `Case ID` 只負責唯一識別，不負責分類。
  - 功能分類改由 `Feature`、`Area`、`Type`、`Tags` 控制。
  - 跨功能 case 使用多個 `Area` 與 tags，例如 `Area: Home, Contact, News`、`@home @contact @news`。
  - `Smoke: true` 與 `@smoke` 控制 smoke 流程，不透過 Case ID 控制。
- 已更新 case 產出邏輯：
  - `CONTRIBUTING.md`
  - `QA-Agents/case-design/agents/test-case-master.md`
  - `QA-Agents/case-design/agents/automation-architect.md`
  - `test-cases/_template.md`
  - `test-cases/README.md`
- 已更新既有案例文件：
  - `test-cases/gemmicro-homepage.md`：`TC-HOME-001~005`、`TC-HOME-012~017` 改為 `TC-001~005`、`TC-012~017`。
  - `test-cases/ai-design_case.md`：`TC-HOME-006~011` 改為 `TC-006~011`。
  - `QA-Agents/case-design/outputs/cases.json`：`TC-HOME-001~011` 改為 `TC-001~011`。
- 已更新 Playwright test title 與 Allure `testCaseId`：
  - `playwright-tool/tests/smoke/homepage.smoke.spec.ts`
  - `playwright-tool/tests/functional/mosfet-product.spec.ts`
  - `playwright-tool/tests/api/mosfet-api.spec.ts`
  - `playwright-tool/tests/ui/homepage-quality.spec.ts`
- 驗證：
  - `npx tsc --noEmit` 無法執行，原因是 `playwright-tool` 尚未安裝 `typescript`。
  - `npm run test` -> `17 passed`。

### 2026-07-11 Contact / News / About / Application Note Case 生成

- 已依 PROD 頁面內容新增測試案例文件：
  - `test-cases/contact.md`
  - `test-cases/news.md`
  - `test-cases/about.md`
  - `test-cases/application-note.md`
- 新增案例 ID：
  - `TC-018~021`：Contact page
  - `TC-022~026`：News page
  - `TC-027~030`：About page
  - `TC-031~034`：Application Note page
- Contact page 現況：
  - 目前 PROD 是聯絡資訊卡片頁，沒有 contact form。
  - 因此案例聚焦頁面載入、公司資訊、email / tel link、mobile navigation shell。
- News page 現況：
  - 目前 PROD 有 1 筆新聞、`行業動態` filter、外部 `閱讀更多` 連結與 pagination script。
  - 案例聚焦頁面載入、新聞卡欄位、filter、外部連結安全屬性、empty / pagination state。
- About page 現況：
  - 案例聚焦公司簡介、品牌核心事實、競爭優勢、FAB 合作夥伴、career/history CTA。
- Application Note page 現況：
  - 案例聚焦 BMS / LCD TV 應用卡、PDF link、安全屬性、圖片 alt 與資源健康。
- 已更新 `test-cases/README.md` 的建議文件清單。
- 已修正 `test-cases/_template.md`，範例 ID 改為 `TC-NNN`，避免 duplicate 掃描時誤判為正式 `TC-001`。
- 驗證：
  - 掃描 `test-cases/*.md`，正式 Case ID 目前為 `TC-001~034`。

### 2026-07-11 Case Report 生成

- 已新增案例總覽報告：
  - `test-cases/case-report.md`
- 報告內容包含：
  - 總案例數
  - 已自動化 / 尚未自動化統計
  - Area coverage
  - Priority 分布
  - Smoke 分布
  - `TC-001~034` case list
  - 建議自動化實作順序


### 2026-07-11 TC-018~034 PROD Review 結論落地

- 已根據 PROD HTML 重新核對外部 agent 對 `TC-018~034` 的評論。
- 決議保留既有 Contact / News / Application Note cases：
  - Contact 頁目前有 email、phone、`mailto:`、`tel:`。
  - News 頁目前有 `閱讀更多` 外部連結，且包含 `target=\"_blank\"` 與 `rel=\"noopener noreferrer\"`。
  - Application Note 頁目前有 `Application Notes` subtitle、BMS / LCD TV cards、PDF links、SVG images。
- 已採納資料量 caveat：
  - `TC-024` 目前驗證單分類 filter interaction / DOM state consistency；完整多分類驗證需控制測試資料。
  - `TC-026` 目前驗證 hidden pagination / empty state consistency；完整 pagination click 驗證需超過 10 筆 news。
- 已更新：
  - `test-cases/news.md`
  - `test-cases/case-report.md`
  - `test-cases/review-notes/tc-018-034-prod-validation.md`
  - `test-cases/xmind/tc-018-034-case-map.xmind`
  - `test-cases/xmind/tc-018-034-xmind-outline.md`

### 2026-07-11 TC-018~034 Playwright Spec 實作

- 已將 `TC-018~034` 從 Markdown 測試設計轉成 Playwright executable spec。
- 新增 spec：
  - `playwright-tool/tests/functional/contact.spec.ts`
  - `playwright-tool/tests/functional/news.spec.ts`
  - `playwright-tool/tests/functional/about.spec.ts`
  - `playwright-tool/tests/functional/application-note.spec.ts`
- 覆蓋範圍：
  - `TC-018~021`：Contact page
  - `TC-022~026`：News page
  - `TC-027~030`：About page
  - `TC-031~034`：Application Note page
- 已更新 `test-cases/case-report.md`：
  - Implemented Playwright cases 改為 `34`
  - Designed only 改為 `0`
  - Contact / News / About / Application Note 狀態改為 `Implemented`
- 驗證：
  - `cmd /c npx playwright test --list` -> `Total: 34 tests in 8 files`
  - `cmd /c npx playwright test tests/functional/contact.spec.ts tests/functional/news.spec.ts tests/functional/about.spec.ts tests/functional/application-note.spec.ts` -> `17 passed`
  - `npm run test` -> `34 passed`
  - `npm run allure:generate` -> `playwright-tool/allure-reports/20260711/002`
