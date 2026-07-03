import { useState } from 'react';
import type { DragEvent } from 'react';
import type { Category } from '../../types/category';
import { categoryTypeLabels } from '../../schemas/category';
import { AppIcon } from '../ui/AppIcon';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { itemAccentVars } from '../finance/ColorPicker';
import { CategoryIcon } from './CategoryIcon';

const MAX_DEPTH = 2; // depth index: 0 parent, 1 child, 2 grandchild

type CategoryTreeProps = {
  readonly categories: readonly Category[];
  readonly onDelete: (category: Category) => void;
  /**
   * Persist a new order. Receives the full flattened id list (all types, DFS
   * order) after a sibling-group reorder. Omit to disable drag-reorder.
   */
  readonly onReorder?: (ids: string[]) => void;
};

type CategoryTreeNode = {
  readonly category: Category;
  readonly children: readonly CategoryTreeNode[];
  readonly depth: number;
};

type CategoryTreeGroup = {
  readonly type: Category['type'];
  readonly tone: 'green' | 'orange';
  readonly iconClass: 'green' | 'orange';
};

const CATEGORY_TREE_GROUPS = [
  { type: 'income', tone: 'green', iconClass: 'green' },
  { type: 'expense', tone: 'orange', iconClass: 'orange' },
] satisfies readonly CategoryTreeGroup[];

function childCountLabel(childCount: number): string {
  return childCount === 1 ? '1 sub' : `${childCount} sub`;
}

function buildCategoryNode(categories: readonly Category[], category: Category, depth: number): CategoryTreeNode {
  return {
    category,
    depth,
    children: categories
      .filter((candidate) => candidate.parent_id === category.id)
      .map((child) => buildCategoryNode(categories, child, depth + 1)),
  };
}

function buildCategoryTree(categories: readonly Category[], type: Category['type']): CategoryTreeNode[] {
  const typedCategories = categories.filter((category) => category.type === type);
  const typedCategoryIds = new Set(typedCategories.map((category) => category.id));

  return typedCategories
    .filter((category) => !category.parent_id || !typedCategoryIds.has(category.parent_id))
    .map((category) => buildCategoryNode(typedCategories, category, 0));
}

function countNodes(nodes: readonly CategoryTreeNode[]): number {
  return nodes.reduce((total, node) => total + 1 + countNodes(node.children), 0);
}

/** Flatten all categories into a DFS id list, so a reorder persists the full order. */
function flattenIds(categories: readonly Category[]): string[] {
  const ids: string[] = [];
  const visit = (nodes: readonly CategoryTreeNode[]) => {
    for (const node of nodes) {
      ids.push(node.category.id);
      visit(node.children);
    }
  };
  for (const group of CATEGORY_TREE_GROUPS) visit(buildCategoryTree(categories, group.type));
  return ids;
}

/**
 * Move `draggedId` to sit immediately before `targetId` within their shared
 * sibling group (same parent_id + type). Returns a new id list (the full
 * flattened order) or null when the move is not allowed (different groups).
 */
function reorderSiblings(categories: readonly Category[], draggedId: string, targetId: string): string[] | null {
  if (draggedId === targetId) return null;
  const byId = new Map(categories.map((c) => [c.id, c]));
  const dragged = byId.get(draggedId);
  const target = byId.get(targetId);
  if (!dragged || !target) return null;
  // Only reorder within the same sibling group.
  if (dragged.type !== target.type) return null;
  if ((dragged.parent_id ?? '') !== (target.parent_id ?? '')) return null;

  // Reorder the affected sibling group, then rebuild the full flattened order.
  const isSibling = (c: Category) => c.type === dragged.type && (c.parent_id ?? '') === (dragged.parent_id ?? '');
  const siblings = categories.filter(isSibling).map((c) => c.id);
  const without = siblings.filter((id) => id !== draggedId);
  const targetIndex = without.indexOf(targetId);
  without.splice(targetIndex, 0, draggedId);

  // Apply the new sibling order back onto a working category list, then flatten.
  const siblingOrder = new Map(without.map((id, index) => [id, index]));
  const reordered = [...categories].sort((a, b) => {
    if (isSibling(a) && isSibling(b)) return (siblingOrder.get(a.id)! - siblingOrder.get(b.id)!);
    return 0; // preserve original relative order for non-siblings (stable sort)
  });
  return flattenIds(reordered);
}

type CategoryNodeProps = {
  readonly node: CategoryTreeNode;
  readonly collapsed: ReadonlySet<string>;
  readonly onToggle: (id: string) => void;
  readonly onDelete: (category: Category) => void;
  readonly draggable: boolean;
  readonly draggingId: string | null;
  readonly onDragStart: (id: string) => void;
  readonly onDragEnd: () => void;
  readonly onDropOn: (targetId: string) => void;
};

