import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';
import { Input } from './Input';
import { Button } from './Button';
import { AppIcon } from './AppIcon';

export type Column<T> = {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
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
};

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  sortable = false,
  pagination = false,
  pageSize = 10,
  searchable = false,
  searchKeys,
  initialSort,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(
    initialSort ? [{ id: initialSort.key, desc: initialSort.dir === 'desc' }] : []
  );
  const [globalFilter, setGlobalFilter] = useState('');

  const tableColumns = useMemo<ColumnDef<T>[]>(() => {
    return columns.map((col) => ({
      id: col.key,
      header: col.header,
      accessorFn: col.accessor ? col.accessor : (row: T) => (row as Record<string, unknown>)[col.key],
      cell: (info) => col.render(info.row.original),
      enableSorting: sortable,
      meta: {
        align: col.align,
      },
    }));
  }, [columns, sortable]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sortable ? getSortedRowModel() : undefined,
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    getFilteredRowModel: searchable ? getFilteredRowModel() : undefined,
    globalFilterFn: (row, columnId, filterValue) => {
      if (!searchKeys || searchKeys.length === 0) {
        const value = row.getValue(columnId);
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
      }
      return searchKeys.some((key) => {
        const value = row.original[key];
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
      });
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className="data-table-container">
      {searchable && (
        <div style={{ marginBottom: '1rem' }}>
          <Input
            placeholder="Search..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
        </div>
      )}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const align = (header.column.columnDef.meta as { align?: 'left' | 'right' } | undefined)?.align;
                  const canSort = header.column.getCanSort();
                  return (
                    <th
                      key={header.id}
                      className={align === 'right' ? 'align-right' : undefined}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      style={{ cursor: canSort ? 'pointer' : 'default' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: align === 'right' ? 'flex-end' : 'flex-start', gap: '4px' }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <span style={{ display: 'inline-flex', width: '16px', opacity: header.column.getIsSorted() ? 1 : 0.3 }}>
                            {header.column.getIsSorted() === 'asc' ? (
                              <AppIcon name="arrow-up" size={14} />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <AppIcon name="arrow-down" size={14} />
                            ) : (
                              <AppIcon name="arrow-up-down" size={14} />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={getRowKey(row.original)}>
                {row.getVisibleCells().map((cell) => {
                  const align = (cell.column.columnDef.meta as { align?: 'left' | 'right' } | undefined)?.align;
                  return (
                    <td key={cell.id} className={align === 'right' ? 'align-right' : undefined}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted, #64748b)' }}>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="default"
              size="small"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="default"
              size="small"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
