import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { useRecurringRule } from '../../hooks/useRecurring';

const formatRunDate = (value?: string) => (value ? new Date(value).toLocaleString('id-ID') : null);

export function RecurringHistoryPage() {
  const { id } = useParams();
  const { data: rule, isLoading, error } = useRecurringRule(id || '');

  if (isLoading) return <AppLayout title="Riwayat Eksekusi" description="Memuat..."><div className="p-8">Memuat...</div></AppLayout>;
  if (error || !rule) return <AppLayout title="Riwayat Eksekusi" description="Gagal memuat"><div className="p-8 text-red-500">Gagal memuat aturan berulang. Periksa koneksi lalu coba lagi.</div></AppLayout>;

  const lastRun = formatRunDate(rule.last_run_at);
  const nextRun = formatRunDate(rule.next_run_at);

  return (
    <AppLayout title="Riwayat Eksekusi" description="Riwayat eksekusi untuk aturan berulang ini.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Riwayat Eksekusi</span><h2>{rule.name}</h2><p>Lihat kapan aturan ini terakhir berjalan dan kapan jadwal berikutnya.</p></div>
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
