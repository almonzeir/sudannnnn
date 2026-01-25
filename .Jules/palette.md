## 2024-05-22 - Clickable Cards Accessibility
**Learning:** `Card` components in this project are used as interactive elements but lack keyboard accessibility features (tab support, enter/space activation).
**Action:** When using `Card` as a trigger, add `role="button"`, `tabIndex={0}`, `aria-label`, and `onKeyDown` handlers. Ideally, refactor to use a semantic `<button>` wrapping the card content if layout permits.

## 2024-05-22 - Dual-Language Search Reliability
**Learning:** Relying solely on database search indexes for dual-language (English/Arabic) content can be flaky during rapid development/testing.
**Action:** For small-to-medium datasets, implementing robust in-memory filtering (checking both fields with normalization) ensures immediate and reliable search results, improving the "it just works" feeling.

## 2024-05-22 - Form Label Association
**Learning:** Visual labels above inputs are often implemented as generic `<div>` or `<label>` tags without `htmlFor`/`id` association, leaving screen reader users without context.
**Action:** Systematically check all inputs. If a visual label exists, force association using `id="field-name"` on the input and `htmlFor="field-name"` on the label.
