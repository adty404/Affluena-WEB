import { useId, useMemo, type ReactNode } from 'react';
import ReactDataTable, { type DataTableSlots } from 'datatables.net-react';
import DT from 'datatables.net-dt';
import type { Config } from 'datatables.net';
import { dataTableStyles } from './DataTable.styles';

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
