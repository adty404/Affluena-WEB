import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { useCategories } from '../../hooks/useCategories';
import { useRecurringRule, useDeleteRecurringRule } from '../../hooks/useRecurring';
import { useWallets } from '../../hooks/useWallets';
import { categoryLabel, createNameById, walletLabel } from '../../lib/financeLabels';
import { ACTIONS } from '../../lib/copy';
import type { RecurringRun } from '../../types/recurring';

const statusTone = (status: string) => status === 'active' || status === 'success' ? 'green' : status === 'paused' || status === 'skipped' ? 'orange' : status === 'cancelled' ? 'gray' : 'red';
const statusLabel = (status: string) => status === 'active' ? 'Aktif' : status === 'paused' ? 'Dijeda' : status === 'cancelled' ? 'Dibatalkan' : status;
const typeLabel = (type: string) => type === 'income' ? 'Pemasukan' : type === 'expense' ? 'Pengeluaran' : type === 'transfer' ? 'Transfer' : 'Penyesuaian';
const frequencyLabel = (frequency: string) => frequency === 'weekly' ? 'Mingguan' : 'Bulanan';

export function RecurringDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: rule, isLoading, error } = useRecurringRule(id || '');
  const deleteMut = useDeleteRecurringRule();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  const walletNameById = createNameById(walletsData?.wallets ?? []);
  const categoryNameById = createNameById(categoriesData?.categories ?? []);

  if (isLoading) return <AppLayout title="Detail Berulang" description={ACTIONS.memuat}><div className="p-8">{ACTIONS.memuat}</div></AppLayout>;
  if (error || !rule) return <AppLayout title="Detail Berulang" description="Gagal memuat"><div className="p-8 text-red-500">Gagal memuat aturan berulang. Periksa koneksi lalu coba lagi.</div></AppLayout>;

  // Mock run history since it's not in the rule object directly from the API
  // In a real app, we would fetch this from a separate endpoint or it would be included
  const runHistory: RecurringRun[] = [];
  const sourceWallet = walletLabel(walletNameById, rule.wallet_id);
  const destinationWallet = walletLabel(walletNameById, rule.to_wallet_id);
  const ruleCategory = categoryLabel(categoryNameById, rule.category_id, rule.type);

  const handleDelete = () => {
    deleteMut.mutate(rule.id, {
      onSuccess: () => {
        showToast('Aturan berulang berhasil dihapus');
        navigate('/recurring');
      },
      onError: (err: any) => showToast(err?.message || 'Gagal menghapus aturan berulang'),
    });
  };

  return (
    <AppLayout title="Detail Berulang" description="Konfigurasi aturan, jadwal berikutnya, dan riwayat eksekusi terbaru.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● {statusLabel(rule.status)}</span><h2>{rule.name}</h2><p>{rule.note}</p></div>
          <div className="app-hero-actions"><Button to="/recurring">{ACTIONS.kembali}</Button><Button to={`/recurring/${rule.id}/edit`}><AppIcon name="edit" /> Edit</Button><Button to={`/recurring/${rule.id}/run`} variant="primary"><AppIcon name="run" /> Jalankan Manual</Button><Button variant="danger" onClick={() => setDeleteOpen(true)}><AppIcon name="delete" /> {ACTIONS.hapus}</Button></div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Jumlah</span><strong><Amount value={rule.amount_minor} type={rule.type === 'income' ? 'income' : 'expense'} /></strong><small>{typeLabel(rule.type)}</small></Card>
          <Card className="stat-card blue"><span>Frekuensi</span><strong>{frequencyLabel(rule.frequency)}</strong><small>jadwal pengulangan</small></Card>
          <Card className="stat-card orange"><span>Jadwal Berikutnya</span><strong>{new Date(rule.next_run_at).toLocaleDateString()}</strong><small>tanggal eksekusi</small></Card>
          <Card className="stat-card"><span>Status</span><strong>{statusLabel(rule.status)}</strong><small>{sourceWallet}</small></Card>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Riwayat Eksekusi</h3><p>Riwayat setiap kali aturan berulang ini dijalankan.</p></div><Button to={`/recurring/${rule.id}/history`} size="small"><AppIcon name="history" /> Riwayat Lengkap</Button></div>
            <DataTable<RecurringRun>
              data={runHistory}
              getRowKey={(run) => run.id}
              columns={[
                { key: 'scheduled', header: 'Dijadwalkan', render: (run) => new Date(run.scheduled_for).toLocaleString() },
                { key: 'executed', header: 'Dijalankan', render: (run) => new Date(run.created_at).toLocaleString() },
                { key: 'status', header: 'Tipe', render: (run) => <Badge tone="blue">{run.run_type === 'manual' ? 'Manual' : 'Terjadwal'}</Badge> },
                { key: 'tx', header: 'Transaksi', render: (run) => run.transaction_id ? <Badge tone="green">{run.transaction_id}</Badge> : '-' }
              ]}
            />
          </Card>

          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Detail Aturan</h3><p>Konfigurasi utama aturan.</p></div></div>
            <div className="metric-list">
              <div><span>Dompet sumber</span><strong>{sourceWallet}</strong></div>
              {rule.to_wallet_id ? <div><span>Dompet tujuan</span><strong>{destinationWallet}</strong></div> : null}
              <div><span>Kategori</span><strong>{ruleCategory}</strong></div>
              <div><span>Status</span><strong><Badge tone={statusTone(rule.status)}>{statusLabel(rule.status)}</Badge></strong></div>
            </div>
          </Card>
        </section>
      </div>

      <Modal
        open={deleteOpen}
        title="Hapus Aturan Berulang"
        description="Tindakan ini menghapus aturan. Riwayat eksekusi yang sudah tercatat tidak ikut terhapus."
        onClose={() => (deleteMut.isPending ? null : setDeleteOpen(false))}
      >
        <div className="readiness-list">
          <div><span>Aturan</span><strong>{rule.name}</strong></div>
          <div><span>Jumlah</span><strong><Amount value={rule.amount_minor} type={rule.type === 'income' ? 'income' : 'expense'} /></strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setDeleteOpen(false)} disabled={deleteMut.isPending}>{ACTIONS.batal}</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteMut.isPending}>{deleteMut.isPending ? 'Menghapus...' : 'Hapus Aturan'}</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
