import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import ReactDataTable, { type DataTableRef, type DataTableSlots } from 'datatables.net-react';
import DT from 'datatables.net-dt';
import type { Config } from 'datatables.net';
import { MobileCardList } from './DataTable.mobile';
import { dataTableStyles } from './DataTable.styles';

ReactDataTable.use(DT);

const emptyActiveFilters: readonly string[] = [];

export type MobileColumnRole = 'title' | 'status' | 'meta' | 'primaryAction' | 'secondaryAction' | 'hidden';

export type Column<T> = {
  readonly key: string;
  readonly header: string;
  readonly render: (item: T) => ReactNode;
  readonly align?: 'left' | 'right';
  readonly accessor?: (item: T) => string | number;
  readonly mobileRole?: MobileColumnRole;
  readonly mobilePriority?: number;
  readonly mobileLabel?: string;
};

export type DataTableProps<T> = {
  readonly columns: readonly Column<T>[];
  readonly data: readonly T[];
  readonly getRowKey: (item: T) => string;
  readonly sortable?: boolean;
  readonly pagination?: boolean;
  readonly pageSize?: number;
  readonly searchable?: boolean;
  readonly searchKeys?: readonly (keyof T)[];
  readonly initialSort?: { readonly key: string; readonly dir: 'asc' | 'desc' };
  readonly emptyMessage?: string;
  readonly activeFilters?: readonly string[];
};

type TableRow<T> = Record<string, unknown> & {
  _row: T;
  _rowKey: string;
};

type OriginalTableRow<T> = {
  readonly _row: T;
};

function hasOriginalTableRow<T>(value: unknown): value is OriginalTableRow<T> {
  return typeof value === 'object' && value !== null && '_row' in value;
}

function renderDisplayNode(node: ReactNode) {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  return node;
}

function renderDataValue(value: unknown) {
  if (value === null || value === undefined || typeof value === 'boolean') return '';
  return value;
}

function readObjectValue(value: unknown, key: string) {
  if (typeof value !== 'object' || value === null) return undefined;
  return Object.getOwnPropertyDescriptor(value, key)?.value;
}

function getSearchLabel(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value instanceof RegExp) return value.source.trim();
  return '';
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
  emptyMessage = 'Tidak ada data',
  activeFilters = emptyActiveFilters,
}: DataTableProps<T>) {
  const reactId = useId();
  const tableRef = useRef<DataTableRef>(null);
  const [mobileRows, setMobileRows] = useState<readonly T[]>(data);
  const [mobileSearchValue, setMobileSearchValue] = useState('');
  const tableId = useMemo(() => `affluena-datatable-${reactId.replace(/[^A-Za-z0-9_-]/g, '')}`, [reactId]);

  const tableRows = useMemo<TableRow<T>[]>(() => {
    return data.map((row) => {
      const obj: TableRow<T> = {
        _row: row,
        _rowKey: getRowKey(row),
      };
      columns.forEach((col) => {
        obj[col.key] = renderDataValue(col.accessor ? col.accessor(row) : readObjectValue(row, col.key));
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
        searchPlaceholder: 'Cari...',
        emptyTable: emptyMessage,
        zeroRecords: emptyMessage,
        lengthMenu: 'Tampilkan _MENU_',
        info: 'Menampilkan _START_–_END_ dari _TOTAL_ entri',
        infoEmpty: 'Tidak ada entri',
        infoFiltered: '(disaring dari _MAX_ total)',
        paginate: { first: '«', previous: '‹', next: '›', last: '»' },
      },
    };
  }, [columns, emptyMessage, initialSort, pageSize, pagination, searchable, sortable]);

  const syncMobileRows = useCallback(() => {
    const api = tableRef.current?.dt();
    if (!api) {
      setMobileRows(data);
      setMobileSearchValue('');
      return;
    }

    setMobileSearchValue(getSearchLabel(api.search()));
    const appliedRows = api
      .rows({ page: 'current', search: 'applied', order: 'applied' })
      .data()
      .toArray()
      .filter(hasOriginalTableRow<T>)
      .map((row) => row._row);
    setMobileRows(appliedRows);
  }, [data]);

  const scheduleMobileRowsSync = useCallback(() => {
    window.setTimeout(syncMobileRows, 0);
  }, [syncMobileRows]);

  useEffect(() => {
    const syncTimer = window.setTimeout(syncMobileRows, 0);
    return () => window.clearTimeout(syncTimer);
  }, [syncMobileRows]);

  const mobileActiveFilters = useMemo(() => {
    if (!mobileSearchValue) return activeFilters;
    return [...activeFilters, `Cari: ${mobileSearchValue}`];
  }, [activeFilters, mobileSearchValue]);

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
        <MobileCardList columns={columns} data={data} getRowKey={getRowKey} emptyMessage={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="dt-wrapper">
      <style>{dataTableStyles}</style>
      <ReactDataTable
        ref={tableRef}
        id={tableId}
        data={tableRows}
        columns={dtColumns}
        options={options}
        slots={slots}
        className="display"
        onDraw={scheduleMobileRowsSync}
        onInit={scheduleMobileRowsSync}
      />
      {mobileActiveFilters.length > 0 ? (
        <div className="dt-mobile-active-filters" aria-label="Filter tabel aktif">
          {mobileActiveFilters.map((filter, index) => (
            <span className="dt-mobile-filter-chip" key={`${filter}-${index}`}>
              {filter}
            </span>
          ))}
        </div>
      ) : null}
      <MobileCardList columns={columns} data={mobileRows} getRowKey={getRowKey} emptyMessage={emptyMessage} />
    </div>
  );
}

export const DataTable = DataTableInner;
