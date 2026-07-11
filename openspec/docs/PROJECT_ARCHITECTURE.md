# Gemmicro Tech Auto - Project Architecture

## Purpose

This project provides E2E UI automation tests for the Gemmicro homepage using Playwright, with Allure reports and artifact capture (screenshots + logs).

## Folder Structure

- `tests/`
  - `smoke/homepage.smoke.spec.ts`
    - Main executable smoke test suite.
    - Includes test IDs (`TC-HOME-001~005`) and tags (`@smoke`, `@P0~@P2`).
- `fixtures/`
  - `test.fixture.ts`
    - Shared fixture layer.
    - Provides `homePage` object and auto artifact capture for each test.
    - Captures screenshot and runtime logs; captures failure summary on failed tests.
- `pages/`
  - `HomePage.ts`
    - Page Object for homepage reusable actions/assertions.
- `data/`
  - `site.data.ts`
    - Static test data container (can be expanded for data-driven tests).
- `docs/`
  - `test-cases/`
    - Requirement-level test case documents (non-executable).
  - `USER_GUIDE.md`
    - PowerShell execution manual and troubleshooting.
  - `PROJECT_ARCHITECTURE.md`
    - This file.
- `scripts/`
  - `allure-generate.ps1`
    - Generate Allure report under date/sequence path.
  - `allure-open-latest.ps1`
    - Open latest generated Allure report via local server.
- `playwright.config.ts`
  - Global Playwright settings (baseURL, reporters, browser project, trace/screenshot/video policies).
- `package.json`
  - Execution scripts and dependencies.

## Execution Flow

1. `npm` script triggers Playwright (`playwright test`).
2. Tests run from `tests/` and use fixtures from `fixtures/test.fixture.ts`.
3. Fixture auto captures:
   - Screenshot (current viewport),
   - Runtime log (`console.error`, `pageerror`, `requestfailed`),
   - Failure summary (only on failed tests).
4. Reporters output:
   - Playwright HTML report,
   - Allure raw results (`allure-results`).
5. `allure-generate.ps1` transforms raw results to static report:
   - Path format: `allure-reports/yyyyMMdd/###`.
6. `allure-open-latest.ps1` opens the latest report.

## Test Selection Logic

- By suite:
  - `npm run test:smoke`
- By priority:
  - `npm run test:p0`
  - `npm run test:p1`
  - `npm run test:p2`
- Full run:
  - `npm test`

Tag matching is done by test title keyword matching (`@smoke`, `@P0`, etc.).

## Report and Artifact Logic

- Playwright report:
  - Open with `npm run report`
- Allure report:
  - Generate: `npm run allure:generate`
  - Open latest: `npm run allure:open`
- Extra step-level artifacts:
  - TC-HOME-003 and TC-HOME-004 attach step screenshots/logs.
  - TC-HOME-005 attaches footer-only screenshot for visual accuracy.

## Recommended Git Scope

For source control, keep only source and config files. Do not commit generated artifacts:

- Ignore:
  - `node_modules/`
  - `allure-results/`
  - `allure-reports/`
  - `playwright-report/`
  - `test-results/`
  - `.allure-latest`

This keeps the repository clean and lightweight.
