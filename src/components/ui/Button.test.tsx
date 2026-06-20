// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { Button } from './Button';

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

function renderButton() {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);

  act(() => {
    root?.render(<Button to="/transactions/tx-1">Open transaction</Button>);
  });

  return host;
}

describe('Button', () => {
  it('renders route actions as anchors when no router context is available', () => {
    const container = renderButton();
    const link = container.querySelector('a');

    expect(link?.getAttribute('href')).toBe('/transactions/tx-1');
    expect(link?.textContent).toBe('Open transaction');
  });
});
