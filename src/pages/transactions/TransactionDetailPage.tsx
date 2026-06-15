import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Amount } from '../../components/finance/Amount';
import { mockTransactions, transactionTypeLabels } from '../../data/mockTransactions';

export function TransactionDetailPage() {
  const { id } = useParams();
  const transaction = mockTransactions.find((item) => item.id === id) ?? mockTransactions[0];
  const amountVariant = transaction.type === 'income' ? 'income' : transaction.type === 'expense' ? 'expense' : 'neutral';
  return (
    <AppLayout title="Transaction Detail" description="Transaction metadata, balance impact, tags, and activity timeline.">
      <div className="dashboard-page grid-stack"><section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Detail</span><h2>{transaction.title}</h2><p>{transaction.note}</p></div><div className="app-hero-actions"><Button to="/transactions">Back</Button><Button to={`/transactions/${transaction.id}/edit`} variant="primary">Edit</Button></div></section><section className="stat-grid"><Card className="stat-card"><span>Amount</span><strong><Amount value={transaction.amount} variant={amountVariant} /></strong><small>{transactionTypeLabels[transaction.type]}</small></Card><Card className="stat-card blue"><span>Wallet</span><strong>{transaction.walletName}</strong><small>{transaction.destinationWalletName ?? 'Primary wallet'}</small></Card><Card className="stat-card orange"><span>Category</span><strong>{transaction.categoryName ?? '—'}</strong><small>Optional for transfer/adjustment</small></Card><Card className="stat-card purple"><span>Status</span><strong>{transaction.status}</strong><small>Posted transaction</small></Card></section><section className="dashboard-grid"><Card className="panel-card"><div className="panel-head"><div><h3>Transaction Metadata</h3><p>Detail field yang siap dihubungkan ke backend.</p></div></div><div className="info-grid"><div><span>ID</span><strong>{transaction.id}</strong></div><div><span>Date</span><strong>{transaction.date}</strong></div><div><span>Type</span><strong>{transactionTypeLabels[transaction.type]}</strong></div><div><span>Tags</span><strong>{transaction.tags.map((tag) => `#${tag}`).join(', ')}</strong></div></div></Card><Card className="panel-card"><div className="panel-head"><div><h3>Activity Timeline</h3><p>Audit trail transaksi.</p></div></div><div className="timeline-list"><div><span>✓</span><strong>Transaction created</strong><small>Balance delta applied.</small></div><div><span>↻</span><strong>Update guardrail active</strong><small>Reverse old delta before applying new delta.</small></div><div><span>⌁</span><strong>Tags linked</strong><small>{transaction.tags.length} tag(s) attached.</small></div></div></Card></section></div>
    </AppLayout>
  );
}
