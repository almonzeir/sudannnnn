## 2024-05-22 - Clickable Cards Accessibility
**Learning:** `Card` components in this project are used as interactive elements but lack keyboard accessibility features (tab support, enter/space activation).
**Action:** When using `Card` as a trigger, add `role="button"`, `tabIndex={0}`, `aria-label`, and `onKeyDown` handlers. Ideally, refactor to use a semantic `<button>` wrapping the card content if layout permits.

## 2024-05-22 - Dual-Language Search Reliability
**Learning:** Relying solely on database search indexes for dual-language (English/Arabic) content can be flaky during rapid development/testing.
**Action:** For small-to-medium datasets, implementing robust in-memory filtering (checking both fields with normalization) ensures immediate and reliable search results, improving the "it just works" feeling.

## 2026-01-30 - Dynamic ARIA Labels for Toggles
**Learning:** Toggle buttons (like Theme or Menu) often have static icons but dynamic states. Screen readers need to know what the button *currently* does or its state.
**Action:** Use ternary operators for `aria-label` based on state (e.g., `aria-label={isOpen ? "Close menu" : "Open menu"}`) to provide accurate context to assistive technology users.
