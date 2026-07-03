# Affluena-WEB

React + Vite + TypeScript implementation for the Affluena personal finance web app. The app is integrated with Affluena-API through `src/api/client.ts`, domain API modules, and React Query hooks.

## Current App Surface

- Foundation, auth, onboarding, and global layout
- Dashboard, analytics, forecast, Wawasan (per-category insights), and widget states
- Wallets (incl. shared wallets with `member` and read-only `viewer` roles), categories (with per-category icon/color + drag-to-reorder), and tags
- Transactions, split bill, and quick entry
- Budgets, budget alerts, and budget report
- Debt & Tracker, installments, and subscriptions
- Recurring automation and run history
- Goals, contributions, and shared goal members
- Reports, export center, activity log, alert center, and system logs
- Settings, account, security, notification preferences, privacy, help, and UI audit

> **Nav de-clutter:** Split bill, tags, debt/loan, and the export center are intentionally hidden from the sidebar to keep day-to-day navigation focused. Their pages, routes, and code are all retained and stay reachable via the All Access menu (`/app-menu`) and direct URLs. The dashboard was also trimmed to net-worth/cashflow stats, recent transactions, and the wallet portfolio; the `CashflowChart` and `ExpenseDistribution` widgets are no longer rendered on `/dashboard` (the components still exist in `src/components/finance/DashboardWidgets.tsx`).

## Architecture Notes

- `src/api/client.ts` is the central fetch wrapper. It defaults to `http://localhost:8080` and supports `VITE_API_BASE_URL`.
- `src/api/*.ts` and `src/hooks/*.ts` provide the domain API and React Query layer.
- `src/components/ui/DataTable.tsx` wraps `datatables.net-react` + `datatables.net-dt`; page code should use this component rather than raw table markup.
- `src/components/ui/AppIcon.tsx` is the shared icon system. Categories have their own icon catalog in `src/lib/categoryIcons.tsx` (ids kept identical to the mobile catalog so a persisted `icon` resolves on both clients), picked via `IconPicker` and rendered via `CategoryIcon`.
- **Follow-up (out of scope here):** a web Calendar view (mobile has a Kalender). The Wawasan page (`/insights`) computes the current-month category breakdown client-side and does not depend on it.
- `src/styles/*.css` define the vanilla CSS design system.
- Remaining `src/data/*` files are static UI/support data for the landing page, app shell/widget-state previews, and shared transaction labels. They are not the main business-data source.
- **Runtime dependencies are pinned to concrete caret majors** (e.g. `react@^19`, `vite@^8`, `react-router-dom@^7`) — never `"latest"`, which had silently drifted the lockfile onto breaking majors. Bump majors deliberately and re-run the build/test gates.
- **Every user-facing number must come from real data.** Analytics/forecast/tracker/recurring panels derive from the fetched API data (or show an EmptyState when there is none) — do not hardcode illustrative amounts, percentages, or dates as if they were the user's finances.

## Run

```bash
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` by default.

## Build

```bash
npm install
npm run build
```

## Test

```bash
npm run test:run
```

## Notes

- Vanilla CSS only; no Tailwind dependency.
- Keep routes aligned with `docs/AI_ROUTE_MAP.md`.
- Keep UI edits aligned with `docs/AI_DESIGN_SYSTEM.md` and `docs/AI_QA_CHECKLIST.md`.
- API behavior should match the Affluena-API contract (`docs/API_CONTRACT.md` in the **Affluena-API** repo — not present in a single-repo/cloud clone; then rely on `src/api/*.ts` + `docs/AI_ROUTE_MAP.md`). See `CLAUDE.md` for the handover quick-start + cross-cutting API gotchas.
