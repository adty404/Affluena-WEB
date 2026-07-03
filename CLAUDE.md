# Affluena-WEB — orientation for a fresh session

Personal-finance **web app: React + Vite + TypeScript** (vanilla CSS, no Tailwind), talking to the
Affluena-API backend. This file is the quick orientation; the full working rules live in
**`AGENTS.md`** (auto-imported below), with routes/design/QA in `docs/`.

## Primary instructions (auto-included)

@AGENTS.md
@docs/AI_ROUTE_MAP.md
@docs/AI_DESIGN_SYSTEM.md
@docs/AI_QA_CHECKLIST.md

## Run / verify

- `npm install`
- `npm run dev` — Vite dev server on **http://localhost:5173** (needs the API running, default `http://localhost:8080`)
- `npm run build` — `tsc -b && vite build` (type-check + bundle; **this is the build gate** — TS errors fail it)
- `npm run test:run` — Vitest, one-shot

## ⚠️ Gotchas a fresh / cloud session must know

- **ALL user-facing copy is Bahasa Indonesia** (workspace rule; mobile terms are canon). The shared
  glossary lives in **`src/lib/copy.ts`** (`NAV` / `NAV_SECTIONS` / `ACTIONS`); full copywriting
  rules in `AGENTS.md` → "Copywriting Rules". Recurring = **"Berulang"** (never "Otomasi"); money
  labels are "Jumlah (Rp)" — never "(Minor)". Keep technical terms: Transfer, Status, Edit,
  Endpoint, Email.

- **`VITE_API_BASE_URL` is baked in at BUILD time** (Vite env; defaults to `http://localhost:8080`,
  see `src/api/client.ts`). It **cannot** be changed at runtime — set it before `npm run build` to
  point at a non-local backend.
- **The full API contract lives in the Affluena-API repo** (`docs/API_CONTRACT.md`), which is
  **NOT present in a single-repo (cloud) clone of WEB.** In this repo, the authoritative encoding of
  what WEB actually calls is the per-domain modules under **`src/api/*.ts`**, and
  **`docs/AI_ROUTE_MAP.md`** maps UI slugs → API paths. **UI slugs intentionally differ from API
  paths — do not "align" them** (e.g. `/budgets` → `/api/v1/category-budgets`, `/recurring` →
  `/api/v1/recurring-transactions`, `/reports/expenses` → `/api/v1/reports/expense`).
- **API dates are full RFC3339 timestamps even for `DATE` columns** — e.g. a budget's `month` comes
  back as `"2026-06-01T00:00:00Z"`, not `"2026-06"`. Parse defensively; never assume `YYYY-MM`.

## API conventions you must not break (full list in AGENTS.md → "Backend/API Integration Rules")

- **Money = integer minor units** (`*_minor`). Format via `src/lib/money.ts` `formatIDR` / the
  `Amount` component (`src/components/finance/Amount.tsx`) — never raw floats, never re-implement.
- **Auth**: single-flight `401 → POST /auth/refresh → retry` in `apiFetch` (`src/api/client.ts`);
  tokens in localStorage via `src/lib/token.ts`. `PUT /auth/password` revokes all other sessions and
  returns a fresh `{ user, tokens }` — `useChangePassword` MUST persist it via `setTokens`, or the
  user is silently logged out when the old refresh token dies.
- **User isolation**: never surface another user's data; respect the API's per-user scoping.
- Every mutation: loading/success/error UI + invalidate/refetch the relevant React Query keys.
- **Item appearance**: wallets/budgets/goals/installments/subscriptions/recurring carry optional
  `color` (`#RRGGBB`) + `icon` strings. The shared 24-color catalog (identical to mobile) +
  `ColorPicker` swatch component live in `src/components/finance/ColorPicker.tsx`. `PUT` replaces
  these fields — pass them through on partial updates or they get wiped.
- **Categories** additionally carry `color` + `icon` + a server-side `position` (the user's
  arranged order). The web **category icon catalog** lives in `src/lib/categoryIcons.tsx` with ids
  **identical to the mobile catalog** (`kCategoryIconCatalog`) so a persisted `icon` resolves on
  both clients — never rename/reorder an id, only append. Pickers: `ColorPicker` +
  `IconPicker` (`src/components/finance/IconPicker.tsx`); render via `CategoryIcon`
  (`src/components/master-data/CategoryIcon.tsx`). **Do not pass `sort` when listing categories** —
  the API default is position ASC (`listCategories` omits it). Reorder via
  `PUT /api/v1/categories/reorder` (`useReorderCategories`, optimistic + revert), driven by
  drag-to-reorder on the CategoryTree (sibling-group only, persists the full flattened id list).
- **"Berbagi Dompet"** (`/sharing` UI → `/api/v1/partners` API, historical name): account-level,
  one-way, read-only share of ALL your wallets, max 5 active outgoing viewers. Not in the sidebar —
  linked from Settings + `/app-menu`. Wallet share roles are `owner`/`member`/`viewer` (no `editor`).

## Before UI changes

1. Inspect the relevant page/component. 2. Reuse existing components (don't duplicate Button/Card/
Badge/Modal). 3. Preserve the Affluena design system (`docs/AI_DESIGN_SYSTEM.md`). 4. Run
`npm run build` (type-check). 5. Re-read **"Known Past Issues To Avoid"** in `AGENTS.md` before
touching layout/cards/sidebar, and the **`docs/AI_QA_CHECKLIST.md`** before finishing.
