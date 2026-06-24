import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { severityTone } from '../../components/reports/ReportCards';
import { actorLabel, formatTimestamp, humanizeAction, humanizeEntity, relativeTime, shortRef } from '../../lib/auditLabels';
import { useActivity } from '../../hooks/useActivity';

function getSeverity(entityType: string): 'info' | 'success' | 'warning' | 'danger' {
  if (entityType === 'RECURRING') return 'success';
  if (entityType === 'BUDGET') return 'warning';
  if (entityType === 'DEBT') return 'danger';
  return 'info';
}

export function ActivityDetailPage() {
  const { id } = useParams();
  const { data: event, isLoading, isError } = useActivity(id ?? '');

  if (isLoading) {
    return (
      <AppLayout title="Activity Detail" description="Detail audit trail aktivitas.">
        <div className="dashboard-page grid-stack">
          <div className="empty-state"><p>Memuat aktivitas...</p></div>
        </div>
      </AppLayout>
    );
  }

  if (isError || !event) {
    return (
      <AppLayout title="Activity Detail" description="Detail audit trail aktivitas.">
        <div className="dashboard-page grid-stack">
          <div className="empty-state"><p>Aktivitas tidak ditemukan atau gagal dimuat.</p><Button to="/activities">Back to Activity Log</Button></div>
        </div>
      </AppLayout>
    );
  }

  const severity = getSeverity(event.entity_type);
  const title = `${humanizeAction(event.action_type)} ${humanizeEntity(event.entity_type)}`;

  return (
    <AppLayout title="Activity Detail" description="Detail audit trail aktivitas.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>● {humanizeEntity(event.entity_type)}</Badge>
            <h2>{title}</h2>
            <p>{event.description || 'No description provided.'}</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/activities">Back</Button>
            <Button to="/system-logs" variant="primary"><AppIcon name="list" /> System Logs</Button>
          </div>
        </section>
        <Card className="panel-card">
          <div className="metric-list compact-metrics">
            <div className="metric-cell"><span>Actor</span><strong>{actorLabel(event.user_id)}</strong><small>Who triggered it</small></div>
            <div className="metric-cell"><span>Module</span><strong>{humanizeEntity(event.entity_type)}</strong><small>Feature area</small></div>
            <div className="metric-cell"><span>Reference</span><strong>{shortRef(event.entity_id)}</strong><small>Affected record</small></div>
            <div className="metric-cell"><span>Time</span><strong>{formatTimestamp(event.created_at)}</strong><small>{relativeTime(event.created_at)}</small></div>
            <div className="metric-cell"><span>Severity</span><strong><Badge tone={severityTone(severity)}>{severity}</Badge></strong><small>Audit level</small></div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
