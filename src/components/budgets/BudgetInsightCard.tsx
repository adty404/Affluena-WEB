import type { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { AppIcon, type AppIconName } from '../ui/AppIcon';

export function BudgetInsightCard({ icon, title, children, tone = 'green' }: { icon: AppIconName; title: string; children: ReactNode; tone?: 'green' | 'blue' | 'orange' | 'red' | 'purple' }) {
  return (
    <Card className="budget-insight-card">
      <div className={`finance-icon ${tone}`}><AppIcon name={icon} /></div>
      <h3>{title}</h3>
      <p>{children}</p>
    </Card>
  );
}
