# Affluena AI Design System

This document defines the UI rules that AI agents must follow when editing or adding pages.

## Visual Identity

Affluena is a professional personal finance web app.

The UI should feel clean, bright, calm, reliable, modern, premium but not flashy, and data-focused but readable.

## Core Style

Use:
- white/light background (Tinta monochrome chrome)
- near-black ink primary accent (`--primary` = `--ink`)
- colour for meaning only: success green (income/positive), amber warning, coral danger
- section identity hues (`--hue-*`) as soft decorative tints for money domains
- rounded cards
- soft neutral shadows
- clear typography hierarchy
- generous but efficient spacing

Do not use:
- dark theme
- neon colors
- random gradients everywhere
- emoji-heavy UI
- overly playful fonts
- sharp table-only design
- unrelated color palette

## Tokens

Always use CSS variables from `src/styles/tokens.css`.

Expected token groups:
- background
- surface
- surface soft
- primary (ink accent) + primary soft
- success / warning / danger (+ soft variants)
- section hues (`--hue-dompet`, `--hue-anggaran`, …)
- legacy aliases (`--secondary` → dompet denim, `--purple` → langganan violet, `--surface-green` → success soft)
- ink/text
- muted text
- border
- radius
- shadow
- sidebar width
- topbar height

If a new token is needed, add it to `tokens.css`.

## Shared state / layout utility classes (pages.css)

Reuse these instead of ad-hoc inline `style={{padding,color}}` blocks. All use
existing tokens only — do not introduce new colour values:

- `.loading-state` — muted, padded "Memuat…" text for the loading branch of a
  data view (the canonical loading affordance; pair with a shared `EmptyState`
  for the error/empty branches).
- `.panel-note` / `.panel-note.danger` — muted (or danger) inline note inside a
  panel/card; replaces repeated inline-styled `<p>` fallbacks.
- `.warning-note` — amber warning banner (`--warning` on `--warning-soft`) for
  form-level warnings (e.g. invalid reset token).
- `.stat-grid.three` — a 3-up modifier for `.stat-grid` (`StatGrid` accepts an
  optional `className`) when a section has exactly three stats.
- `.report-meta-chip` — flat read-only scope chip for report pages; deliberately
  has no card border/shadow so it does not read as an interactive filter next to
  the `MonthPicker`.
