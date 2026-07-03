import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import type { Category } from '../../types/category';
import { CategoryTree } from './CategoryTree';

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

function category(id: string, name: string, parent_id?: string): Category {
  return {
    id,
    user_id: 'user-1',
    parent_id,
    name,
    type: 'expense',
    created_at: '2026-06-21T00:00:00.000Z',
    updated_at: '2026-06-21T00:00:00.000Z',
  };
}

function renderTree(categories: readonly Category[]) {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);

  act(() => {
    root?.render(<CategoryTree categories={categories} onDelete={() => {}} />);
  });

  return host;
}

describe('CategoryTree', () => {
  it('renders nested parent child and grandchild levels from parent ids', () => {
    const container = renderTree([
      category('food', 'Food'),
      category('restaurant', 'Restaurant', 'food'),
      category('sushi', 'Sushi', 'restaurant'),
    ]);

    const levels = Array.from(container.querySelectorAll<HTMLElement>('[data-tree-depth]')).map((node) => ({
      depth: node.dataset.treeDepth,
      text: node.textContent ?? '',
    }));

    expect(levels).toHaveLength(3);
    expect(levels[0]).toMatchObject({ depth: '0' });
    expect(levels[0]?.text).toContain('Food');
    expect(levels[0]?.text).toContain('Kategori utama');
    expect(levels[1]).toMatchObject({ depth: '1' });
    expect(levels[1]?.text).toContain('Restaurant');
    expect(levels[1]?.text).toContain('Subkategori');
    expect(levels[2]).toMatchObject({ depth: '2' });
    expect(levels[2]?.text).toContain('Sushi');
    expect(levels[2]?.text).toContain('Sub-subkategori');
  });
});
