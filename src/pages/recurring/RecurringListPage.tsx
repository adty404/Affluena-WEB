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
import { useRecurringRules, useDeleteRecurringRule } from '../../hooks/useRecurring';
import { NAV } from '../../lib/copy';
import type { RecurringRule } from '../../types/recurring';

const statusTone = (status: RecurringRule['status']) => status === 'active' ? 'green' : status === 'paused' ? 'orange' : 'gray';
const statusLabel = (status: RecurringRule['status']) => status === 'active' ? 'Aktif' : status === 'paused' ? 'Dijeda' : 'Dibatalkan';
const typeIcon = (type: RecurringRule['type']) => type === 'income' ? 'receivable' : type === 'expense' ? 'payable' : 'transactions';
const typeLabel = (type: RecurringRule['type']) => type === 'income' ? 'Pemasukan' : type === 'expense' ? 'Pengeluaran' : type === 'transfer' ? 'Transfer' : 'Penyesuaian';
const frequencyLabel = (frequency: RecurringRule['frequency']) => frequency === 'weekly' ? 'Mingguan' : 'Bulanan';
const amountTone = (type: RecurringRule['type']) => type === 'income' ? 'income' : 'expense';
const iconTone = (type: RecurringRule['type'], status: RecurringRule['status']) => status === 'paused' ? 'warning' : type === 'income' ? 'safe' : type === 'expense' ? 'danger' : 'info';

