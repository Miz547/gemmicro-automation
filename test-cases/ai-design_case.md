# AI 設計測試案例：Gemmicro MOSFET Product / API

## 文件目的

本文件是「測試用例架構師」的輸出範例，用來把 OpenSpec / 現有 Playwright 測試內容整理成可 review、可交付、可讓 UI 自動化工程師實作的測試案例。

本次範圍聚焦既有可執行測試 `TC-006~011`，主題包含：

- MOSFET API 與 UI pagination 一致性
- MOSFET API response 欄位型別檢查
- MOSFET product page filter 行為
- filter reset 行為
- responsive filter panel 行為
- MOSFET API 重複資料檢查

## 測試範圍

- Product Page URL: `https://www.gemmicro.com.tw/zh-TW/product_mostfet`
- MOSFET API URL: `https://www.gemmicro.com.tw/zh-TW/api/mosfet`
- Test Runner: Playwright Test
- Browser: Chromium / Desktop Chrome
- Report: Playwright HTML Report / Allure
- Evidence: screenshot、runtime log、API validation log、failure summary

## 角色分工

### 測試用例架構師

負責閱讀 OpenSpec、既有測試與需求脈絡，產出測試案例文件。重點是定義每個 case 的目標、前置條件、測試步驟、預期結果、資料風險與自動化注意事項。

### UI 自動化工程師

負責將本文件轉成 Playwright 測試。建議後續拆分為：

- `pages/ProductPage.ts`
- `tests/smoke/mosfet-product.smoke.spec.ts`
- `tests/api/mosfet-api.spec.ts`
- `data/site.data.ts` 或 `data/endpoints.ts`

---

## Case

- Case ID: `TC-006`
- Title: MOSFET API total count matches UI pagination total and per-page rows are correct
- Feature: MOSFET
- Area: Product, API
- Type: UI / API Integration
- Priority: P0
- Smoke: false
- Tags: @mosfet @P0 @functional
- Automation: Yes

## Goal

驗證 MOSFET product page 載入時，前端表格與 pagination 顯示的總筆數、分頁範圍、每頁列數，必須與 MOSFET API 回傳資料一致。

## Preconditions

- Product page 可以正常開啟。
- MOSFET API `/zh-TW/api/mosfet` 可回傳 HTTP 200。
- API response root 為 array，或 object 中包含 `data` array。
- UI pagination 文字格式可解析，例如 `1–30，共 389 筆`。

## Steps

1. 開啟 MOSFET product page。
2. 攔截 `/api/mosfet` response，確認 HTTP status 為 200。
3. 解析 API response，計算 API records 總筆數。
4. 讀取第一頁 pagination text。
5. 檢查第一頁 pagination total 是否等於 API records 總筆數。
6. 檢查第一頁範圍是否為 `1–30`。
7. 檢查第一頁 table rows 是否為 30 筆。
8. 點擊下一頁。
9. 檢查第二頁範圍是否為 `31–60`，且 total 仍等於 API records 總筆數。
10. 點擊最後一頁。
11. 根據 API records 總筆數計算最後一頁應顯示的 start、end、row count。
12. 檢查最後一頁 UI 顯示與計算結果一致。
13. 附上 page screenshot 與 pagination log。

## Expected Result

- API 至少回傳 1 筆資料。
- UI pagination total 等於 API records 總筆數。
- 第一頁顯示 `1–30`，且 table rows 為 30。
- 第二頁顯示 `31–60`，且 table rows 為 30。
- 最後一頁的 start、end、row count 符合 API records 總筆數計算結果。
- 測試報告中可看到每個 pagination 檢查點的 screenshot 與 log。

## Notes

- 此案例是很有價值的 UI/API 整合測試，能抓到「API 有資料但 UI 分頁顯示錯」或「UI row count 與 pagination 不一致」問題。
- 建議後續將 `parsePagination()` 與翻頁操作移到 `ProductPage.ts`。

---

## Case

- Case ID: `TC-007`
- Title: MOSFET API field types are valid
- Feature: MOSFET API
- Area: API, Data Quality
- Type: API Contract / Data Quality
- Priority: P0
- Smoke: false
- Tags: @mosfet @api @schema @P0
- Automation: Yes

## Goal

驗證 MOSFET API response 中每筆資料的欄位型別，只允許 `string`、`number`、`boolean`、`null`，避免前端接收到 array、object 或其他非預期資料型態。

## Preconditions

- MOSFET API 可以直接呼叫。
- API response 可解析為 JSON。
- API response root 為 array，或 object 中包含 `data` array。

## Steps

1. 開啟 MOSFET API URL，保留 raw response screenshot 作為證據。
2. 使用 Playwright API request 呼叫 MOSFET API。
3. 檢查 HTTP status 是否為 200。
4. 解析 response JSON。
5. 逐筆檢查每個 record 的所有欄位。
6. 判斷欄位值型別是否屬於 `string`、`number`、`boolean`、`null`。
7. 若發現不合法型別，記錄 index、pn、field、detectedType、value。
8. 將 anomaly summary 寫入測試報告附件。

