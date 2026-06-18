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

export function TransactionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const { data: transaction, isLoading, error } = useTransaction(id);
  const deleteMutation = useDeleteTransaction();
  
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  const { data: tagsData } = useTags();

  if (isLoading) return <AppLayout title="Transaction Detail" description="Loading transaction detail"><p>Loading...</p></AppLayout>;
  if (error || !transaction) return <AppLayout title="Transaction Detail" description="Loading transaction detail"><p>Error loading transaction.</p></AppLayout>;

  const amountVariant = transaction.type === 'income' ? 'income' : transaction.type === 'expense' ? 'expense' : 'neutral';
  
  const wallet = walletsData?.wallets.find(w => w.id === transaction.wallet_id);
  const toWallet = walletsData?.wallets.find(w => w.id === transaction.to_wallet_id);
  const category = categoriesData?.categories.find(c => c.id === transaction.category_id);
  const tags = tagsData?.tags?.filter(t => transaction.tag_ids?.includes(t.id)) || [];

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteMutation.mutate(transaction.id, {
        onSuccess: () => {
          showToast('Transaction deleted successfully');
          navigate('/transactions');
        },
        onError: (err: any) => {
          showToast(err.message || 'Failed to delete transaction');
        }
      });
    }
  };

  return (
    <AppLayout title="Transaction Detail" description="Transaction metadata, balance impact, tags, and activity timeline.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Detail</span>
            <h2>{category?.name || transaction.note || transactionTypeLabels[transaction.type]}</h2>
            <p>{transaction.note}</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/transactions">Back</Button>
            <Button to={`/transactions/${transaction.id}/edit`} variant="primary">Edit</Button>
            <Button onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </section>
        <section className="stat-grid">
          <Card className="stat-card">
            <span>Amount</span>
            <strong><Amount value={transaction.amount_minor} variant={amountVariant} /></strong>
            <small>{transactionTypeLabels[transaction.type]}</small>
          </Card>
          <Card className="stat-card blue">
            <span>Wallet</span>
            <strong>{wallet?.name || 'Unknown'}</strong>
            <small>{toWallet ? `→ ${toWallet.name}` : 'Primary wallet'}</small>
          </Card>
          <Card className="stat-card orange">
            <span>Category</span>
            <strong>{category?.name ?? '—'}</strong>
            <small>Optional for transfer/adjustment</small>
          </Card>
          <Card className="stat-card purple">
            <span>Date</span>
            <strong>{new Date(transaction.transaction_at).toLocaleDateString()}</strong>
            <small>Posted transaction</small>
          </Card>
        </section>
        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head">
              <div><h3>Transaction Metadata</h3><p>Detail field yang siap dihubungkan ke backend.</p></div>
            </div>
            <div className="info-grid">
              <div><span>ID</span><strong>{transaction.id}</strong></div>
              <div><span>Date</span><strong>{new Date(transaction.transaction_at).toLocaleString()}</strong></div>
              <div><span>Type</span><strong>{transactionTypeLabels[transaction.type]}</strong></div>
              <div><span>Tags</span><strong>{tags.map((tag) => `#${tag.name}`).join(', ') || '—'}</strong></div>
            </div>
          </Card>
          <Card className="panel-card">
            <div className="panel-head">
              <div><h3>Activity Timeline</h3><p>Audit trail transaksi.</p></div>
            </div>
            <div className="timeline-list">
              <div><span>✓</span><strong>Transaction created</strong><small>{new Date(transaction.created_at).toLocaleString()}</small></div>
              <div><span>↻</span><strong>Last updated</strong><small>{new Date(transaction.updated_at).toLocaleString()}</small></div>
              <div><span>⌁</span><strong>Tags linked</strong><small>{tags.length} tag(s) attached.</small></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
