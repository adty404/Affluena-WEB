# Affluena-WEB

React + Vite + TypeScript implementation for the Affluena personal finance web app. The app is integrated with Affluena-API through `src/api/client.ts`, domain API modules, and React Query hooks.

## Current App Surface

- Foundation, auth, onboarding, and global layout
- Dashboard, analytics, forecast, and widget states
- Wallets, categories, and tags
- Transactions, split bill, and quick entry
- Budgets, budget alerts, and budget report
- Debt & Tracker, installments, and subscriptions
- Recurring automation and run history
- Goals, contributions, and shared goal members
- Reports, export center, activity log, alert center, and system logs
- Settings, account, security, notification preferences, privacy, help, and UI audit

## Architecture Notes

- `src/api/client.ts` is the central fetch wrapper. It defaults to `http://localhost:8080` and supports `VITE_API_BASE_URL`.
- `src/api/*.ts` and `src/hooks/*.ts` provide the domain API and React Query layer.
- `src/components/ui/DataTable.tsx` wraps `datatables.net-react` + `datatables.net-dt`; page code should use this component rather than raw table markup.
- `src/components/ui/AppIcon.tsx` is the shared icon system.
- `src/styles/*.css` define the vanilla CSS design system.
- Remaining `src/data/*` files are static UI/support data for the landing page, app shell/widget-state previews, and shared transaction labels. They are not the main business-data source.

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
- API behavior should match `../Affluena-API/docs/API_CONTRACT.md`.
