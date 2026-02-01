## 2024-05-22 - Clickable Cards Accessibility
**Learning:** `Card` components in this project are used as interactive elements but lack keyboard accessibility features (tab support, enter/space activation).
**Action:** When using `Card` as a trigger, add `role="button"`, `tabIndex={0}`, `aria-label`, and `onKeyDown` handlers. Ideally, refactor to use a semantic `<button>` wrapping the card content if layout permits.

## 2024-05-22 - Dual-Language Search Reliability
**Learning:** Relying solely on database search indexes for dual-language (English/Arabic) content can be flaky during rapid development/testing.
**Action:** For small-to-medium datasets, implementing robust in-memory filtering (checking both fields with normalization) ensures immediate and reliable search results, improving the "it just works" feeling.

## 2024-05-22 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons (typically using `size="icon"`) frequently exist in the codebase without `aria-label` attributes, making them inaccessible.
**Action:** When working with `Button` components, especially in navigation or toolbars, always verify that `size="icon"` buttons include a descriptive, localized `aria-label`.
