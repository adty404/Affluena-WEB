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
11. Berbagi Dompet (account-level wallet sharing at `/sharing` — API `/api/v1/partners`)

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
- Tinta monochrome ink accent (near-black `--primary`; colour carries meaning only — success green, danger coral, warning amber, section hues, user item colours)
- rounded cards
- soft neutral shadows
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
- `ColorPicker` (`src/components/finance/ColorPicker.tsx` — the shared 24-color item-appearance catalog; also exports `normalizeItemColor`/`itemAccentVars` for accent rendering)
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

**ALL user-facing copy is Bahasa Indonesia** (workspace-wide product rule; mobile is already fully Indonesian). Nav/section labels come from the shared glossary module **`src/lib/copy.ts`** (`NAV`, `NAV_SECTIONS`, `ACTIONS`) — reuse it for labels shared across Sidebar/BottomNav/AppMenu/Settings; page-local strings stay inline but must use the same canonical terms. Mobile terms are canon: Beranda, Dompet, Kategori, Transaksi, Catat Cepat, Anggaran, Cicilan, Langganan, **Berulang** (Recurring — never "Otomasi"), Target Tabungan, Utang, Laporan, Wawasan, Pengaturan, Berbagi Dompet (viewers = "pemantau"), Keluar, Lainnya. Technical terms that are identical/expected stay: Transfer, Status, Edit, Endpoint, Email. Money labels are "Jumlah (Rp)"-style — never expose "(Minor)"/minor-unit wording in UI. Copy style is informal "kamu", never "Anda".

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

Use final product copy. Input placeholders like `Cari...`, `friend@example.com`, or `Rp 0` are allowed.

Also forbidden in user-facing copy (developer-note wording):
- backend
- minor unit
- module/architecture narration ("Recurring rule menggunakan frequency...", table names, rule engine)
- English UI strings (labels, headers, toasts, empty states, badges — everything user-visible is Indonesian)

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
- **item appearance (`color`/`icon`)**: wallets, category-budgets, goals, installments, subscriptions, and recurring rules carry optional `color` (`#RRGGBB` hex) + `icon` (semantic id) strings the API stores as-is. The color catalog lives in `src/components/finance/ColorPicker.tsx` and is intentionally identical to mobile's — do not add colors on one client only. `PUT` endpoints replace these fields, so any update that isn't a full form submit must pass the current `color`/`icon` through or it silently wipes them.
- **categories (`color`/`icon`/`position`)**: categories carry the same optional `color`/`icon` plus a server-side `position` (the user's arranged order). The web **category icon catalog** is `src/lib/categoryIcons.tsx`, with ids **identical to the mobile catalog** (`kCategoryIconCatalog`) so a persisted `icon` resolves on both clients — never rename/reorder an id, only append. The category form uses `ColorPicker` + the new `IconPicker` (`src/components/finance/IconPicker.tsx`); rows/tx rows render the chosen icon+color via `CategoryIcon` (`src/components/master-data/CategoryIcon.tsx`). **Do not pass `sort` when listing categories** — the API default is position ASC (`listCategories` omits it). Reorder is a `PUT /api/v1/categories/reorder` (body `{ ids }`) via `useReorderCategories` (optimistic + revert), wired to drag-to-reorder on the CategoryTree (rearranges within a sibling group and persists the full flattened id list). The **Wawasan** page (`/insights`) mirrors mobile's current-month category breakdown fully client-side (pages the month's transactions, aggregates by category into expense/income tabs with a "Tanpa kategori" bucket). The **Kalender** page (`/calendar`, sidebar "Wawasan" section) mirrors mobile's monthly money calendar the same way: `useMonthTransactions` fetches the (±1-day widened) month window and `bucketByLocalDay` (`src/lib/calendar.ts`) aggregates it per LOCAL day — transfers/adjustments are listed but count toward neither income nor expense.
- **transfer admin fee (`fee_minor`)**: transfers accept an optional `fee_minor` (integer minor units, default 0, must be >= 0; the API 400s a negative fee or a fee on a non-transfer). Semantics: **the source wallet is charged `amount_minor + fee_minor`; the destination receives `amount_minor` only.** Transaction responses include `fee_minor` (treat undefined as 0 for rows cached before the field shipped). The web transfer form ("Biaya admin (Rp, opsional)") only includes `fee_minor` in the payload when > 0, the source balance preview subtracts amount+fee, and the transaction detail shows a "Biaya admin" row for transfers with a fee.
- **avatar photos are data URLs**: mobile uploads profile photos as base64 `data:image/...` URLs stored directly in `avatar_url` (~20–160KB). Web mirrors this — the Pengaturan Akun "Foto profil" picker downscales client-side via canvas (≤256px, JPEG q0.8, hard cap ~120KB, helpers in `src/lib/avatar.ts`) and submits the data URL. There is **no manual URL input anymore**; legacy http(s) `avatar_url` values still render. Validation accepts `''`, `data:image/...`, or http(s) (`isValidAvatarUrl`). Render the photo via the shared `UserAvatar` (`src/components/ui/UserAvatar.tsx`) — img when usable, initials fallback (Topbar popover, Sidebar footer, settings preview).
- **"Penyamaran nominal" masking**: a persisted global setting (localStorage `affluena.amounts_visible`, provider `src/contexts/AmountVisibilityProvider.tsx`, hook `useAmountVisibility`) mirrors mobile — when masked, balances/summaries render `Rp ••••••` (`maskedIDR()` in `src/lib/money.ts`) via the `Amount` component's opt-in `maskable` prop. **Masked scope:** Dashboard hero/net-worth/stat amounts + savings tile + net-worth sparkline label + wallet portfolio, WalletListPage + WalletCard balances, WalletDetailPage balance figures, goal saved/target figures (GoalList/GoalDetail). **The transactions ledger/detail/reports stay visible.** Toggles: the Beranda eye button and Pengaturan → Privasi both flip the same setting.
- **wallet share roles** are `owner` / `member` (read+write) / `viewer` (read-only) — there is no `editor`. Wallet invites accept an optional `role` (`member` default).
- **transaction wallet pickers must exclude non-recordable wallets**: any source/destination wallet `<Select>` (new transaction, transfer, adjustment, quick-entry, split-bill) must filter `walletsData.wallets` through **`canRecordToWallet`** (`src/lib/wallet.ts`) — it drops read-only `viewer` wallets (the API rejects writes to them with "resource not found", so offering one makes the create **silently fail** and the transaction never appears) and `goal`-type wallets (funded via goal contributions, not manual transactions). `GET /wallets` returns viewer + goal wallets for display/name-resolution, so never render that raw list in a record picker.
- **"Berbagi Dompet"** (`/sharing` UI): account-level, one-way, read-only share of ALL the caller's wallets, max 5 active outgoing viewers. API endpoints keep the historical `/api/v1/partners` name. Accepting/revoking a link changes which wallets the viewer sees, so those mutations must also invalidate financial queries.

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
