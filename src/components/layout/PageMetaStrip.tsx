import type { ReactNode } from 'react';
import { Button } from '../ui/Button';
import type { AppIconName } from '../ui/AppIcon';
import { AppIcon } from '../ui/AppIcon';

type MetaItem = {
  label: string;
  value: ReactNode;
  icon?: AppIconName;
};

type MetaAction = {
  label: string;
  to?: string;
  onClick?: () => void;
  icon?: AppIconName;
  variant?: 'default' | 'primary' | 'ghost' | 'danger';
};

type PageMetaStripProps = {
  title: string;
  items: MetaItem[];
  actions?: MetaAction[];
};

export function PageMetaStrip({ title, items, actions = [] }: PageMetaStripProps) {
  return (
    <section className="page-meta-strip" data-testid="page-meta-strip" aria-label={title}>
      <div className="page-meta-items">
        {items.map((item) => (
          <div className="page-meta-item" key={item.label}>
            {item.icon ? <span className="page-meta-icon"><AppIcon name={item.icon} /></span> : null}
            <div>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          </div>
        ))}
      </div>
      {actions.length > 0 ? (
        <div className="page-meta-actions">
          {actions.map((action) =>
            action.to ? (
              <Button key={`${action.to}-${action.label}`} to={action.to} size="small" variant={action.variant}>
                {action.icon ? <AppIcon name={action.icon} /> : null}
                {action.label}
              </Button>
            ) : (
              <Button key={`action-${action.label}`} onClick={action.onClick} size="small" variant={action.variant}>
                {action.icon ? <AppIcon name={action.icon} /> : null}
                {action.label}
              </Button>
            ),
          )}
        </div>
      ) : null}
    </section>
  );
}
