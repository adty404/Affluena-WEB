import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { activityEvents } from '../../data/mockReporting';
import { severityTone } from '../../components/reports/ReportCards';
import type { ActivityEvent } from '../../types/reporting';

export function ActivityListPage() {
  return (
    <AppLayout title="Activity Log" description="Audit trail aktivitas user, scheduler, budget engine, dan export.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><Badge>● Activity</Badge><h2>Semua perubahan penting dapat ditelusuri dari activity log.</h2><p>Activity log membantu audit transaksi, pembayaran debt, recurring run, export, dan goal sharing.</p></div><div className="app-hero-actions"><Button to="/system-logs">System Logs</Button><Button to="/reports" variant="primary">Reports</Button></div></section>
        <Card className="panel-card"><div className="panel-head"><div><h3>Activity Timeline</h3><p>Event terbaru dengan module, actor, dan severity.</p></div></div><DataTable<ActivityEvent> data={activityEvents} getRowKey={(event) => event.id} columns={[{ key: 'action', header: 'Activity', render: (event) => <div className="table-title"><span className={`mini-icon ${event.severity === 'danger' ? 'danger' : event.severity === 'warning' ? 'warning' : event.severity === 'success' ? 'safe' : 'info'}`}><AppIcon name="history" /></span><strong>{event.action}</strong><small>{event.description}</small></div> }, { key: 'actor', header: 'Actor', render: (event) => event.actor }, { key: 'module', header: 'Module', render: (event) => <Badge tone="gray">{event.module}</Badge> }, { key: 'time', header: 'Time', render: (event) => event.timestamp }, { key: 'severity', header: 'Severity', render: (event) => <Badge tone={severityTone(event.severity)}>{event.severity}</Badge> }, { key: 'actionLink', header: 'Action', render: (event) => <Button to={`/activities/${event.id}`} size="small">Open</Button> }]} /></Card>
      </div>
    </AppLayout>
  );
}
