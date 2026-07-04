import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { useToast } from '../../components/ui/Toast';
import { useDebt, useDeleteDebt } from '../../hooks/useDebts';
import { useWallets } from '../../hooks/useWallets';
import { createNameById, walletLabel } from '../../lib/financeLabels';
import { formatDateID } from '../../lib/dates';
import type { DebtPayment } from '../../types/debt';

const statusLabel = (status: string) => status === 'cancelled' ? 'Dibatalkan' : status === 'paid' ? 'Lunas' : 'Belum Lunas';
const statusTone = (status: string) => status === 'cancelled' ? 'red' : status === 'paid' ? 'green' : 'orange';

export function DebtDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: debt, isLoading } = useDebt(id ?? '');
  const { data: walletsData } = useWallets();
  const deleteMut = useDeleteDebt();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const walletNameById = createNameById(walletsData?.wallets ?? []);

  const handleDelete = () => {
    if (!debt) return;
    deleteMut.mutate(debt.id, {
      onSuccess: () => {
        showToast('Utang berhasil dihapus');
        navigate('/debts');
      },
      onError: (err: any) => showToast(err?.message || 'Gagal menghapus utang'),
    });
  };

  if (isLoading) {
    return (
      <AppLayout title="Detail Utang" description="Memuat...">
        <div className="dashboard-page grid-stack"><div className="loading-state">Memuat...</div></div>
      </AppLayout>
    );
  }

  if (!debt) {
    return (
      <AppLayout title="Detail Utang" description="Tidak ditemukan">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><EmptyState icon={<AppIcon name="empty" />} title="Utang tidak ditemukan" description="Utang mungkin sudah dihapus." action={<Button to="/debts">Kembali ke daftar</Button>} /></Card></div>
      </AppLayout>
    );
  }

  const progress = debt.principal_amount_minor > 0 ? Math.round((debt.paid_amount_minor / debt.principal_amount_minor) * 100) : 0;

  return (
    <AppLayout title="Detail Utang" description="Sisa tagihan, riwayat pembayaran, dan aktivitas utang.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge className="dark">{debt.type === 'payable' ? 'Utang' : 'Piutang'}</Badge>
            <h2>{debt.counterparty_name}</h2>
            <p>{debt.note}</p>
          </div>
          <div className="app-hero-actions"><Button to="/debts">Kembali</Button><Button to={`/debts/${debt.id}/pay`} variant="primary"><AppIcon name="pay" /> Catat Pembayaran</Button><Button variant="danger" onClick={() => setDeleteOpen(true)}><AppIcon name="delete" /> Hapus</Button></div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Nominal Awal</span><strong><Amount value={debt.principal_amount_minor} /></strong><small>{debt.counterparty_name}</small></Card>
          <Card className="stat-card"><span>Terbayar</span><strong><Amount value={debt.paid_amount_minor} type="income" /></strong><small>{progress}% terbayar</small></Card>
          <Card className="stat-card orange"><span>Sisa</span><strong><Amount value={debt.remaining_amount_minor} type={debt.type === 'payable' ? 'expense' : 'income'} /></strong><small>Jatuh tempo {formatDateID(debt.due_date)}</small></Card>
          <Card className="stat-card blue"><span>Status</span><strong><Badge tone={statusTone(debt.status)}>{statusLabel(debt.status)}</Badge></strong><small>{walletLabel(walletNameById, debt.wallet_id)}</small></Card>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Riwayat Pembayaran</h3><p>Semua pembayaran untuk utang ini.</p></div><Button to={`/debts/${debt.id}/pay`} size="small" variant="primary"><AppIcon name="pay" /> Bayar</Button></div>
            <DataTable<DebtPayment>
              data={debt.payments || []}
              getRowKey={(payment) => payment.id}
              columns={[
                { key: 'date', header: 'Tanggal', render: (payment) => formatDateID(payment.paid_at) },
                { key: 'transaction', header: 'Transaksi', render: (payment) => payment.transaction_id ? <Button to={`/transactions/${payment.transaction_id}`} size="small">Lihat</Button> : '-' },
                { key: 'amount', header: 'Jumlah', align: 'right', render: (payment) => <Amount value={payment.amount_minor} type="income" /> },
                { key: 'note', header: 'Catatan', render: (payment) => payment.note },
              ]}
            />
          </Card>

          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Progres Pelunasan</h3><p>Pembayaran tidak boleh melebihi sisa tagihan.</p></div></div>
            <div className="metric-list">
              <div><span>Progres</span><strong>{progress}%</strong></div>
              <ProgressBar value={progress} tone={debt.type === 'payable' ? 'orange' : 'green'} />
              <div><span>Efek ke dompet</span><strong>{debt.type === 'payable' ? 'Saldo berkurang saat dibayar' : 'Saldo bertambah saat diterima'}</strong></div>
              <div><span>Status jatuh tempo</span><strong><Badge tone={statusTone(debt.status)}>{statusLabel(debt.status)}</Badge></strong></div>
            </div>
          </Card>
        </section>
      </div>

      <Modal
        open={deleteOpen}
        title="Hapus Utang"
        description="Tindakan ini menghapus utang beserta riwayat pembayarannya."
        onClose={() => (deleteMut.isPending ? null : setDeleteOpen(false))}
      >
        <div className="readiness-list">
          <div><span>Pihak Lain</span><strong>{debt.counterparty_name}</strong></div>
          <div><span>Sisa</span><strong><Amount value={debt.remaining_amount_minor} type={debt.type === 'payable' ? 'expense' : 'income'} /></strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setDeleteOpen(false)} disabled={deleteMut.isPending}>Batal</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteMut.isPending}>{deleteMut.isPending ? 'Menghapus...' : 'Hapus Utang'}</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
