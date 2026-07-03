import { Badge } from '../ui/Badge';
import { AppIcon } from '../ui/AppIcon';
import type { BudgetAlert } from '../../types/budget';

const severityTone = {
  warning: 'orange',
  danger: 'red',
} as const;

export function BudgetAlertItem({ alert }: { alert: BudgetAlert }) {
  return (
    <article className={`alert-item ${alert.severity}`}>
      <div className="alert-icon"><AppIcon name={alert.severity === 'danger' ? 'warning' : 'budgetAlert'} /></div>
      <div>
        <strong>{alert.title}</strong>
        <p>{alert.message}</p>
        <span>{alert.notified_at ?? 'Baru saja'}</span>
      </div>
      <Badge tone={severityTone[alert.severity]}>{alert.threshold}%</Badge>
    </article>
  );
}
