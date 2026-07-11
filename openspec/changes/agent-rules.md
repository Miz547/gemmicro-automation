# Agent Rules

<!--
給 AI Agent 的啟動提醒：
本專案文件使用繁體中文與 UTF-8。
在 Windows PowerShell 讀取 markdown 時，建議使用：
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
chcp 65001
Get-Content -Raw -Encoding UTF8 -LiteralPath "<file>"
-->

## 基本互動規則

- 使用者主要使用繁體中文溝通，AI Agent 回覆與文件撰寫應使用繁體中文。
- 程式碼、指令、檔名、路徑、套件名稱、測試 ID、tag 與 URL 保留原文格式。
- 回覆時優先提供可直接執行的 `cwd`、指令、報告路徑與驗證結果。
- 若網站現況與既有測試案例不一致，先回報差異，再調整測試或文件。

## 必讀文件

處理本專案任務前，請先閱讀：

1. `openspec/changes/agent-rules.md`
   - 確認工作規則、文件分工與更新方式。
2. `openspec/changes/proposal.md`
   - 理解本次完善專案的目的、範圍與影響。
3. `openspec/changes/design.md`
   - 理解目前 Playwright 自動化架構、報告流程與測試資料流。
4. `openspec/changes/tasks.md`
   - 理解任務拆解、優先順序與哪些項目需 user 確認。
5. `openspec/changes/worklog.md`
   - 理解最近一次進度、已完成、待確認與下一步。

## 工作規則

- 不要直接假設網站文案、導覽項目或 API response schema；需以實際網站或目前測試結果確認。
- 若修改測試邏輯，需同步檢查 `docs/test-cases/` 內對應 Markdown 是否需要更新。
- 若修改測試專案架構，需同步更新 `docs/PROJECT_ARCHITECTURE.md` 或 `openspec/changes/design.md`。
- 產生或更新 Allure 報告後，需確認 `.allure-latest` 指向最新報告資料夾。
- PowerShell 直接執行 `npx` 可能遇到 execution policy；可使用 `cmd /c npx ...`。
- 生成物不視為原始碼，不應手動編輯：
  - `allure-results/`
  - `allure-reports/`
  - `playwright-report/`
  - `test-results/`
  - `.allure-latest`
- 若只是跑測試產生報告，不需更新架構文件；若有決策、測試範圍、案例定義或工具流程改變，需更新 `worklog.md`。

## 文件分工

- `proposal.md`：記錄為什麼要完善此專案、要新增或改善哪些能力、影響範圍。
- `design.md`：記錄現在架構、資料流、測試流、報告流、風險與設計決策。
- `tasks.md`：記錄任務拆解、完成狀態、優先順序與待確認問題。
- `worklog.md`：記錄日期、實際進度、驗證結果、阻塞與下一步。
- `docs/test-cases/*.md`：記錄需求層測試案例，不直接等同 executable test。
- `tests/**/*.spec.ts`：可執行 Playwright 測試。

## 測試與報告規則

- 優先使用專案 scripts：
  - `npm run test:smoke`
  - `npm run test:p0`
  - `npm run test:p1`
  - `npm run test:p2`
  - `npm run allure:generate`
  - `npm run allure:open`
- 若 PowerShell 擋住 `npx.ps1`，改用：
  - `cmd /c npx playwright test -g "@smoke"`
- 每次重要修改後至少執行受影響測試；若修改共用 fixture、config 或 Page Object，需執行完整 smoke。
- 回報測試結果時需包含：
  - 執行目錄
  - 執行指令
  - passed/failed 數量
  - 最新 Allure 報告路徑

## 更新 worklog 規則

- 有實際修改、測試結果、架構決策或阻塞時，更新 `worklog.md`。
- 若同一天已有區塊，合併更新，不要新增多個相同日期的大區塊。
- 建議格式：
  - `### 紀錄者 AI Agent`
  - `### 今日重點`
  - `### 已完成`
  - `### 驗證結果`
  - `### 待確認`
  - `### 下一步`
