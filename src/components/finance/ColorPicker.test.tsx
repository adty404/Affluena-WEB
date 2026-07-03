// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ColorPicker, ITEM_COLOR_PALETTE, itemAccentVars, normalizeItemColor } from './ColorPicker';

let root: Root | null = null;
let host: HTMLDivElement | null = null;

afterEach(() => {
  if (root) {
    act(() => {
      root?.unmount();
    });
  }
  root = null;
  host?.remove();
  host = null;
});

function renderPicker(value: string | undefined, onChange: (hex: string) => void) {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);

  act(() => {
    root?.render(<ColorPicker value={value} onChange={onChange} />);
  });

  return host;
}

// The item-appearance catalog is intentionally identical to the mobile app's
// 24-swatch palette (same order, uppercase hex). Keep this list in lockstep
// with `lib/features/shared/presentation/appearance/` on mobile.
const EXPECTED_PALETTE = [
  '#3E72B8', '#2BB3A3', '#2E8B57', '#E0A23B', '#C2553F', '#7C5BC2',
  '#4256B8', '#C2588A', '#5E6E80', '#9E7B4F', '#2E86C1', '#17A2B8',
  '#16A085', '#5CB85C', '#8BC34A', '#B8902E', '#D9822B', '#E67E22',
  '#C0392B', '#D6337A', '#6A4CB3', '#795548', '#607D8B', '#455A64',
];

describe('ColorPicker', () => {
  it('renders the 24-color catalog plus a "no color" option as toggle buttons', () => {
    const container = renderPicker('', () => {});
    const buttons = container.querySelectorAll('button');

    expect(ITEM_COLOR_PALETTE.map((swatch) => swatch.value)).toEqual(EXPECTED_PALETTE);
    expect(ITEM_COLOR_PALETTE).toHaveLength(24);
    expect(buttons).toHaveLength(ITEM_COLOR_PALETTE.length + 1);
    // Every swatch is a real button with aria-pressed (keyboard accessible).
    buttons.forEach((btn) => {
      expect(btn.getAttribute('type')).toBe('button');
      expect(btn.hasAttribute('aria-pressed')).toBe(true);
    });
    // With no value, the "no color" option is the pressed one.
    const pressed = container.querySelectorAll('button[aria-pressed="true"]');
    expect(pressed).toHaveLength(1);
    expect(pressed[0].getAttribute('aria-label')).toBe('Tanpa warna');
  });

  it('marks the selected swatch and fires onChange with the picked hex', () => {
    const onChange = vi.fn();
    const container = renderPicker('#2E8B57', onChange);

    const pressed = container.querySelector('button[aria-pressed="true"]');
    expect(pressed?.getAttribute('aria-label')).toBe('Warna Hijau');

    const denim = container.querySelector('button[aria-label="Warna Denim"]') as HTMLButtonElement;
    act(() => {
      denim.click();
    });
    expect(onChange).toHaveBeenCalledWith('#3E72B8');

    const none = container.querySelector('button[aria-label="Tanpa warna"]') as HTMLButtonElement;
    act(() => {
      none.click();
    });
    expect(onChange).toHaveBeenCalledWith('');
  });
});

describe('normalizeItemColor', () => {
  it('passes valid hex through uppercased and maps legacy wallet color names', () => {
    expect(normalizeItemColor('#3e72b8')).toBe('#3E72B8');
    expect(normalizeItemColor('green')).toBe('#2E8B57');
    expect(normalizeItemColor('purple')).toBe('#7C5BC2');
  });

  it('returns empty string for missing or unparseable values', () => {
    expect(normalizeItemColor('')).toBe('');
    expect(normalizeItemColor(undefined)).toBe('');
    expect(normalizeItemColor('not-a-color')).toBe('');
    expect(normalizeItemColor('#12345')).toBe('');
  });
});

describe('itemAccentVars', () => {
  it('exposes the accent as a CSS custom property only for valid colors', () => {
    expect(itemAccentVars('#C2553F')).toEqual({ '--item-accent': '#C2553F' });
    expect(itemAccentVars('')).toBeUndefined();
    expect(itemAccentVars(undefined)).toBeUndefined();
  });
});
