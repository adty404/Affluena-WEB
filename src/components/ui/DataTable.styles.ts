import { mobileDataTableStyles } from './DataTable.mobile.styles';

export const dataTableStyles = `
  .dt-wrapper {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    border: 1px solid var(--line, #e5e5e3);
    border-radius: 18px;
    background: var(--surface, #ffffff);
    -webkit-overflow-scrolling: touch;
  }
  .dt-wrapper .dt-container {
    width: 100%;
    min-width: 0;
  }
  .dt-wrapper .dt-layout-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    justify-content: space-between;
    min-width: 0;
    padding: 0.75rem 0.875rem 0;
  }
  .dt-wrapper .dt-layout-row.dt-layout-table {
    display: block;
    padding: 0;
  }
  .dt-wrapper .dt-layout-cell {
    min-width: 0;
  }
  .dt-wrapper .dt-layout-cell.dt-layout-full {
    width: 100%;
  }
  .dt-wrapper .dt-search,
  .dt-wrapper .dt-length {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0;
  }
  .dt-wrapper .dt-search {
    margin-left: auto;
  }
  .dt-wrapper .dt-input {
    max-width: 100%;
    border: 1px solid var(--line, #e5e5e3);
    border-radius: var(--radius-sm, 10px);
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: var(--ink, #17181a);
    background-color: var(--surface, #ffffff);
  }
  .dt-wrapper .dt-search .dt-input {
    width: min(100%, 240px);
  }
  .dt-wrapper table.dataTable,
  .dt-wrapper table.dt-empty-table {
    width: 100% !important;
    min-width: 720px;
    border-collapse: collapse;
    margin: 0;
  }
  .dt-wrapper table.dataTable thead th,
  .dt-wrapper table.dt-empty-table thead th {
    border-bottom: 2px solid var(--line, #e5e5e3);
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--muted, #6e7073);
    text-transform: uppercase;
    letter-spacing: 0;
    white-space: nowrap;
  }
  .dt-wrapper table.dataTable thead th.dt-right,
  .dt-wrapper table.dt-empty-table thead th.dt-right { text-align: right; }
  .dt-wrapper table.dataTable tbody td,
  .dt-wrapper table.dt-empty-table tbody td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--line-soft, #f1f1ef);
    font-size: 0.875rem;
    color: var(--ink, #17181a);
    max-width: 260px;
    overflow-wrap: anywhere;
  }
  .dt-wrapper table.dataTable tbody td.dt-right,
  .dt-wrapper table.dt-empty-table tbody td.dt-right {
    text-align: right;
    white-space: nowrap;
  }
  .dt-wrapper table.dataTable tbody tr:hover {
    background-color: var(--surface-alt, #f7f7f5);
  }
  .dt-wrapper .table-subtitle {
    display: block;
    margin-top: 0.1875rem;
    color: var(--muted, #6e7073);
    font-size: 0.75rem;
    line-height: 1.45;
  }
  .dt-wrapper .dt-empty-state {
    color: var(--muted, #6e7073);
    text-align: center;
  }
  .dt-mobile-list {
    display: none;
  }
  .dt-mobile-active-filters {
    display: none;
  }
  .dt-wrapper .dt-info,
  .dt-wrapper .dt-paging {
    padding: 0.75rem 0.875rem;
  }
  .dt-wrapper .dt-paging {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    justify-content: flex-end;
  }
  .dt-wrapper .dt-paging .dt-paging-button {
    border: 1px solid var(--line, #e5e5e3);
    border-radius: var(--radius-sm, 6px);
    padding: 0.375rem 0.75rem;
    margin: 0;
    background: var(--surface, #ffffff);
    cursor: pointer;
  }
  .dt-wrapper .dt-paging .dt-paging-button.current {
    background: var(--primary, #17181a);
    border-color: var(--primary, #17181a);
    color: #ffffff;
  }
  .dt-wrapper .dt-paging .dt-paging-button.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .dt-wrapper .dt-info {
    font-size: 0.8125rem;
    color: var(--muted, #6e7073);
  }
  ${mobileDataTableStyles}
`;