function CategoryNode({ node, collapsed, onToggle, onDelete, draggable, draggingId, onDragStart, onDragEnd, onDropOn }: CategoryNodeProps) {
  const { category, children, depth } = node;
  const childCount = children.length;
  const hasChildren = childCount > 0;
  const isCollapsed = collapsed.has(category.id);
  const canNest = depth < MAX_DEPTH;
  const isRoot = depth === 0;
  const isDragging = draggingId === category.id;

  const handleDragOver = (event: DragEvent) => {
    if (draggingId && draggingId !== category.id) event.preventDefault();
  };
  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    if (draggingId && draggingId !== category.id) onDropOn(category.id);
  };

  return (
    <div className="category-node" data-tree-depth={depth}>
      <div
        className={`category-node-row${draggable ? ' has-drag' : ''}${isDragging ? ' is-dragging' : ''}`}
        onDragOver={draggable ? handleDragOver : undefined}
        onDrop={draggable ? handleDrop : undefined}
      >
        {draggable ? (
          <button
            type="button"
            className="category-drag-handle"
            aria-label={`Ubah urutan ${category.name}`}
            title="Tahan lalu geser untuk mengubah urutan"
            draggable
            onDragStart={() => onDragStart(category.id)}
            onDragEnd={onDragEnd}
          >
            <AppIcon name="more" />
          </button>
        ) : null}
        <button
          type="button"
          className={`category-node-toggle ${hasChildren ? '' : 'is-leaf'}`}
          data-collapsed={hasChildren && isCollapsed ? 'true' : undefined}
          onClick={hasChildren ? () => onToggle(category.id) : undefined}
          aria-expanded={hasChildren ? !isCollapsed : undefined}
          aria-label={hasChildren ? (isCollapsed ? 'Buka subkategori' : 'Tutup subkategori') : undefined}
          disabled={!hasChildren}
        >
          {hasChildren ? <AppIcon name="back" className="chevron" /> : null}
        </button>
        {(() => {
          const accent = itemAccentVars(category.color);
          return (
            <div className={accent ? 'category-icon has-accent' : `category-icon ${category.type === 'income' ? 'green' : 'orange'}`} style={accent}>
              <CategoryIcon icon={category.icon} type={category.type} />
            </div>
          );
        })()}
        <div className="category-node-main">
          <div className="category-node-title-row">
            <strong>{category.name}</strong>
            {hasChildren ? <span className="category-sub-hint">{childCountLabel(childCount)}</span> : null}
          </div>
          <span className="category-node-meta">
            {isRoot ? 'Kategori utama' : depth === 1 ? 'Subkategori' : 'Sub-subkategori'}
          </span>
        </div>
        <Badge tone={category.type === 'income' ? 'green' : 'orange'}>{categoryTypeLabels[category.type]}</Badge>
        <div className="category-node-actions">
          {canNest ? (
            <Button
              size="icon"
              to={`/categories/new?parent_id=${category.id}&type=${category.type}`}
              aria-label={`Tambah subkategori di bawah ${category.name}`}
              title="Tambah subkategori"
            >
              <AppIcon name="add" />
            </Button>
          ) : null}
          <Button size="icon" to={`/categories/${category.id}/edit`} aria-label={`Edit ${category.name}`} title="Edit">
            <AppIcon name="edit" />
          </Button>
          <Button
            size="icon"
            variant="danger"
            onClick={() => onDelete(category)}
            aria-label={`Hapus ${category.name}`}
            title="Hapus"
          >
            <AppIcon name="delete" />
          </Button>
        </div>
      </div>
      {hasChildren && !isCollapsed ? (
        <div className="category-node-children">
          {children.map((child) => (
            <CategoryNode
              key={child.category.id}
              node={child}
              collapsed={collapsed}
              onToggle={onToggle}
              onDelete={onDelete}
              draggable={draggable}
              draggingId={draggingId}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDropOn={onDropOn}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CategoryTree({ categories, onDelete, onReorder }: CategoryTreeProps) {
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(() => new Set());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const draggable = Boolean(onReorder);

  const toggle = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDropOn = (targetId: string) => {
    if (!draggingId || !onReorder) return;
    const ids = reorderSiblings(categories, draggingId, targetId);
    setDraggingId(null);
    if (ids) onReorder(ids);
  };

  const groups = CATEGORY_TREE_GROUPS.map((group) => ({
    group,
    nodes: buildCategoryTree(categories, group.type),
  })).filter(({ nodes }) => nodes.length > 0);

  return (
    <div className={`category-tree ${groups.length === 1 ? 'single' : ''}`} aria-label="Susunan kategori">
      {groups.map(({ group, nodes }) => (
        <section className="category-tree-section" key={group.type}>
          <div className="category-tree-section-head">
            <div className={`category-icon ${group.iconClass}`}>
              <AppIcon name="categories" />
            </div>
            <div>
              <h4>{categoryTypeLabels[group.type]}</h4>
              <p>{nodes.length} kategori utama · {countNodes(nodes)} total</p>
            </div>
            <Button size="small" to={`/categories/new?type=${group.type}`}>
              <AppIcon name="add" /> Tambah
            </Button>
          </div>
          <div className="category-tree-branches">
            {nodes.map((node) => (
              <CategoryNode
                key={node.category.id}
                node={node}
                collapsed={collapsed}
                onToggle={toggle}
                onDelete={onDelete}
                draggable={draggable}
                draggingId={draggingId}
                onDragStart={setDraggingId}
                onDragEnd={() => setDraggingId(null)}
                onDropOn={handleDropOn}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
