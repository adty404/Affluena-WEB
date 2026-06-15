import type { ReactNode } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AppIcon, type AppIconName } from '../../components/ui/AppIcon';

export function SettingsHero({ badge, title, description, children }: { badge: string; title: string; description: string; children?: ReactNode }) {
  return (
    <section className="app-hero-card dashboard-hero settings-hero">
      <div>
        <Badge>{badge}</Badge>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children ? <div className="app-hero-actions">{children}</div> : null}
    </section>
  );
}

export function SettingsCard({ icon, title, description, children }: { icon: AppIconName; title: string; description: string; children: ReactNode }) {
  return (
    <Card className="panel-card settings-panel">
      <div className="settings-panel-head">
        <div className="settings-icon"><AppIcon name={icon} /></div>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </Card>
  );
}

export function SettingRow({ title, description, aside, children }: { title: string; description: string; aside?: ReactNode; children?: ReactNode }) {
  return (
    <div className="settings-row">
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      {aside ? <div className="settings-row-aside">{aside}</div> : null}
      {children ? <div className="settings-row-extra">{children}</div> : null}
    </div>
  );
}

export function SettingsToggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" className={`settings-toggle ${checked ? 'on' : ''}`} onClick={onChange} aria-pressed={checked} aria-label={label}>
      <span />
    </button>
  );
}

export function SettingMetric({ label, value, tone = 'green' }: { label: string; value: string; tone?: 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'gray' }) {
  return <div className={`setting-metric ${tone}`}><span>{label}</span><strong>{value}</strong></div>;
}
