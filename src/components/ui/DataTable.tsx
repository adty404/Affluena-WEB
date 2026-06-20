import { useId, useMemo, type ReactNode } from 'react';
import ReactDataTable, { type DataTableSlots } from 'datatables.net-react';
import DT from 'datatables.net-dt';
import type { Config } from 'datatables.net';

ReactDataTable.use(DT);

export type Column<T> = {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  align?: 'left' | 'right';
  accessor?: (item: T) => string | number;
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  getRowKey: (item: T) => string;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  initialSort?: { key: string; dir: 'asc' | 'desc' };
  emptyMessage?: string;
};

type TableRow<T> = Record<string, unknown> & {
  _row: T;
  _rowKey: string;
};

function renderDisplayNode(node: ReactNode) {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  return node;
}

function renderDataValue(value: unknown) {
  if (value === null || value === undefined || typeof value === 'boolean') return '';
  return value;
}

const dataTableStyles = `
  .dt-wrapper .dt-search { margin-bottom: 0.75rem; }
  .dt-wrapper .dt-length { margin-bottom: 0.75rem; }
  .dt-wrapper .dt-input {
    border: 1px solid var(--border, #e2e8f0);
    border-radius: var(--radius-md, 8px);
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    background-color: var(--bg-input, #ffffff);
  }
  .dt-wrapper table.dataTable,
  .dt-wrapper table.dt-empty-table {
    width: 100% !important;
    border-collapse: collapse;
  }
  .dt-wrapper table.dataTable thead th,
  .dt-wrapper table.dt-empty-table thead th {
    border-bottom: 2px solid var(--border, #e2e8f0);
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-muted, #64748b);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .dt-wrapper table.dataTable thead th.dt-right,
  .dt-wrapper table.dt-empty-table thead th.dt-right { text-align: right; }
  .dt-wrapper table.dataTable tbody td,
  .dt-wrapper table.dt-empty-table tbody td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border-light, #f1f5f9);
    font-size: 0.875rem;
    color: var(--text-main, #0f172a);
  }
  .dt-wrapper table.dataTable tbody td.dt-right,
  .dt-wrapper table.dt-empty-table tbody td.dt-right { text-align: right; }
  .dt-wrapper table.dataTable tbody tr:hover {
    background-color: var(--bg-hover, #f8fafc);
  }
  .dt-wrapper .dt-empty-state {
    color: var(--text-muted, #64748b);
    text-align: center;
  }
  .dt-wrapper .dt-paging .dt-paging-button {
    border: 1px solid var(--border, #e2e8f0);
    border-radius: var(--radius-sm, 6px);
    padding: 0.375rem 0.75rem;
    margin: 0 0.125rem;
    background: var(--bg-input, #ffffff);
    cursor: pointer;
  }
  .dt-wrapper .dt-paging .dt-paging-button.current {
    background: var(--primary, #10b981);
    border-color: var(--primary, #10b981);
    color: #ffffff;
  }
  .dt-wrapper .dt-paging .dt-paging-button.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .dt-wrapper .dt-info {
    font-size: 0.8125rem;
    color: var(--text-muted, #64748b);
  }
`;

function DataTableInner<T>({
  columns,
  data,
  getRowKey,
  sortable = true,
  pagination = true,
  pageSize = 10,
  searchable = true,
  initialSort,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const reactId = useId();
  const tableId = useMemo(() => `affluena-datatable-${reactId.replace(/[^A-Za-z0-9_-]/g, '')}`, [reactId]);

  const tableRows = useMemo<TableRow<T>[]>(() => {
    return data.map((row) => {
      const obj: TableRow<T> = {
        _row: row,
        _rowKey: getRowKey(row),
      };
      columns.forEach((col) => {
        obj[col.key] = renderDataValue(col.accessor ? col.accessor(row) : (row as Record<string, unknown>)[col.key]);
      });
      return obj;
    });
  }, [columns, data, getRowKey]);

  const dtColumns = useMemo<Config['columns']>(() => {
    return columns.map((col) => ({
      data: col.key,
      name: col.key,
      title: col.header,
      className: col.align === 'right' ? 'dt-right' : '',
    }));
  }, [columns]);

  const slots = useMemo<DataTableSlots>(() => {
    return columns.reduce<DataTableSlots>((acc, col) => {
      acc[col.key] = (_cellData: unknown, type: string, row: TableRow<T>) => {
        if (type === 'display') return renderDisplayNode(col.render(row._row));
        return renderDataValue(col.accessor ? col.accessor(row._row) : row[col.key]);
      };
      return acc;
    }, {});
  }, [columns]);

  const options = useMemo<Config>(() => {
    const sortIndex = initialSort ? columns.findIndex((col) => col.key === initialSort.key) : -1;

    return {
      destroy: true,
      searching: searchable,
      ordering: sortable,
      paging: pagination,
      pageLength: pageSize,
      lengthChange: true,
      info: pagination,
      autoWidth: false,
      order: sortIndex >= 0 && initialSort ? [[sortIndex, initialSort.dir]] : [],
      language: {
        search: '',
        searchPlaceholder: 'Search...',
        emptyTable: emptyMessage,
        zeroRecords: emptyMessage,
        lengthMenu: 'Show _MENU_',
        info: 'Showing _START_ to _END_ of _TOTAL_ entries',
        infoEmpty: 'No entries to show',
        infoFiltered: '(filtered from _MAX_ total)',
        paginate: { previous: '‹', next: '›' },
      },
    };
  }, [columns, emptyMessage, initialSort, pageSize, pagination, searchable, sortable]);

  if (data.length === 0) {
    return (
      <div className="dt-wrapper">
        <style>{dataTableStyles}</style>
        <table id={tableId} className="dt-empty-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className={col.align === 'right' ? 'dt-right' : undefined}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="dt-empty-state" colSpan={Math.max(columns.length, 1)}>
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="dt-wrapper">
      <style>{dataTableStyles}</style>
      <ReactDataTable id={tableId} data={tableRows} columns={dtColumns} options={options} slots={slots} className="display" />
    </div>
  );
}

export const DataTable = DataTableInner;
