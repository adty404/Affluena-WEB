# Affluena AI Agent Instructions

You are working on the Affluena React + Vite + TypeScript web app.

## Current Base

Use this project as an existing integrated app, not as a blank project.

The UI covers these product areas:

1. Foundation
2. Dashboard
3. Master Data
4. Transactions
5. Budget
6. Debt & Tracker
7. Automation / Recurring
8. Goals
9. Reports, Export, Activity & Alerts
10. Settings, Account & Final Polish

Do not restart, rewrite, redesign, or replace the existing UI system.

The sidebar nav was de-cluttered: Split Bill, Tags, Debt & Tracker, and the Export Center are intentionally hidden from the sidebar (and the dashboard no longer renders the cashflow-trend chart or expense-distribution widget). These pages, routes, and components are all retained — they stay reachable via the All Access menu (`/app-menu`) and direct URLs. Do not re-add them to the sidebar, and do not delete the routes/pages/components.

## Main Rule

Preserve the existing Affluena design system.

Do not change:
- brand direction
- primary color
- typography feel
- card radius
- shadow style
- sidebar behavior
- topbar behavior
- bottom navigation behavior
- icon style
- responsive layout pattern

## Required Files To Understand First

Before editing UI, inspect:

- `src/styles/tokens.css`
- `src/styles/globals.css`
- `src/styles/layout.css`
- `src/styles/components.css`
- `src/styles/pages.css`
- `src/components/ui/Button.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/AppIcon.tsx`
- `src/components/ui/Modal.tsx`
- `src/components/ui/Toast.tsx`
- `src/components/ui/DataTable.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Topbar.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/layouts/AppLayout.tsx`
- `docs/AI_DESIGN_SYSTEM.md`
- `docs/AI_ROUTE_MAP.md`
- `docs/AI_QA_CHECKLIST.md`

## Design Identity

Affluena must remain:

- clean white/light UI
- modern professional finance app
- green primary accent
- rounded cards
- soft shadows
- readable typography
- high-contrast text
- responsive desktop/tablet/mobile
- desktop sidebar
- sticky topbar
- mobile bottom navigation
- consistent inline SVG icons via `AppIcon`

Do not add a dark theme unless explicitly requested.

## Styling Rules

Use existing Vanilla CSS files. Do not introduce Tailwind, CSS Modules, UI libraries, random colors, large inline style blocks, or duplicate style systems.

Approved libraries: `react-select` (for `Select` component search/async/multi), `datatables.net-react`, and `datatables.net-dt` (for the shared `DataTable` sort/pagination/search wrapper). No other UI libraries without explicit approval.

Use CSS variables from `tokens.css`. If a new token is needed, add it to `tokens.css` and reuse it consistently.

## Component Rules

Reuse existing components first:

- `Button`
- `Card`
- `Badge`
- `Input`
- `Select`
- `Textarea`
- `Modal`
- `Toast`
- `DataTable`
- `EmptyState`
- `AppIcon`
- layout components
- finance components

Do not create duplicate Button/Card/Badge/Modal components.

Keep components simple and reusable. Do not over-engineer state management.

## Button & Action Rules

Every button must do something real.

Allowed button behaviors:
- route navigation
- open modal/popover
- close modal/popover
- submit form
- update local state
- trigger confirmation flow
- trigger simulated export/download
- show toast after a real UI state/action
- redirect to related page

Not allowed:
- button with no action
- `href="#"` without click handler
- “coming soon” toast as the only action
- dead menu item
- decorative clickable element

If backend is not connected yet, implement UI-level behavior: local state update, confirmation modal, success/error toast, redirect, simulated progress, or visible result state.

## Icon Rules

Use `AppIcon` for primary UI icons. Do not use emoji for main action icons. Do not mix new icon libraries unless explicitly requested.

Icon mapping:
- Bank wallet: bank icon
- Cash wallet: cash icon
- E-wallet: phone/wallet icon
- Investment: trend icon
- Goal: target icon
- Payable debt: outflow/down icon
- Receivable: inflow/up icon
- Subscription: recurring/cycle icon
- Recurring: cycle/automation icon
- Report: chart icon
- Export: download icon
- Settings: gear icon
- Alert: alert/bell icon
- Activity: timeline/history icon

Icons must have consistent size, stroke, and visual weight.

## Routing Rules

Static routes must be declared before dynamic routes.

Do not let these routes be swallowed by dynamic `:id` routes:
- `/transactions/new`
- `/transactions/transfer`
- `/transactions/adjustment`
- `/transactions/filter`
- `/transactions/split`
- `/budgets/alerts`
- `/budgets/report`
- `/exports/new`
- `/exports/history`
- `/settings/profile`
- `/settings/security`

Use exact/manual active link matching. Do not use raw prefix matching that causes double active states.

Examples that must not happen:
- `/transactions` and `/transactions/split` active at the same time
- `/budgets` and `/budgets/report` active at the same time
- `/reports` and `/reports/cashflow` active at the same time if detail route should be separate
- `/settings` and `/settings/profile` active at the same time if exact section highlighting is expected

