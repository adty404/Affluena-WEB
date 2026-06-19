import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { useSystemLog } from '../../hooks/useSystemLog';

export function SystemLogDetailPage() {
  const { id } = useParams();
  const { data: log, isLoading } = useSystemLog(id ?? '');

  if (isLoading || !log) {
    return (
      <AppLayout title="System Log Detail" description="Detailed request metadata for audit and debugging.">
        <div className="dashboard-page grid-stack">
          <div className="empty-state">Memuat log...</div>
        </div>
      </AppLayout>
    );
  }

  return <AppLayout title="System Log Detail" description="Detailed request metadata for audit and debugging."><div className="dashboard-page grid-stack"><section className="app-hero-card dashboard-hero"><div><Badge>● {log.method}</Badge><h2>{log.path}</h2><p>{new Date(log.created_at).toLocaleString('id-ID')}</p></div><div className="app-hero-actions"><Button to="/system-logs">Back</Button><Button to="/exports/new" variant="primary"><AppIcon name="export" /> Export Logs</Button></div></section><Card className="panel-card"><div className="metric-list compact-metrics"><div className="metric-cell"><span>Status</span><strong>{log.status_code}</strong><small>HTTP status</small></div><div className="metric-cell"><span>Latency</span><strong>{log.latency_ms} ms</strong><small>Request duration</small></div><div className="metric-cell"><span>User</span><strong>{log.user_id || 'System'}</strong><small>Actor</small></div><div className="metric-cell"><span>IP Address</span><strong>{log.client_ip}</strong><small>Client IP</small></div></div></Card></div></AppLayout>;
}
