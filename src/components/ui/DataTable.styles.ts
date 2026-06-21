export const dataTableStyles = `
  .dt-wrapper {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    border: 1px solid var(--line, #e2e8f0);
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
    border: 1px solid var(--line, #e2e8f0);
    border-radius: var(--radius-sm, 10px);
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: var(--ink, #0f172a);
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
    border-bottom: 2px solid var(--line, #e2e8f0);
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--muted, #64748b);
    text-transform: uppercase;
    letter-spacing: 0;
    white-space: nowrap;
  }
  .dt-wrapper table.dataTable thead th.dt-right,
  .dt-wrapper table.dt-empty-table thead th.dt-right { text-align: right; }
  .dt-wrapper table.dataTable tbody td,
  .dt-wrapper table.dt-empty-table tbody td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--line-soft, #f1f5f9);
    font-size: 0.875rem;
    color: var(--ink, #0f172a);
    max-width: 260px;
    overflow-wrap: anywhere;
  }
  .dt-wrapper table.dataTable tbody td.dt-right,
  .dt-wrapper table.dt-empty-table tbody td.dt-right {
    text-align: right;
    white-space: nowrap;
  }
  .dt-wrapper table.dataTable tbody tr:hover {
    background-color: var(--surface-alt, #f8fafc);
  }
  .dt-wrapper .table-subtitle {
    display: block;
    margin-top: 0.1875rem;
    color: var(--muted, #64748b);
    font-size: 0.75rem;
    line-height: 1.45;
  }
  .dt-wrapper .dt-empty-state {
    color: var(--muted, #64748b);
    text-align: center;
  }
  .dt-mobile-list {
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
    border: 1px solid var(--line, #e2e8f0);
    border-radius: var(--radius-sm, 6px);
    padding: 0.375rem 0.75rem;
    margin: 0;
    background: var(--surface, #ffffff);
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
    color: var(--muted, #64748b);
  }
  @media (max-width: 720px) {
    .dt-wrapper {
      overflow: visible;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
    }
    .dt-wrapper .dt-layout-row.dt-layout-table,
    .dt-wrapper table.dataTable,
    .dt-wrapper table.dt-empty-table {
      display: none !important;
    }
    .dt-mobile-list {
      display: grid;
      gap: var(--mobile-page-gap, 8px);
      padding: 0;
    }
    .dt-mobile-card,
    .dt-mobile-empty-card {
      min-width: 0;
      padding: var(--mobile-card-padding, 12px);
      border: 1px solid var(--line, #e2e8f0);
      border-radius: var(--mobile-card-radius, 16px);
      background: var(--surface, #ffffff);
      box-shadow: var(--mobile-card-shadow, 0 6px 18px rgba(15, 23, 42, .055));
    }
    .dt-mobile-card {
      display: grid;
      gap: 0.75rem;
    }
    .dt-mobile-card-head {
      min-width: 0;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.75rem;
      align-items: start;
    }
    .dt-mobile-card-title {
      min-width: 0;
      font-size: 0.9375rem;
      font-weight: 900;
      color: var(--ink, #0f172a);
      overflow-wrap: anywhere;
    }
    .dt-mobile-card-status {
      min-width: 0;
      display: flex;
      justify-content: flex-end;
    }
    .dt-mobile-card-status .badge {
      max-width: 100%;
      white-space: nowrap;
    }
    .dt-mobile-card-title .table-subtitle {
      margin-top: 0.25rem;
    }
    .dt-mobile-fields {
      display: grid;
      gap: 0.5rem;
      margin: 0;
    }
    .dt-mobile-field {
      min-width: 0;
      display: grid;
      grid-template-columns: minmax(88px, .42fr) minmax(0, 1fr);
      gap: 0.75rem;
      align-items: start;
      padding-top: 0.5rem;
      border-top: 1px solid var(--line-soft, #f1f5f9);
    }
    .dt-mobile-field dt {
      color: var(--muted, #64748b);
      font-size: 0.75rem;
      font-weight: 850;
      line-height: 1.35;
    }
    .dt-mobile-field dd {
      min-width: 0;
      margin: 0;
      color: var(--ink, #0f172a);
      font-size: 0.875rem;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }
    .dt-mobile-field dd.dt-right {
      text-align: right;
    }
    .dt-mobile-empty-card {
      color: var(--muted, #64748b);
      font-weight: 850;
      text-align: center;
    }
    .dt-mobile-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
      gap: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--line-soft, #f1f5f9);
    }
    .dt-mobile-action {
      min-width: 0;
    }
    .dt-mobile-action .inline-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
      gap: 0.5rem;
    }
    .dt-mobile-action .btn,
    .dt-mobile-actions .btn {
      width: 100%;
      min-height: var(--mobile-touch-target, 48px);
    }
    .dt-wrapper .dt-layout-row:not(.dt-layout-table) {
      flex-direction: column;
      align-items: stretch;
      padding: 0 0 0.75rem;
    }
    .dt-wrapper .dt-search {
      width: 100%;
      margin-left: 0;
    }
    .dt-wrapper .dt-length {
      width: 100%;
    }
    .dt-wrapper .dt-search .dt-input,
    .dt-wrapper .dt-length .dt-input {
      width: 100%;
      min-height: var(--mobile-touch-target, 48px);
      font-size: 1rem;
    }
    .dt-wrapper .dt-info,
    .dt-wrapper .dt-paging {
      justify-content: flex-start;
      padding-inline: 0;
    }
    .dt-wrapper .dt-paging .dt-paging-button {
      min-height: 44px;
      min-width: 44px;
    }
  }
`;
