# Homepage Test Cases

## Case

- Case ID: `TC-001`
- Title: Homepage loads successfully
- Feature: Home
- Area: Home
- Type: Smoke
- Priority: P0
- Smoke: true
- Tags: @home @smoke @P0
- Automation: Yes

## Goal

Verify homepage can be opened and core brand content is visible, including logo, hero title, slogan, and company positioning copy.

## Preconditions

- Base URL is reachable.
- Test runs with default language `zh-TW`.

## Steps

1. Open homepage `/zh-TW/`.
2. Wait until main hero section is displayed.
3. Check logo image `GEMMICRO Logo` is visible.
4. Check hero text `Precision Technology Leader` is visible.
5. Check H1 contains `專業．卓越` and `引領半導體未來`.
6. Check brand description contains `半導體設備與關鍵組件` and `專業的服務團隊`.

## Expected Result

- Page loads without error page.
- Brand logo, slogan, hero title, and company positioning text are visible.
- No blocking UI issue appears.

## Notes

- Attach screenshot in report for every run.
- Attach runtime log for diagnostics.

---

## Case

- Case ID: `TC-002`
- Title: Key navigation items are visible
- Feature: Navigation
- Area: Home
- Type: Smoke
- Priority: P0
- Smoke: true
- Tags: @home @smoke @P0
- Automation: Yes

## Goal

Verify key top menu items are shown on homepage.

## Preconditions

- Homepage is accessible.

## Steps

1. Open homepage `/zh-TW/`.
2. Verify zh-TW menu text `首頁`.
3. Verify zh-TW menu text `產品中心`.
4. Verify zh-TW menu text `產品應用`.
5. Verify zh-TW menu text `關於我們`.
6. Verify zh-TW menu text `聯絡我們`.
7. Verify zh-TW menu text `新聞中心`.
8. Click `EN`.
9. Verify English menu text `Home`, `Products`, `Application Note`, `About Us`, `Contact`, and `News`.

## Expected Result

- All key menu items are visible.

## Notes

- Use resilient locator strategy to avoid duplicate text conflicts.

---

## Case

- Case ID: `TC-003`
- Title: Key zh-TW navigation redirects are correct
- Feature: Navigation
- Area: Home, Product, Application, About, Contact, News
- Type: Functional
- Priority: P1
- Smoke: false
- Tags: @home @navigation @product @application @about @contact @news @P1
- Automation: Yes

## Goal

Verify visible zh-TW navigation entries redirect to the expected pages.

## Preconditions

- Homepage has loaded.

## Steps

1. Open homepage `/zh-TW/`.
2. Verify homepage URL remains `/zh-TW/`.
3. Open product center and verify MOSFET redirects to `/zh-TW/product_mostfet`.
4. Verify `產品應用` redirects to `/zh-TW/application-note`.
5. Open `關於我們` menu and verify `發展歷程` redirects to `/zh-TW/career`.
6. Verify `聯絡我們` redirects to `/zh-TW/contact`.
7. Verify `新聞中心` redirects to `/zh-TW/news`.

## Expected Result

- Each checked navigation action lands on the expected URL.
- Screenshots and redirect logs are attached to the report.

## Notes

- `公司簡介` and IC links exist in the DOM but are not currently exposed as visible homepage navigation links, so they are not included in this smoke redirect case.

---

## Case

- Case ID: `TC-004`
- Title: Language switch option is visible
- Feature: Language
- Area: Home
- Type: UI
- Priority: P1
- Smoke: false
- Tags: @home @language @P1
- Automation: Yes

## Goal

Verify language switch entry exists on homepage.

## Preconditions

- Homepage is loaded in zh-TW.

## Steps

1. Open homepage `/zh-TW/`.
2. Check language options (e.g., `中文 / EN`) are visible.
3. Click `EN` and verify URL or content language change.

## Expected Result

- Language switch control is visible.
- Switching language updates page as expected.

## Notes

- If URL rule exists, verify path pattern (e.g., `/en`).

---

## Case

- Case ID: `TC-005`
- Title: Footer copyright information appears
- Feature: Footer
- Area: Home
- Type: UI
- Priority: P2
- Smoke: false
- Tags: @home @footer @P2
- Automation: Yes

## Goal

Verify footer copyright text is displayed.

## Preconditions

- Homepage is loaded.

## Steps

1. Open homepage `/zh-TW/`.
2. Scroll to footer.
3. Verify copyright text contains `Gem-micro Semiconductor Inc.`

## Expected Result

- Footer text is visible and readable.

## Notes

- Accept minor year changes (dynamic year).

---

## Case

- Case ID: `TC-012`
- Title: Homepage basic SEO metadata is present
- Feature: SEO
- Area: Home
- Type: Quality
- Priority: P1
- Smoke: false
- Tags: @home @seo @P1 @quality
- Automation: Yes

## Goal

Verify homepage contains basic document metadata required for search engines and browser presentation.

## Preconditions

- Homepage is accessible.

## Steps

1. Open homepage `/zh-TW/`.
2. Verify document title is present.
3. Verify document language is `zh-TW`.
4. Verify viewport meta exists.
5. Verify favicon link exists and has a non-empty `href`.

## Expected Result

