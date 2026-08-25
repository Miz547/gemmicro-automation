# User Guide (PowerShell)

## Prerequisites

- Windows PowerShell
- Node.js LTS installed
- Project path: `C:\Users\lo762\Gemmicro_Tech_Auto`

## Quick Start

Set this PowerShell session to UTF-8 first, especially if you need to type or read Chinese:

```powershell
cd "C:\Users\lo762\Gemmicro_Tech_Auto"
.\tools\setup-utf8.ps1
```

Run full test + Allure report in one line:

```powershell
cd "C:\Users\lo762\Gemmicro_Tech_Auto\playwright-tool"; npm test; npm run allure:generate; npm run allure:open
```

## Common Commands

### Run all tests

```powershell
cd "C:\Users\lo762\Gemmicro_Tech_Auto"
.\tools\setup-utf8.ps1
cd ".\playwright-tool"
npm test
```

### Run smoke tests only

```powershell
cd "C:\Users\lo762\Gemmicro_Tech_Auto"
.\tools\setup-utf8.ps1
cd ".\playwright-tool"
npm run test:smoke
```

### Run by priority

```powershell
cd "C:\Users\lo762\Gemmicro_Tech_Auto\playwright-tool"
npm run test:p0
npm run test:p1
npm run test:p2
```

### Run with browser UI (headed)

```powershell
cd "C:\Users\lo762\Gemmicro_Tech_Auto\playwright-tool"
npx playwright test -g "@smoke" --headed
```

### Generate and open Allure report

```powershell
cd "C:\Users\lo762\Gemmicro_Tech_Auto\playwright-tool"
npm run allure:generate
npm run allure:open
```

## Report Output Paths

- Allure raw results: `allure-results\`
- Allure report output: `allure-reports\yyyyMMdd\###\`
- Latest report marker: `.allure-latest`

## Recommended Daily Flow

1. Pull latest code.
2. Run smoke tests.
3. Generate Allure report.
4. Review screenshots and runtime logs in Allure.

Example:

```powershell
cd "C:\Users\lo762\Gemmicro_Tech_Auto"
.\tools\setup-utf8.ps1
cd ".\playwright-tool"
npm run test:smoke
npm run allure:generate
npm run allure:open
```

## Troubleshooting

### `ENOENT ... package.json`

Cause: command is executed outside project folder.

Fix:

```powershell
cd "C:\Users\lo762\Gemmicro_Tech_Auto"
```

### `npm` not recognized

Cause: Node.js not available in PATH.

Fix:

```powershell
node -v
npm -v
```

If missing, install Node.js LTS and reopen PowerShell.

### Cannot type or read Chinese correctly

Cause: the interactive Windows terminal is not using UTF-8. You can confirm with:

```powershell
cmd /c chcp
```

If it returns `Active code page: 950`, switch the current session to UTF-8:

```powershell
cd "C:\Users\lo762\Gemmicro_Tech_Auto"
.\tools\setup-utf8.ps1
```

Expected result:

```text
Active code page: 65001
```

This fixes the current PowerShell window only. For a persistent fix, add this line to your PowerShell profile:

```powershell
& "C:\Users\lo762\Gemmicro_Tech_Auto\tools\setup-utf8.ps1"
```

### PowerShell script blocked (`PSSecurityException`)

Fix one-time (current user):

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Or continue using `npm.cmd` / `npx.cmd`.

### Allure page opens as `file://` and shows 404

Always open via command:

```powershell
npm run allure:open
```

Do not open `index.html` directly with `file://`.