- `.readiness-list` — the shared label/value info rows (wallet-create "Aturan
  Dompet", delete/confirm dialogs, detail-meta panels). Rows are side-by-side on
  wide screens; **below 600px they stack (label as a muted caption over the
  full-width value)** so long sentence values don't get squeezed into a cramped
  right column. Keep that responsive rule — don't force side-by-side on mobile.

## Shared components of note

- `EmptyState` (`src/components/ui/EmptyState.tsx`) is the single empty / error /
  not-found affordance. Error branches should pass an
  `action={<Button variant="primary" onClick={() => refetch()}>Coba lagi</Button>}`.
- `PasswordInput` (`src/components/ui/PasswordInput.tsx`) wraps `Input` + the
  show/hide toggle for Login/Register/Reset. The toggle is `type="button"`,
  sits outside the field `<label>`, and exposes `aria-pressed` + an Indonesian
  `aria-label`. Do not re-implement the password reveal toggle inline.
- Date rendering: use `formatDateID` / `formatDateTimeID` (`src/lib/dates.ts`)
  for all user-facing dates (id-ID, defensive RFC3339 parse, `'-'` fallback) —
  never a locale-less `toLocaleDateString()` or a raw ISO string.
- Money always renders through `Amount` / `formatIDR` with the correct
  income/expense type — never a raw formatted string in a styled `<strong>`.
- **Penyamaran nominal**: `Amount` has an opt-in `maskable` prop backed by the
  persisted `AmountVisibilityProvider` setting (localStorage
  `affluena.amounts_visible`; hook `useAmountVisibility`). While masked it
  renders `Rp ••••••` (`maskedIDR()` in `src/lib/money.ts`). Scope mirrors
  mobile: Beranda hero/stat/sparkline/portfolio amounts + savings tile, Dompet
  balances (list, card, detail), Target Tabungan saved/target figures. The
  transactions ledger/detail/reports are NEVER masked. Toggles: the Beranda eye
  button (`eye`/`eyeOff` AppIcons) and the Pengaturan → Privasi switch flip the
  same setting. New balance/summary surfaces should pass `maskable`; ledgers
  should not.
- `UserAvatar` (`src/components/ui/UserAvatar.tsx`) is the single profile-photo
  circle: renders `avatar_url` (`data:image/...` upload from mobile/web, or a
  legacy http(s) URL) as an `img`, with an initials fallback on the `.avatar`
  ink gradient. Do not hand-render `<div className="avatar">` initials where a
  user photo could exist. Photo uploads downscale via `src/lib/avatar.ts`
  (≤256px JPEG, ~120KB cap) — never submit raw file data URLs.
- `NetWorthTrend` (`src/components/finance/DashboardWidgets.tsx`) is the Beranda
  "Tren Kekayaan Bersih" sparkline — an inline SVG area+line (income-green
  `--success` stroke over `--success-soft` fill, emphasized endpoint dot). Its
  data comes from the pure `buildNetWorthSeries` helper (`src/lib/netWorth.ts`,
  a 1:1 port of mobile's `net_worth_series.dart`): anchor at the current
  `net_worth_minor`, walk backward through `useCashflowTrend(12)`'s per-month
  `cashflow_minor`, clamped to the earliest OWNED wallet's created month. Shows
  a skeleton while loading and a muted "belum cukup data" note under 2 points —
  never a NaN axis. The savings-rate stat (`monthly_cashflow_minor /
  monthly_income_minor`, `—` when income is 0) sits beside it in the
  `.dashboard-insights` grid.

## Typography

Maintain existing typography:
- large page titles with tight letter spacing
- readable body text
- muted helper text
- strong financial amounts
- clear labels

Do not make text too small on mobile.

## Layout

Use:
- `AppLayout` for logged-in app pages
- desktop sidebar
- sticky topbar
- mobile bottom navigation
- responsive content grid
- page content wrapper
- cards and panels

Do not create alternative layout systems unless explicitly requested.

## Cards

Standard cards:
- white or very light background
- subtle border
- soft shadow
- large rounded radius
- internal spacing
- clear heading and body

Dark cards:
- text must be white/high-contrast
- amount must be white/high-contrast
- muted text must still be readable
- action buttons must contrast

Finance cards:
- use stable finance card patterns
- icon/title/badge layout must not collide
- amount must not wrap badly
- progress bar must remain inside card
- buttons must wrap cleanly on mobile

## Forms

Form rules:
- every field has label
- every important field has helper text if needed
- primary submit button is ink (near-black) with white text
- cancel/back action is present
- validation message area is visible when needed
- 2-column desktop allowed
- 1-column mobile required

Do not make forms too dense.

## Buttons

Button variants:
- primary: ink (near-black, white text)
- secondary/default: white with border
- danger: red
- ghost/subtle: minimal

Every button must have real behavior.

## Tables

Tables must:
- use the shared `DataTable` component backed by `datatables.net-react` and `datatables.net-dt`
- have clear headers
- be inside overflow wrapper
- not cause body horizontal scroll
- be readable on mobile

Do not hand-render page tables with raw `<table>` markup. Keep custom cell content inside `DataTable` column renderers.

## Icons

Use `AppIcon`.

Icon style:
- inline SVG
- consistent stroke
- consistent size
- consistent visual weight
- no emoji for primary actions

Icon mapping examples:
- Dashboard: grid/home/chart
- Wallet bank: bank
- Cash: cash
- E-wallet: phone/wallet
- Transaction: arrows/receipt
- Budget: pie/progress
- Debt: outflow/inflow
- Recurring: cycle
- Goal: target
- Reports: chart
- Export: download
- Activity: history/timeline
- Alerts: bell/alert
- Settings: gear

## Color Contrast

Always check:
- dark card text
- badges on dark cards
- disabled states
- helper text
- danger/warning states
- financial amount readability

Do not leave black text on dark cards.

## Responsive Design

Desktop:
- sidebar visible
- topbar sticky
- grids can use multiple columns

Tablet:
- grid can reduce to 2 columns
- sidebar may become drawer

Mobile:
- bottom nav visible
- cards stack
- forms stack
- modals fit viewport
- table scrolls inside wrapper

Never allow global horizontal overflow.

## User-Facing Copy

**All user-facing copy is Bahasa Indonesia.** This is a workspace-wide product rule — the mobile app is fully Indonesian and its terms are canonical. Copy style is informal ("kamu", never "Anda").

The shared glossary module is **`src/lib/copy.ts`** (`NAV`, `NAV_SECTIONS`, `ACTIONS`). Use it for nav/section labels shared across Sidebar, BottomNav, App Menu, and Settings. Page-local strings stay inline but must use the same canonical terms.

Canonical glossary (EN → ID):

| English | Indonesian |
| --- | --- |
| Dashboard / Home | Beranda |
| Analytics / Forecast | Analitik / Prakiraan |
| Wallets | Dompet |
| Categories / Tags | Kategori / Tag |
| Transactions | Transaksi |
| Quick Entry / Quick Add | Catat Cepat |
| Split Bill | Bagi Tagihan |
| Budgets / Budget Alerts / Budget Report | Anggaran / Notifikasi Anggaran / Laporan Anggaran |
| Installments / Subscriptions | Cicilan / Langganan |
| Recurring | **Berulang** (never "Otomasi") |
| Goals | Target Tabungan |
| Debt / Payable / Receivable | Utang / Utang / Piutang |
| Tracker | Pemantau Utang |
| Reports / Insights | Laporan / Wawasan |
| Activity Log / Alerts / System Logs | Riwayat Aktivitas / Pemberitahuan / Log Sistem |
| Export Center | Pusat Ekspor |
| Settings / Security / Sessions | Pengaturan / Keamanan / Sesi |
| All Access / More / Logout | Akses Lengkap / Lainnya / Keluar |
| Wallet sharing (read-only viewers) | Berbagi Dompet (viewers = "pemantau") |
| Sharing roles owner/member/viewer | Pemilik / Anggota (bisa mencatat) / Hanya lihat |
| Amount / Date / Note / Name / Type | Jumlah / Tanggal / Catatan / Nama / Tipe |
| Save / Cancel / Back / Close / View | Simpan / Batal / Kembali / Tutup / Lihat |
| Income / Expense / Cashflow / Net Flow | Pemasukan / Pengeluaran / Arus Kas / Arus Bersih |
| Safe / Warning / Exceeded | Aman / Peringatan / Terlampaui |
| Loading... / Search... | Memuat... / Cari... |

Keep as-is (technical/identical terms): **Transfer, Status, Edit, Endpoint, Email**, CSV, FAQ, Rp.

Money labels are user-facing rupiah: **"Jumlah (Rp)"** — never expose "(Minor)"/minor-unit storage wording.

Use final product copy.

Do not use:
- English UI strings (all visible copy is Indonesian)
- Stage label copy
- dev notes (backend/minor unit/module/endpoint/pattern narration)
- prototype wording
- mock data wording
- coming soon
- roadmap
- placeholder action copy

Input placeholders are allowed.

## Responsive/mobile rules (from the 2026-07 responsive audit)

- **The mobile sidebar drawer must stay reachable.** The `.mobile-sidebar-button`
  hamburger is visible ≤960px and the opened drawer/overlay sit ABOVE the sticky
  topbar (`.app-layout.sidebar-open .sidebar` z-index:80 / overlay 75 in the ≤720
  block, over the topbar's 70). Never re-add a `display:none` on
  `.mobile-sidebar-button` — every sidebar-only section (Anggaran, Cicilan,
  Langganan, Berulang, Target, Wawasan, Kalender, Laporan) is otherwise
  unreachable except via `/app-menu`.
- **Shared stacking on phones (≤600px):** `.panel-head` and
  `.finance-overview-meta` stack (title/label over full-width value/actions),
  mirroring `.readiness-list`. `.finance-overview-card` is a **flex column** (not
  a fixed 6-row grid) so absent rows reserve no space.
- **Grid modifiers:** use `.stat-grid.three` / `.stat-grid.two` for 3-/2-up stat
  rows (never a 4-col grid with empty columns) and `.dashboard-grid.two-col` for
  a 2-up dashboard grid (both collapse to 1-col ≤1100px). The ≤820 stat-grid
  carousel is scoped `:not(.three)` so 3-up money summaries collapse to 1-col.
- **Overflow discipline:** unbreakable tokens (emails, IPs, endpoint paths,
  wallet names) use `overflow-wrap: anywhere` or ellipsis + `min-width:0` on their
  flex/grid parent so they never drive body-level horizontal scroll. `.member-row`
  truncates its text block (not the trailing Badge).
- **Touch + zoom:** `.react-select__control` matches the 46px `.form-control`
  height (48px on ≤720) and its input is 16px on mobile (no iOS auto-zoom). Use
  `100dvh` (with a `100vh` fallback) for full-height auth/onboarding/body.
- **`.warning-note.success`** is the green variant of the amber form banner.
