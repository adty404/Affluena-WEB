# Affluena React Vite Full Audit

React + Vite + TypeScript implementation for Affluena personal finance web app.

## Included modules

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

## Audit fixes

- Removed outdated staging copy from landing and app shell pages.
- Kept icons consistent through the shared inline SVG `AppIcon` system.
- Replaced emoji feature icons on the landing page with `AppIcon`.
- Removed user-facing “mock/prototype/stage readiness” copy from active UI screens.
- Confirmed implemented modules route to real pages or local UI actions.
- Preserved responsive layout for desktop sidebar, mobile drawer, bottom navigation, cards, tables, and forms.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- Vanilla CSS only.
- No Tailwind dependency.
- Data is still local demo data under `src/data` for modules not yet integrated (Categories, Tags, Transactions, Budgets, Debts, Goals, Recurring, Reports, etc.). Auth and Wallets are already wired to the live backend API.
- Form input placeholders such as example email/search text are retained because they are normal UX hints, not inactive placeholders.
