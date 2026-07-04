// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { Select } from './Select';

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

function render(node: React.ReactNode) {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  act(() => {
    root?.render(node);
  });
  return host;
}

// Bug #4: edit forms drive Selects controlled via RHF's Controller. A controlled
// Select must display the label matching its `value` prop immediately (this is
// what was broken: uncontrolled Selects never re-synced after reset()).
describe('Select (controlled)', () => {
  it('renders the label for the current value prop', () => {
    const el = render(
      <Select value="w2" onChange={() => {}}>
        <option value="w1">Dompet Tunai</option>
        <option value="w2">Rekening Bank</option>
      </Select>,
    );
    // react-select paints the selected label into the single-value node.
    const single = el.querySelector('.react-select__single-value');
    expect(single?.textContent).toBe('Rekening Bank');
  });

  it('reflects a changed value prop (as reset() would do on edit load)', () => {
    const el = render(
      <Select value="w1" onChange={() => {}}>
        <option value="w1">Dompet Tunai</option>
        <option value="w2">Rekening Bank</option>
      </Select>,
    );
    expect(el.querySelector('.react-select__single-value')?.textContent).toBe('Dompet Tunai');

    // Re-render with a new controlled value — the display must follow it.
    act(() => {
      root?.render(
        <Select value="w2" onChange={() => {}}>
          <option value="w1">Dompet Tunai</option>
          <option value="w2">Rekening Bank</option>
        </Select>,
      );
    });
    expect(el.querySelector('.react-select__single-value')?.textContent).toBe('Rekening Bank');
  });

  it('shows all selected labels for a controlled multi value', () => {
    const el = render(
      <Select multi value={['t1', 't3']} onChange={() => {}}>
        <option value="t1">Makan</option>
        <option value="t2">Transportasi</option>
        <option value="t3">Hiburan</option>
      </Select>,
    );
    const chips = Array.from(el.querySelectorAll('.react-select__multi-value')).map((c) => c.textContent);
    expect(chips).toContain('Makan');
    expect(chips).toContain('Hiburan');
    expect(chips).not.toContain('Transportasi');
  });
});
