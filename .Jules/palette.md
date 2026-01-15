## 2024-05-22 - Clickable Cards Accessibility
**Learning:** `Card` components in this project are used as interactive elements but lack keyboard accessibility features (tab support, enter/space activation).
**Action:** When using `Card` as a trigger, add `role="button"`, `tabIndex={0}`, `aria-label`, and `onKeyDown` handlers. Ideally, refactor to use a semantic `<button>` wrapping the card content if layout permits.
