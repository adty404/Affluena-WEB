export const mobileDataTableStyles = `
  @media (max-width: 720px) {
    .dt-wrapper {
      display: flex;
      flex-direction: column;
      overflow: visible;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
    }
    .dt-wrapper > div:has(.dt-container),
    .dt-wrapper .dt-container {
      display: contents;
    }
    .dt-wrapper .dt-layout-row.dt-layout-table,
    .dt-wrapper table.dataTable,
    .dt-wrapper table.dt-empty-table {
      display: none !important;
    }
    .dt-wrapper .dt-layout-row:not(.dt-layout-table):has(.dt-search),
    .dt-wrapper .dt-layout-row:not(.dt-layout-table):has(.dt-length) {
      position: sticky;
      top: calc(var(--mobile-topbar-offset, 56px) + env(safe-area-inset-top, 0px));
      z-index: 8;
      order: 1;
      display: grid;
      gap: var(--mobile-page-gap, 8px);
      align-items: stretch;
      margin: 0 0 var(--mobile-page-gap, 8px);
      padding: var(--mobile-dense-padding, 8px);
      border: 1px solid var(--line, #e2e8f0);
      border-radius: var(--mobile-card-radius, 16px);
      background: var(--surface, #ffffff);
      box-shadow: var(--mobile-card-shadow, 0 6px 18px rgba(15, 23, 42, .055));
    }
    .dt-wrapper .dt-layout-row:not(.dt-layout-table):not(:has(.dt-search)):not(:has(.dt-length)) {
      order: 4;
      display: grid;
      gap: 0.5rem;
      padding: 0;
    }
    .dt-wrapper .dt-layout-cell,
    .dt-wrapper .dt-search,
    .dt-wrapper .dt-length {
      width: 100%;
      min-width: 0;
      margin-left: 0;
    }
    .dt-wrapper .dt-search .dt-input,
    .dt-wrapper .dt-length .dt-input {
      width: 100%;
      min-height: var(--mobile-touch-target, 48px);
      font-size: 1rem;
    }
    .dt-mobile-active-filters {
      order: 2;
      display: flex;
      gap: 0.5rem;
      max-width: 100%;
      overflow-x: auto;
      padding: 0 0 0.25rem;
      scrollbar-width: none;
    }
    .dt-mobile-active-filters::-webkit-scrollbar {
      display: none;
    }
    .dt-mobile-filter-chip {
      flex: 0 0 auto;
      max-width: 100%;
      padding: 0.375rem 0.625rem;
      border: 1px solid var(--line, #e2e8f0);
      border-radius: var(--radius-sm, 10px);
      color: var(--ink, #0f172a);
      background: var(--surface-soft, #f9fbfd);
      font-size: 0.75rem;
      font-weight: 850;
      line-height: 1.2;
      overflow-wrap: anywhere;
    }
    .dt-mobile-list {
      order: 3;
      display: grid;
      gap: var(--mobile-page-gap, 8px);
      padding: 0;
    }
    .dt-mobile-card,
    .dt-mobile-empty-card {
      min-width: 0;
      padding: var(--mobile-dense-padding, 8px) var(--mobile-card-padding, 12px);
      border: 1px solid var(--line, #e2e8f0);
      border-radius: var(--mobile-card-radius, 16px);
      background: var(--surface, #ffffff);
      box-shadow: var(--mobile-card-shadow, 0 6px 18px rgba(15, 23, 42, .055));
    }
    .dt-mobile-card {
      position: relative;
      display: grid;
      gap: var(--mobile-page-gap, 8px);
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
      line-height: 1.2;
      color: var(--ink, #0f172a);
      overflow-wrap: anywhere;
    }
    .dt-mobile-card-title .table-subtitle,
    .dt-mobile-card-title small {
      margin-top: 0.25rem;
      line-height: 1.35;
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
    .dt-mobile-fields {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(104px, 1fr));
      gap: 0.5rem;
      margin: 0;
      padding-top: 0.5rem;
      border-top: 1px solid var(--line-soft, #f1f5f9);
    }
    .dt-mobile-field {
      min-width: 0;
      display: grid;
      gap: 0.1875rem;
    }
    .dt-mobile-field dt {
      color: var(--muted, #64748b);
      font-size: 0.6875rem;
      font-weight: 850;
      line-height: 1.25;
    }
    .dt-mobile-field dd {
      min-width: 0;
      margin: 0;
      color: var(--ink, #0f172a);
      font-size: 0.8125rem;
      font-weight: 750;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }
    .dt-mobile-field dd.dt-right {
      text-align: left;
    }
    .dt-mobile-empty-card {
      color: var(--muted, #64748b);
      font-weight: 850;
      text-align: center;
    }
    .dt-mobile-actions {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.5rem;
      align-items: stretch;
      padding-top: 0.5rem;
      border-top: 1px solid var(--line-soft, #f1f5f9);
    }
    .dt-mobile-primary-action {
      min-width: 0;
    }
    .dt-mobile-primary-action .inline-actions {
      display: contents;
    }
    .dt-mobile-primary-action .btn,
    .dt-mobile-primary-action button,
    .dt-mobile-primary-action a {
      width: 100%;
      min-height: 44px;
    }
    .dt-mobile-more {
      position: relative;
      min-width: 44px;
    }
    .dt-mobile-more-button {
      width: 44px;
      min-height: 44px;
      border: 1px solid var(--line, #e2e8f0);
      border-radius: var(--radius-sm, 10px);
      color: var(--ink, #0f172a);
      background: var(--surface-soft, #f9fbfd);
      font-size: 1rem;
      font-weight: 900;
      cursor: pointer;
    }
    .dt-mobile-more-button:focus-visible {
      outline: 3px solid var(--primary-soft, #d1fae5);
      outline-offset: 2px;
    }
    .dt-mobile-action-menu {
      position: absolute;
      top: calc(100% + 0.375rem);
      right: 0;
      z-index: 20;
      display: grid;
      gap: 0.25rem;
      width: min(180px, calc(100vw - 48px));
      padding: 0.375rem;
      border: 1px solid var(--line, #e2e8f0);
      border-radius: var(--radius-sm, 10px);
      background: var(--surface, #ffffff);
      box-shadow: var(--shadow, 0 14px 34px rgba(15, 23, 42, .12));
    }
    .dt-mobile-menu-action {
      min-width: 0;
    }
    .dt-mobile-menu-action .btn,
    .dt-mobile-menu-action button,
    .dt-mobile-menu-action a {
      width: 100%;
      min-height: 40px;
      justify-content: flex-start;
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
