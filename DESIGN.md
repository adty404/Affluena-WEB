# Affluena Design System

## 1. Atmosphere & Identity

Affluena feels like a calm financial command center: data-dense enough for repeated daily use, but soft enough that money decisions do not feel punishing. The signature is the **Tinta** monochrome ink language shared with the mobile app: white and warm-grey surfaces over a paper-toned base, a near-black ink accent for every action, and compact dashboard cards that prioritize scan speed on mobile. Colour is deliberate and rare — when something is green or coral it *means* something.

## 2. Color

### Tinta palette

Mirrors the mobile app's `lib/app/theme/sky_palette.dart` (light set). The web app is **light mode only** — no dark palette is defined here.

| Role | Token | Light | Usage |
|------|-------|-------|-------|
| Surface/base | `--bg` | `#f7f7f5` | App background (mobile `ground`) |
| Surface/default | `--surface` | `#ffffff` | Cards, buttons, panels |
| Surface/soft | `--surface-soft` | `#f1f1ef` | List rows, nested panels (mobile `sheet`) |
| Border/default | `--line` | `#e5e5e3` | Card borders, dividers |
| Border/strong | `--line-strong` | `#d6d6d4` | Scrollbar thumbs, tree connectors, sheet handles |
| Text/primary | `--ink` | `#17181a` | Headings, body, money values |
| Text/ink step | `--ink-2` | `#2a2b2e` | Dark-card gradient stop, form labels |
| Text/secondary | `--muted` | `#6e7073` | Descriptions and metadata |
| Text/tertiary | `--muted-2` | `#a4a5a8` | Captions and quiet labels (mobile `faint`) |
| Accent (= ink) | `--primary` | `#17181a` | Primary CTAs, active nav, focus rings |
| Accent strong | `--primary-dark` | `#000000` | Primary hover/gradient stop, links |
| Accent soft | `--primary-soft` | `#ececea` | Active-nav pills, neutral icon chips |
| Accent soft border | `--primary-soft-border` | `#dcdcda` | Pill borders, active nav-icon chip |
| Status/success | `--success` | `#2e8b57` | Income, positive finance state |
| Status/success soft | `--success-soft` | `#e7f3ec` | Income-tinted chips (alias `--surface-green`) |
| Status/warning | `--warning` | `#b87b2e` | Warning status |
| Status/warning soft | `--warning-soft` | `#f9f0e1` | Warning-tinted surfaces |
| Status/danger | `--danger` | `#c2553f` | Expense, destructive state |
| Status/danger soft | `--danger-soft` | `#f9ece8` | Error-tinted surfaces |

### Section identity hues

Decorative accents for money domains only (mirror mobile `lib/app/theme/section_palette.dart`): soft tint backgrounds + saturated icons; text on tinted surfaces stays ink. The retired blue/purple brand tokens now alias into this layer: `--secondary`/`--secondary-soft` → dompet denim (blue "info"/transfer coding), `--purple`/`--purple-soft` → langganan violet.

| Domain | Token | Strong | Soft |
|--------|-------|--------|------|
| Dompet | `--hue-dompet` | `#3e72b8` | `#e9f0f9` |
| Anggaran | `--hue-anggaran` | `#b87b2e` | `#f9f0e1` |
| Tabungan | `--hue-tabungan` | `#2e8b57` | `#e7f3ec` |
| Cicilan | `--hue-cicilan` | `#5b62c9` | `#ecedf9` |
| Langganan | `--hue-langganan` | `#8352c9` | `#f1ebf9` |
| Berulang | `--hue-berulang` | `#178a80` | `#e4f2f1` |
| Dibagikan | `--hue-dibagikan` | `#b14e86` | `#f9eaf2` |

### Item appearance palette

