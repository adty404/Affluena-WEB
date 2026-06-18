import type { Category } from '../../types/category';
import { Badge } from '../ui/Badge';

type CategoryTreeProps = { categories: Category[] };

function CategoryNode({ category, level = 0 }: { category: Category; level?: number }) {
  const children = category.parent_id ? [] : []; // Client must filter children from flat list
  return (
    <div className="category-node" style={{ marginLeft: level * 18 }}>
      <div className="category-node-row">
        <div className={`category-icon ${category.type === 'income' ? 'income' : 'expense'}`}>
          {category.type === 'income' ? '+' : '-'}
        </div>
        <div className="category-node-main">
          <strong>{category.name}</strong>
        </div>
        <Badge tone={category.type === 'income' ? 'green' : 'orange'}>{category.type}</Badge>
      </div>
    </div>
  );
}

export function CategoryTree({ categories }: CategoryTreeProps) {
  return <div className="category-tree">{categories.map((category) => <CategoryNode key={category.id} category={category} />)}</div>;
}
