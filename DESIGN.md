# Affluena Design System

## 1. Atmosphere & Identity

Affluena feels like a calm financial command center: data-dense enough for repeated daily use, but soft enough that money decisions do not feel punishing. The signature is crisp financial depth: white and misted surfaces over a pale blue-gray base, with emerald action cues and compact dashboard cards that prioritize scan speed on mobile.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/base | `--bg` | `#f6f8fb` | Not defined | App background |
| Surface/default | `--surface` | `#ffffff` | Not defined | Cards, buttons, panels |
| Surface/soft | `--surface-soft` | `#f9fbfd` | Not defined | List rows, nested panels |
| Surface/success | `--surface-green` | `#ecfdf5` | Not defined | Active nav, success-tinted surfaces |
| Accent/primary | `--primary` | `#10b981` | Not defined | Primary CTAs, success data |
| Accent/primary strong | `--primary-dark` | `#059669` | Not defined | Primary hover, active text |
| Accent/primary soft | `--primary-soft` | `#d1fae5` | Not defined | Icon backgrounds |
| Accent/secondary | `--secondary` | `#2563eb` | Not defined | Info data, chart contrast |
| Accent/secondary soft | `--secondary-soft` | `#dbeafe` | Not defined | Info-tinted surfaces |
| Status/warning | `--warning` | `#f59e0b` | Not defined | Warning status |
| Status/warning soft | `--warning-soft` | `#fef3c7` | Not defined | Warning-tinted surfaces |
| Status/danger | `--danger` | `#ef4444` | Not defined | Expense, destructive state |
| Status/danger soft | `--danger-soft` | `#fee2e2` | Not defined | Error-tinted surfaces |
| Accent/purple | `--purple` | `#8b5cf6` | Not defined | Secondary categorization |
| Accent/purple soft | `--purple-soft` | `#ede9fe` | Not defined | Purple-tinted surfaces |
| Text/primary | `--ink` | `#0f172a` | Not defined | Headings and main body |
| Text/secondary | `--muted` | `#64748b` | Not defined | Descriptions and metadata |
| Text/tertiary | `--muted-2` | `#94a3b8` | Not defined | Captions and quiet labels |
| Border/default | `--line` | `#e2e8f0` | Not defined | Card borders, dividers |

### Rules

- Emerald is reserved for primary actions, positive finance state, and active navigation.
- Blue, purple, orange, and red appear only as semantic finance/status tones.
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

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | `150-200ms` | `ease` / `ease-out` | Buttons, nav, compact hover |
| Standard | `200-300ms` | `ease-in-out` | Sidebar, drawer, modal |
| Emphasis | `400-600ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Large page transitions only |

### Rules

- Animate only `transform`, `opacity`, or color/shadow changes.
- Do not animate dimensions on dashboard cards.
- Respect compact mobile density: interaction feedback should be visible but not bouncy.

## 7. Depth & Surface

### Strategy

Affluena uses a mixed strategy: borders define structure, subtle tinted shadows separate elevated controls, and tonal row backgrounds reduce nested-card heaviness.

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
