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
import { useSubscriptions, useDeleteSubscription } from '../../hooks/useTrackers';
import { NAV } from '../../lib/copy';
import type { Subscription } from '../../types/tracker';

const statusTone = (status: Subscription['status']) => status === 'cancelled' ? 'red' : status === 'active' ? 'blue' : 'orange';
const statusLabel = (status: Subscription['status']) => status === 'cancelled' ? 'Dibatalkan' : status === 'active' ? 'Aktif' : 'Dijeda';
const cycleLabel = (cycle: Subscription['billing_cycle']) => cycle === 'weekly' ? 'Mingguan' : 'Bulanan';

export function SubscriptionListPage() {
  const { data, isLoading, error } = useSubscriptions();
  const deleteMut = useDeleteSubscription();
  const { showToast } = useToast();
  const [target, setTarget] = useState<Subscription | null>(null);
  const subscriptions = data?.subscriptions ?? [];

  const monthlyBurn = subscriptions.reduce((sum, item) => sum + (item.billing_cycle === 'weekly' ? item.amount_minor * 4 : item.amount_minor), 0);

  const confirmDelete = () => {
    if (!target) return;
    deleteMut.mutate(target.id, {
      onSuccess: () => {
        showToast('Langganan berhasil dihapus');
        setTarget(null);
      },
      onError: (err: any) => showToast(err?.message || 'Gagal menghapus langganan'),
    });
  };

  return (
    <AppLayout title={NAV.langganan} description="Pantau tanggal perpanjangan, pengeluaran bulanan, dan pembayaran langganan.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● {NAV.langganan}</span><h2>Lacak langganan digital, tanggal perpanjangan, dan pengeluaran bulanannya.</h2><p>Setiap pembayaran langganan tercatat sebagai transaksi agar arus kas tetap akurat.</p></div>
          <div className="app-hero-actions"><Button to="/tracker"><AppIcon name="tracker" /> {NAV.pemantauUtang}</Button><Button to="/subscriptions/new" variant="primary"><AppIcon name="add" /> Tambah Langganan</Button></div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Langganan Aktif</span><strong>{subscriptions.length}</strong><small>Layanan terpantau</small></Card>
          <Card className="stat-card orange"><span>Pengeluaran Bulanan</span><strong><Amount value={monthlyBurn} type="expense" /></strong><small>Setara per bulan</small></Card>
          <Card className="stat-card blue"><span>Setahun</span><strong><Amount value={monthlyBurn * 12} /></strong><small>Proyeksi</small></Card>
          <Card className="stat-card purple"><span>Segera Jatuh Tempo</span><strong>0</strong><small>Perpanjangan</small></Card>
        </section>

        <section className="entity-card-grid stable-card-grid">
          {subscriptions.map((item) => (
            <FinanceOverviewCard
              key={item.id}
              title={item.name}
              subtitle={`Dompet ${item.wallet_id} · ${cycleLabel(item.billing_cycle)}`}
              icon="subscription"
              iconTone="info"
              badge={statusLabel(item.status)}
              badgeTone={statusTone(item.status)}
              amount={item.amount_minor}
              amountType="expense"
              accentColor={item.color}
              description={`Dibayar dari ${item.wallet_id}. Perpanjangan berikutnya ${item.next_due_date}.`}
              metaLeft={item.account_detail}
              metaRight={cycleLabel(item.billing_cycle)}
              actions={<><Button to={`/subscriptions/${item.id}/pay`} size="small" variant="primary"><AppIcon name="pay" /> Bayar</Button><Button size="small" variant="danger" onClick={() => setTarget(item)}><AppIcon name="delete" /> Hapus</Button></>}
            />
          ))}
        </section>

        {isLoading && (
          <Card className="panel-card"><div className="readiness-list"><div><span>Memuat</span><strong>Memuat langganan...</strong></div></div></Card>
        )}
        {!isLoading && !error && subscriptions.length === 0 && (
          <Card className="panel-card">
            <EmptyState icon={<AppIcon name="subscription" />} title="Belum ada langganan" description="Tambahkan langganan untuk melacak tanggal perpanjangan dan pengeluaran bulanannya." action={<Button to="/subscriptions/new" variant="primary"><AppIcon name="add" /> Tambah Langganan</Button>} />
          </Card>
        )}
        {error && (
          <Card className="panel-card"><EmptyState icon={<AppIcon name="empty" />} title="Gagal memuat langganan" description="Periksa koneksi lalu coba lagi." /></Card>
        )}

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Daftar Langganan</h3><p>Jadwal perpanjangan dan aksi pembayaran.</p></div><Button to="/subscriptions/new" size="small" variant="primary"><AppIcon name="add" /> Tambah</Button></div>
          <DataTable<Subscription>
            data={subscriptions}
            getRowKey={(item) => item.id}
            columns={[
              { key: 'name', header: 'Nama', render: (item) => { const accent = itemAccentVars(item.color); return <div className="table-title"><span className={clsx('mini-icon', accent ? 'has-accent' : 'info')} style={accent}><AppIcon name="subscription" /></span><strong>{item.name}</strong></div>; } },
              { key: 'wallet', header: 'Dompet', render: (item) => item.wallet_id },
              { key: 'cycle', header: 'Siklus', render: (item) => cycleLabel(item.billing_cycle) },
              { key: 'amount', header: 'Jumlah', align: 'right', render: (item) => <Amount value={item.amount_minor} type="expense" /> },
              { key: 'renewal', header: 'Perpanjangan Berikutnya', render: (item) => item.next_due_date },
              { key: 'status', header: 'Status', render: (item) => <Badge tone={statusTone(item.status)}>{statusLabel(item.status)}</Badge> },
              { key: 'action', header: 'Aksi', render: (item) => <div className="inline-actions"><Button to={`/subscriptions/${item.id}/pay`} size="small">Bayar</Button><Button size="small" variant="danger" onClick={() => setTarget(item)}><AppIcon name="delete" /></Button></div> },
            ]}
          />
        </Card>
      </div>

      <Modal
        open={!!target}
        title="Hapus Langganan"
        description="Tindakan ini menghapus langganan beserta riwayat pembayarannya."
        onClose={() => (deleteMut.isPending ? null : setTarget(null))}
      >
        <div className="readiness-list">
          <div><span>Nama</span><strong>{target?.name}</strong></div>
          <div><span>Jumlah</span><strong>{target ? <Amount value={target.amount_minor} type="expense" /> : null}</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setTarget(null)} disabled={deleteMut.isPending}>Batal</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleteMut.isPending}>{deleteMut.isPending ? 'Menghapus...' : 'Hapus Langganan'}</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