User-picked accent colors for finance items (wallets, budgets, goals, installments, subscriptions, recurring rules) come from a fixed 10-swatch catalog shared with the mobile app — `#3E72B8` denim, `#2BB3A3` teal, `#2E8B57` green, `#E0A23B` amber, `#C2553F` coral, `#7C5BC2` purple, `#4256B8` indigo, `#C2588A` pink, `#5E6E80` slate, `#9E7B4F` bronze — plus a "no color" default. The catalog lives in `src/components/finance/ColorPicker.tsx`; the API stores the value as a raw `#RRGGBB` string. Do not extend this palette on one client only.

### Rules

- The chrome is monochrome: `--primary` (ink) is reserved for primary actions, active navigation, links, and focus rings; anything rendered on an ink fill is white.
- Colour carries **meaning only**: `--success` (income/positive), `--danger` (expense/destructive), `--warning`, user-chosen content colours (the item-appearance palette), and the section identity hues — applied as soft tints + saturated icons; text on tinted surfaces stays ink. Everything else is monochrome.
- Item-appearance accents render via the `--item-accent` CSS variable + `has-accent` classes (soft `color-mix` tint for icon chips and card backgrounds); items without a color keep their default styling, and warning/exceeded status colors always win over decoration. On the monochrome chrome these user colours are the loudest thing on screen — by design.
- Shadows are always neutral (`rgba(0,0,0,…)`); never colour a shadow.
- New colors should be added as tokens first; raw color use is tolerated only when consolidating legacy CSS.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Display | `44-72px` clamp | 850-950 | `0.94-1.05` | tight | Landing hero |
| Page hero | `28-44px` clamp | 850-950 | `1.05` | tight | App hero cards |
| Mobile page hero | `20-23px` clamp | 850-950 | `1.08` | tight | Compact mobile dashboard hero |
| Card metric | `20-27px` | 900-950 | `1.05` | tight | Stat values |
| Section title | `19-24px` | 850-900 | `1.1` | tight | Panel headings |
| Body | `14-16px` | 400-750 | `1.5-1.7` | `0` | Main copy |
| Small body | `12-13px` | 750-850 | `1.35-1.5` | `0` | Metadata |
| Caption | `11px` | 850-900 | `1.2-1.35` | optional | Mobile labels |

### Font Stack

- Primary: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Mono: system monospace only when explicitly needed for tabular financial data.

### Rules

- Dashboard text is compact but body text should not drop below `12px`.
- Amounts and dashboard metrics should use tight line-height and tabular-feeling alignment where practical.
- Mobile headings must prefer shorter height over marketing-scale display type.

## 4. Spacing & Layout

### Base Unit

All spacing is based on `4px`.

| Token | Value | Usage |
|-------|-------|-------|
| `--mobile-page-gap` | `8px` | Mobile vertical stack rhythm |
| `--mobile-card-padding` | `12px` | Compact mobile card and panel padding |
| `--mobile-dense-padding` | `8px` | Extra-compact dashboard stat/list padding |
| `--mobile-card-radius` | `16px` | Compact mobile card radius |
| `--mobile-row-padding` | `8px` | Dense mobile list row padding |
| `--mobile-icon-size` | `36px` | Mobile row and widget icons |
| `--container` | `1180px` | Public page container |
| `--sidebar` | `280px` | Desktop/sidebar width |
| `--topbar` | `72px` | Desktop topbar height |

### Grid

- App shell switches from sidebar grid to single-column mobile at `960px`.
- Primary compact density breakpoint is `820px`; shell chrome has an additional compact breakpoint at `720px`.
- Dashboard stats use horizontal snap cards on mobile to keep the first viewport shorter.

### Rules

- Mobile dashboard surfaces should optimize scan density: less vertical padding, smaller radii, shorter chart heights.
- Keep bottom navigation safe-area padding intact.
- Avoid nested-card visual weight; list rows should read lighter than parent panels.

## 5. Components

### App Shell

- **Structure**: `AppLayout` renders sidebar, sticky topbar, content region, and bottom nav.
- **Spacing**: desktop content uses `28px`; mobile content uses compact page padding with safe-area bottom clearance.
- **States**: sidebar overlay on tablet/mobile, active bottom navigation state, profile popover.
- **Accessibility**: topbar and navigation actions use real buttons/links.

