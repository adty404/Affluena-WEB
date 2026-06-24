import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { actorLabel, formatTimestamp, humanizeUserAgent, relativeTime } from '../../lib/auditLabels';
import { useSystemLog } from '../../hooks/useSystemLog';

const statusTone = (code: number) => code >= 500 ? 'red' : code >= 400 ? 'orange' : code >= 300 ? 'blue' : 'green';

export function SystemLogDetailPage() {
  const { id } = useParams();
  const { data: log, isLoading, isError } = useSystemLog(id ?? '');

  if (isLoading) {
    return (
      <AppLayout title="System Log Detail" description="Detailed request metadata for audit and debugging.">
        <div className="dashboard-page grid-stack">
          <div className="empty-state"><p>Memuat log...</p></div>
        </div>
      </AppLayout>
    );
  }

  if (isError || !log) {
    return (
      <AppLayout title="System Log Detail" description="Detailed request metadata for audit and debugging.">
        <div className="dashboard-page grid-stack">
          <div className="empty-state"><p>Log tidak ditemukan atau gagal dimuat.</p><Button to="/system-logs">Back to System Logs</Button></div>
        </div>
      </AppLayout>
    );
  }

  const hasPayload = log.request_payload || log.response_payload;

  return (
    <AppLayout title="System Log Detail" description="Detailed request metadata for audit and debugging.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge tone={statusTone(log.status_code)}>● {log.method} · {log.status_code}</Badge>
            <h2>{log.path}</h2>
            <p>{formatTimestamp(log.created_at)} · {relativeTime(log.created_at)}</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/system-logs">Back</Button>
            <Button to="/activities" variant="primary"><AppIcon name="history" /> Activity Log</Button>
          </div>
        </section>
        <Card className="panel-card">
          <div className="metric-list compact-metrics">
            <div className="metric-cell"><span>Status</span><strong>{log.status_code}</strong><small>HTTP status</small></div>
            <div className="metric-cell"><span>Latency</span><strong>{log.latency_ms} ms</strong><small>Request duration</small></div>
            <div className="metric-cell"><span>User</span><strong>{actorLabel(log.user_id)}</strong><small>Actor</small></div>
            <div className="metric-cell"><span>IP Address</span><strong>{log.client_ip || '—'}</strong><small>Client IP</small></div>
            <div className="metric-cell"><span>Client</span><strong>{humanizeUserAgent(log.user_agent)}</strong><small>User agent</small></div>
            <div className="metric-cell"><span>Method</span><strong>{log.method}</strong><small>HTTP method</small></div>
          </div>
        </Card>
        {hasPayload ? (
          <section className="dashboard-grid two-col">
            <Card className="panel-card">
              <div className="panel-head"><div><h3>Request Payload</h3><p>Body yang dikirim ke endpoint.</p></div></div>
              <pre className="code-block">{log.request_payload ? JSON.stringify(log.request_payload, null, 2) : 'No request body'}</pre>
            </Card>
            <Card className="panel-card">
              <div className="panel-head"><div><h3>Response Payload</h3><p>Body yang dikembalikan endpoint.</p></div></div>
              <pre className="code-block">{log.response_payload ? JSON.stringify(log.response_payload, null, 2) : 'No response body'}</pre>
            </Card>
          </section>
        ) : null}
      </div>
    </AppLayout>
  );
}
