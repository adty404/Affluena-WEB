import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useQuickEntryTemplates, useExecuteQuickEntryTemplate, useDeleteQuickEntryTemplate } from '../../hooks/useQuickEntry';
import { useWallets } from '../../hooks/useWallets';
import { useCategories } from '../../hooks/useCategories';
import { useToast } from '../../components/ui/Toast';
import { categoryLabel, createNameById, walletPairLabel } from '../../lib/financeLabels';
import { NAV } from '../../lib/copy';
import type { QuickEntryTemplate } from '../../types/quickEntry';

export function QuickEntryPage() {
  const { data, isLoading, error } = useQuickEntryTemplates();
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  const executeMutation = useExecuteQuickEntryTemplate();
  const deleteMutation = useDeleteQuickEntryTemplate();
  const { showToast } = useToast();
  const [target, setTarget] = useState<QuickEntryTemplate | null>(null);

  if (isLoading) return <AppLayout title={NAV.catatCepat} description="Memuat..."><div className="p-8">Memuat...</div></AppLayout>;
  if (error) return <AppLayout title={NAV.catatCepat} description="Memuat..."><div className="p-8 text-red-500">Gagal memuat template catat cepat</div></AppLayout>;

  const templates = data?.templates || [];
  const walletNameById = createNameById(walletsData?.wallets ?? []);
  const categoryNameById = createNameById(categoriesData?.categories ?? []);

  const handleExecute = async (id: string) => {
    try {
      await executeMutation.mutateAsync({ id });
      showToast('Transaksi berhasil dibuat');
    } catch (error) {
      showToast('Gagal membuat transaksi');
    }
  };

  const confirmDelete = () => {
    if (!target) return;
    deleteMutation.mutate(target.id, {
      onSuccess: () => {
        showToast('Template berhasil dihapus');
        setTarget(null);
      },
      onError: (err: any) => showToast(err?.message || 'Gagal menghapus template'),
    });
  };

  return (
    <AppLayout title={NAV.catatCepat} description="Template siap pakai untuk transaksi rutin.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● {NAV.catatCepat}</span><h2>Template transaksi rutin agar pencatatan harian makin cepat.</h2><p>Simpan detail transaksi yang sering berulang, lalu jalankan kapan saja dalam sekali klik.</p></div>
          <div className="app-hero-actions"><Button to="/quick-entry/new" variant="primary">+ Template</Button><Button to="/transactions/new">Transaksi Manual</Button></div>
        </section>
        
        {templates.length > 0 ? (
          <section className="master-grid cards-3">
            {templates.map((item) => (
              <Card key={item.id} className="quick-entry-card">
                <div className="qe-header">
                  <div className="qe-title">
                    <span className="mini-icon info"><AppIcon name={item.type === 'income' ? 'receivable' : item.type === 'expense' ? 'payable' : 'transactions'} /></span>
                    <strong>{item.name}</strong>
                  </div>
                  <div className="inline-actions">
                    <Button to={`/quick-entry/${item.id}/edit`} size="small" variant="ghost"><AppIcon name="edit" /></Button>
                    <Button size="small" variant="ghost" onClick={() => setTarget(item)} aria-label="Hapus template"><AppIcon name="delete" /></Button>
                  </div>
                </div>
                <div className="qe-amount">
                  <Amount value={item.amount_minor} type={item.type === 'income' ? 'income' : 'expense'} />
                </div>
                <div className="qe-meta">
                  <small><span>Dompet</span><strong>{walletPairLabel(walletNameById, item.wallet_id, item.to_wallet_id)}</strong></small>
                  <small><span>Kategori</span><strong>{categoryLabel(categoryNameById, item.category_id, item.type)}</strong></small>
                </div>
                <div className="qe-action">
                  <Button 
                    variant="primary" 
                    className="w-full" 
                    onClick={() => handleExecute(item.id)}
                    disabled={executeMutation.isPending}
                  >
                    <AppIcon name="run" /> {executeMutation.isPending ? 'Menjalankan...' : 'Jalankan'}
                  </Button>
                </div>
              </Card>
            ))}
          </section>
        ) : (
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Belum Ada Template</h3><p>Template pertamamu akan muncul di sini.</p></div></div>
            <EmptyState icon={<AppIcon name="run" />} title="Belum ada template catat cepat" description="Buat template untuk transaksi yang sering kamu catat, seperti makan siang, transportasi, atau penghasilan freelance." action={<Button to="/quick-entry/new" variant="primary">+ Buat Template</Button>} />
          </Card>
        )}
      </div>

      <Modal
        open={!!target}
        title="Hapus Template"
        description="Tindakan ini menghapus template catat cepat. Transaksi yang sudah dibuat tidak terpengaruh."
        onClose={() => (deleteMutation.isPending ? null : setTarget(null))}
      >
        <div className="readiness-list">
          <div><span>Template</span><strong>{target?.name}</strong></div>
          <div><span>Jumlah</span><strong>{target ? <Amount value={target.amount_minor} type={target.type === 'income' ? 'income' : 'expense'} /> : null}</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setTarget(null)} disabled={deleteMutation.isPending}>Batal</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? 'Menghapus...' : 'Hapus Template'}</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