### Card and Panel

- **Structure**: reusable `Card` applies `.card`; page panels add `.panel-card`.
- **Variants**: stat card, dashboard panel, wallet card, budget card, finance overview card.
- **Spacing**: desktop panels use `16-22px`; mobile panels use `--mobile-card-padding`.
- **States**: hover belongs on interactive child actions, not every static card.
- **Depth**: border plus soft shadow; on mobile shadows are reduced so cards feel lighter.

### Dashboard Hero and Stat Carousel

- **Structure**: `.app-hero-card` becomes a compact mobile action strip; `.stat-grid` becomes a horizontal snap scroller.
- **Spacing**: `--mobile-page-gap` between cards; stat cards use dense padding and compact radius.
- **Behavior**: cards must be narrow enough to show a hint of the next card on 390px screens.
- **Mobile copy**: topbar already carries page context, so hero body copy may be visually hidden on mobile to reduce first-viewport height.

### Dashboard Panel Lists

- **Structure**: parent `.panel-card` contains `.transaction-row`, `.expense-list`, `.portfolio-list`, or chart content.
- **Spacing**: rows use compact padding and icon size on mobile.
- **Behavior**: long finance labels wrap inside the available column without causing horizontal overflow.

### Color Picker (item appearance)

- **Structure**: `ColorPicker` (`src/components/finance/ColorPicker.tsx`) renders a `.color-swatch-row` of round `.color-swatch` buttons — a dashed "no color" option followed by the 10 catalog swatches.
- **States**: the active swatch carries `aria-pressed="true"` and an ink ring; disabled swatches dim.
- **Accessibility**: plain `<button>` elements with `aria-pressed` and per-swatch `aria-label` ("Tanpa warna", "Warna Denim", …), focus-visible outline.
- **Usage**: place inside a form `<label>` captioned "Warna"; value is `''` (default) or a catalog hex.

### Mobile Tables and Filters

- **Structure**: `DataTable` renders desktop tables and mobile cards from the same columns.
- **Hierarchy**: mobile cards promote one title, one status-like badge, and at most three metadata fields into compact list items.
- **Actions**: first mobile action is the primary row action; secondary row actions live behind a three-dot overflow menu.
- **Filters**: summary filter cards become horizontal chips on mobile; dedicated filter pages use sticky bottom actions.
- **Spacing**: mobile filter controls use `--mobile-touch-target`, `--mobile-page-gap`, and safe-area-aware bottom spacing.
- **Behavior**: table controls must not create horizontal overflow; search controls stay sticky and primary filter apply actions stay reachable above bottom navigation.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | `160-220ms` | `ease` | Buttons, nav, compact hover, sidebar/drawer transitions |
| Entrance | `160-200ms` | `ease` | Modal/sheet (`modalSheetIn`), page `fadeIn` |
| Loop | `1.4s` | `linear` | Skeleton `shimmer` loading state |

### Rules

- Animate only `transform`, `opacity`, or color/shadow changes.
- Do not animate dimensions on dashboard cards.
- Respect compact mobile density: interaction feedback should be visible but not bouncy.

## 7. Depth & Surface

### Strategy

Affluena uses a mixed strategy: borders define structure, subtle neutral shadows separate elevated controls, and tonal row backgrounds reduce nested-card heaviness.

| Level | Token/Value | Usage |
|-------|-------------|-------|
| Soft shadow | `--shadow-soft` | Desktop cards and panels |
| Default shadow | `--shadow` | Sidebar, modal, hero surfaces |
| Mobile card shadow | `--mobile-card-shadow` | Compact mobile panels/cards |
| Border | `1px solid var(--line)` | Panels, rows, table wrappers |
| Tonal row | `var(--surface-soft)` | Nested list rows |

### Rules

- Mobile cards use smaller radius and lighter shadow than desktop.
- Nested rows should rely more on tonal shift than heavy elevation.
- Hero cards may carry stronger depth, but not at the expense of first-viewport scan density.