## Expected Result

- API HTTP status 為 200。
- API 至少回傳 1 筆資料。
- 所有欄位型別都屬於允許清單。
- 若有 anomaly，測試報告能明確指出是哪一筆、哪個欄位、實際型別與實際值。

## Notes

- 此案例屬於基本 contract test，不是完整 JSON Schema 驗證，但非常適合第一版資料品質檢查。
- 若未來 API schema 固定，建議升級為 JSON Schema validation。

---

## Case

- Case ID: `TC-008`
- Title: MOSFET product page single filter and multiple filters yield correct results
- Feature: MOSFET Filter
- Area: Product
- Type: UI Functional
- Priority: P0
- Smoke: false
- Tags: @mosfet @filter @P0 @functional
- Automation: Yes

## Goal

驗證 MOSFET product page 的 filter 功能可正常作用。使用單一 filter 與多重 filter 後，pagination 與 table rows 應更新，且頁面至少能顯示符合條件的資料。

## Preconditions

- Product page 可以正常開啟。
- MOSFET API 初始載入成功。
- 頁面存在可操作的 filter option。
- pagination text 可解析。

## Steps

1. 開啟 MOSFET product page，等待 `/api/mosfet` 載入完成。
2. 記錄套用 filter 前的 pagination text。
3. 套用單一 filter：`package = PDFN3.3*3.3`。
4. 等待 pagination text 或 table rows 更新。
5. 檢查 pagination 是否仍可解析。
6. 檢查 table 至少顯示 1 筆資料。
7. 附上單一 filter 後的 screenshot 與 log。
8. 繼續套用第二個 package filter：`PDFN5*6`。
9. 等待 pagination 或 table rows 更新，記錄結果。
10. 繼續套用 `BVDSS(V) = 60`。
11. 等待 pagination 或 table rows 更新，記錄結果。
12. 附上多重 filter 後的 screenshot 與 log。

## Expected Result

- 單一 filter 後，pagination 可正常顯示。
- 單一 filter 後，table 至少顯示 1 筆資料。
- 多重 filter 後，頁面不應出現錯誤或卡住。
- 多重 filter 後，pagination 與 row count 需被記錄到測試報告中。
- 若 filter option 找不到，需附上 warning log，而不是讓測試在定位器階段失去診斷資訊。

## Notes

- 目前此案例偏 smoke / functional，尚未嚴格驗證每一列資料是否真的符合 filter 條件。
- 第二版可加強為：讀取每列欄位值，驗證 package 與 BVDSS 欄位是否符合選取條件。

---

## Case

- Case ID: `TC-009`
- Title: MOSFET product page multiple filters then reset restores full results
- Feature: MOSFET Filter Reset
- Area: Product
- Type: UI Functional / Regression
- Priority: P0
- Smoke: false
- Tags: @mosfet @filter @reset @P0 @functional
- Automation: Yes

## Goal

驗證使用多個 MOSFET filters 後，點擊 `重置` 可以恢復篩選前的結果狀態，避免 filter 狀態殘留或資料列表無法恢復。

## Preconditions

- Product page 可以正常開啟。
- MOSFET API 初始載入成功。
- filter 區塊包含 BVDSS、VGS、Vth Min 等條件。
- 頁面有 `重置` 按鈕。

## Steps

1. 開啟 MOSFET product page，等待 `/api/mosfet` 載入完成。
2. 確認 API status 為 200。
3. 套用 `BVDSS(V) = 60`。
4. 等待 pagination 或 table rows 更新，記錄結果。
5. 套用 `VGS(V) = 20`。
6. 等待 pagination 或 table rows 更新，記錄結果。
7. 套用 `Vth(V) Min = -1.3`。
8. 等待 pagination 或 table rows 更新，記錄結果。
9. 附上多重 filter 狀態下的 screenshot 與 log。
10. 點擊 `重置`。
11. 等待 pagination 或 table rows 更新。
12. 附上 reset 後的 screenshot 與 log。

## Expected Result

- 多重 filter 操作過程中頁面不應發生錯誤。
- 每次 filter 操作後，pagination 或 row count 應可被記錄。
- 點擊 `重置` 後，filter 狀態應被清除。
- reset 後 pagination 與 row count 應回到未篩選或接近初始狀態。
- 測試報告中需保留 reset 前後的比較證據。

## Notes

- 目前既有測試已記錄 reset 後 pagination 與 row count，但尚未明確 assert reset 後 total 是否等於初始 total。
- 建議 UI 自動化工程師後續補強：在套用 filter 前先保存 initial pagination total，reset 後 assert total 回復為 initial total。

---

## Case

- Case ID: `TC-010`
- Title: MOSFET product page filter row visibility changes with viewport width
- Feature: MOSFET Responsive Filter
- Area: Product
- Type: Responsive UI
- Priority: P0
- Smoke: false
- Tags: @mosfet @filter @responsive @P0 @ui
- Automation: Yes

