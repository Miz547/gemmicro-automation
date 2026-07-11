# <Module Name> Test Cases

## Case

- Case ID: `TC-NNN`
- Title: <Short case title>
- Feature: <Primary feature>
- Area: <Covered areas, comma-separated>
- Type: Functional / UI / API / Regression / Smoke
- Priority: P0 / P1 / P2
- Smoke: true / false
- Tags: @feature @area @P0
- Automation: Yes / No

## Goal

<What this case validates>

## Preconditions

- <Environment ready>
- <Required data exists>
- <User state / role>

## Steps

1. <Step 1>
2. <Step 2>
3. <Step 3>

## Expected Result

- <Expected outcome 1>
- <Expected outcome 2>

## Notes

- <Known risks / assumptions>
- <Links to design or requirement docs>

---

## Example

- Case ID: `TC-NNN`
- Title: Homepage loads and key menu is visible
- Feature: Navigation
- Area: Home, Contact, News
- Type: Smoke
- Priority: P0
- Smoke: true
- Tags: @home @navigation @contact @news @smoke @P0
- Automation: Yes

### Goal

Verify homepage can be opened and key navigation items are rendered.

### Preconditions

- Base URL is reachable.
- Browser session starts without login.

### Steps

1. Open homepage URL.
2. Verify brand text is visible.
3. Verify `產品中心`, `關於我們`, `聯絡我們` are visible.

### Expected Result

- Page opens successfully.
- Key menu items are visible and interactable.

