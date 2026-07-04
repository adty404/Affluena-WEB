import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { severityLabel, severityTone } from '../../components/reports/ReportCards';
import { actorLabel, humanizeAction, humanizeEntity, relativeTime } from '../../lib/auditLabels';
import { NAV } from '../../lib/copy';
import type { Activity } from '../../types/reporting';
import { useActivities } from '../../hooks/useActivities';

function getSeverity(entityType: string): 'info' | 'success' | 'warning' | 'danger' {
  if (entityType === 'RECURRING') return 'success';
  if (entityType === 'BUDGET') return 'warning';
  if (entityType === 'DEBT') return 'danger';
  return 'info';
}

export function ActivityListPage() {
  const { data, isLoading, isError, refetch } = useActivities();
  const activities = data?.data ?? [];

  return (
    <AppLayout title={NAV.riwayatAktivitas} description="Jejak semua perubahan penting di akun kamu.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><Badge>Aktivitas</Badge><h2>Semua perubahan penting dapat ditelusuri dari riwayat aktivitas.</h2><p>Telusuri transaksi, pembayaran utang, transaksi berulang, ekspor, dan target bersama.</p></div><div className="app-hero-actions"><Button to="/system-logs">Log Sistem</Button><Button to="/reports" variant="primary">Laporan</Button></div></section>
        <Card className="panel-card">
          <div className="panel-head"><div><h3>Linimasa Aktivitas</h3><p>Kejadian terbaru lengkap dengan modul, aktor, dan tingkat.</p></div></div>
          {isLoading ? (
            <div className="loading-state">Memuat aktivitas...</div>
          ) : isError ? (
            <EmptyState icon={<AppIcon name="empty" />} title="Gagal memuat aktivitas" description="Periksa koneksi lalu coba lagi." action={<Button variant="primary" onClick={() => refetch()}><AppIcon name="recurring" /> Coba lagi</Button>} />
          ) : activities.length === 0 ? (
            <EmptyState icon={<AppIcon name="history" />} title="Belum ada aktivitas" description="Perubahan penting pada akunmu akan muncul di sini." />
          ) : (
            <DataTable<Activity>
              data={activities}
              getRowKey={(event) => event.id}
              columns={[
                { key: 'action', header: 'Aktivitas', render: (event) => {
                  const severity = getSeverity(event.entity_type);
                  const title = `${humanizeAction(event.action_type)} ${humanizeEntity(event.entity_type)}`;
                  return <div className="table-title"><span className={`mini-icon ${severity === 'danger' ? 'danger' : severity === 'warning' ? 'warning' : severity === 'success' ? 'safe' : 'info'}`}><AppIcon name="history" /></span><strong>{title}</strong><small>{event.description || 'Tidak ada deskripsi'}</small></div>
                } },
                { key: 'actor', header: 'Aktor', render: (event) => actorLabel(event.user_id) },
                { key: 'module', header: 'Modul', render: (event) => <Badge tone="gray">{humanizeEntity(event.entity_type)}</Badge> },
                { key: 'time', header: 'Waktu', render: (event) => relativeTime(event.created_at) },
                { key: 'severity', header: 'Tingkat', render: (event) => {
                  const severity = getSeverity(event.entity_type);
                  return <Badge tone={severityTone(severity)}>{severityLabel(severity)}</Badge>
                } },
                { key: 'actionLink', header: 'Aksi', render: (event) => <Button to={`/activities/${event.id}`} size="small">Buka</Button> }
              ]}
            />
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
