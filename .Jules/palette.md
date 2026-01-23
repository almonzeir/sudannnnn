## 2024-05-22 - Clickable Cards Accessibility
**Learning:** `Card` components in this project are used as interactive elements but lack keyboard accessibility features (tab support, enter/space activation).
**Action:** When using `Card` as a trigger, add `role="button"`, `tabIndex={0}`, `aria-label`, and `onKeyDown` handlers. Ideally, refactor to use a semantic `<button>` wrapping the card content if layout permits.

## 2024-05-22 - Dual-Language Search Reliability
**Learning:** Relying solely on database search indexes for dual-language (English/Arabic) content can be flaky during rapid development/testing.
**Action:** For small-to-medium datasets, implementing robust in-memory filtering (checking both fields with normalization) ensures immediate and reliable search results, improving the "it just works" feeling.

## 2026-01-23 - Navigation Accessibility in Arabic
**Learning:** Navigation bars often contain icon-only buttons (notifications, settings, theme toggle) that are invisible to screen readers without labels. In an Arabic UI, these labels must be localized to Arabic to maintain a consistent experience.
**Action:** Audit all icon-only buttons in the `Navigation` component and add `aria-label` attributes in Arabic. Ensure toggle buttons (like theme or menu) have dynamic labels reflecting their current state or action.
