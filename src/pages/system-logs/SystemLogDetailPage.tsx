import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { systemLogs } from '../../data/mockReporting';

export function SystemLogDetailPage() {
  const { id } = useParams();
  const log = systemLogs.find((item) => item.id === id) ?? systemLogs[0];
  return <AppLayout title="System Log Detail" description="Detailed request metadata for audit and debugging."><div className="dashboard-page grid-stack"><section className="app-hero-card dashboard-hero"><div><Badge>● {log.method}</Badge><h2>{log.endpoint}</h2><p>{log.module} · {log.timestamp}</p></div><div className="app-hero-actions"><Button to="/system-logs">Back</Button><Button to="/exports/new" variant="primary"><AppIcon name="export" /> Export Logs</Button></div></section><Card className="panel-card"><div className="metric-list compact-metrics"><div className="metric-cell"><span>Status</span><strong>{log.statusCode}</strong><small>HTTP status</small></div><div className="metric-cell"><span>Latency</span><strong>{log.latencyMs} ms</strong><small>Request duration</small></div><div className="metric-cell"><span>User</span><strong>{log.user}</strong><small>Actor</small></div><div className="metric-cell"><span>Module</span><strong>{log.module}</strong><small>Backend scope</small></div></div></Card></div></AppLayout>;
}
