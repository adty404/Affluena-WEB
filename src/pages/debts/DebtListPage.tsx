import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { FinanceOverviewCard } from '../../components/finance/FinanceOverviewCard';
import { useToast } from '../../components/ui/Toast';
import { useDebts, useDeleteDebt } from '../../hooks/useDebts';
import { formatDateID } from '../../lib/dates';
import { NAV } from '../../lib/copy';
import type { Debt } from '../../types/debt';

const tone = (status: Debt['status']) => status === 'cancelled' ? 'red' : status === 'paid' ? 'green' : 'blue';
const label = (status: Debt['status']) => status === 'cancelled' ? 'Dibatalkan' : status === 'paid' ? 'Lunas' : 'Belum Lunas';
const typeLabel = (type: Debt['type']) => type === 'payable' ? 'Utang' : 'Piutang';

export function DebtListPage() {
  const { data, isLoading, error } = useDebts();
  const deleteMut = useDeleteDebt();
  const { showToast } = useToast();
  const [target, setTarget] = useState<Debt | null>(null);
  const debts = data?.debts ?? [];

  const confirmDelete = () => {
    if (!target) return;
    deleteMut.mutate(target.id, {
      onSuccess: () => {
        showToast('Utang berhasil dihapus');
        setTarget(null);
      },
      onError: (err: any) => showToast(err?.message || 'Gagal menghapus utang'),
    });
  };

  const totalPayable = debts.filter(d => d.type === 'payable' && d.status === 'open').reduce((acc, d) => acc + d.remaining_amount_minor, 0);
  const totalReceivable = debts.filter(d => d.type === 'receivable' && d.status === 'open').reduce((acc, d) => acc + d.remaining_amount_minor, 0);
  // No per-payment date is exposed here, so this is all-time paid — labeled honestly.
  const totalPaid = debts.filter(d => d.status === 'paid').reduce((acc, d) => acc + d.paid_amount_minor, 0);
  // "Segera jatuh tempo" = open debts whose due_date falls within the next 7 days.
  const now = new Date();
  const in7Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueSoon = debts.filter(d => {
    if (d.status !== 'open' || !d.due_date) return false;
    const due = new Date(d.due_date);
    if (Number.isNaN(due.getTime())) return false;
    return due >= startOfToday && due <= in7Days;
  }).length;

  return (
    <AppLayout title={NAV.utang} description="Kelola utang, piutang, pembayaran, dan pengingat jatuh tempo.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge className="dark">Utang & Piutang</Badge>
            <h2>Lacak utang dan piutang tanpa kehilangan riwayat pembayaran.</h2>
            <p>Saldo dompet kamu ikut terbarui setiap kali utang dibayar atau piutang diterima.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/debts/new/payable" variant="primary"><AppIcon name="payable" /> Tambah Utang</Button>
            <Button to="/debts/new/receivable"><AppIcon name="receivable" /> Tambah Piutang</Button>
            <Button to="/tracker"><AppIcon name="tracker" /> {NAV.pemantauUtang}</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card orange"><span>Total Utang</span><strong><Amount value={totalPayable} type="expense" /></strong><small>Harus dibayar</small></Card>
          <Card className="stat-card"><span>Total Piutang</span><strong><Amount value={totalReceivable} type="income" /></strong><small>Perlu ditagih</small></Card>
          <Card className="stat-card blue"><span>Total Lunas</span><strong><Amount value={totalPaid} /></strong><small>Pembayaran utang</small></Card>
          <Card className="stat-card purple"><span>Segera Jatuh Tempo</span><strong>{dueSoon}</strong><small>7 hari ke depan</small></Card>
        </section>

        {error ? (
          <Card className="panel-card">
            <EmptyState icon={<AppIcon name="empty" />} title="Gagal memuat utang" description="Periksa koneksi lalu coba lagi." />
          </Card>
        ) : isLoading ? (
          <div className="loading-state">Memuat utang...</div>
        ) : debts.length === 0 ? (
          <Card className="panel-card">
            <EmptyState icon={<AppIcon name="empty" />} title="Belum ada utang atau piutang" description="Catat utang atau piutang untuk melacak sisa pembayaran dan riwayat penagihan." action={<Button to="/debts/new/payable" variant="primary"><AppIcon name="payable" /> Tambah Utang</Button>} />
          </Card>
        ) : (
          <>
            <section className="entity-card-grid stable-card-grid">
              {debts.map((debt) => {
                const pct = debt.principal_amount_minor > 0 ? Math.round((debt.paid_amount_minor / debt.principal_amount_minor) * 100) : 0;
                const isPayable = debt.type === 'payable';
                return (
                  <FinanceOverviewCard
                    key={debt.id}
                    title={debt.counterparty_name}
                    subtitle={`Jatuh tempo ${formatDateID(debt.due_date)}`}
                    icon={isPayable ? 'payable' : 'receivable'}
                    iconTone={isPayable ? 'danger' : 'safe'}
                    badge={typeLabel(debt.type)}
                    badgeTone={isPayable ? 'red' : 'green'}
                    amount={debt.remaining_amount_minor}
                    amountType={isPayable ? 'expense' : 'income'}
                    description={debt.note}
                    progress={pct}
                    progressTone={isPayable ? 'orange' : 'green'}
                    metaLeft={`${pct}% terbayar`}
                    metaRight={label(debt.status)}
                    actions={<><Button to={`/debts/${debt.id}`} size="small">Detail</Button><Button to={`/debts/${debt.id}/pay`} size="small" variant="primary"><AppIcon name="pay" /> Bayar</Button><Button size="small" variant="danger" onClick={() => setTarget(debt)} aria-label={`Hapus utang ${debt.counterparty_name}`}><AppIcon name="delete" /> Hapus</Button></>}
                  />
                );
              })}
            </section>

            <Card className="panel-card">
              <div className="panel-head">
                <div><h3>Daftar Utang & Piutang</h3><p>Semua utang dan piutang beserta aksinya.</p></div>
                <div className="panel-actions"><Button to="/debts/new/payable" size="small"><AppIcon name="payable" /> Utang</Button><Button to="/debts/new/receivable" size="small" variant="primary"><AppIcon name="receivable" /> Piutang</Button></div>
              </div>
              <DataTable<Debt>
                data={debts}
                getRowKey={(debt) => debt.id}
                columns={[
                  { key: 'title', header: 'Nama', render: (debt) => <div className="table-title"><span className={`mini-icon ${debt.type === 'payable' ? 'danger' : 'safe'}`}><AppIcon name={debt.type === 'payable' ? 'payable' : 'receivable'} /></span><strong>{debt.counterparty_name}</strong></div> },
                  { key: 'type', header: 'Tipe', render: (debt) => <Badge tone={debt.type === 'payable' ? 'red' : 'green'}>{typeLabel(debt.type)}</Badge> },
                  { key: 'remaining', header: 'Sisa', align: 'right', render: (debt) => <Amount value={debt.remaining_amount_minor} type={debt.type === 'payable' ? 'expense' : 'income'} /> },
                  { key: 'due', header: 'Jatuh Tempo', render: (debt) => formatDateID(debt.due_date) },
                  { key: 'status', header: 'Status', render: (debt) => <Badge tone={tone(debt.status)}>{label(debt.status)}</Badge> },
                  { key: 'action', header: 'Aksi', render: (debt) => <div className="inline-actions"><Button to={`/debts/${debt.id}`} size="small">Lihat</Button><Button to={`/debts/${debt.id}/pay`} size="small">Bayar</Button><Button size="small" variant="danger" onClick={() => setTarget(debt)} aria-label={`Hapus utang ${debt.counterparty_name}`}><AppIcon name="delete" /></Button></div> },
                ]}
              />
            </Card>
          </>
        )}
      </div>

      <Modal
        open={!!target}
        title="Hapus Utang"
        description="Tindakan ini menghapus utang beserta riwayat pembayarannya."
        onClose={() => (deleteMut.isPending ? null : setTarget(null))}
      >
        <div className="readiness-list">
          <div><span>Pihak Lain</span><strong>{target?.counterparty_name}</strong></div>
          <div><span>Sisa</span><strong>{target ? <Amount value={target.remaining_amount_minor} type={target.type === 'payable' ? 'expense' : 'income'} /> : null}</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setTarget(null)} disabled={deleteMut.isPending}>Batal</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleteMut.isPending}>{deleteMut.isPending ? 'Menghapus...' : 'Hapus Utang'}</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
