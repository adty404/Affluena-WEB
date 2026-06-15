import type { Category } from '../../types/category';
import { Amount } from '../finance/Amount';
import { Badge } from '../ui/Badge';

type CategoryTreeProps = { categories: Category[] };

function CategoryNode({ category, level = 0 }: { category: Category; level?: number }) {
  return (
    <div className="category-node" style={{ marginLeft: level * 18 }}>
      <div className="category-node-row">
        <div className={`category-icon ${category.color}`}>{category.icon}</div>
        <div className="category-node-main">
          <strong>{category.name}</strong>
          <span>{category.transactionCount} transactions · <Amount value={category.monthlyUsage} /></span>
        </div>
        <Badge tone={category.type === 'income' ? 'green' : 'orange'}>{category.type}</Badge>
      </div>
      {category.children?.map((child) => <CategoryNode key={child.id} category={child} level={level + 1} />)}
    </div>
  );
}

export function CategoryTree({ categories }: CategoryTreeProps) {
  return <div className="category-tree">{categories.map((category) => <CategoryNode key={category.id} category={category} />)}</div>;
}
