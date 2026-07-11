# Contact Page Test Cases

## Page Scope

- Page URL: `https://www.gemmicro.com.tw/zh-TW/contact`
- Current PROD behavior: contact information cards only; no contact form is present.
- Case ID rule: project-wide sequence ID with metadata classification.

---

## Case

- Case ID: `TC-018`
- Title: Contact page loads and core heading is visible
- Feature: Contact
- Area: Contact
- Type: Smoke
- Priority: P0
- Smoke: true
- Tags: @contact @smoke @P0
- Automation: Yes

## Goal

Verify the zh-TW contact page can be opened and its primary page identity is visible.

## Preconditions

- PROD site is reachable.
- Browser can access `/zh-TW/contact`.

## Steps

1. Open `/zh-TW/contact`.
2. Verify the URL ends with `/zh-TW/contact`.
3. Verify document title contains `聯絡我們`.
4. Verify `html` language is `zh-TW`.
5. Verify visible H1 contains `聯絡我們`.
6. Verify page intro text contains `歡迎與我們的專業團隊取得聯繫`.

## Expected Result

- Contact page loads without error.
- Browser URL is correct.
- Page title, language, H1, and intro copy are visible and aligned with the Contact page.

## Notes

- This is the Contact page smoke case.
- This case does not validate every contact information field.

---

## Case

- Case ID: `TC-019`
- Title: Contact information cards show company names and required contact details
- Feature: Contact Information
- Area: Contact
- Type: UI / Content
- Priority: P0
- Smoke: false
- Tags: @contact @content @P0
- Automation: Yes

## Goal

Verify the contact page displays the expected company contact cards and critical contact details.

## Preconditions

- Contact page is accessible.
- Contact information is expected to be publicly visible.

## Steps

1. Open `/zh-TW/contact`.
2. Verify the Shenzhen company card is visible: `深圳市晶宏電科技有限公司（深圳）`.
3. Verify the Taiwan company card is visible: `晶群科技有限公司`.
4. Verify the agency recruitment card is visible: `誠徵代理商`.
5. Verify Shenzhen address is visible: `深圳市宝安区石岩街道塘头一号路创维创新谷2#楼B座南区8层808`.
6. Verify Taiwan address is visible: `235603 新北市中和區建八路197號14樓`.
7. Verify shared email `sales_gem@gemmicro.com.tw` is visible.
8. Verify phone `+86-755-23030602` is visible where phone contact is provided.

## Expected Result

- Required contact cards are visible.
- Company names, addresses, email, and phone information are readable.
- Missing optional phone on the Taiwan card does not fail unless requirement changes.

## Notes

- This case validates business-critical content, not layout pixel accuracy.
- If contact information changes, update this case before updating automation.

---

## Case

- Case ID: `TC-020`
- Title: Contact email and phone links use correct mailto and tel targets
- Feature: Contact Link
- Area: Contact
- Type: Functional
- Priority: P1
- Smoke: false
- Tags: @contact @link @email @phone @P1
- Automation: Yes

## Goal

Verify contact links are actionable and use expected `mailto:` and `tel:` targets.

## Preconditions

- Contact page is accessible.
- Browser can inspect link attributes without actually launching mail or phone apps.

## Steps

1. Open `/zh-TW/contact`.
2. Locate all visible `sales_gem@gemmicro.com.tw` email links.
3. Verify each email link `href` equals `mailto:sales_gem@gemmicro.com.tw`.
4. Locate visible phone links for `+86-755-23030602`.
5. Verify each phone link `href` equals `tel:+86-755-23030602`.
6. Attach collected link hrefs to report.

## Expected Result

- Email links use the correct `mailto:` target.
- Phone links use the correct `tel:` target.
- No email or phone link has an empty or malformed `href`.

## Notes

- Do not click the links in automation if it may open a local mail or phone handler.
- Attribute validation is enough for this PROD-safe case.

---

## Case

- Case ID: `TC-021`
- Title: Contact page navigation shell and mobile menu remain usable
- Feature: Contact Responsive Navigation
- Area: Contact, Navigation
- Type: UI / Responsive
- Priority: P1
- Smoke: false
- Tags: @contact @navigation @mobile @responsive @P1
- Automation: Yes

## Goal

Verify the shared navigation shell works on the Contact page, including mobile menu open and close behavior.

## Preconditions

- Contact page is accessible.
- Mobile viewport can be simulated.

## Steps

1. Set viewport to mobile width.
2. Open `/zh-TW/contact`.
3. Verify mobile menu is hidden by default.
4. Click the mobile menu button.
5. Verify mobile menu becomes visible.
6. Verify key mobile navigation links are visible: `首頁`, `產品中心`, `聯絡我們`, `新聞中心`.
7. Click the mobile menu button again.
8. Verify mobile menu is hidden.

## Expected Result

- Mobile menu can open and close on the Contact page.
- Key navigation links are visible in mobile menu.
- Contact page content remains reachable after menu interaction.

## Notes

- This validates page-level navigation shell health, not only the homepage mobile menu.
