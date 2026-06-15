import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { alertMessages } from '../../data/mockReporting';
import { severityIcon, severityTone } from '../../components/reports/ReportCards';

export function AlertDetailPage() {
  const { id } = useParams();
  const alert = alertMessages.find((item) => item.id === id) ?? alertMessages[0];
  return <AppLayout title="Alert Detail" description="Detail alert, severity, module, dan action."><div className="dashboard-page grid-stack"><section className="app-hero-card dashboard-hero"><div><Badge>● {alert.module}</Badge><h2>{alert.title}</h2><p>{alert.description}</p></div><div className="app-hero-actions"><Button to="/alerts">Back</Button><Button to={alert.actionTo} variant="primary"><AppIcon name={severityIcon(alert.severity)} /> Open Module</Button></div></section><Card className="panel-card"><div className="metric-list compact-metrics"><div className="metric-cell"><span>Severity</span><strong><Badge tone={severityTone(alert.severity)}>{alert.severity}</Badge></strong><small>Alert level</small></div><div className="metric-cell"><span>Status</span><strong>{alert.read ? 'Read' : 'Unread'}</strong><small>Inbox state</small></div><div className="metric-cell"><span>Time</span><strong>{alert.timestamp}</strong><small>Created at</small></div><div className="metric-cell"><span>Module</span><strong>{alert.module}</strong><small>Action scope</small></div></div></Card></div></AppLayout>;
}
