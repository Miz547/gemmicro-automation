# Application Note Page Test Cases

## Page Scope

- Page URL: `https://www.gemmicro.com.tw/zh-TW/application-note`
- Current PROD behavior: Application Notes page with BMS and LCD TV downloadable PDF cards.
- Case ID rule: project-wide sequence ID with metadata classification.

---

## Case

- Case ID: `TC-031`
- Title: Application Note page loads and core heading is visible
- Feature: Application Note
- Area: Application
- Type: Smoke
- Priority: P0
- Smoke: true
- Tags: @application @application-note @smoke @P0
- Automation: Yes

## Goal

Verify the zh-TW Application Note page can be opened and its primary page identity is visible.

## Preconditions

- PROD site is reachable.
- Browser can access `/zh-TW/application-note`.

## Steps

1. Open `/zh-TW/application-note`.
2. Verify the URL ends with `/zh-TW/application-note`.
3. Verify document title contains `產品應用`.
4. Verify `html` language is `zh-TW`.
5. Verify visible H1 contains `產品應用`.
6. Verify subtitle `Application Notes` is visible.
7. Verify intro text contains `下載各應用場景的技術簡介`.

## Expected Result

- Application Note page loads without error.
- Browser URL is correct.
- Page title, language, H1, subtitle, and intro copy are visible.

## Notes

- This is the Application Note smoke case.

---

## Case

- Case ID: `TC-032`
- Title: Application Note cards display expected application names
- Feature: Application Note List
- Area: Application
- Type: UI / Content
- Priority: P0
- Smoke: false
- Tags: @application @application-note @content @P0
- Automation: Yes

## Goal

Verify the Application Note page displays the expected downloadable application cards.

## Preconditions

- Application Note page is accessible.
- Application note cards are expected to be publicly visible.

## Steps

1. Open `/zh-TW/application-note`.
2. Locate application note cards.
3. Verify at least two cards are visible.
4. Verify BMS card is visible with label `BMS`.
5. Verify BMS card title contains `電池管理系統`.
6. Verify LCD TV card is visible with label `LCD TV`.
7. Verify LCD TV card title contains `LCD 電視顯示器`.

## Expected Result

- Application note cards are visible.
- BMS and LCD TV application entries are present and readable.

## Notes

- This case validates page content structure, not PDF content.

---

## Case

- Case ID: `TC-033`
- Title: Application Note PDF links use expected external file targets safely
- Feature: Application Note Download Link
- Area: Application
- Type: Functional / Security
- Priority: P1
- Smoke: false
- Tags: @application @application-note @pdf @link @security @P1
- Automation: Yes

## Goal

Verify application note cards point to expected PDF files and use safe external-link attributes.

## Preconditions

- Application Note page is accessible.
- PDF links are visible.

## Steps

1. Open `/zh-TW/application-note`.
2. Locate the BMS card link.
3. Verify BMS link `href` ends with `/application-note/BMS.pdf`.
4. Locate the LCD TV card link.
5. Verify LCD TV link `href` ends with `/application-note/LCD_TV.pdf`.
6. Verify each PDF link starts with `https://`.
7. Verify each PDF link has `target="_blank"`.
8. Verify each PDF link `rel` contains `noopener` and `noreferrer`.

## Expected Result

- PDF links exist and point to expected PDF files.
- Links open in a new tab/window.
- Links include safe external-link attributes.

## Notes

- Attribute validation is preferred for PROD-safe automation.
- Optional PDF download validation can be added later if needed.

---

## Case

- Case ID: `TC-034`
- Title: Application Note card images are loaded and accessible
- Feature: Application Note Image
- Area: Application
- Type: UI / Quality
- Priority: P1
- Smoke: false
- Tags: @application @application-note @image @accessibility @quality @P1
- Automation: Yes

## Goal

Verify application note card cover images load correctly and expose useful alt text.

## Preconditions

- Application Note page is accessible.
- Image assets can be loaded from the public bucket.

## Steps

1. Open `/zh-TW/application-note`.
2. Locate BMS cover image.
3. Verify BMS image `src` ends with `/application-note/BMS.svg`.
4. Verify BMS image `alt` equals `電池管理系統`.
5. Verify LCD TV cover image `src` ends with `/application-note/LCD_TV.svg`.
6. Verify LCD TV image `alt` equals `LCD 電視顯示器`.
7. Verify each image has completed loading and has `naturalWidth > 0`.

## Expected Result

- Application note images load successfully.
- Image `alt` text is meaningful.
- No card image is broken.

## Notes

- This case is a lightweight asset health and accessibility check.
