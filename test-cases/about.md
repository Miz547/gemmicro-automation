# About Page Test Cases

## Page Scope

- Page URL: `https://www.gemmicro.com.tw/zh-TW/about`
- Current PROD behavior: company introduction, competitive advantages, FAB partners, and career/history CTA.
- Case ID rule: project-wide sequence ID with metadata classification.

---

## Case

- Case ID: `TC-027`
- Title: About page loads and core heading is visible
- Feature: About
- Area: About
- Type: Smoke
- Priority: P0
- Smoke: true
- Tags: @about @smoke @P0
- Automation: Yes

## Goal

Verify the zh-TW About page can be opened and its primary page identity is visible.

## Preconditions

- PROD site is reachable.
- Browser can access `/zh-TW/about`.

## Steps

1. Open `/zh-TW/about`.
2. Verify the URL ends with `/zh-TW/about`.
3. Verify document title contains `關於我們`.
4. Verify `html` language is `zh-TW`.
5. Verify visible H1 contains `關於我們`.

## Expected Result

- About page loads without error.
- Browser URL is correct.
- Page title, language, and H1 are visible and aligned with the About page.

## Notes

- This is the About page smoke case.

---

## Case

- Case ID: `TC-028`
- Title: About page company introduction contains core brand facts
- Feature: Company Profile
- Area: About
- Type: Content
- Priority: P0
- Smoke: false
- Tags: @about @content @brand @P0
- Automation: Yes

## Goal

Verify the About page presents the company profile and important brand facts accurately.

## Preconditions

- About page is accessible.
- Company profile section is expected to be publicly visible.

## Steps

1. Open `/zh-TW/about`.
2. Verify section heading `公司簡介` is visible.
3. Verify company name text contains `晶群科技有限公司 Gem-micro semiconductor Inc.`.
4. Verify founding date text contains `成立於 2006 年 3 月`.
5. Verify semiconductor focus text includes `類比半導體技術應用研發與行銷`.
6. Verify product scope text includes `MOSFET`, `鋰電池保護`, `LED 恆流`, and `電源管理`.
7. Verify mission or positioning text includes `全球主要電源及類比產品供應商`.

## Expected Result

- Company profile section is visible.
- Core company facts and product positioning are present.
- Text content is readable and not empty.

## Notes

- This case protects brand and business content, not pixel-level layout.
- If official company wording changes, update the case before automation.

---

## Case

- Case ID: `TC-029`
- Title: About page competitive advantages and FAB partners are visible
- Feature: Competitive Advantage
- Area: About
- Type: UI / Content
- Priority: P1
- Smoke: false
- Tags: @about @content @fab @P1
- Automation: Yes

## Goal

Verify the About page displays competitive advantage sections and FAB partner badges.

## Preconditions

- About page is accessible.
- Competitive advantage section is expected to be visible.

## Steps

1. Open `/zh-TW/about`.
2. Scroll to the `競爭優勢` section.
3. Verify advantage cards are visible: `自主研發`, `創新技術`, `本地化服務`.
4. Verify each advantage card contains at least one bullet item.
5. Verify `FAB 合作夥伴` heading is visible.
6. Verify FAB partner badges are visible: `XFAB`, `ASMC`, `HHG`, `MXIC`, `SMIC`.

## Expected Result

- Competitive advantage section is visible.
- Required advantage categories are present.
- FAB partner badges are visible and readable.

## Notes

- This case is useful for detecting missing business sections after layout or CMS changes.

---

## Case

- Case ID: `TC-030`
- Title: About page history CTA navigates to career page
- Feature: About CTA
- Area: About, Career
- Type: Functional
- Priority: P1
- Smoke: false
- Tags: @about @career @cta @navigation @P1
- Automation: Yes

## Goal

Verify the About page CTA routes users to the company history / career page.

## Preconditions

- About page is accessible.
- CTA link `了解我們的歷程` is visible.

## Steps

1. Open `/zh-TW/about`.
2. Locate CTA link `了解我們的歷程`.
3. Verify CTA `href` equals `/zh-TW/career`.
4. Click the CTA.
5. Verify URL ends with `/zh-TW/career`.
6. Attach navigation evidence to report.

## Expected Result

- CTA is visible and actionable.
- CTA points to the expected career/history route.
- Clicking the CTA lands on `/zh-TW/career`.

## Notes

- This case crosses About and Career areas; classification is handled by `Area` and tags.
