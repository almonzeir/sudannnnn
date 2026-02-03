## 2024-05-22 - Clickable Cards Accessibility
**Learning:** `Card` components in this project are used as interactive elements but lack keyboard accessibility features (tab support, enter/space activation).
**Action:** When using `Card` as a trigger, add `role="button"`, `tabIndex={0}`, `aria-label`, and `onKeyDown` handlers. Ideally, refactor to use a semantic `<button>` wrapping the card content if layout permits.

## 2024-05-22 - Dual-Language Search Reliability
**Learning:** Relying solely on database search indexes for dual-language (English/Arabic) content can be flaky during rapid development/testing.
**Action:** For small-to-medium datasets, implementing robust in-memory filtering (checking both fields with normalization) ensures immediate and reliable search results, improving the "it just works" feeling.

## 2026-02-03 - Icon-Only Button Accessibility
**Learning:** The codebase frequently uses `size="icon"` buttons for navigation actions without providing `aria-label`s, rendering them invisible to screen readers.
**Action:** Always pair `size="icon"` with an `aria-label` describing the action in Arabic (e.g., "التنبيهات"), and use dynamic labels for stateful toggles (e.g., theme or menu).
