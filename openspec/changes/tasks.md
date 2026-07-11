# Gemmicro Tech Auto 任務拆解

## 1. OpenSpec 文件骨架

- [x] 1.1 確認參考範例 md 結構。
- [x] 1.2 建立 `agent-rules.md`。
- [x] 1.3 建立 `proposal.md`。
- [x] 1.4 建立 `design.md`。
- [x] 1.5 建立 `tasks.md`。
- [x] 1.6 建立 `worklog.md`。

> 狀態：已依 `C:\Users\lo762\AppData\Local\Programs\Jamie_Project\OPENSPEC\changes\accident-pipeline\md` 的文件分工方式，改寫為 Gemmicro 專案版本。

---

## 2. 現有測試穩定化

- [x] 2.1 確認 `TC-HOME-001~002` 對齊目前首頁文案與導覽。
- [x] 2.2 修正 `TC-HOME-003` 只檢查目前可見可點的 zh-TW 導覽入口。
- [x] 2.3 修正 `TC-HOME-005` footer 公司名。
- [x] 2.4 修正 `TC-HOME-007` API 欄位型別允許 `boolean`。
- [x] 2.5 執行完整 `@smoke` 驗證。
- [x] 2.6 修正 Windows PowerShell 終端中文顯示亂碼問題：
  - 中文 Markdown / TypeScript 檔案加入 UTF-8 BOM。
  - npm test/report scripts 前置 `chcp 65001`。

> 最新驗證：`cmd /c npx playwright test -g "@smoke"`，結果 `11 passed`。

---

## 3. 測試案例文件補齊

- [x] 3.1 更新 `docs/test-cases/gemmicro-homepage.md` 的 `TC-HOME-001~005`。
- [ ] 3.2 新增 `docs/test-cases/gemmicro-mosfet.md`，記錄 `TC-HOME-006~011`。
- [ ] 3.3 將 API schema、pagination、filter、reset、responsive rule 分別寫成清楚 steps / expected result。
- [ ] 3.4 檢查 test title 與 Markdown case title 是否一致。

> 建議下一步：優先補 `gemmicro-mosfet.md`，因目前 executable tests 已有 `TC-HOME-006~011`，但需求層文件尚未完整對應。

---

## 4. 測試資料集中化

- [ ] 4.1 擴充 `data/site.data.ts`，集中管理首頁導覽文字。
- [ ] 4.2 將 `MOSFET_API_URL` 與 `PRODUCT_PAGE_URL` 從 spec 移至 data/config 檔。
- [ ] 4.3 將 footer expected text、hero text、language text 集中管理。
- [ ] 4.4 將 MOSFET API 合法型別規則集中管理。

> 執行前請確認：是否接受新增 `data/endpoints.ts` 或只擴充現有 `data/site.data.ts`。

---

## 5. Page Object 擴充

- [ ] 5.1 擴充 `pages/HomePage.ts`：
  - `expectHeaderNavigationVisible()`
  - `switchToEnglish()`
  - `clickVisibleNavByHref()`
  - `expectFooterVisible()`
- [ ] 5.2 新增 `pages/ProductPage.ts`：
  - `gotoMosfet()`
  - `parsePagination()`
  - `clickNextPage()`
  - `clickLastPage()`
  - `clickFilterOption()`
  - `resetFilters()`
- [ ] 5.3 將 `homepage.smoke.spec.ts` 中重複 helper 搬入 Page Object。

> 執行前請確認：是否要先小步抽出 helper，不一次重構所有測試。

---

## 6. 測試檔拆分

- [ ] 6.1 保留 `tests/smoke/homepage.smoke.spec.ts` 給 `TC-HOME-001~005`。
- [ ] 6.2 新增 `tests/smoke/mosfet-product.smoke.spec.ts` 給 UI pagination / filter / responsive。
- [ ] 6.3 新增 `tests/api/mosfet-api.spec.ts` 給 API schema / duplicate / count。
- [ ] 6.4 確認 tag 仍可用：
  - `@smoke`
  - `@P0`
  - `@P1`
  - `@P2`

> 執行前請確認：是否接受測試 ID 從 `TC-HOME-006~011` 改名為 `TC-MOSFET-*` 或保留原 ID。

---

## 7. 報告與 log 流程完善

- [x] 7.1 確認 Allure report 可產生至 `allure-reports/yyyyMMdd/###`。
- [x] 7.2 確認 `.allure-latest` 指向最新報告。
- [ ] 7.3 在 `docs/USER_GUIDE.md` 加入常用驗證命令與 PowerShell `npx.ps1` 替代方案。
- [ ] 7.4 補一份 report artifact 說明，解釋 screenshot、runtime-log、failure-summary 用途。

---

## 8. CI / 自動化執行規劃

- [ ] 8.1 決定 CI 平台或本機排程方式。
- [ ] 8.2 建立 headless smoke 執行命令。
- [ ] 8.3 規劃 Allure report artifact 保存策略。
- [ ] 8.4 規劃失敗通知方式。

> 執行前請確認：此專案目前不是 git repository；若要 CI，需先確認版本管理位置。

---

## 建議執行順序

```text
立即可做：
  Task 3.2~3.4 補 MOSFET 測試案例文件
  → Task 4 測試資料集中化
  → Task 5 小步擴充 Page Object

需要 user 確認：
  Task 6 測試檔拆分與測試 ID 命名
  Task 8 CI / 排程策略
```

## 目前優先建議

下一步建議從 `Task 3.2 新增 docs/test-cases/gemmicro-mosfet.md` 開始，因為目前可執行測試已有 MOSFET API 與 product page 驗證，但 Markdown 測試案例文件尚未完整覆蓋。
