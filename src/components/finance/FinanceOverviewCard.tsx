
import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AppIcon, type AppIconName } from '../ui/AppIcon';
import { Amount } from './Amount';
import { ProgressBar } from './ProgressBar';
import { itemAccentVars } from './ColorPicker';

type BadgeTone = 'green' | 'blue' | 'orange' | 'purple' | 'gray' | 'red';
type AmountTone = 'income' | 'expense' | 'neutral';

type FinanceOverviewCardProps = {
  title: string;
  subtitle: string;
  icon: AppIconName;
  iconTone?: 'safe' | 'danger' | 'info' | 'warning' | 'purple' | 'neutral';
  badge: string;
  badgeTone?: BadgeTone;
  amount: number;
  amountType?: AmountTone;
  description?: ReactNode;
  progress?: number;
  progressTone?: 'green' | 'blue' | 'orange' | 'red' | 'purple';
  metaLeft?: string;
  metaRight?: string;
  actions: ReactNode;
  /** Item appearance color (`#RRGGBB`); tints the card + icon chip when set. */
  accentColor?: string;
};

export function FinanceOverviewCard({
  title,
  subtitle,
  icon,
  iconTone = 'info',
  badge,
  badgeTone = 'blue',
  amount,
  amountType = 'neutral',
  description,
  progress,
  progressTone = 'green',
  metaLeft,
  metaRight,
  actions,
  accentColor,
}: FinanceOverviewCardProps) {
  const accentStyle = itemAccentVars(accentColor);
  return (
    <Card
      as="article"
      className={clsx('finance-overview-card', accentStyle && 'has-accent')}
      style={accentStyle}
    >
      <header className="finance-overview-head">
        <span className={clsx('mini-icon', iconTone, accentStyle && 'has-accent')}><AppIcon name={icon} /></span>
        <div className="finance-overview-title">
          <strong title={title}>{title}</strong>
          <small title={subtitle}>{subtitle}</small>
        </div>
        <Badge tone={badgeTone}>{badge}</Badge>
      </header>

      <div className="finance-overview-amount"><Amount value={amount} type={amountType} /></div>

      {description && <p className="finance-overview-desc">{description}</p>}

      {typeof progress === 'number' && (
        <div className="finance-overview-progress">
          <ProgressBar value={progress} tone={progressTone} />
        </div>
      )}

      {(metaLeft || metaRight) && (
        <div className="finance-overview-meta">
          <span>{metaLeft}</span>
          <span>{metaRight}</span>
        </div>
      )}

      <footer className="finance-overview-actions">{actions}</footer>
    </Card>
  );
}
