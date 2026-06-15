import type { ReactNode } from 'react';

type Column<T> = {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  align?: 'left' | 'right';
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  getRowKey: (item: T) => string;
};

export function DataTable<T>({ columns, data, getRowKey }: DataTableProps<T>) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.align === 'right' ? 'align-right' : undefined}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={getRowKey(item)}>
              {columns.map((column) => (
                <td key={column.key} className={column.align === 'right' ? 'align-right' : undefined}>{column.render(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
