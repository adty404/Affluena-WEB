import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { useAlerts } from '../../hooks/useAlerts';
import { ReadStatusBadge, severityIcon, severityTone } from '../../components/reports/ReportCards';
import { relativeTime } from '../../lib/auditLabels';

export function AlertListPage() {
  const { data, isLoading, isError } = useAlerts();
  const alerts = data?.alerts ?? [];

  const [readMap, setReadMap] = useState<Record<string, boolean>>({});
  const markRead = (id: string) => setReadMap((current) => ({ ...current, [id]: true }));
  const markAll = () => setReadMap(Object.fromEntries(alerts.map((alert) => [alert.id, true])));
  const unread = alerts.filter((alert) => !readMap[alert.id]).length;

  return (
    <AppLayout title="Pusat Pemberitahuan" description="Kotak masuk pemberitahuan keuangan dan operasional.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><Badge>● Pemberitahuan</Badge><h2>Prioritaskan risiko anggaran, utang jatuh tempo, hasil transaksi berulang, dan ekspor yang siap.</h2><p>Tandai yang sudah dibaca supaya kamu bisa fokus ke yang penting.</p></div><div className="app-hero-actions"><Button onClick={markAll} variant="primary"><AppIcon name="success" /> Tandai Semua Dibaca</Button><Button to="/reports">Laporan</Button></div></section>

        {isLoading ? (
          <div className="empty-state"><p>Memuat pemberitahuan...</p></div>
        ) : isError ? (
          <div className="empty-state"><p>Gagal memuat pemberitahuan.</p></div>
        ) : alerts.length === 0 ? (
          <div className="empty-state"><p>Belum ada pemberitahuan.</p></div>
        ) : (
          <>
            <section className="stat-grid"><Card className="stat-card"><span>Belum Dibaca</span><strong>{unread}</strong><small>Perlu perhatian</small></Card><Card className="stat-card blue"><span>Total Pemberitahuan</span><strong>{alerts.length}</strong><small>Kotak masuk saat ini</small></Card><Card className="stat-card danger-card"><span>Kritis</span><strong>{alerts.filter((a) => a.severity === 'danger').length}</strong><small>Perlu tindakan segera</small></Card><Card className="stat-card"><span>Sudah Dibaca</span><strong>{alerts.length - unread}</strong><small>Sudah ditangani</small></Card></section>
            <section className="insight-list">
              {alerts.map((alert) => (
                <Card className={`alert-message-card ${alert.severity}`} key={alert.id}>
                  <div className={`mini-icon ${alert.severity === 'danger' ? 'danger' : alert.severity === 'warning' ? 'warning' : alert.severity === 'success' ? 'safe' : 'info'}`}><AppIcon name={severityIcon(alert.severity)} /></div>
                  <div><h3>{alert.title}</h3><p>{alert.description}</p><div className="inline-actions"><Badge tone={severityTone(alert.severity)}>{alert.module}</Badge><ReadStatusBadge read={!!readMap[alert.id]} /><span className="muted-text">{relativeTime(alert.created_at)}</span></div></div>
                  <div className="alert-actions"><Button to={`/alerts/${alert.id}`} size="small">Buka</Button><Button to={alert.action_path} size="small">Buka Modul</Button><Button onClick={() => markRead(alert.id)} size="small" disabled={readMap[alert.id]}>Tandai Dibaca</Button></div>
                </Card>
              ))}
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}
