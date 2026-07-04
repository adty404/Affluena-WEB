import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { severityLabel, severityTone } from '../../components/reports/ReportCards';
import { actorLabel, formatTimestamp, humanizeAction, humanizeEntity, relativeTime, shortRef } from '../../lib/auditLabels';
import { useActivity } from '../../hooks/useActivity';

function getSeverity(entityType: string): 'info' | 'success' | 'warning' | 'danger' {
  if (entityType === 'RECURRING') return 'success';
  if (entityType === 'BUDGET') return 'warning';
  if (entityType === 'DEBT') return 'danger';
  return 'info';
}

export function ActivityDetailPage() {
  const { id } = useParams();
  const { data: event, isLoading, isError, refetch } = useActivity(id ?? '');

  if (isLoading) {
    return (
      <AppLayout title="Detail Aktivitas" description="Detail lengkap satu aktivitas di akun kamu.">
        <div className="dashboard-page grid-stack">
          <div className="loading-state">Memuat aktivitas...</div>
        </div>
      </AppLayout>
    );
  }

  if (isError || !event) {
    return (
      <AppLayout title="Detail Aktivitas" description="Detail lengkap satu aktivitas di akun kamu.">
        <div className="dashboard-page grid-stack">
          <Card className="panel-card">
            <EmptyState icon={<AppIcon name="empty" />} title="Aktivitas tidak ditemukan" description="Aktivitas ini gagal dimuat atau sudah tidak tersedia." action={<Button variant="primary" onClick={() => refetch()}><AppIcon name="recurring" /> Coba lagi</Button>} />
          </Card>
        </div>
      </AppLayout>
    );
  }

  const severity = getSeverity(event.entity_type);
  const title = `${humanizeAction(event.action_type)} ${humanizeEntity(event.entity_type)}`;

  return (
    <AppLayout title="Detail Aktivitas" description="Detail lengkap satu aktivitas di akun kamu.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>{humanizeEntity(event.entity_type)}</Badge>
            <h2>{title}</h2>
            <p>{event.description || 'Tidak ada deskripsi.'}</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/activities">Kembali</Button>
            <Button to="/system-logs" variant="primary"><AppIcon name="list" /> Log Sistem</Button>
          </div>
        </section>
        <Card className="panel-card">
          <div className="metric-list compact-metrics">
            <div className="metric-cell"><span>Aktor</span><strong>{actorLabel(event.user_id)}</strong><small>Pemicu aktivitas</small></div>
            <div className="metric-cell"><span>Modul</span><strong>{humanizeEntity(event.entity_type)}</strong><small>Area fitur</small></div>
            <div className="metric-cell"><span>Referensi</span><strong>{shortRef(event.entity_id)}</strong><small>Data terdampak</small></div>
            <div className="metric-cell"><span>Waktu</span><strong>{formatTimestamp(event.created_at)}</strong><small>{relativeTime(event.created_at)}</small></div>
            <div className="metric-cell"><span>Tingkat</span><strong><Badge tone={severityTone(severity)}>{severityLabel(severity)}</Badge></strong><small>Tingkat kejadian</small></div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