- Title is not empty.
- HTML `lang` is `zh-TW`.
- Viewport meta is present.
- Favicon link is present.

## Notes

- This is a basic metadata health check, not a full SEO audit.
- Current site does not expose canonical or meta description on homepage, so this case does not assert those fields.

---

## Case

- Case ID: `TC-013`
- Title: Homepage image resources are healthy
- Feature: Image Resource Health
- Area: Home
- Type: UI / Quality
- Priority: P1
- Smoke: false
- Tags: @home @image @P1 @ui @quality
- Automation: Yes

## Goal

Verify homepage image resources are successfully loaded and no rendered image is broken, preventing missing logo, banner, or product visual assets caused by invalid `src`, failed CDN resource, or deployment path errors.

## Preconditions

- Homepage is accessible.
- Network can load first-party and required public image assets.

## Steps

1. Open homepage `/zh-TW/`.
2. Collect all rendered image elements.
3. Verify each image has a non-empty `src`.
4. Verify each image has completed loading.
5. Verify each image has `naturalWidth > 0`.
6. Attach any broken image list to report.

## Expected Result

- Homepage contains at least one image.
- No image is broken.

## Notes

- This case is different from `TC-001`: `TC-001` checks visible brand content; this case checks image resource health.
- This case validates image resource health, not visual layout correctness.

---

## Case

- Case ID: `TC-014`
- Title: Homepage has no critical console or network errors
- Feature: Runtime Health
- Area: Home
- Type: Quality
- Priority: P1
- Smoke: false
- Tags: @home @runtime @network @P1 @quality
- Automation: Yes

## Goal

Verify homepage load does not produce critical frontend runtime errors or failed network requests.

## Preconditions

- Homepage is accessible.

## Steps

1. Register console, page error, request failure, and HTTP 5xx listeners.
2. Open homepage `/zh-TW/`.
3. Wait until page load is complete.
4. Collect critical console errors, page errors, failed requests, and server errors.
5. Attach error summary to report.

## Expected Result

- No page error occurs.
- No critical console error occurs.
- No request failure occurs.
- No HTTP 5xx response occurs.

## Notes

- This case focuses on runtime health, not visible UI text.

---

## Case

- Case ID: `TC-015`
- Title: Homepage mobile menu can open and close
- Feature: Mobile Navigation
- Area: Home
- Type: UI / Responsive
- Priority: P1
- Smoke: false
- Tags: @home @mobile @navigation @P1 @ui @responsive
- Automation: Yes

## Goal

Verify homepage mobile navigation menu can be opened and closed at mobile viewport width.

## Preconditions

- Homepage is accessible.
- Mobile menu button exists at small viewport width.

## Steps

1. Set viewport to mobile width.
2. Open homepage `/zh-TW/`.
3. Verify mobile menu is hidden by default.
4. Click mobile menu button.
5. Verify mobile menu is visible.
6. Verify key menu links are visible inside mobile menu.
7. Click mobile menu button again.
8. Verify mobile menu is hidden.

## Expected Result

- Mobile menu button is visible.
- Mobile menu can be opened.
- Key mobile navigation links are visible.
- Mobile menu can be closed.

## Notes

- This case is different from `TC-002`: `TC-002` checks navigation text visibility; this case checks mobile RWD interaction.

---

## Case

- Case ID: `TC-016`
- Title: Homepage basic accessibility signals are present
- Feature: Accessibility
- Area: Home
- Type: Accessibility / Quality
- Priority: P1
- Smoke: false
- Tags: @home @accessibility @P1 @quality
- Automation: Yes

## Goal

Verify homepage has basic accessibility signals for headings, images, and interactive elements.

## Preconditions

- Homepage is accessible.

## Steps

1. Open homepage `/zh-TW/`.
2. Verify at least one visible `h1` exists.
3. Verify visible images have non-empty `alt`.
4. Verify visible links and buttons have accessible text or label.
5. Attach any accessibility signal issues to report.

## Expected Result

- Visible main heading exists.
- Visible images have alt text.
- Visible links and buttons have accessible names.

## Notes

- This is a lightweight accessibility signal check, not a full WCAG audit.

---

## Case

- Case ID: `TC-017`
- Title: Homepage hero CTA links navigate to expected destinations
- Feature: CTA Navigation
- Area: Home, Product, Contact
- Type: Functional
- Priority: P1
- Smoke: false
- Tags: @home @product @contact @cta @P1 @functional
- Automation: Yes

## Goal

Verify the homepage hero commercial CTA links route users to the expected product and contact destinations.

## Preconditions

- Homepage is accessible.
- Hero CTA links are visible.

## Steps

1. Open homepage `/zh-TW/`.
2. Locate the hero product CTA.
3. Click the product CTA.
4. Verify URL redirects to `/zh-TW/product_mostfet`.
5. Return to homepage.
6. Locate the hero contact CTA.
7. Click the contact CTA.
8. Verify URL redirects to `/zh-TW/contact`.
9. Attach CTA navigation log to report.

## Expected Result

- Hero product CTA is visible and navigates to MOSFET product page.
- Hero contact CTA is visible and navigates to contact page.
- CTA navigation evidence is attached to the report.

## Notes

- This case is different from `TC-003`: `TC-003` verifies top navigation redirects; this case verifies hero commercial conversion entries.
