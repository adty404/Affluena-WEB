// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { DataTable, type Column } from './DataTable';

type Row = {
  id: string;
  name: string;
  amount: number;
};

const columns: Column<Row>[] = [
  { key: 'name', header: 'Name', render: (row) => row.name },
  { key: 'amount', header: 'Amount', align: 'right', render: (row) => row.amount.toLocaleString('id-ID') },
];

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

function renderDataTable(data: Row[]) {
  if (!host) {
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  }

  act(() => {
    root?.render(
      <DataTable<Row>
        columns={columns}
        data={data}
        getRowKey={(row) => row.id}
      />,
    );
  });

  return host;
}

describe('DataTable', () => {
  it('renders a static empty table instead of initialising DataTables when there are no rows', () => {
    const container = renderDataTable([]);

    expect(container.querySelector('table.dataTable')).toBeNull();
    expect(container.querySelector('.dt-empty-state')?.textContent).toContain('No data available');
    expect(container.querySelector('tbody td')?.getAttribute('colspan')).toBe(String(columns.length));
  });

  it('does not throw when display-only columns do not exist on the raw row object', () => {
    const displayOnlyColumns: Column<Row>[] = [
      ...columns,
      { key: 'action', header: 'Action', render: () => <button type="button">Open</button> },
    ];

    expect(() => {
      if (!host) {
        host = document.createElement('div');
        document.body.appendChild(host);
        root = createRoot(host);
      }

      act(() => {
        root?.render(
          <DataTable<Row>
            columns={displayOnlyColumns}
            data={[{ id: 'row-1', name: 'Wallet', amount: 100_000 }]}
            getRowKey={(row) => row.id}
          />,
        );
      });
    }).not.toThrow();
  });
});