export function RecurringListPage() {
  const { data, isLoading, error } = useRecurringRules();
  const deleteMut = useDeleteRecurringRule();
  const { showToast } = useToast();
  const [target, setTarget] = useState<RecurringRule | null>(null);

  if (isLoading) return <AppLayout title={NAV.berulang} description="Memuat..."><div className="p-8">Memuat...</div></AppLayout>;
  if (error) return <AppLayout title={NAV.berulang} description="Gagal memuat"><div className="p-8 text-red-500">Gagal memuat aturan berulang. Periksa koneksi lalu coba lagi.</div></AppLayout>;

  const rules = data?.recurring_transactions || [];

  const confirmDelete = () => {
    if (!target) return;
    deleteMut.mutate(target.id, {
      onSuccess: () => {
        showToast('Aturan berulang berhasil dihapus');
        setTarget(null);
      },
      onError: (err: any) => showToast(err?.message || 'Gagal menghapus aturan berulang'),
    });
  };

  const activeCount = rules.filter(r => r.status === 'active').length;
  const pausedCount = rules.filter(r => r.status === 'paused').length;
  const monthlyIncome = rules.filter(r => r.type === 'income' && r.status === 'active').reduce((sum, r) => sum + r.amount_minor, 0);
  const monthlyOutflow = rules.filter(r => r.type === 'expense' && r.status === 'active').reduce((sum, r) => sum + r.amount_minor, 0);

  return (
    <AppLayout title={NAV.berulang} description="Aturan berulang, jalankan manual, dan riwayat eksekusi.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● {NAV.berulang}</span><h2>Otomatisasi transaksi berulang dengan kontrol manual yang aman.</h2><p>Transaksi rutin tercatat otomatis sesuai jadwal — kamu tetap bisa menjalankannya manual kapan saja.</p></div>
          <div className="app-hero-actions"><Button to="/recurring/new" variant="primary"><AppIcon name="add" /> Tambah Aturan</Button>{rules[0] ? <Button to={`/recurring/${rules[0].id}/history`}><AppIcon name="history" /> Riwayat Eksekusi</Button> : null}</div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Aturan Aktif</span><strong>{activeCount}</strong><small>Berjalan</small></Card>
          <Card className="stat-card orange"><span>Dijeda</span><strong>{pausedCount}</strong><small>Perlu ditinjau</small></Card>
          <Card className="stat-card"><span>Pemasukan Bulanan</span><strong><Amount value={monthlyIncome} type="income" /></strong><small>Pemasukan otomatis</small></Card>
          <Card className="stat-card purple"><span>Pengeluaran Bulanan</span><strong><Amount value={monthlyOutflow} type="expense" /></strong><small>Pengeluaran otomatis</small></Card>
        </section>

        <section className="entity-card-grid stable-card-grid">
          {rules.slice(0, 3).map((rule) => (
            <FinanceOverviewCard
              key={rule.id}
              title={rule.name}
              subtitle={`${frequencyLabel(rule.frequency)} · berikutnya ${new Date(rule.next_run_at).toLocaleDateString()}`}
              icon={typeIcon(rule.type)}
              iconTone={iconTone(rule.type, rule.status)}
              badge={statusLabel(rule.status)}
              badgeTone={statusTone(rule.status)}
              amount={rule.amount_minor}
              amountType={amountTone(rule.type)}
              accentColor={rule.color}
              description={rule.note}
              metaLeft={rule.to_wallet_id ? `${rule.wallet_id} → ${rule.to_wallet_id}` : rule.wallet_id}
              metaRight={rule.category_id ?? typeLabel(rule.type)}
              actions={<><Button to={`/recurring/${rule.id}`} size="small">Detail</Button><Button to={`/recurring/${rule.id}/run`} size="small" variant="primary"><AppIcon name="run" /> Jalankan</Button><Button size="small" variant="danger" onClick={() => setTarget(rule)}><AppIcon name="delete" /> Hapus</Button></>}
            />
          ))}
        </section>

        {rules.length === 0 && (
          <Card className="panel-card">
            <EmptyState icon={<AppIcon name="recurring" />} title="Belum ada aturan berulang" description="Buat aturan untuk mencatat pemasukan atau pengeluaran rutin secara otomatis." action={<Button to="/recurring/new" variant="primary"><AppIcon name="add" /> Tambah Aturan</Button>} />
          </Card>
        )}

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Daftar Aturan Berulang</h3><p>Semua aturan dan status eksekusinya.</p></div><Button to="/recurring/new" size="small" variant="primary"><AppIcon name="add" /> Tambah</Button></div>
          <DataTable<RecurringRule>
            data={rules}
            getRowKey={(rule) => rule.id}
            columns={[
              { key: 'title', header: 'Aturan', render: (rule) => { const accent = itemAccentVars(rule.color); return <div className="table-title"><span className={clsx('mini-icon', accent ? 'has-accent' : 'info')} style={accent}><AppIcon name={typeIcon(rule.type)} /></span><strong>{rule.name}</strong><small>{typeLabel(rule.type)} · {frequencyLabel(rule.frequency)}</small></div>; } },
              { key: 'wallet', header: 'Dompet', render: (rule) => rule.to_wallet_id ? `${rule.wallet_id} → ${rule.to_wallet_id}` : rule.wallet_id },
              { key: 'amount', header: 'Jumlah', align: 'right', render: (rule) => <Amount value={rule.amount_minor} type={amountTone(rule.type)} /> },
              { key: 'next', header: 'Eksekusi Berikutnya', render: (rule) => new Date(rule.next_run_at).toLocaleDateString() },
              { key: 'status', header: 'Status', render: (rule) => <Badge tone={statusTone(rule.status)}>{statusLabel(rule.status)}</Badge> },
              { key: 'action', header: 'Aksi', render: (rule) => <div className="inline-actions"><Button to={`/recurring/${rule.id}`} size="small">Lihat</Button><Button to={`/recurring/${rule.id}/edit`} size="small">Edit</Button><Button to={`/recurring/${rule.id}/run`} size="small">Jalankan</Button><Button size="small" variant="danger" onClick={() => setTarget(rule)}><AppIcon name="delete" /></Button></div> },
            ]}
          />
        </Card>
      </div>

      <Modal
        open={!!target}
        title="Hapus Aturan Berulang"
        description="Tindakan ini menghapus aturan. Riwayat eksekusi yang sudah tercatat tidak ikut terhapus."
        onClose={() => (deleteMut.isPending ? null : setTarget(null))}
      >
        <div className="readiness-list">
          <div><span>Aturan</span><strong>{target?.name}</strong></div>
          <div><span>Jumlah</span><strong>{target ? <Amount value={target.amount_minor} type={target.type === 'income' ? 'income' : 'expense'} /> : null}</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setTarget(null)} disabled={deleteMut.isPending}>Batal</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleteMut.isPending}>{deleteMut.isPending ? 'Menghapus...' : 'Hapus Aturan'}</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
