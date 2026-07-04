import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { useRecurringRule } from '../../hooks/useRecurring';
import { formatDateTimeID } from '../../lib/dates';

const formatRunDate = (value?: string) => (value ? formatDateTimeID(value) : null);

export function RecurringHistoryPage() {
  const { id } = useParams();
  const { data: rule, isLoading, error } = useRecurringRule(id || '');

  if (isLoading) return <AppLayout title="Riwayat Eksekusi" description="Memuat..."><div className="loading-state">Memuat...</div></AppLayout>;
  if (error || !rule) return <AppLayout title="Riwayat Eksekusi" description="Gagal memuat"><Card className="panel-card"><EmptyState icon={<AppIcon name="empty" />} title="Gagal memuat aturan berulang" description="Periksa koneksi lalu coba lagi." action={<Button to="/recurring">Kembali</Button>} /></Card></AppLayout>;

  const lastRun = formatRunDate(rule.last_run_at);
  const nextRun = formatRunDate(rule.next_run_at);

  return (
    <AppLayout title="Riwayat Eksekusi" description="Riwayat eksekusi untuk aturan berulang ini.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><Badge className="dark">Riwayat Eksekusi</Badge><h2>{rule.name}</h2><p>Lihat kapan aturan ini terakhir berjalan dan kapan jadwal berikutnya.</p></div>
          <div className="app-hero-actions"><Button to={`/recurring/${rule.id}`}>Kembali</Button><Button to={`/recurring/${rule.id}/run`} variant="primary"><AppIcon name="run" /> Jalankan Manual</Button></div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Terakhir Dijalankan</span><strong>{lastRun ?? 'Belum pernah'}</strong><small>{lastRun ? 'Eksekusi terakhir' : 'Aturan ini belum pernah berjalan'}</small></Card>
          <Card className="stat-card orange"><span>Jadwal Berikutnya</span><strong>{nextRun ?? '—'}</strong><small>Eksekusi terjadwal berikutnya</small></Card>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Riwayat Eksekusi</h3><p>Waktu aturan berulang ini dijalankan.</p></div><Button to="/recurring" size="small"><AppIcon name="list" /> Semua Aturan</Button></div>
          {lastRun ? (
            <div className="metric-list">
              <div><span>Terakhir dijalankan</span><strong>{lastRun}</strong></div>
              <div><span>Jadwal berikutnya</span><strong>{nextRun ?? '—'}</strong></div>
            </div>
          ) : (
            <EmptyState
              icon={<AppIcon name="history" />}
              title="Belum ada eksekusi"
              description="Aturan ini belum pernah dijalankan. Jalankan manual sekarang atau tunggu jadwal berikutnya."
              action={<Button to={`/recurring/${rule.id}/run`} variant="primary"><AppIcon name="run" /> Jalankan Manual</Button>}
            />
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
