# Affluena AI Design System

This document defines the UI rules that AI agents must follow when editing or adding pages.

## Visual Identity

Affluena is a professional personal finance web app.

The UI should feel clean, bright, calm, reliable, modern, premium but not flashy, and data-focused but readable.

## Core Style

Use:
- white/light background
- green primary accent
- blue secondary/info accent
- orange warning
- red danger
- purple accent only when appropriate
- rounded cards
- soft shadows
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
- primary
- primary soft
- secondary
- warning
- danger
- purple
- ink/text
- muted text
- border
- radius
- shadow
- sidebar width
- topbar height

If a new token is needed, add it to `tokens.css`.

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
- primary submit button is green
- cancel/back action is present
- validation message area is visible when needed
- 2-column desktop allowed
- 1-column mobile required

Do not make forms too dense.

## Buttons

Button variants:
- primary: green
- secondary/default: white with border
- danger: red
- ghost/subtle: minimal

Every button must have real behavior.

## Tables

Tables must:
- use the existing table/data table style
- have clear headers
- be inside overflow wrapper
- not cause body horizontal scroll
- be readable on mobile

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

Use final product copy.

Do not use:
- Stage label copy
- dev notes
- prototype wording
- mock data wording
- coming soon
- roadmap
- placeholder action copy

Input placeholders are allowed.
