import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { useToast } from '../../components/ui/Toast';
import { useAlerts } from '../../hooks/useAlerts';
import { ReadStatusBadge, severityIcon, severityTone } from '../../components/reports/ReportCards';
import { relativeTime } from '../../lib/auditLabels';

export function AlertListPage() {
  const { data, isLoading, isError, refetch } = useAlerts();
  const { showToast } = useToast();
  const alerts = data?.alerts ?? [];

  const [readMap, setReadMap] = useState<Record<string, boolean>>({});
  const markRead = (id: string) => setReadMap((current) => ({ ...current, [id]: true }));
  const unread = alerts.filter((alert) => !readMap[alert.id]).length;
  const markAll = () => {
    if (unread === 0) return;
    setReadMap(Object.fromEntries(alerts.map((alert) => [alert.id, true])));
    showToast('Semua pemberitahuan ditandai sudah dibaca.');
  };

  return (
    <AppLayout title="Pusat Pemberitahuan" description="Kotak masuk pemberitahuan keuangan dan operasional.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><Badge>Pemberitahuan</Badge><h2>Prioritaskan risiko anggaran, utang jatuh tempo, hasil transaksi berulang, dan ekspor yang siap.</h2><p>Tandai yang sudah dibaca supaya kamu bisa fokus ke yang penting.</p></div><div className="app-hero-actions"><Button onClick={markAll} variant="primary" disabled={unread === 0}><AppIcon name="success" /> Tandai Semua Dibaca</Button><Button to="/reports">Laporan</Button></div></section>

        {isLoading ? (
          <div className="loading-state">Memuat pemberitahuan...</div>
        ) : isError ? (
          <EmptyState icon={<AppIcon name="empty" />} title="Gagal memuat pemberitahuan" description="Periksa koneksi lalu coba lagi." action={<Button variant="primary" onClick={() => refetch()}><AppIcon name="recurring" /> Coba lagi</Button>} />
        ) : alerts.length === 0 ? (
          <EmptyState icon={<AppIcon name="warning" />} title="Belum ada pemberitahuan" description="Pemberitahuan anggaran, jatuh tempo, dan berulang akan muncul di sini." />
        ) : (
          <>
            <section className="stat-grid"><Card className="stat-card"><span>Belum Dibaca</span><strong>{unread}</strong><small>Perlu perhatian</small></Card><Card className="stat-card blue"><span>Total Pemberitahuan</span><strong>{alerts.length}</strong><small>Kotak masuk saat ini</small></Card><Card className="stat-card danger-card"><span>Kritis</span><strong>{alerts.filter((a) => a.severity === 'danger').length}</strong><small>Perlu tindakan segera</small></Card><Card className="stat-card"><span>Sudah Dibaca</span><strong>{alerts.length - unread}</strong><small>Sudah ditangani</small></Card></section>
            <section className="insight-list">
              {alerts.map((alert) => (
                <Card className={`alert-message-card ${alert.severity}`} key={alert.id}>
                  <div className={`mini-icon ${alert.severity === 'danger' ? 'danger' : alert.severity === 'warning' ? 'warning' : alert.severity === 'success' ? 'safe' : 'info'}`}><AppIcon name={severityIcon(alert.severity)} /></div>
                  <div><h3>{alert.title}</h3><p>{alert.description}</p><div className="inline-actions"><Badge tone={severityTone(alert.severity)}>{alert.module}</Badge><ReadStatusBadge read={!!readMap[alert.id]} /><span className="muted-text">{relativeTime(alert.created_at)}</span></div></div>
                  <div className="alert-actions"><Button to={alert.action_path} size="small" variant="primary">Buka Modul</Button><Button to={`/alerts/${alert.id}`} size="small" variant="ghost">Detail</Button><Button onClick={() => markRead(alert.id)} size="small" variant="ghost" disabled={readMap[alert.id]}>Tandai Dibaca</Button></div>
                </Card>
              ))}
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}
