import { Children, Fragment, isValidElement, useState, type ReactNode } from 'react';
import type { Column, DataTableProps } from './DataTable';

const mobileStatusColumnPattern = /^(status|type|severity|role|akses)$/i;
const mobileActionColumnPattern = /(action|actions|aksi|option|opsi)$/i;
const maxMobileMetadataFields = 3;

type ActionContainerProps = {
  readonly children?: ReactNode;
  readonly className?: string;
};

type MobileActionNodes = {
  readonly primary: ReactNode | null;
  readonly secondary: readonly ReactNode[];
};

type IndexedColumn<T> = {
  readonly column: Column<T>;
  readonly index: number;
};

function renderMobileNode(node: ReactNode) {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  return node;
}

function getNodeText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).filter(Boolean).join(' ').trim();
  if (isValidElement<ActionContainerProps>(node)) return getNodeText(node.props.children);
  return '';
}

function isInlineActionContainer(node: ReactNode) {
  if (!isValidElement<ActionContainerProps>(node)) return false;
  return typeof node.props.className === 'string' && node.props.className.split(/\s+/).includes('inline-actions');
}

function flattenActionNodes(node: ReactNode): ReactNode[] {
  const displayNode = renderMobileNode(node);

  if (displayNode === '') return [];
  if (Array.isArray(displayNode)) return displayNode.flatMap(flattenActionNodes);
  if (!isValidElement<ActionContainerProps>(displayNode)) return [displayNode];
  if (displayNode.type === Fragment || isInlineActionContainer(displayNode)) {
    return Children.toArray(displayNode.props.children).flatMap(flattenActionNodes);
  }

  return [displayNode];
}

function isHiddenColumn<T>(column: Column<T>) {
  return column.mobileRole === 'hidden';
}

function isMobileStatusColumn<T>(column: Column<T>) {
  if (column.mobileRole === 'status') return true;
  if (column.mobileRole) return false;
  return mobileStatusColumnPattern.test(column.key) || mobileStatusColumnPattern.test(column.header);
}

function isMobileActionColumn<T>(column: Column<T>) {
  if (column.mobileRole === 'primaryAction' || column.mobileRole === 'secondaryAction') return true;
  if (column.mobileRole) return false;
  return mobileActionColumnPattern.test(column.key) || mobileActionColumnPattern.test(column.header);
}

function sortByMobilePriority<T>(columns: readonly Column<T>[]) {
  return columns
    .map<IndexedColumn<T>>((column, index) => ({ column, index }))
    .sort((left, right) => {
      const leftPriority = left.column.mobilePriority ?? left.index;
      const rightPriority = right.column.mobilePriority ?? right.index;
      return leftPriority - rightPriority;
    })
    .map(({ column }) => column);
}

function renderActionColumns<T>(columns: readonly Column<T>[], row: T) {
  return columns.flatMap((column) => flattenActionNodes(column.render(row)));
}

function getMobileActionNodes<T>(actionColumns: readonly Column<T>[], row: T): MobileActionNodes {
  const primaryColumns = actionColumns.filter((column) => column.mobileRole === 'primaryAction');
  const secondaryColumns = actionColumns.filter((column) => column.mobileRole === 'secondaryAction');
  const inferredColumns = actionColumns.filter(
    (column) => column.mobileRole !== 'primaryAction' && column.mobileRole !== 'secondaryAction',
  );
  const primaryNodes = renderActionColumns(primaryColumns, row);
  const inferredNodes = renderActionColumns(inferredColumns, row);
  const secondaryNodes = renderActionColumns(secondaryColumns, row);

  if (primaryNodes.length > 0) {
    return {
      primary: primaryNodes[0] ?? null,
      secondary: [...primaryNodes.slice(1), ...inferredNodes, ...secondaryNodes],
    };
  }

  return {
    primary: inferredNodes[0] ?? null,
    secondary: [...inferredNodes.slice(1), ...secondaryNodes],
  };
}

export function MobileCardList<T>({
  columns,
  data,
  getRowKey,
  emptyMessage,
}: Pick<DataTableProps<T>, 'columns' | 'data' | 'getRowKey' | 'emptyMessage'>) {
  const [openActionRow, setOpenActionRow] = useState<string | null>(null);
  const visibleColumns = columns.filter((column) => !isHiddenColumn(column));
  const titleColumn = visibleColumns.find((column) => column.mobileRole === 'title') ?? visibleColumns[0];
  const detailColumns = visibleColumns.filter((column) => column !== titleColumn);
  const statusColumn = detailColumns.find(isMobileStatusColumn);
  const actionColumns = detailColumns.filter(isMobileActionColumn);
  const metadataColumns = sortByMobilePriority(
    detailColumns.filter((column) => column.mobileRole === 'meta' || (column !== statusColumn && !isMobileActionColumn(column))),
  ).slice(0, maxMobileMetadataFields);

  if (data.length === 0) {
    return (
      <div className="dt-mobile-list" role="list">
        <article className="dt-mobile-empty-card" role="listitem">
          {emptyMessage}
        </article>
      </div>
    );
  }

  return (
    <div className="dt-mobile-list" role="list">
      {data.map((row) => {
        const rowKey = getRowKey(row);
        const titleNode = titleColumn ? renderMobileNode(titleColumn.render(row)) : '';
        const titleText = getNodeText(titleNode) || 'row';
        const actions = getMobileActionNodes(actionColumns, row);
        const isActionMenuOpen = openActionRow === rowKey;

        return (
          <article className="dt-mobile-card" role="listitem" key={rowKey}>
            <div className="dt-mobile-card-head">
              {titleColumn ? <div className="dt-mobile-card-title">{titleNode}</div> : null}
              {statusColumn ? (
                <div className="dt-mobile-card-status">
                  {renderMobileNode(statusColumn.render(row))}
                </div>
              ) : null}
            </div>
            {metadataColumns.length > 0 ? (
              <dl className="dt-mobile-fields">
                {metadataColumns.map((col) => (
                  <div className="dt-mobile-field" key={`${rowKey}-${col.key}`}>
                    <dt>{col.mobileLabel ?? col.header}</dt>
                    <dd className={col.align === 'right' ? 'dt-mobile-value dt-right' : 'dt-mobile-value'}>
                      {renderMobileNode(col.render(row))}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {actions.primary || actions.secondary.length > 0 ? (
              <div className="dt-mobile-actions">
                {actions.primary ? <div className="dt-mobile-primary-action">{actions.primary}</div> : null}
                {actions.secondary.length > 0 ? (
                  <div className="dt-mobile-more">
                    <button
                      type="button"
                      className="dt-mobile-more-button"
                      aria-expanded={isActionMenuOpen}
                      aria-label={`More actions for ${titleText}`}
                      onClick={() => setOpenActionRow((current) => (current === rowKey ? null : rowKey))}
                    >
                      <span aria-hidden="true">...</span>
                    </button>
                    {isActionMenuOpen ? (
                      <div className="dt-mobile-action-menu">
                        {actions.secondary.map((action, index) => (
                          <div className="dt-mobile-menu-action" key={`${rowKey}-secondary-${index}`}>
                            {action}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