## Sidebar Rules

Do not create a second sidebar.

The existing sidebar must:
- have its own scrollable area
- not overlap the footer/profile area
- keep footer/profile visible and stable
- not overflow below viewport
- not double-highlight active links

## Topbar & Profile Rules

Do not create a second topbar. Profile initials/menu must open as a popover near the top-right profile button. It must not appear floating in the center of the screen unless it is explicitly a modal.

## Bottom Navigation Rules

Mobile bottom navigation must remain clean and stable. Do not add too many items to the bottom nav. If adding more sections, prefer the existing app menu/more page pattern.

## Card Rules

Cards must not overflow. Cards must not be too narrow if parent space is available.

For finance cards:
- title must not collide with badge
- badge must not push layout outside the card
- amount must remain readable
- action buttons must wrap cleanly
- dark cards must have white/readable text
- progress bars must stay inside card

Use existing `FinanceOverviewCard` pattern for debt, installment, subscription, recurring, and similar finance summary cards.

## Amount / Currency Rules

Do not manually format currency repeatedly. Use existing amount utility/component.

Important currency text must not break into multiple ugly lines. Use no-wrap patterns for key amounts. Amount text must not overflow outside cards.

## Form Rules

Every form field must have visible label, clear input, helper text when useful, submit action, and cancel/back action.

Desktop forms may use 2 columns. Mobile forms must stack into 1 column. Mutation-like forms need disabled/loading state if applicable, success toast, error/validation message when applicable, and redirect or visible result after submit.

## Table/List Rules

Use the shared `DataTable` component for table views. It is backed by `datatables.net-react` + `datatables.net-dt`; do not hand-render page tables with raw `<table>` markup. Large tables must remain inside the DataTable/overflow pattern, and the page body must not horizontally scroll.

## Modal/Popover Rules

Use existing modal/popover patterns. Modals must fit viewport, be closeable, have clear title, clear actions, and avoid excessive width on mobile. Critical actions must use confirmation modal.

## Copywriting Rules

Do not use staging/prototype/development wording in user-facing UI.

Forbidden UI copy:
- Ready for Stage 2
- prototype mode
- mock data
- coming soon
- roadmap
- will be built later
- akan dibuat
- Stage 1 / Stage 2 / Stage 3 as user-facing labels
- development note
- placeholder action

Use final product copy. Input placeholders like `Search...`, `friend@example.com`, or `Rp 0` are allowed.

## Responsive Rules

Always check desktop, tablet, and mobile.

Requirements:
- no global horizontal overflow
- cards stack on mobile
- forms stack on mobile
- sidebar desktop works
- sidebar mobile drawer works
- bottom nav mobile works
- modals fit mobile viewport
- tables scroll inside wrappers only
- buttons remain tappable
- icons remain readable

## Known Past Issues To Avoid

These issues have happened before and must not happen again:
- sidebar menu overlaps footer/profile
- sidebar active link double active
- profile popover appears floating in the center
- wallet balance preview overflows to the right
- amount text breaks ugly into multiple lines
- dark budget card has black text
- finance cards are messy in Debt/Installment/Subscription/Recurring
- badge pushes title and breaks card layout
- card too narrow while parent space is still wide
- staging/prototype wording appears on landing page
- buttons are only decorative
- links are dead
- tables cause page-level horizontal scroll

## Backend/API Integration Rules

The app uses `src/api/client.ts` plus domain API modules and React Query hooks for the main backend-integrated surface. The API base URL defaults to `http://localhost:8080` and can be overridden with `VITE_API_BASE_URL`.

When adding or changing API-backed UI:
- keep request/response shapes aligned with the Affluena-API contract (`docs/API_CONTRACT.md` lives in the **Affluena-API** repo and is NOT present in a single-repo/cloud clone of WEB — in that case `src/api/*.ts` + `docs/AI_ROUTE_MAP.md` are the in-repo source of truth)
- preserve existing loading/error/empty states
- preserve JWT auth/refresh behavior in `apiFetch`
- `PUT /auth/password` revokes all other sessions and returns a fresh `{ user, tokens }` pair — `useChangePassword` MUST persist the returned tokens via `setTokens`, or the user is silently logged out when the old refresh token dies
- preserve `Amount` formatting and integer minor-unit money handling
- preserve user isolation expectations from the API
- every mutation must show loading/success/error behavior and invalidate/refetch relevant query keys

The remaining `src/data/*` files are static UI/support data for the landing page, app menu/widget-state previews, and shared transaction labels. Do not treat those files as live business data sources.

## Commands

Before finishing, run:

```bash
npm install
npm run build
```

Use `npm run dev` for manual preview.

Build warnings about chunk size are acceptable if build succeeds, but do not ignore TypeScript or runtime errors.

## Final Report Required

After changes, report:
- files changed
- routes added/changed
- components added/changed
- buttons/actions added or fixed
- responsive checks
- sidebar active checks
- build result
- known risks or TODOs
