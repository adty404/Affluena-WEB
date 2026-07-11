// @vitest-environment jsdom

import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Amount } from './Amount';
import {
  AmountVisibilityProvider,
  AMOUNT_VISIBILITY_STORAGE_KEY,
} from '../../contexts/AmountVisibilityProvider';

let root: Root | null = null;
let host: HTMLDivElement | null = null;

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  if (root) {
    act(() => {
      root?.unmount();
    });
  }
  root = null;
  host?.remove();
  host = null;
  window.localStorage.clear();
});

function render(ui: ReactNode) {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  act(() => {
    root?.render(ui);
  });
  return host!;
}

describe('Amount masking (Penyamaran nominal)', () => {
  it('renders the formatted rupiah value when amounts are visible', () => {
    const container = render(
      <AmountVisibilityProvider>
        <Amount value={1500000} maskable />
      </AmountVisibilityProvider>
    );
    expect(container.textContent).toContain('1.500.000');
  });

  it('shows Rp bullets with no digits when the persisted setting is masked', () => {
    window.localStorage.setItem(AMOUNT_VISIBILITY_STORAGE_KEY, '0');
    const container = render(
      <AmountVisibilityProvider>
        <Amount value={1500000} maskable />
      </AmountVisibilityProvider>
    );
    expect(container.textContent).toBe('Rp ••••••');
    expect(container.textContent).not.toMatch(/\d/);
  });

  it('never masks a non-maskable Amount (the working ledger stays visible)', () => {
    window.localStorage.setItem(AMOUNT_VISIBILITY_STORAGE_KEY, '0');
    const container = render(
      <AmountVisibilityProvider>
        <Amount value={1500000} />
      </AmountVisibilityProvider>
    );
    expect(container.textContent).toContain('1.500.000');
  });

  it('stays visible outside the provider (isolated usage never throws)', () => {
    window.localStorage.setItem(AMOUNT_VISIBILITY_STORAGE_KEY, '0');
    const container = render(<Amount value={2500} maskable />);
    expect(container.textContent).toContain('2.500');
  });
});
