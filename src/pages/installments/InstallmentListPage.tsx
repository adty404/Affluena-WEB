import { useState } from 'react';
import clsx from 'clsx';
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
import { itemAccentVars } from '../../components/finance/ColorPicker';
import { useToast } from '../../components/ui/Toast';
import { useInstallments, useDeleteInstallment } from '../../hooks/useTrackers';
import { NAV } from '../../lib/copy';
import type { Installment } from '../../types/tracker';

const statusTone = (status: Installment['status']) => status === 'cancelled' ? 'red' : status === 'paid' ? 'green' : 'blue';
const statusLabel = (status: Installment['status']) => status === 'cancelled' ? 'Dibatalkan' : status === 'paid' ? 'Lunas' : 'Aktif';

/**
 * Count how many installments fall due within the next 7 days based on their
 * `due_day` (day-of-month). `due_day` is clamped to the target month's length
 * so e.g. day 31 in a 30-day month resolves to the 30th.
 */
function countDueWithin7Days(items: Installment[], now = new Date()): number {
  const clampDay = (year: number, month: number, day: number) => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    return new Date(year, month, Math.min(day, lastDay));
  };
  return items.filter((item) => {
    const y = now.getFullYear();
    const m = now.getMonth();
    let due = clampDay(y, m, item.due_day);
    if (due < new Date(y, m, now.getDate())) {
      // This month's due date already passed; look at next month's.
      due = clampDay(y, m + 1, item.due_day);
    }
    const diffDays = Math.ceil((due.getTime() - new Date(y, m, now.getDate()).getTime()) / 86_400_000);
    return diffDays >= 0 && diffDays <= 7;
  }).length;
}

