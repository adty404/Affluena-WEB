import type { Category } from '../../types/category';
import { categoryTypeLabels } from '../../schemas/category';
import { AppIcon } from '../ui/AppIcon';
import { Badge } from '../ui/Badge';

type CategoryTreeProps = { readonly categories: readonly Category[] };

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

const DEPTH_LABELS = ['Parent', 'Child', 'Grandchild'] as const;

function getDepthLabel(depth: number): string {
  return DEPTH_LABELS[depth] ?? `Level ${depth + 1}`;
}

function getChildLabel(childCount: number): string {
  if (childCount === 0) return 'Tidak ada child';
  if (childCount === 1) return '1 child langsung';
  return `${childCount} child langsung`;
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

function CategoryNode({ node }: { node: CategoryTreeNode }) {
  const { category, children, depth } = node;
  const childCount = children.length;

  return (
    <div className="category-node" data-tree-depth={depth}>
      <div className="category-node-row">
        <div className={`category-icon ${category.type === 'income' ? 'green' : 'orange'}`}>
          <AppIcon name="categories" />
        </div>
        <div className="category-node-main">
          <div className="category-node-title-row">
            <strong>{category.name}</strong>
            <span className="category-depth-pill">{getDepthLabel(depth)}</span>
          </div>
          <span>{getChildLabel(childCount)}</span>
        </div>
        <Badge tone={category.type === 'income' ? 'green' : 'orange'}>{categoryTypeLabels[category.type]}</Badge>
      </div>
      {childCount > 0 ? (
        <div className="category-node-children">
          {children.map((child) => <CategoryNode key={child.category.id} node={child} />)}
        </div>
      ) : null}
    </div>
  );
}

export function CategoryTree({ categories }: CategoryTreeProps) {
  const groups = CATEGORY_TREE_GROUPS
    .map((group) => ({
      group,
      nodes: buildCategoryTree(categories, group.type),
    }))
    .filter(({ nodes }) => nodes.length > 0);

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
              <p>{nodes.length} parent, {countNodes(nodes)} total kategori</p>
            </div>
            <Badge tone={group.tone}>{group.type}</Badge>
          </div>
          <div className="category-tree-branches">
            {nodes.map((node) => <CategoryNode key={node.category.id} node={node} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
