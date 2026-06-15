import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { activityEvents } from '../../data/mockReporting';
import { severityTone } from '../../components/reports/ReportCards';

export function ActivityDetailPage() {
  const { id } = useParams();
  const event = activityEvents.find((item) => item.id === id) ?? activityEvents[0];
  return <AppLayout title="Activity Detail" description="Detail audit trail aktivitas."><div className="dashboard-page grid-stack"><section className="app-hero-card dashboard-hero"><div><Badge>● {event.module}</Badge><h2>{event.action}</h2><p>{event.description}</p></div><div className="app-hero-actions"><Button to="/activities">Back</Button><Button to="/system-logs" variant="primary"><AppIcon name="list" /> System Logs</Button></div></section><Card className="panel-card"><div className="metric-list compact-metrics"><div className="metric-cell"><span>Actor</span><strong>{event.actor}</strong><small>Who triggered it</small></div><div className="metric-cell"><span>Module</span><strong>{event.module}</strong><small>Feature area</small></div><div className="metric-cell"><span>Time</span><strong>{event.timestamp}</strong><small>Local time</small></div><div className="metric-cell"><span>Severity</span><strong><Badge tone={severityTone(event.severity)}>{event.severity}</Badge></strong><small>Audit level</small></div></div></Card></div></AppLayout>;
}