export function InstallmentListPage() {
  const { data, isLoading, error } = useInstallments();
  const deleteMut = useDeleteInstallment();
  const { showToast } = useToast();
  const [target, setTarget] = useState<Installment | null>(null);
  const installments = data?.installments ?? [];

  // Totals + "aktif" count should only reflect active installments; cancelled/paid
  // ones no longer generate monthly dues or outstanding principal.
  const activeInstallments = installments.filter((item) => item.status === 'active');
  const monthlyDue = activeInstallments.reduce((sum, item) => sum + item.monthly_amount_minor, 0);
  const outstanding = activeInstallments.reduce((sum, item) => sum + (item.monthly_amount_minor * item.remaining_months), 0);
  const dueSoon = countDueWithin7Days(activeInstallments);

  const confirmDelete = () => {
    if (!target) return;
    deleteMut.mutate(target.id, {
      onSuccess: () => {
        showToast('Cicilan berhasil dihapus');
        setTarget(null);
      },
      onError: (err: any) => showToast(err?.message || 'Gagal menghapus cicilan'),
    });
  };

  return (
    <AppLayout title={NAV.cicilan} description="Pantau tenor cicilan, sisa pokok, dan jadwal tagihan bulanan.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● {NAV.cicilan}</span><h2>Pantau cicilan tetap, sisa tenor, dan pembayaran berikutnya.</h2><p>Setiap cicilan punya dompet pembayaran, nominal bulanan, tenor, dan pengingat yang jelas.</p></div>
          <div className="app-hero-actions"><Button to="/tracker"><AppIcon name="tracker" /> {NAV.pemantauUtang}</Button><Button to="/installments/new" variant="primary"><AppIcon name="add" /> Tambah Cicilan</Button></div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Cicilan Aktif</span><strong>{activeInstallments.length}</strong><small>Sedang berjalan</small></Card>
          <Card className="stat-card orange"><span>Tagihan Bulanan</span><strong><Amount value={monthlyDue} type="expense" /></strong><small>Pengeluaran tetap</small></Card>
          <Card className="stat-card blue"><span>Sisa Pokok</span><strong><Amount value={outstanding} /></strong><small>Belum terbayar</small></Card>
          <Card className="stat-card purple"><span>Segera Jatuh Tempo</span><strong>{dueSoon}</strong><small>7 hari ke depan</small></Card>
        </section>

        <section className="entity-card-grid stable-card-grid">
          {installments.map((item) => {
            const paidCount = item.tenor_months - item.remaining_months;
            const pct = item.tenor_months > 0 ? Math.round((paidCount / item.tenor_months) * 100) : 0;
            return (
              <FinanceOverviewCard
                key={item.id}
                title={item.name}
                subtitle={`${paidCount} dari ${item.tenor_months} bulan · Dompet ${item.wallet_id}`}
                icon="installment"
                iconTone="info"
                badge={statusLabel(item.status)}
                badgeTone={statusTone(item.status)}
                amount={item.monthly_amount_minor}
                amountType="expense"
                description={<>Sisa pokok <Amount value={item.monthly_amount_minor * item.remaining_months} /></>}
                accentColor={item.color}
                progress={pct}
                progressTone="blue"
                metaLeft={`${pct}% selesai`}
                metaRight={`Jatuh tempo tanggal ${item.due_day}`}
                actions={<><Button to={`/installments/${item.id}/pay`} size="small" variant="primary"><AppIcon name="pay" /> Bayar</Button><Button size="small" variant="danger" onClick={() => setTarget(item)}><AppIcon name="delete" /> Hapus</Button></>}
              />
            );
          })}
        </section>

        {isLoading && (
          <Card className="panel-card"><div className="readiness-list"><div><span>Memuat</span><strong>Memuat cicilan...</strong></div></div></Card>
        )}
        {!isLoading && !error && installments.length === 0 && (
          <Card className="panel-card">
            <EmptyState icon={<AppIcon name="installment" />} title="Belum ada cicilan" description="Tambahkan cicilan untuk melacak tenor, tagihan bulanan, dan sisa pembayaran." action={<Button to="/installments/new" variant="primary"><AppIcon name="add" /> Tambah Cicilan</Button>} />
          </Card>
        )}
        {error && (
          <Card className="panel-card"><EmptyState icon={<AppIcon name="empty" />} title="Gagal memuat cicilan" description="Periksa koneksi lalu coba lagi." /></Card>
        )}

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Daftar Cicilan</h3><p>Cicilan aktif dan jadwal pembayaran berikutnya.</p></div><Button to="/installments/new" size="small" variant="primary"><AppIcon name="add" /> Tambah</Button></div>
          <DataTable<Installment>
            data={installments}
            getRowKey={(item) => item.id}
            columns={[
              { key: 'name', header: 'Nama', render: (item) => { const accent = itemAccentVars(item.color); return <div className="table-title"><span className={clsx('mini-icon', accent ? 'has-accent' : 'info')} style={accent}><AppIcon name="installment" /></span><strong>{item.name}</strong></div>; } },
              { key: 'wallet', header: 'Dompet', render: (item) => item.wallet_id },
              { key: 'monthly', header: 'Bulanan', align: 'right', render: (item) => <Amount value={item.monthly_amount_minor} type="expense" /> },
              { key: 'tenor', header: 'Tenor', render: (item) => `${item.tenor_months - item.remaining_months}/${item.tenor_months}` },
              { key: 'due', header: 'Tanggal Tagihan', render: (item) => item.due_day },
              { key: 'status', header: 'Status', render: (item) => <Badge tone={statusTone(item.status)}>{statusLabel(item.status)}</Badge> },
              { key: 'action', header: 'Aksi', render: (item) => <div className="inline-actions"><Button to={`/installments/${item.id}/pay`} size="small">Bayar</Button><Button size="small" variant="danger" onClick={() => setTarget(item)}><AppIcon name="delete" /></Button></div> },
            ]}
          />
        </Card>
      </div>

      <Modal
        open={!!target}
        title="Hapus Cicilan"
        description="Tindakan ini menghapus cicilan beserta jadwal pembayarannya."
        onClose={() => (deleteMut.isPending ? null : setTarget(null))}
      >
        <div className="readiness-list">
          <div><span>Nama</span><strong>{target?.name}</strong></div>
          <div><span>Bulanan</span><strong>{target ? <Amount value={target.monthly_amount_minor} type="expense" /> : null}</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setTarget(null)} disabled={deleteMut.isPending}>Batal</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleteMut.isPending}>{deleteMut.isPending ? 'Menghapus...' : 'Hapus Cicilan'}</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
