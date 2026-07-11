# News Page Test Cases

## Page Scope

- Page URL: `https://www.gemmicro.com.tw/zh-TW/news`
- Current PROD behavior: one visible news card, one category filter `行業動態`, external read-more link, pagination script with page size 10.
- Case ID rule: project-wide sequence ID with metadata classification.

---

## Case

- Case ID: `TC-022`
- Title: News page loads and core heading is visible
- Feature: News
- Area: News
- Type: Smoke
- Priority: P0
- Smoke: true
- Tags: @news @smoke @P0
- Automation: Yes

## Goal

Verify the zh-TW news page can be opened and its primary page identity is visible.

## Preconditions

- PROD site is reachable.
- Browser can access `/zh-TW/news`.

## Steps

1. Open `/zh-TW/news`.
2. Verify the URL ends with `/zh-TW/news`.
3. Verify document title contains `新聞中心`.
4. Verify `html` language is `zh-TW`.
5. Verify visible H1 contains `新聞中心`.

## Expected Result

- News page loads without error.
- Browser URL is correct.
- Page title, language, and H1 are visible and aligned with the News page.

## Notes

- This is the News page smoke case.

---

## Case

- Case ID: `TC-023`
- Title: News list displays required card fields
- Feature: News List
- Area: News
- Type: UI / Content
- Priority: P0
- Smoke: false
- Tags: @news @content @P0
- Automation: Yes

## Goal

Verify the news list renders at least one news card with required user-facing fields.

## Preconditions

- News page is accessible.
- At least one news item is expected in PROD.

## Steps

1. Open `/zh-TW/news`.
2. Locate visible `.news-card` elements.
3. Verify at least one news card is visible.
4. In the first visible news card, verify category label is visible.
5. Verify date text matches `YYYY-MM-DD` format.
6. Verify news title is visible and non-empty.
7. Verify summary text is visible.
8. Verify `閱讀更多` link is visible.

## Expected Result

- At least one news card is visible.
- Each required card field is present: category, date, title, summary, read-more link.
- Date format is valid.

## Notes

- Current PROD first item category is `行業動態`.
- This case validates list content structure, not external article content.

---

## Case

- Case ID: `TC-024`
- Title: News category filter keeps matching news visible
- Feature: News Filter
- Area: News
- Type: Functional
- Priority: P1
- Smoke: false
- Tags: @news @filter @P1
- Automation: Yes

## Goal

Verify the news category filter updates the visible list according to selected category.

## Preconditions

- News page is accessible.
- Category filter buttons are visible.
- At least one category exists.

## Steps

1. Open `/zh-TW/news`.
2. Verify `全部` filter button is active by default.
3. Verify at least one news card is visible.
4. Click category filter `行業動態`.
5. Verify `行業動態` button becomes active.
6. Verify visible news cards all have `data-category="行業動態"`.
7. Click `全部`.
8. Verify all available news cards are visible again.

## Expected Result

- Default filter is `全部`.
- Category filter can be selected.
- Visible cards match the selected category.
- Switching back to `全部` restores all available cards.

## Notes

- Current PROD has one visible news item and one category (`行業動態`).
- This case validates single-category filter interaction and DOM state consistency.
- Full multi-category filtering should be covered later in a controlled test/staging data set with multiple categories.

---

## Case

- Case ID: `TC-025`
- Title: News read-more link opens external article safely
- Feature: News External Link
- Area: News
- Type: Functional / Security
- Priority: P1
- Smoke: false
- Tags: @news @link @external @security @P1
- Automation: Yes

## Goal

Verify the news read-more link points to the expected external article and uses safe external-link attributes.

## Preconditions

- News page is accessible.
- News card includes a `閱讀更多` link.

## Steps

1. Open `/zh-TW/news`.
2. Locate the first visible `閱讀更多` link.
3. Verify `href` is non-empty and starts with `https://`.
4. Verify current PROD link points to `technews.tw`.
5. Verify `target="_blank"` is set.
6. Verify `rel` contains `noopener` and `noreferrer`.
7. Optionally click the link in a new page context and verify the new page URL starts with `https://technews.tw/`.

## Expected Result

- Read-more link is visible and valid.
- External link opens in a new tab/window.
- Link uses `noopener noreferrer` to reduce external tab security risk.

## Notes

- The optional click step may depend on external site availability.
- Attribute validation should be the primary PROD-safe assertion.

---

## Case

- Case ID: `TC-026`
- Title: News empty state and pagination state are consistent with result count
- Feature: News Pagination
- Area: News
- Type: UI / Functional
- Priority: P2
- Smoke: false
- Tags: @news @pagination @empty-state @P2
- Automation: Yes

## Goal

Verify the news list empty-state and pagination UI match the filtered result count.

## Preconditions

- News page is accessible.
- News pagination script is loaded.
- Current page size is 10.

## Steps

1. Open `/zh-TW/news`.
2. Count all news cards.
3. Verify `news-empty` is hidden when at least one result exists.
4. Verify pagination container is empty when total result count is less than or equal to page size.
5. If future data exceeds page size, verify pagination buttons render and clicking a page updates visible cards.
6. Attach result count and pagination state to report.

## Expected Result

- Empty state is hidden when results exist.
- Pagination is not shown when total results fit on one page.
- If result count exceeds page size in the future, pagination becomes visible and functional.

## Notes

- Current PROD has one news item and `PAGE_SIZE = 10`, so pagination is expected to be hidden.
- The current executable value is state-consistency validation: results exist, empty state stays hidden, pagination does not render unnecessarily.
- Full pagination click testing requires more than 10 news items in a controlled test/staging data set.
