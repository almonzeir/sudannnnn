## 2024-05-22 - Clickable Cards Accessibility
**Learning:** `Card` components in this project are used as interactive elements but lack keyboard accessibility features (tab support, enter/space activation).
**Action:** When using `Card` as a trigger, add `role="button"`, `tabIndex={0}`, `aria-label`, and `onKeyDown` handlers. Ideally, refactor to use a semantic `<button>` wrapping the card content if layout permits.

## 2024-05-22 - Dual-Language Search Reliability
**Learning:** Relying solely on database search indexes for dual-language (English/Arabic) content can be flaky during rapid development/testing.
**Action:** For small-to-medium datasets, implementing robust in-memory filtering (checking both fields with normalization) ensures immediate and reliable search results, improving the "it just works" feeling.

## 2024-05-23 - Icon-Only Button Accessibility Pattern
**Learning:** The codebase frequently uses `Button` with `size="icon"` (Shadcn UI pattern) without providing `aria-label`, creating "unlabeled button" issues for screen readers.
**Action:** When encountering `size="icon"`, always verify and add a descriptive `aria-label` (preferably dynamic if stateful) in the primary language (Arabic).
