import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AppIcon, type AppIconName } from '../ui/AppIcon';
import { Amount } from '../finance/Amount';
import type { ReportMetric, ReportRow, Severity } from '../../types/reporting';

export const statusTone = (status: ReportRow['status']) => status === 'critical' ? 'red' : status === 'watch' ? 'orange' : status === 'growth' ? 'blue' : 'green';
export const severityTone = (severity: Severity) => severity === 'danger' ? 'red' : severity === 'warning' ? 'orange' : severity === 'success' ? 'green' : 'blue';
export const severityIcon = (severity: Severity): AppIconName => severity === 'danger' || severity === 'warning' ? 'warning' : severity === 'success' ? 'success' : 'chart';

export function ReportMetricCard({ metric }: { metric: ReportMetric }) {
  return (
    <Card className={`stat-card ${metric.tone === 'blue' ? 'blue' : metric.tone === 'purple' ? 'purple' : metric.tone === 'orange' ? 'warning-card' : metric.tone === 'red' ? 'danger-card' : ''}`}>
      <span>{metric.label}</span>
      <strong><Amount value={metric.value_minor} type={metric.tone === 'red' || metric.tone === 'orange' ? 'expense' : 'income'} /></strong>
      <small>{metric.helper}</small>
    </Card>
  );
}

export function ReportShortcutCard({ title, description, icon, to, tone = 'blue' }: { title: string; description: string; icon: AppIconName; to: string; tone?: 'green' | 'blue' | 'orange' | 'purple' | 'gray' | 'red' }) {
  return (
    <Card className="report-shortcut-card">
      <div className={`mini-icon ${tone === 'red' ? 'danger' : tone === 'orange' ? 'warning' : tone === 'purple' ? 'purple' : tone === 'gray' ? 'neutral' : tone === 'green' ? 'safe' : 'info'}`}><AppIcon name={icon} /></div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <Button to={to} size="small">Open</Button>
    </Card>
  );
}

export function InsightCard({ title, description, severity, actionTo }: { title: string; description: string; severity: Severity; actionTo: string }) {
  return (
    <Card className={`insight-card ${severity}`}>
      <div className={`mini-icon ${severity === 'danger' ? 'danger' : severity === 'warning' ? 'warning' : severity === 'success' ? 'safe' : 'info'}`}><AppIcon name={severityIcon(severity)} /></div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <Button to={actionTo} size="small">Review</Button>
    </Card>
  );
}

export function ReportBarChart({ rows }: { rows: ReportRow[] }) {
  const max = Math.max(...rows.map((row) => row.amount_minor), 1);
  return (
    <div className="report-bars" aria-label="Report bar chart">
      {rows.map((row) => {
        const width = Math.max(12, Math.round((row.amount_minor / max) * 100));
        return (
          <div className="report-bar-row" key={row.id}>
            <span>{row.name}</span>
            <div className="report-bar-track"><i className={row.status} style={{ width: `${width}%` }} /></div>
            <strong><Amount value={row.amount_minor} /></strong>
          </div>
        );
      })}
    </div>
  );
}

export function ReadStatusBadge({ read }: { read: boolean }) {
  return <Badge tone={read ? 'gray' : 'blue'}>{read ? 'Read' : 'Unread'}</Badge>;
}
