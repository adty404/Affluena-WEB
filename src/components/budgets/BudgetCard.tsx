import clsx from 'clsx';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AppIcon } from '../ui/AppIcon';
import { Amount } from '../finance/Amount';
import { ProgressBar } from '../finance/ProgressBar';
import { itemAccentVars } from '../finance/ColorPicker';
import type { BudgetSummary } from '../../types/budget';
import { useCategories } from '../../hooks/useCategories';

const statusTone = {
  safe: 'green',
  warning: 'orange',
  exceeded: 'red',
} as const;

const progressTone = {
  safe: 'green',
  warning: 'orange',
  exceeded: 'red',
} as const;

const statusLabel = {
  safe: 'Aman',
  warning: 'Peringatan',
  exceeded: 'Terlampaui',
} as const;

type BudgetCardProps = {
  budget: BudgetSummary;
  featured?: boolean;
};

export function BudgetCard({ budget, featured }: BudgetCardProps) {
  const { data: categoriesData } = useCategories({ type: 'expense' });
  const category = (categoriesData?.categories ?? []).find(c => c.id === budget.category_id);
  const categoryName = category?.name ?? 'Kategori tidak dikenal';
  const categoryIcon = 'categories';

  const usage = budget.usage_percent;
  const remaining = budget.remaining_minor;
  
  let status: 'safe' | 'warning' | 'exceeded' = 'safe';
  if (usage >= 100) status = 'exceeded';
  else if (usage >= 80) status = 'warning';

  // The featured card keeps its dark gradient; the appearance tint only
  // applies to regular cards so status/progress colors stay readable.
  const accentStyle = featured ? undefined : itemAccentVars(budget.color);

  return (
    <article
      className={clsx('budget-card', featured && 'featured', accentStyle && 'has-accent')}
      style={accentStyle}
    >
      <div className="budget-card-head">
        <div className={clsx('finance-icon', status, accentStyle && status === 'safe' && 'has-accent')}><AppIcon name={categoryIcon} /></div>
        <div>
          <strong>{categoryName}</strong>
          <span>{budget.month}</span>
        </div>
        <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>
      </div>
      <div className="budget-limit"><Amount value={budget.limit_minor} /></div>
      <p className="budget-meta">
        Terpakai <Amount value={budget.spent_minor} /> · {remaining >= 0 ? 'Sisa' : 'Lebih'} <Amount value={Math.abs(remaining)} />
      </p>
      <ProgressBar value={usage} tone={progressTone[status]} />
      <div className="budget-card-foot">
        <span>{usage}% terpakai</span>
      </div>
      <div className="card-actions">
        <Button to={`/budgets/${budget.id}`} size="small">Detail</Button>
        <Button to={`/budgets/${budget.id}/edit`} size="small">Edit</Button>
      </div>
    </article>
  );
}
