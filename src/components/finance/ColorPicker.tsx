import type { CSSProperties } from 'react';
import clsx from 'clsx';
import { AppIcon } from '../ui/AppIcon';

/**
 * Shared item-appearance catalog: the curated color palette a user can pick
 * when creating/editing a wallet, budget, goal, installment, subscription, or
 * recurring rule. The chosen value is persisted on the API as a plain
 * `#RRGGBB` hex string; missing/empty means "no color" so every surface must
 * fall back to its default styling. This palette is intentionally identical to
 * the mobile catalog (`lib/features/shared/presentation/appearance/`) so both
 * clients render the same item identically.
 */
export const ITEM_COLOR_PALETTE: { value: string; label: string }[] = [
  { value: '#3E72B8', label: 'Denim' },
  { value: '#2BB3A3', label: 'Teal' },
  { value: '#2E8B57', label: 'Hijau' },
  { value: '#E0A23B', label: 'Amber' },
  { value: '#C2553F', label: 'Coral' },
  { value: '#7C5BC2', label: 'Ungu' },
  { value: '#4256B8', label: 'Indigo' },
  { value: '#C2588A', label: 'Pink' },
  { value: '#5E6E80', label: 'Slate' },
  { value: '#9E7B4F', label: 'Bronze' },
  { value: '#2E86C1', label: 'Biru Langit' },
  { value: '#17A2B8', label: 'Sian' },
  { value: '#16A085', label: 'Hijau Laut' },
  { value: '#5CB85C', label: 'Hijau Daun' },
  { value: '#8BC34A', label: 'Hijau Limau' },
  { value: '#B8902E', label: 'Emas' },
  { value: '#D9822B', label: 'Oranye Tua' },
  { value: '#E67E22', label: 'Oranye' },
  { value: '#C0392B', label: 'Merah' },
  { value: '#D6337A', label: 'Magenta' },
  { value: '#6A4CB3', label: 'Violet' },
  { value: '#795548', label: 'Cokelat' },
  { value: '#607D8B', label: 'Abu Biru' },
  { value: '#455A64', label: 'Arang' },
];

/** Legacy wallet color names (pre-hex palette) mapped to their nearest catalog hex. */
const LEGACY_COLOR_MAP: Record<string, string> = {
  green: '#2E8B57',
  blue: '#3E72B8',
  orange: '#E0A23B',
  purple: '#7C5BC2',
  gray: '#5E6E80',
};

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

/**
 * Normalizes a stored item color to a `#RRGGBB` hex string: valid hex is
 * passed through (uppercased), legacy named wallet colors are mapped to their
 * catalog equivalent, and anything else returns '' (no color).
 */
export function normalizeItemColor(color?: string | null): string {
  const value = (color ?? '').trim();
  if (!value) return '';
  if (HEX_COLOR.test(value)) return value.toUpperCase();
  return LEGACY_COLOR_MAP[value.toLowerCase()] ?? '';
}

/**
 * Inline CSS custom property carrying an item's accent color. Pair with the
 * `has-accent` class (`.mini-icon`, `.finance-icon`, `.wallet-icon`,
 * `.finance-overview-card`, `.wallet-card`, `.budget-card`) so the tint and
 * icon color are derived from one variable. Returns undefined when the item
 * has no (valid) color so callers keep their default styling.
 */
export function itemAccentVars(color?: string | null): CSSProperties | undefined {
  const hex = normalizeItemColor(color);
  if (!hex) return undefined;
  return { '--item-accent': hex } as CSSProperties;
}

type ColorPickerProps = {
  /** Current value: '' / undefined = no color, otherwise a palette hex. */
  value?: string;
  /** Receives the picked hex, or '' when "no color" is chosen. */
  onChange: (hex: string) => void;
  disabled?: boolean;
};

/**
 * Swatch picker over {@link ITEM_COLOR_PALETTE} plus a leading "no color"
 * option. Plain buttons with `aria-pressed`, so it is keyboard accessible out
 * of the box. Render inside a form `<label>` with a "Warna" caption.
 */
export function ColorPicker({ value, onChange, disabled }: ColorPickerProps) {
  const selected = normalizeItemColor(value);
  return (
    <div className="color-swatch-row" role="group" aria-label="Warna">
      <button
        type="button"
        className={clsx('color-swatch', 'none')}
        aria-pressed={selected === ''}
        aria-label="Tanpa warna"
        title="Tanpa warna"
        disabled={disabled}
        onClick={() => onChange('')}
      >
        {selected === '' ? <AppIcon name="success" decorative /> : <AppIcon name="close" decorative />}
      </button>
      {ITEM_COLOR_PALETTE.map((swatch) => {
        const isSelected = selected === swatch.value;
        return (
          <button
            key={swatch.value}
            type="button"
            className="color-swatch"
            style={{ '--swatch-color': swatch.value } as CSSProperties}
            aria-pressed={isSelected}
            aria-label={`Warna ${swatch.label}`}
            title={swatch.label}
            disabled={disabled}
            onClick={() => onChange(swatch.value)}
          >
            {isSelected ? <AppIcon name="success" decorative /> : null}
          </button>
        );
      })}
    </div>
  );
}
