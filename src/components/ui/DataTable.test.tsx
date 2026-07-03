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

type DetailedRow = Row & {
  status: string;
  date: string;
  category: string;
  wallet: string;
  owner: string;
  note: string;
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

type RenderTableOptions<T> = {
  readonly columns: Column<T>[];
  readonly data: T[];
  readonly getRowKey: (row: T) => string;
  readonly pageSize?: number;
};

function renderTable<T>({ columns: tableColumns, data, getRowKey, pageSize }: RenderTableOptions<T>) {
  if (!host) {
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  }

  act(() => {
    root?.render(
      <DataTable<T>
        columns={tableColumns}
        data={data}
        getRowKey={getRowKey}
        pageSize={pageSize}
      />,
    );
  });

  return host;
}

async function flushDataTableDraw() {
  await act(async () => {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 0);
    });
  });
}

function renderDataTable(data: Row[]) {
  return renderTable<Row>({ columns, data, getRowKey: (row) => row.id });
}

describe('DataTable', () => {
  it('renders a static empty table instead of initialising DataTables when there are no rows', () => {
    const container = renderDataTable([]);

    expect(container.querySelector('table.dataTable')).toBeNull();
    expect(container.querySelector('.dt-empty-state')?.textContent).toContain('Tidak ada data');
    expect(container.querySelector('.dt-mobile-empty-card')?.textContent).toContain('Tidak ada data');
    expect(container.querySelector('tbody td')?.getAttribute('colspan')).toBe(String(columns.length));
  });

  it('renders a mobile card list with the first column as the card title', () => {
    const container = renderDataTable([{ id: 'row-1', name: 'Wallet', amount: 100_000 }]);

    expect(container.querySelector('.dt-mobile-card-title')?.textContent).toContain('Wallet');
    expect(container.querySelector('.dt-mobile-field dt')?.textContent).toBe('Amount');
    expect(container.querySelector('.dt-mobile-value.dt-right')?.textContent).toBe('100.000');
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

  it('promotes status and action columns into mobile card regions', () => {
    const mobileColumns: Column<Row>[] = [
      { key: 'name', header: 'Name', render: (row) => row.name },
      { key: 'status', header: 'Status', render: () => <span className="badge">Active</span> },
      { key: 'amount', header: 'Amount', render: (row) => row.amount.toLocaleString('id-ID') },
      { key: 'action', header: 'Action', render: () => <button type="button">Open</button> },
    ];

    if (!host) {
      host = document.createElement('div');
      document.body.appendChild(host);
      root = createRoot(host);
    }

    act(() => {
      root?.render(
        <DataTable<Row>
          columns={mobileColumns}
          data={[{ id: 'row-1', name: 'Wallet', amount: 100_000 }]}
          getRowKey={(row) => row.id}
        />,
      );
    });

    expect(host.querySelector('.dt-mobile-card-status')?.textContent).toContain('Active');
    expect(host.querySelector('.dt-mobile-actions')?.textContent).toContain('Open');
    expect([...host.querySelectorAll('.dt-mobile-field dt')].map((term) => term.textContent)).toEqual(['Amount']);
  });

  it('limits mobile card metadata to three priority fields after title and status', () => {
    const detailedColumns: Column<DetailedRow>[] = [
      { key: 'name', header: 'Transaction', render: (row) => row.name },
      { key: 'status', header: 'Status', render: (row) => <span className="badge">{row.status}</span> },
      { key: 'date', header: 'Date', render: (row) => row.date },
      { key: 'category', header: 'Category', render: (row) => row.category },
      { key: 'wallet', header: 'Wallet', render: (row) => row.wallet },
      { key: 'owner', header: 'Owner', render: (row) => row.owner },
      { key: 'note', header: 'Note', render: (row) => row.note },
    ];

    const container = renderTable<DetailedRow>({
      columns: detailedColumns,
      data: [
        {
          id: 'row-1',
          name: 'June rent',
          amount: 2_500_000,
          status: 'Posted',
          date: '2026-06-12',
          category: 'Housing',
          wallet: 'Main wallet',
          owner: 'Ayu',
          note: 'Recurring transfer',
        },
      ],
      getRowKey: (row) => row.id,
    });

    expect([...container.querySelectorAll('.dt-mobile-field dt')].map((term) => term.textContent)).toEqual([
      'Date',
      'Category',
      'Wallet',
    ]);
    expect(container.querySelector('.dt-mobile-fields')?.textContent).not.toContain('Owner');
    expect(container.querySelector('.dt-mobile-fields')?.textContent).not.toContain('Recurring transfer');
  });

  it('keeps the first inline mobile action primary and moves remaining actions into the more menu', () => {
    const actionColumns: Column<Row>[] = [
      { key: 'name', header: 'Name', render: (row) => row.name },
      { key: 'amount', header: 'Amount', render: (row) => row.amount.toLocaleString('id-ID') },
      {
        key: 'action',
        header: 'Action',
        render: () => (
          <div className="inline-actions">
            <button type="button">View</button>
            <button type="button">Edit</button>
            <button type="button">Delete</button>
          </div>
        ),
      },
    ];

    const container = renderTable<Row>({
      columns: actionColumns,
      data: [{ id: 'row-1', name: 'Wallet', amount: 100_000 }],
      getRowKey: (row) => row.id,
    });

    expect(container.querySelector('.dt-mobile-primary-action')?.textContent).toContain('View');
    expect(container.querySelector('.dt-mobile-primary-action')?.textContent).not.toContain('Edit');
    expect(container.querySelector('.dt-mobile-action-menu')).toBeNull();

    const moreButton = container.querySelector<HTMLButtonElement>('.dt-mobile-more-button');
    expect(moreButton?.getAttribute('aria-label')).toBe('Aksi lain untuk Wallet');

    act(() => {
      moreButton?.click();
    });

    expect(container.querySelector('.dt-mobile-action-menu')?.textContent).toContain('Edit');
    expect(container.querySelector('.dt-mobile-action-menu')?.textContent).toContain('Delete');
  });

  it('keeps mobile cards synced with DataTables pagination and search state', async () => {
    const container = renderTable<Row>({
      columns,
      data: [
        { id: 'row-1', name: 'Wallet', amount: 100_000 },
        { id: 'row-2', name: 'Cash', amount: 200_000 },
      ],
      getRowKey: (row) => row.id,
      pageSize: 1,
    });

    await flushDataTableDraw();

    expect([...container.querySelectorAll('.dt-mobile-card-title')].map((title) => title.textContent)).toEqual(['Wallet']);

    const searchInput = container.querySelector<HTMLInputElement>('.dt-search input');
    if (!searchInput) throw new Error('Search input was not rendered');

    await act(async () => {
      searchInput.value = 'Cash';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((resolve) => {
        window.setTimeout(resolve, 0);
      });
    });

    expect([...container.querySelectorAll('.dt-mobile-card-title')].map((title) => title.textContent)).toEqual(['Cash']);
    expect(container.querySelector('.dt-mobile-filter-chip')?.textContent).toBe('Cari: Cash');
  });
});
