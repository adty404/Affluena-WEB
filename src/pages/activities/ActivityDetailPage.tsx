import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { severityTone } from '../../components/reports/ReportCards';
import { useActivity } from '../../hooks/useActivity';

function getSeverity(entityType: string): 'info' | 'success' | 'warning' | 'danger' {
  if (entityType === 'RECURRING') return 'success';
  if (entityType === 'BUDGET') return 'warning';
  if (entityType === 'DEBT') return 'danger';
  return 'info';
}

export function ActivityDetailPage() {
  const { id } = useParams();
  const { data: event, isLoading } = useActivity(id ?? '');

  if (isLoading || !event) {
    return (
      <AppLayout title="Activity Detail" description="Detail audit trail aktivitas.">
        <div className="dashboard-page grid-stack">
          <div className="empty-state">Memuat aktivitas...</div>
        </div>
      </AppLayout>
    );
  }

  const severity = getSeverity(event.entity_type);

  return <AppLayout title="Activity Detail" description="Detail audit trail aktivitas."><div className="dashboard-page grid-stack"><section className="app-hero-card dashboard-hero"><div><Badge>● {event.entity_type}</Badge><h2>{event.action_type}</h2><p>{event.description}</p></div><div className="app-hero-actions"><Button to="/activities">Back</Button><Button to="/system-logs" variant="primary"><AppIcon name="list" /> System Logs</Button></div></section><Card className="panel-card"><div className="metric-list compact-metrics"><div className="metric-cell"><span>Actor</span><strong>{event.user_id || 'System'}</strong><small>Who triggered it</small></div><div className="metric-cell"><span>Module</span><strong>{event.entity_type}</strong><small>Feature area</small></div><div className="metric-cell"><span>Time</span><strong>{new Date(event.created_at).toLocaleString('id-ID')}</strong><small>Local time</small></div><div className="metric-cell"><span>Severity</span><strong><Badge tone={severityTone(severity)}>{severity}</Badge></strong><small>Audit level</small></div></div></Card></div></AppLayout>;
}
