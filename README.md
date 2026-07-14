# Gemmicro Automation

Playwright + Allure QA automation project for the Gemmicro website.

This repository demonstrates an end-to-end QA automation workflow: test case design, metadata-driven case management, Playwright executable specs, Page Object / fixture structure, Allure reporting, and AI-assisted QA documentation.

## Project Status

| Item | Status |
| --- | --- |
| Total test cases | 34 |
| Automated Playwright specs | 34 |
| Latest local run | 34 passed |
| Report format | Allure HTML |
| Target site | `https://www.gemmicro.com.tw/zh-TW/` |

## Coverage

| Area | Case IDs | Coverage |
| --- | --- | --- |
| Home / Navigation / Homepage Quality | `TC-001~005`, `TC-012~017` | Homepage smoke, navigation, SEO metadata, image health, runtime health, mobile menu, accessibility signals, CTA navigation |
| MOSFET Product / API / Data Quality | `TC-006~011` | API/UI pagination consistency, API schema, product filters, reset behavior, responsive filter UI, duplicate data check |
| Contact | `TC-018~021` | Page smoke, contact information, `mailto:` / `tel:` links, mobile navigation |
| News | `TC-022~026` | Page smoke, news card fields, category filter state, external link safety, empty/pagination state |
| About | `TC-027~030` | Page smoke, company profile, brand facts, competitive advantages, FAB partners, history CTA |
| Application Note | `TC-031~034` | Page smoke, application cards, PDF link safety, image loading and alt text |

## Repository Structure

```text
.
├─ playwright-tool/
│  ├─ tests/                 # Playwright executable specs
│  │  ├─ api/
│  │  ├─ functional/
│  │  ├─ smoke/
│  │  └─ ui/
│  ├─ pages/                 # Page Object classes
│  ├─ fixtures/              # Shared Playwright fixtures
│  ├─ scripts/               # Allure report scripts
│  ├─ playwright.config.ts
│  └─ package.json
├─ test-cases/               # Test design documents and case report
├─ QA-Agents/                # AI agent role cards and case-design prompts
├─ openspec/changes/         # Worklog and architecture decisions
├─ CONTRIBUTING.md           # Project rules and case metadata standards
└─ README.md
```

## Test Design Rules

Case IDs use a project-wide sequence format, for example `TC-001`, `TC-018`, `TC-034`.

Case IDs are only unique identifiers. Classification is handled by metadata:

- `Feature`
- `Area`
- `Type`
- `Priority`
- `Smoke`
- `Tags`
- `Automation`

This keeps cross-feature cases readable. For example, a navigation case can cover `Home`, `Contact`, and `News` without changing its Case ID naming pattern.

## Run Locally

Run commands from the Playwright project folder:

```powershell
cd C:\Users\lo762\Gemmicro_Tech_Auto\playwright-tool
npm install
npx playwright install
npm run test
```

Generate and open the Allure report:

```powershell
npm run allure:generate
npm run allure:open
```

The local Allure report is served at:

```text
http://127.0.0.1:8888
```

## Useful Commands

```powershell
npm run test          # Run all automated cases
npm run test:smoke    # Run smoke cases
npm run test:p0       # Run P0 cases
npm run test:p1       # Run P1 cases
npm run test:p2       # Run P2 cases
npm run test:report   # Run tests, generate Allure report, open report
```

## Reporting

Allure report includes:

- pass/fail result
- testcase metadata
- screenshots
- runtime logs
- JSON evidence attachments
- API raw response evidence for API/data-quality cases

Generated reports are intentionally ignored by Git and should not be committed to the main repository:

```text
playwright-tool/allure-results/
playwright-tool/allure-reports/
playwright-tool/playwright-report/
playwright-tool/test-results/
```

For portfolio or interview sharing, use one of these approaches:

- run the report locally during demo
- upload Allure output as a GitHub Actions artifact
- deploy the static Allure report to GitHub Pages or Render later

## CI/CD Plan

Recommended first CI step: GitHub Actions CI only.

Suggested pipeline:

```text
GitHub push / pull request
  -> npm install
  -> npx playwright install --with-deps
  -> npm run test
  -> npm run allure:generate
  -> upload Playwright / Allure report artifacts
```

Deployment of the report to GitHub Pages or Render can be added later. The first priority is to keep regression tests reproducible on every push or pull request.

## Points

This project is not just a set of Playwright scripts. It shows a QA automation workflow:

- test cases are designed first in Markdown
- executable specs are mapped by Case ID
- smoke / P0 / P1 / P2 runs are controlled by tags
- Allure reports provide debugging evidence
- Page Object and fixtures reduce duplication
- worklog and contribution rules make the project maintainable
- AI agent prompts document how new cases should be generated and reviewed

## Current Notes

- Contact page currently has no form, so form submission cases are intentionally excluded.
- News page currently has one visible news item and one category. `TC-024` validates filter state consistency, not full multi-category data coverage.
- News pagination currently has fewer than 10 items. `TC-026` validates hidden-pagination and empty-state consistency; full pagination click coverage requires controlled data with more than 10 news items.
- Application Note cases validate PDF link targets and image health, not PDF file content.
