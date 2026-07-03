# Affluena AI Route Map

Use this file to understand existing routes and avoid active-link/dynamic-route mistakes.

> **Hidden-from-sidebar routes (still routable):** The sidebar nav was de-cluttered and no longer links to Split Bill (`/transactions/split`), Tags (`/tags*`), Debt & Tracker (`/debts*`, `/tracker`), or the Export Center (`/exports*`). All of these routes, pages, and handlers are still mounted in `src/App.tsx` and remain reachable via the All Access menu (`/app-menu`) and direct URLs — they were hidden, not removed. Every route below is still accurate.

## Route Principles

- Static routes must be declared before dynamic routes.
- Do not let static routes get swallowed by `:id`.
- Sidebar active state should use exact/manual matching.
- Do not use raw prefix matching for active links.
- **UI route slugs intentionally differ from API endpoint paths.** The browser URL and the backend path are separate namespaces. Do not "align" them — each `src/api/*.ts` module already hardcodes the correct backend path. Known intentional differences:
  - `/budgets` (UI) → `/api/v1/category-budgets` (API)
  - `/recurring` (UI) → `/api/v1/recurring-transactions` (API)
  - `/reports/expenses` (UI) → `/api/v1/reports/expense` (API, singular)
  - `/reports/budgets` (UI) reuses `/api/v1/category-budgets/report` (there is no `/reports/budget(s)` endpoint)
  - `/sharing` (UI, "Berbagi Dompet") → `/api/v1/partners` (API keeps the historical `partners` name)

## Public / Foundation

- `/`
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/onboarding`

## Dashboard

- `/dashboard`
- `/dashboard/analytics`
- `/dashboard/forecast`
- `/dashboard/widget-states`

## Wallets

- `/wallets`
- `/wallets/new`
- `/wallets/:id`
- `/wallets/:id/edit`
- `/wallets/:id/sharing`

## Berbagi Dompet (account-level wallet sharing)

- `/sharing` — not in the sidebar; reachable from Settings and the All Access menu (`/app-menu`).

## Categories

- `/categories`
- `/categories/new`
- `/categories/:id/edit`

## Tags

- `/tags`
- `/tags/new`
- `/tags/:id/edit`

## Transactions

- `/transactions`
- `/transactions/new`
- `/transactions/transfer`
- `/transactions/adjustment`
- `/transactions/filter`
- `/transactions/split`
- `/transactions/:id`
- `/transactions/:id/edit`

Do not interpret these as `/transactions/:id`:
- `/transactions/new`
- `/transactions/transfer`
- `/transactions/adjustment`
- `/transactions/filter`
- `/transactions/split`

## Quick Entry

- `/quick-entry`
- `/quick-entry/new`
- `/quick-entry/:id/edit`

## Budgets

- `/budgets`
- `/budgets/new`
- `/budgets/:id`
- `/budgets/:id/edit`
- `/budgets/alerts`
- `/budgets/report`

Do not interpret `/budgets/alerts` or `/budgets/report` as `/budgets/:id`.

## Debt & Tracker

- `/tracker`
- `/debts`
- `/debts/new/payable`
- `/debts/new/receivable`
- `/debts/:id`
- `/debts/:id/pay`
- `/installments`
- `/installments/new`
- `/installments/:id/pay`
- `/subscriptions`
- `/subscriptions/new`
- `/subscriptions/:id/pay`

## Recurring / Automation

- `/recurring`
- `/recurring/new`
- `/recurring/:id`
- `/recurring/:id/edit`
- `/recurring/:id/run`
- `/recurring/:id/history`

## Goals

- `/goals`
- `/goals/new`
- `/goals/:id`
- `/goals/:id/edit`
- `/goals/:id/contribute`
- `/goals/:id/members`

## Reports

- `/reports`
- `/reports/cashflow`
- `/reports/expenses`
- `/reports/income`
- `/reports/budgets`
- `/reports/debts`
- `/reports/goals`

## Exports

- `/exports`
- `/exports/new`
- `/exports/history`
- `/exports/:id`

Do not interpret `/exports/new` or `/exports/history` as `/exports/:id`.

## Activities

- `/activities`
- `/activities/:id`

## Alerts

- `/alerts`
- `/alerts/:id`

## System Logs

- `/system-logs`
- `/system-logs/:id`

## Settings

- `/settings`
- `/settings/profile`
- `/settings/account`
- `/settings/security`
- `/settings/sessions`
- `/settings/notifications`
- `/settings/preferences`
- `/settings/privacy`
- `/settings/data`
- `/settings/help`
- `/settings/about`
- `/settings/ui-audit`

## App Menu

- `/app-menu`
- `/app-shell`
- `/app` redirects to `/dashboard`

## Active Link Checklist

When adding/editing nav:
- test exact route
- test child route
- test sibling route
- ensure no double active states
- ensure bottom nav active state is correct
