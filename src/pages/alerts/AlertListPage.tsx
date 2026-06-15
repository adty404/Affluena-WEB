import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { alertMessages } from '../../data/mockReporting';
import { ReadStatusBadge, severityIcon, severityTone } from '../../components/reports/ReportCards';

export function AlertListPage() {
  const [readMap, setReadMap] = useState<Record<string, boolean>>(() => Object.fromEntries(alertMessages.map((alert) => [alert.id, alert.read])));
  const markRead = (id: string) => setReadMap((current) => ({ ...current, [id]: true }));
  const markAll = () => setReadMap(Object.fromEntries(alertMessages.map((alert) => [alert.id, true])));
  const unread = alertMessages.filter((alert) => !readMap[alert.id]).length;
  return (
    <AppLayout title="Alert Center" description="Inbox notifikasi finansial dan operasional.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><Badge>● Alerts</Badge><h2>Prioritaskan budget risk, debt overdue, recurring result, dan export readiness.</h2><p>Alert center memiliki read state lokal agar action tidak hanya pajangan.</p></div><div className="app-hero-actions"><Button onClick={markAll} variant="primary"><AppIcon name="success" /> Mark All Read</Button><Button to="/reports">Reports</Button></div></section>
        <section className="stat-grid"><Card className="stat-card"><span>Unread</span><strong>{unread}</strong><small>Needs attention</small></Card><Card className="stat-card blue"><span>Total Alerts</span><strong>{alertMessages.length}</strong><small>Current inbox</small></Card><Card className="stat-card danger-card"><span>Critical</span><strong>{alertMessages.filter((a) => a.severity === 'danger').length}</strong><small>Immediate action</small></Card><Card className="stat-card"><span>Read</span><strong>{alertMessages.length - unread}</strong><small>Handled alerts</small></Card></section>
        <section className="insight-list">
          {alertMessages.map((alert) => (
            <Card className={`alert-message-card ${alert.severity}`} key={alert.id}>
              <div className={`mini-icon ${alert.severity === 'danger' ? 'danger' : alert.severity === 'warning' ? 'warning' : alert.severity === 'success' ? 'safe' : 'info'}`}><AppIcon name={severityIcon(alert.severity)} /></div>
              <div><h3>{alert.title}</h3><p>{alert.description}</p><div className="inline-actions"><Badge tone={severityTone(alert.severity)}>{alert.module}</Badge><ReadStatusBadge read={!!readMap[alert.id]} /><span className="muted-text">{alert.timestamp}</span></div></div>
              <div className="alert-actions"><Button to={`/alerts/${alert.id}`} size="small">Open</Button><Button to={alert.actionTo} size="small">Go to Module</Button><Button onClick={() => markRead(alert.id)} size="small" disabled={readMap[alert.id]}>Mark Read</Button></div>
            </Card>
          ))}
        </section>
      </div>
    </AppLayout>
  );
}
