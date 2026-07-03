import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { useRecurringRule } from '../../hooks/useRecurring';
import type { RecurringRun } from '../../types/recurring';

export function RecurringHistoryPage() {
  const { id } = useParams();
  const { data: rule, isLoading, error } = useRecurringRule(id || '');

  if (isLoading) return <AppLayout title="Riwayat Eksekusi" description="Memuat..."><div className="p-8">Memuat...</div></AppLayout>;
  if (error || !rule) return <AppLayout title="Riwayat Eksekusi" description="Gagal memuat"><div className="p-8 text-red-500">Gagal memuat aturan berulang. Periksa koneksi lalu coba lagi.</div></AppLayout>;

  // Mock run history since it's not in the rule object directly from the API
  const runHistory: RecurringRun[] = [];

  return (
    <AppLayout title="Riwayat Eksekusi" description="Riwayat eksekusi untuk aturan berulang ini.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Riwayat Eksekusi</span><h2>{rule.name}</h2><p>Lihat kapan aturan ini berjalan otomatis, dijalankan manual, dilewati, atau gagal.</p></div>
          <div className="app-hero-actions"><Button to={`/recurring/${rule.id}`}>Kembali</Button><Button to={`/recurring/${rule.id}/run`} variant="primary"><AppIcon name="run" /> Jalankan Manual</Button></div>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Riwayat Eksekusi</h3><p>Riwayat setiap kali aturan berulang ini dijalankan.</p></div><Button to="/recurring" size="small"><AppIcon name="list" /> Semua Aturan</Button></div>
          <DataTable<RecurringRun>
            data={runHistory}
            getRowKey={(run) => run.id}
            columns={[
              { key: 'scheduled', header: 'Dijadwalkan', render: (run) => new Date(run.scheduled_for).toLocaleString() },
              { key: 'executed', header: 'Dijalankan', render: (run) => new Date(run.created_at).toLocaleString() },
              { key: 'status', header: 'Tipe', render: (run) => <Badge tone="blue">{run.run_type === 'manual' ? 'Manual' : 'Terjadwal'}</Badge> },
              { key: 'transaction', header: 'Transaksi', render: (run) => run.transaction_id ? <Badge tone="green">{run.transaction_id}</Badge> : '-' }
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
