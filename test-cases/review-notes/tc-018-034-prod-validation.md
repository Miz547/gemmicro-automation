# TC-018~034 PROD Validation Notes

## Purpose

Record the final decision after comparing external agent feedback with the current PROD HTML for `gemmicro.com.tw`.

## Conclusion

Keep the existing `TC-018~034` design. Do not downgrade or remove Contact link, News external link, or Application Note card/PDF/image cases, because those elements are present in current PROD HTML.

## External Feedback Not Adopted

| Case | External Claim | PROD Finding | Decision |
| --- | --- | --- | --- |
| `TC-019` | Contact page lacks email / phone | PROD contains `sales_gem@gemmicro.com.tw` and `+86-755-23030602` | Keep case |
| `TC-020` | No clickable mailto / tel links | PROD contains `mailto:sales_gem@gemmicro.com.tw` and `tel:+86-755-23030602` | Keep case |
| `TC-025` | News has no clickable read-more link | PROD contains `閱讀更多` link to `technews.tw` with `target="_blank"` and `rel="noopener noreferrer"` | Keep case |
| `TC-031` | Application Note lacks subtitle | PROD contains `Application Notes` subtitle | Keep case |
| `TC-032~034` | Application cards / PDF / images are missing | PROD contains BMS and LCD TV cards, PDF links, and SVG images | Keep cases |

## Adopted Caveats

| Case | Caveat | Final Test Meaning |
| --- | --- | --- |
| `TC-024` | Current PROD has one visible news item and one category (`行業動態`) | Validate filter interaction and DOM state consistency only; full multi-category coverage requires controlled test data |
| `TC-026` | Current PROD has fewer than 10 news items | Validate hidden-pagination and empty-state consistency only; full pagination click testing requires more than 10 news items |

## Final Guidance For Agents

- Do not mark `TC-020`, `TC-025`, or `TC-033` as blocked based on visual-only inspection.
- Use current DOM/HTML evidence before changing case scope.
- Treat `TC-024` and `TC-026` as data-dependent cases with current-PROD assertions plus future-data expansion points.
