import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { useAlert } from '../../hooks/useAlert';
import { severityIcon, severityTone } from '../../components/reports/ReportCards';
import { formatTimestamp, relativeTime } from '../../lib/auditLabels';

export function AlertDetailPage() {
  const { id } = useParams();
  const { data: alert, isLoading, isError } = useAlert(id ?? '');

  if (isLoading) {
    return <AppLayout title="Alert Detail" description="Detail alert, severity, module, dan action."><div className="dashboard-page grid-stack"><div className="empty-state"><p>Loading alert...</p></div></div></AppLayout>;
  }

  if (isError || !alert) {
    return <AppLayout title="Alert Detail" description="Detail alert, severity, module, dan action."><div className="dashboard-page grid-stack"><div className="empty-state"><p>Alert not found or failed to load.</p><Button to="/alerts">Back to Alerts</Button></div></div></AppLayout>;
  }

  return <AppLayout title="Alert Detail" description="Detail alert, severity, module, dan action."><div className="dashboard-page grid-stack"><section className="app-hero-card dashboard-hero"><div><Badge>● {alert.module}</Badge><h2>{alert.title}</h2><p>{alert.description}</p></div><div className="app-hero-actions"><Button to="/alerts">Back</Button><Button to={alert.action_path} variant="primary"><AppIcon name={severityIcon(alert.severity)} /> Open Module</Button></div></section><Card className="panel-card"><div className="metric-list compact-metrics"><div className="metric-cell"><span>Severity</span><strong><Badge tone={severityTone(alert.severity)}>{alert.severity}</Badge></strong><small>Alert level</small></div><div className="metric-cell"><span>Type</span><strong>{alert.type}</strong><small>Alert category</small></div><div className="metric-cell"><span>Time</span><strong>{formatTimestamp(alert.created_at)}</strong><small>{relativeTime(alert.created_at)}</small></div><div className="metric-cell"><span>Module</span><strong>{alert.module}</strong><small>Action scope</small></div></div></Card></div></AppLayout>;
}
