# Affluena AI QA Checklist

Run this checklist before finishing any edit, adjustment, or new page.

## Build

Required:

```bash
npm install
npm run build
```

Optional preview:

```bash
npm run dev
```

Build must succeed. TypeScript errors are not acceptable.

## Visual QA

Check:
- UI still uses Affluena green primary accent.
- Fonts are consistent.
- Cards use consistent radius and shadow.
- Icons are consistent.
- Dark cards have readable text.
- Amount text is readable.
- No black text on dark cards.
- No ugly amount wrapping.
- No body-level horizontal scroll.
- Cards do not overflow.
- Tables are inside scroll wrappers.

## Button / Link QA

Every button/link must have one of:
- route navigation
- submit action
- open modal
- close modal
- state update
- confirmation action
- export/download simulation
- meaningful toast after actual state/action

Not allowed:
- dead link
- empty onClick
- `href="#"` with no handler
- decorative button only
- coming soon toast only

## Navigation QA

Check:
- sidebar active state
- bottom nav active state
- no double active links
- profile popover position
- sidebar scroll area
- sidebar footer/profile not overlapped
- route static/dynamic ordering

Important cases:
- `/transactions`
- `/transactions/new`
- `/transactions/split`
- `/transactions/filter`
- `/transactions/transfer`
- `/transactions/adjustment`
- `/budgets`
- `/budgets/alerts`
- `/budgets/report`
- `/reports`
- `/reports/cashflow`
- `/settings`
- `/settings/profile`

## Responsive QA

Test desktop, tablet, and mobile.

Desktop:
- sidebar visible
- topbar sticky
- main grid balanced
- tables readable

Tablet:
- grid reduces gracefully
- no overflow
- form layout readable

Mobile:
- bottom nav visible
- sidebar drawer works
- cards stack
- forms stack
- modal fits viewport
- table scrolls inside wrapper
- buttons are tappable

## Form QA

Check:
- labels exist
- helper text exists where useful
- submit action works
- cancel/back works
- validation message area exists if relevant
- loading/success/error UI if mutation-like
- mobile stack layout works

## Modal / Popover QA

Check:
- modal opens
- modal closes
- close/cancel/confirm actions work
- modal fits mobile viewport
- profile menu appears near profile button, not floating center

## Copy QA

Forbidden user-facing copy:
- Ready for Stage
- prototype mode
- mock data
- coming soon
- roadmap
- akan dibuat
- development note
- placeholder action
- Stage 1 / Stage 2 / etc as main UI labels

Allowed:
- input placeholders like Search, example email, example amount

## Finance Card QA

Check cards in:
- debts
- installments
- subscriptions
- recurring
- goals
- wallets
- budgets

Ensure:
- title not colliding with badge
- badge stays inside card
- amount not broken
- progress bar inside card
- action buttons wrap cleanly
- card is readable on mobile

## Final Report

Report:
- files changed
- routes changed
- components changed
- button/action audit result
- active navigation audit result
- responsive audit result
- build result
- known risks/TODOs
