import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AppIcon } from '../ui/AppIcon';
import { Amount } from '../finance/Amount';
import { ProgressBar } from '../finance/ProgressBar';
import type { Budget } from '../../types/budget';

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

type BudgetCardProps = {
  budget: Budget;
  featured?: boolean;
};

export function BudgetCard({ budget, featured }: BudgetCardProps) {
  const usage = Math.round((budget.actual / budget.limit) * 100);
  const remaining = budget.limit - budget.actual;

  return (
    <article className={`budget-card ${featured ? 'featured' : ''}`}>
      <div className="budget-card-head">
        <div className={`finance-icon ${budget.status}`}><AppIcon name={budget.categoryIcon} /></div>
        <div>
          <strong>{budget.categoryName}</strong>
          <span>{budget.period} · {budget.periodType}</span>
        </div>
        <Badge tone={statusTone[budget.status]}>{budget.status}</Badge>
      </div>
      <div className="budget-limit"><Amount value={budget.limit} /></div>
      <p className="budget-meta">
        Spent <Amount value={budget.actual} /> · {remaining >= 0 ? 'Remaining' : 'Over'} <Amount value={Math.abs(remaining)} />
      </p>
      <ProgressBar value={usage} tone={progressTone[budget.status]} />
      <div className="budget-card-foot">
        <span>{usage}% used</span>
        <span>Forecast <Amount value={budget.forecast} /></span>
      </div>
      <div className="card-actions">
        <Button to={`/budgets/${budget.id}`} size="small">Detail</Button>
        <Button to={`/budgets/${budget.id}/edit`} size="small">Edit</Button>
      </div>
    </article>
  );
}
