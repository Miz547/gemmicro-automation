# User Guide (PowerShell)

## Prerequisites

- Windows PowerShell
- Node.js LTS installed
- Project path: `C:\Users\lo762\Gemmicro_Tech_Auto`

## Quick Start

Run full test + Allure report in one line:

```powershell
cd "C:\Users\lo762\Gemmicro_Tech_Auto"; npm test; npm run allure:generate; npm run allure:open
```

## Common Commands

### Run all tests

```powershell
cd "C:\Users\lo762\Gemmicro_Tech_Auto"
npm test
```

### Run smoke tests only

```powershell
cd "C:\Users\lo762\Gemmicro_Tech_Auto"
npm run test:smoke
```

### Run by priority

```powershell
cd "C:\Users\lo762\Gemmicro_Tech_Auto"
npm run test:p0
npm run test:p1
npm run test:p2
```

### Run with browser UI (headed)

```powershell
cd "C:\Users\lo762\Gemmicro_Tech_Auto"
npx playwright test -g "@smoke" --headed
```

### Generate and open Allure report

```powershell
cd "C:\Users\lo762\Gemmicro_Tech_Auto"
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
