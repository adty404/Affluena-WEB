import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { severityTone } from '../../components/reports/ReportCards';
import { actorLabel, humanizeAction, humanizeEntity, relativeTime } from '../../lib/auditLabels';
import type { Activity } from '../../types/reporting';
import { useActivities } from '../../hooks/useActivities';

function getSeverity(entityType: string): 'info' | 'success' | 'warning' | 'danger' {
  if (entityType === 'RECURRING') return 'success';
  if (entityType === 'BUDGET') return 'warning';
  if (entityType === 'DEBT') return 'danger';
  return 'info';
}

export function ActivityListPage() {
  const { data, isLoading, isError } = useActivities();
  const activities = data?.data ?? [];

  return (
    <AppLayout title="Activity Log" description="Audit trail aktivitas user, scheduler, budget engine, dan export.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><Badge>● Activity</Badge><h2>Semua perubahan penting dapat ditelusuri dari activity log.</h2><p>Activity log membantu audit transaksi, pembayaran debt, recurring run, export, dan goal sharing.</p></div><div className="app-hero-actions"><Button to="/system-logs">System Logs</Button><Button to="/reports" variant="primary">Reports</Button></div></section>
        <Card className="panel-card">
          <div className="panel-head"><div><h3>Activity Timeline</h3><p>Event terbaru dengan module, actor, dan severity.</p></div></div>
          {isLoading ? (
            <div className="empty-state"><p>Memuat aktivitas...</p></div>
          ) : isError ? (
            <div className="empty-state"><p>Gagal memuat aktivitas. Coba muat ulang halaman.</p></div>
          ) : activities.length === 0 ? (
            <div className="empty-state"><p>Belum ada aktivitas.</p></div>
          ) : (
            <DataTable<Activity>
              data={activities}
              getRowKey={(event) => event.id}
              columns={[
                { key: 'action', header: 'Activity', render: (event) => {
                  const severity = getSeverity(event.entity_type);
                  const title = `${humanizeAction(event.action_type)} ${humanizeEntity(event.entity_type)}`;
                  return <div className="table-title"><span className={`mini-icon ${severity === 'danger' ? 'danger' : severity === 'warning' ? 'warning' : severity === 'success' ? 'safe' : 'info'}`}><AppIcon name="history" /></span><strong>{title}</strong><small>{event.description || 'No description'}</small></div>
                } },
                { key: 'actor', header: 'Actor', render: (event) => actorLabel(event.user_id) },
                { key: 'module', header: 'Module', render: (event) => <Badge tone="gray">{humanizeEntity(event.entity_type)}</Badge> },
                { key: 'time', header: 'Time', render: (event) => relativeTime(event.created_at) },
                { key: 'severity', header: 'Severity', render: (event) => {
                  const severity = getSeverity(event.entity_type);
                  return <Badge tone={severityTone(severity)}>{severity}</Badge>
                } },
                { key: 'actionLink', header: 'Action', render: (event) => <Button to={`/activities/${event.id}`} size="small">Open</Button> }
              ]}
            />
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
