import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import type { SystemLog } from '../../types/reporting';
import { useSystemLogs } from '../../hooks/useSystemLogs';

const statusTone = (code: number) => code >= 500 ? 'red' : code >= 400 ? 'orange' : code >= 300 ? 'blue' : 'green';

export function SystemLogListPage() {
  const { data, isLoading } = useSystemLogs();
  const systemLogs = data?.logs ?? [];

  return (
    <AppLayout title="System Logs" description="API log viewer for request, latency, user, and module trace.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><Badge>● API Logs</Badge><h2>Pantau request penting untuk audit teknis dan tracing backend.</h2><p>System logs meniru API log middleware dari system map: endpoint, method, status, latency, dan user.</p></div><div className="app-hero-actions"><Button to="/activities">Activity Log</Button><Button to="/exports/new" variant="primary"><AppIcon name="export" /> Export Logs</Button></div></section>
        <Card className="panel-card">
          <div className="panel-head"><div><h3>Request Logs</h3><p>Log terbaru dari modul transaction, debt, recurring, export, dan alert.</p></div></div>
          {isLoading ? (
            <div className="empty-state">Memuat logs...</div>
          ) : systemLogs.length === 0 ? (
            <div className="empty-state">Belum ada logs.</div>
          ) : (
            <DataTable<SystemLog> data={systemLogs} getRowKey={(log) => log.id} columns={[{ key: 'endpoint', header: 'Endpoint', render: (log) => <div className="table-title"><span className="mini-icon neutral"><AppIcon name="list" /></span><strong>{log.path}</strong><small>{log.method}</small></div> }, { key: 'method', header: 'Method', render: (log) => <Badge tone="gray">{log.method}</Badge> }, { key: 'status', header: 'Status', render: (log) => <Badge tone={statusTone(log.status_code)}>{log.status_code}</Badge> }, { key: 'latency', header: 'Latency', align: 'right', render: (log) => `${log.latency_ms} ms` }, { key: 'user', header: 'User', render: (log) => log.user_id || 'System' }, { key: 'action', header: 'Action', render: (log) => <Button to={`/system-logs/${log.id}`} size="small">Open</Button> }]} />
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
