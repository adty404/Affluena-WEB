import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Amount } from '../../components/finance/Amount';
import { transactionTypeLabels } from '../../data/mockTransactions';
import { useTransaction, useDeleteTransaction } from '../../hooks/useTransactions';
import { useWallets } from '../../hooks/useWallets';
import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';
import { useToast } from '../../components/ui/Toast';
import { NAV } from '../../lib/copy';

export function TransactionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const { data: transaction, isLoading, error } = useTransaction(id);
  const deleteMutation = useDeleteTransaction();
  
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  const { data: tagsData } = useTags();

  if (isLoading) return <AppLayout title="Detail Transaksi" description="Memuat detail transaksi"><p>Memuat...</p></AppLayout>;
  if (error || !transaction) return <AppLayout title="Detail Transaksi" description="Memuat detail transaksi"><p>Gagal memuat transaksi.</p></AppLayout>;

  const amountVariant = transaction.type === 'income' ? 'income' : transaction.type === 'expense' ? 'expense' : 'neutral';
  
  const wallet = (walletsData?.wallets ?? []).find(w => w.id === transaction.wallet_id);
  const toWallet = (walletsData?.wallets ?? []).find(w => w.id === transaction.to_wallet_id);
  const category = (categoriesData?.categories ?? []).find(c => c.id === transaction.category_id);
  const tags = tagsData?.tags?.filter(t => transaction.tag_ids?.includes(t.id)) || [];

  const handleDelete = () => {
    if (window.confirm('Yakin ingin menghapus transaksi ini?')) {
      deleteMutation.mutate(transaction.id, {
        onSuccess: () => {
          showToast('Transaksi berhasil dihapus');
          navigate('/transactions');
        },
        onError: (err: any) => {
          showToast(err.message || 'Gagal menghapus transaksi');
        }
      });
    }
  };

  return (
    <AppLayout title="Detail Transaksi" description="Rincian transaksi, dampak saldo, tag, dan riwayat aktivitas.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Detail</span>
            <h2>{category?.name || transaction.note || transactionTypeLabels[transaction.type]}</h2>
            <p>{transaction.note}</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/transactions">Kembali</Button>
            <Button to={`/transactions/${transaction.id}/edit`} variant="primary">Edit</Button>
            <Button onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
            </Button>
          </div>
        </section>
        <section className="stat-grid">
          <Card className="stat-card">
            <span>Jumlah</span>
            <strong><Amount value={transaction.amount_minor} variant={amountVariant} /></strong>
            <small>{transactionTypeLabels[transaction.type]}</small>
          </Card>
          <Card className="stat-card blue">
            <span>Dompet</span>
            <strong>{wallet?.name || 'Tidak diketahui'}</strong>
            <small>{toWallet ? `→ ${toWallet.name}` : 'Dompet utama'}</small>
          </Card>
          <Card className="stat-card orange">
            <span>Kategori</span>
            <strong>{category?.name ?? '—'}</strong>
            <small>Opsional untuk transfer/penyesuaian</small>
          </Card>
          <Card className="stat-card purple">
            <span>Tanggal</span>
            <strong>{new Date(transaction.transaction_at).toLocaleDateString()}</strong>
            <small>Transaksi tercatat</small>
          </Card>
        </section>
        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head">
              <div><h3>Rincian Transaksi</h3><p>Informasi lengkap transaksi ini.</p></div>
            </div>
            <div className="info-grid">
              <div><span>ID</span><strong>{transaction.id}</strong></div>
              <div><span>Tanggal</span><strong>{new Date(transaction.transaction_at).toLocaleString()}</strong></div>
              <div><span>Tipe</span><strong>{transactionTypeLabels[transaction.type]}</strong></div>
              <div><span>Tag</span><strong>{tags.map((tag) => `#${tag.name}`).join(', ') || '—'}</strong></div>
            </div>
          </Card>
          <Card className="panel-card">
            <div className="panel-head">
              <div><h3>{NAV.riwayatAktivitas}</h3><p>Riwayat perubahan transaksi ini.</p></div>
            </div>
            <div className="timeline-list">
              <div><span>✓</span><strong>Transaksi dibuat</strong><small>{new Date(transaction.created_at).toLocaleString()}</small></div>
              <div><span>↻</span><strong>Terakhir diperbarui</strong><small>{new Date(transaction.updated_at).toLocaleString()}</small></div>
              <div><span>⌁</span><strong>Tag tertaut</strong><small>{tags.length} tag terpasang.</small></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