## Goal

驗證 MOSFET product page 在不同 viewport 寬度下，filter row 與 filter toggle 的顯示邏輯符合 responsive design 規則。

## Preconditions

- Product page 可以正常開啟。
- 頁面包含 `#filter-row`。
- 小螢幕狀態下頁面包含 `#filter-toggle`。

## Steps

1. 開啟 MOSFET product page。
2. 將視窗調整為最大化或 desktop 寬度。
3. 檢查 `#filter-row` 是否可見。
4. 附上 desktop 狀態 screenshot 與 log。
5. 將 viewport 設為 `1023 x 768`。
6. 檢查 `#filter-row` 是否隱藏。
7. 檢查 `#filter-toggle` 是否可見。
8. 附上 mobile/tablet breakpoint 狀態 screenshot 與 log。
9. 點擊 `#filter-toggle`。
10. 檢查 `#filter-row` 是否重新顯示。
11. 附上展開後 screenshot 與 log。

## Expected Result

- Desktop 寬度下，`#filter-row` 可見。
- 當 viewport width 小於 1024px 時，`#filter-row` 隱藏。
- 當 viewport width 小於 1024px 時，`#filter-toggle` 可見。
- 點擊 `#filter-toggle` 後，`#filter-row` 會展開並可見。

## Notes

- 此案例可證明 UI 自動化不只是點擊流程，也能驗證 responsive behavior。
- 建議後續將 breakpoint `1024` 集中到測試資料或 config，避免寫死在測試碼中。

---

## Case

- Case ID: `TC-011`
- Title: MOSFET API duplicate record check by pn and pn+type
- Feature: MOSFET API Data Quality
- Area: API, Data Quality
- Type: API Data Quality
- Priority: P0
- Smoke: false
- Tags: @mosfet @api @data-quality @P0
- Automation: Yes

## Goal

驗證 MOSFET API 是否存在重複產品資料。此案例分成兩層檢查：單純 `pn` 重複只記錄，`pn + type` 組合重複則視為資料品質問題並標記失敗。

## Preconditions

- MOSFET API 可以直接呼叫。
- API response 可解析為 JSON。
- API response records 中包含 `pn` 與 `type` 欄位。

## Steps

1. 開啟 MOSFET API URL，保留 raw response screenshot。
2. 使用 Playwright API request 呼叫 MOSFET API。
3. 檢查 HTTP status 是否為 200。
4. 解析 response JSON。
5. 確認至少回傳 1 筆資料。
6. 以 `pn` 分組，統計每個 pn 出現次數。
7. 若 pn 重複，記錄 pn 與出現 index，但不直接 fail。
8. 以 `pn + type` 建立 composite key。
9. 統計每個 composite key 出現次數。
10. 若 `pn + type` 重複，記錄 pn、type 與出現 index。
11. 若存在 `pn + type` 重複，測試標記失敗。

## Expected Result

- API HTTP status 為 200。
- API 至少回傳 1 筆資料。
- `pn` 重複資訊會被記錄在報告中，作為資料觀察。
- `pn + type` 不應重複。
- 若 `pn + type` 有重複，報告需清楚列出重複項目與 index。

## Notes

- `pn` 單欄位重複不一定代表錯誤，可能同一料號有不同 type 或規格，所以只記錄。
- `pn + type` 組合重複更接近資料唯一性風險，因此適合作為 fail 條件。

---

## 自動化落地建議

### 建議拆檔

```text
pages/ProductPage.ts
  gotoMosfet()
  parsePagination()
  clickNextPage()
  clickLastPage()
  clickFilterOption()
  resetFilters()
  getTableRowCount()

tests/smoke/mosfet-product.smoke.spec.ts
  TC-006
  TC-008
  TC-009
  TC-010

tests/api/mosfet-api.spec.ts
  TC-007
  TC-011

data/site.data.ts 或 data/endpoints.ts
  MOSFET_API_URL
  PRODUCT_PAGE_URL
  paginationPageSize
  responsiveBreakpoint
  allowedApiFieldTypes
```

### 建議優先順序

1. Case ID 使用 `TC-006~011` 流水號，MOSFET 分類改由 `Feature / Area / Tags` 表示。
2. 先抽 `ProductPage.ts`，減少 spec 中重複 helper。
3. 再把 API cases 拆到 `tests/api/mosfet-api.spec.ts`。
4. 最後補強 filter 結果驗證，從「有資料」升級為「資料真的符合 filter 條件」。

### 對 Agent Workflow 的意義

這份文件可作為 Demo：

1. 測試用例架構師讀 OpenSpec 與既有測試。
2. 產生可 review 的測試案例文件。
3. UI 自動化工程師根據案例拆 Page Object 與 Playwright spec。
4. Codex 執行瀏覽器測試。
5. 測試報告產生 screenshot、runtime log、API validation log 作為證據。
