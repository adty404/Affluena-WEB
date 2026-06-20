// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Config } from 'datatables.net';

const captured: Array<{ id?: string; options?: Config }> = [];

vi.mock('datatables.net-dt', () => ({ default: {} }));
vi.mock('datatables.net-react', () => {
  const MockDataTable = Object.assign(
    ({ id, options }: { id?: string; options?: Config }) => {
      captured.push({ id, options });
      return <table id={id} />;
    },
    { use: vi.fn() },
  );

  return {
    default: MockDataTable,
  };
});

const { DataTable } = await import('./DataTable');

type Row = {
  id: string;
  name: string;
};

let root: Root | null = null;
let host: HTMLDivElement | null = null;

beforeEach(() => {
  captured.length = 0;
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
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
});

describe('DataTable configuration', () => {
  it('passes destroy mode and a stable table id to the DataTables adapter', () => {
    act(() => {
      root?.render(
        <DataTable<Row>
          columns={[{ key: 'name', header: 'Name', render: (row) => row.name }]}
          data={[{ id: 'row-1', name: 'Revenue' }]}
          getRowKey={(row) => row.id}
        />,
      );
    });

    expect(captured.at(-1)?.options).toMatchObject({ destroy: true });
    expect(captured.at(-1)?.id).toMatch(/^affluena-datatable-/);
  });
});
