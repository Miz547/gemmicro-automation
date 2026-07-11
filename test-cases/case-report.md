# Gemmicro Test Case Report

## Report Scope

- Project: Gemmicro Tech Auto
- Case source: `test-cases/*.md`
- Case ID rule: project-wide sequence ID, `TC-001` style
- Classification source: `Feature`, `Area`, `Type`, `Priority`, `Smoke`, `Tags`
- Current total: 34 cases

## Executive Summary

| Metric | Count | Notes |
| --- | ---: | --- |
| Total cases | 34 | `TC-001~034` |
| Implemented Playwright cases | 34 | `TC-001~034` |
| Designed only, not automated yet | 0 | None |
| Automation marked Yes | 34 | All are automation candidates |
| Smoke cases | 6 | Fast health-check candidates |
| P0 cases | 16 | Highest priority |
| P1 cases | 16 | Regular regression |
| P2 cases | 2 | Lower-risk coverage |

## Coverage By Area

| Area | Case Range | Count | Status |
| --- | --- | ---: | --- |
| Home / Navigation / Homepage Quality | `TC-001~005`, `TC-012~017` | 11 | Implemented |
| MOSFET Product / API / Data Quality | `TC-006~011` | 6 | Implemented |
| Contact | `TC-018~021` | 4 | Implemented |
| News | `TC-022~026` | 5 | Implemented |
| About | `TC-027~030` | 4 | Implemented |
| Application Note | `TC-031~034` | 4 | Implemented |

## Priority Summary

| Priority | Count | Case IDs |
| --- | ---: | --- |
| P0 | 16 | `TC-001`, `TC-002`, `TC-006~011`, `TC-018`, `TC-019`, `TC-022`, `TC-023`, `TC-027`, `TC-028`, `TC-031`, `TC-032` |
| P1 | 16 | `TC-003`, `TC-004`, `TC-012~017`, `TC-020`, `TC-021`, `TC-024`, `TC-025`, `TC-029`, `TC-030`, `TC-033`, `TC-034` |
| P2 | 2 | `TC-005`, `TC-026` |

## Smoke Summary

| Smoke | Count | Case IDs |
| --- | ---: | --- |
| true | 6 | `TC-001`, `TC-002`, `TC-018`, `TC-022`, `TC-027`, `TC-031` |
| false | 28 | All other cases |

## Case List

| Case ID | Title | Feature | Area | Priority | Smoke | Automation | Implementation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TC-001` | Homepage loads successfully | Home | Home | P0 | true | Yes | Implemented |
| `TC-002` | Key navigation items are visible | Navigation | Home | P0 | true | Yes | Implemented |
| `TC-003` | Key zh-TW navigation redirects are correct | Navigation | Home, Product, Application, About, Contact, News | P1 | false | Yes | Implemented |
| `TC-004` | Language switch option is visible | Language | Home | P1 | false | Yes | Implemented |
| `TC-005` | Footer copyright information appears | Footer | Home | P2 | false | Yes | Implemented |
| `TC-006` | MOSFET API total count matches UI pagination total and per-page rows are correct | MOSFET | Product, API | P0 | false | Yes | Implemented |
| `TC-007` | MOSFET API field types are valid | MOSFET API | API, Data Quality | P0 | false | Yes | Implemented |
| `TC-008` | MOSFET product page single filter and multiple filters yield correct results | MOSFET Filter | Product | P0 | false | Yes | Implemented |
| `TC-009` | MOSFET product page multiple filters then reset restores full results | MOSFET Filter Reset | Product | P0 | false | Yes | Implemented |
| `TC-010` | MOSFET product page filter row visibility changes with viewport width | MOSFET Responsive Filter | Product | P0 | false | Yes | Implemented |
| `TC-011` | MOSFET API duplicate record check by pn and pn+type | MOSFET API Data Quality | API, Data Quality | P0 | false | Yes | Implemented |
| `TC-012` | Homepage basic SEO metadata is present | SEO | Home | P1 | false | Yes | Implemented |
| `TC-013` | Homepage image resources are healthy | Image Resource Health | Home | P1 | false | Yes | Implemented |
| `TC-014` | Homepage has no critical console or network errors | Runtime Health | Home | P1 | false | Yes | Implemented |
| `TC-015` | Homepage mobile menu can open and close | Mobile Navigation | Home | P1 | false | Yes | Implemented |
| `TC-016` | Homepage basic accessibility signals are present | Accessibility | Home | P1 | false | Yes | Implemented |
| `TC-017` | Homepage hero CTA links navigate to expected destinations | CTA Navigation | Home, Product, Contact | P1 | false | Yes | Implemented |
| `TC-018` | Contact page loads and core heading is visible | Contact | Contact | P0 | true | Yes | Implemented |
| `TC-019` | Contact information cards show company names and required contact details | Contact Information | Contact | P0 | false | Yes | Implemented |
| `TC-020` | Contact email and phone links use correct mailto and tel targets | Contact Link | Contact | P1 | false | Yes | Implemented |
| `TC-021` | Contact page navigation shell and mobile menu remain usable | Contact Responsive Navigation | Contact, Navigation | P1 | false | Yes | Implemented |
| `TC-022` | News page loads and core heading is visible | News | News | P0 | true | Yes | Implemented |
| `TC-023` | News list displays required card fields | News List | News | P0 | false | Yes | Implemented |
| `TC-024` | News category filter keeps matching news visible | News Filter | News | P1 | false | Yes | Implemented |
| `TC-025` | News read-more link opens external article safely | News External Link | News | P1 | false | Yes | Implemented |
| `TC-026` | News empty state and pagination state are consistent with result count | News Pagination | News | P2 | false | Yes | Implemented |
| `TC-027` | About page loads and core heading is visible | About | About | P0 | true | Yes | Implemented |
| `TC-028` | About page company introduction contains core brand facts | Company Profile | About | P0 | false | Yes | Implemented |
| `TC-029` | About page competitive advantages and FAB partners are visible | Competitive Advantage | About | P1 | false | Yes | Implemented |
| `TC-030` | About page history CTA navigates to career page | About CTA | About, Career | P1 | false | Yes | Implemented |
| `TC-031` | Application Note page loads and core heading is visible | Application Note | Application | P0 | true | Yes | Implemented |
| `TC-032` | Application Note cards display expected application names | Application Note List | Application | P0 | false | Yes | Implemented |
| `TC-033` | Application Note PDF links use expected external file targets safely | Application Note Download Link | Application | P1 | false | Yes | Implemented |
| `TC-034` | Application Note card images are loaded and accessible | Application Note Image | Application | P1 | false | Yes | Implemented |

## Latest Automation Result

- `TC-018~034` have been implemented as Playwright specs under `playwright-tool/tests/functional`.
- Latest full run: `34 passed`.
- Latest Allure report: `playwright-tool/allure-reports/20260711/002`.

## Notes For Review

- Contact page currently has no form, so form submission cases are intentionally not included.
- News page currently has one visible news item and one category; `TC-024` validates filter interaction/state consistency, not full multi-category coverage.
- News pagination currently has fewer than 10 items; `TC-026` validates hidden-pagination and empty-state consistency, while full page-click testing requires controlled data with more than 10 news items.
- Application Note cases validate PDF link targets and image health, not PDF content.
- `TC-018~034` are now implemented as Playwright specs.
