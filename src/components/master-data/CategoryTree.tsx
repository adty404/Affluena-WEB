import { useState } from 'react';
import type { Category } from '../../types/category';
import { categoryTypeLabels } from '../../schemas/category';
import { AppIcon } from '../ui/AppIcon';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const MAX_DEPTH = 2; // depth index: 0 parent, 1 child, 2 grandchild

type CategoryTreeProps = {
  readonly categories: readonly Category[];
  readonly onDelete: (category: Category) => void;
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

type CategoryNodeProps = {
  readonly node: CategoryTreeNode;
  readonly collapsed: ReadonlySet<string>;
  readonly onToggle: (id: string) => void;
  readonly onDelete: (category: Category) => void;
};

function CategoryNode({ node, collapsed, onToggle, onDelete }: CategoryNodeProps) {
  const { category, children, depth } = node;
  const childCount = children.length;
  const hasChildren = childCount > 0;
  const isCollapsed = collapsed.has(category.id);
  const canNest = depth < MAX_DEPTH;
  const isRoot = depth === 0;

  return (
    <div className="category-node" data-tree-depth={depth}>
      <div className="category-node-row">
        <button
          type="button"
          className={`category-node-toggle ${hasChildren ? '' : 'is-leaf'}`}
          data-collapsed={hasChildren && isCollapsed ? 'true' : undefined}
          onClick={hasChildren ? () => onToggle(category.id) : undefined}
          aria-expanded={hasChildren ? !isCollapsed : undefined}
          aria-label={hasChildren ? (isCollapsed ? 'Expand subcategories' : 'Collapse subcategories') : undefined}
          disabled={!hasChildren}
        >
          {hasChildren ? <AppIcon name="back" className="chevron" /> : null}
        </button>
        <div className={`category-icon ${category.type === 'income' ? 'green' : 'orange'}`}>
          <AppIcon name={isRoot ? 'categories' : 'tags'} />
        </div>
        <div className="category-node-main">
          <div className="category-node-title-row">
            <strong>{category.name}</strong>
            {hasChildren ? <span className="category-sub-hint">{childCountLabel(childCount)}</span> : null}
          </div>
          <span className="category-node-meta">
            {isRoot ? 'Top-level category' : depth === 1 ? 'Subcategory' : 'Sub-subcategory'}
          </span>
        </div>
        <Badge tone={category.type === 'income' ? 'green' : 'orange'}>{categoryTypeLabels[category.type]}</Badge>
        <div className="category-node-actions">
          {canNest ? (
            <Button
              size="icon"
              to={`/categories/new?parent_id=${category.id}&type=${category.type}`}
              aria-label={`Add subcategory under ${category.name}`}
              title="Add subcategory"
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
            aria-label={`Delete ${category.name}`}
            title="Delete"
          >
            <AppIcon name="delete" />
          </Button>
        </div>
      </div>
      {hasChildren && !isCollapsed ? (
        <div className="category-node-children">
          {children.map((child) => (
            <CategoryNode key={child.category.id} node={child} collapsed={collapsed} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CategoryTree({ categories, onDelete }: CategoryTreeProps) {
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(() => new Set());

  const toggle = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const groups = CATEGORY_TREE_GROUPS.map((group) => ({
    group,
    nodes: buildCategoryTree(categories, group.type),
  })).filter(({ nodes }) => nodes.length > 0);

  return (
    <div className={`category-tree ${groups.length === 1 ? 'single' : ''}`} aria-label="Category hierarchy">
      {groups.map(({ group, nodes }) => (
        <section className="category-tree-section" key={group.type}>
          <div className="category-tree-section-head">
            <div className={`category-icon ${group.iconClass}`}>
              <AppIcon name="categories" />
            </div>
            <div>
              <h4>{categoryTypeLabels[group.type]}</h4>
              <p>{nodes.length} parents · {countNodes(nodes)} total</p>
            </div>
            <Button size="small" to={`/categories/new?type=${group.type}`}>
              <AppIcon name="add" /> Add
            </Button>
          </div>
          <div className="category-tree-branches">
            {nodes.map((node) => (
              <CategoryNode key={node.category.id} node={node} collapsed={collapsed} onToggle={toggle} onDelete={onDelete} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
