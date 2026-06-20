import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useCategories } from '../../hooks/useCategories';
import { useRecurringRule } from '../../hooks/useRecurring';
import { useWallets } from '../../hooks/useWallets';
import { categoryLabel, createNameById, walletLabel } from '../../lib/financeLabels';
import type { RecurringRun } from '../../types/recurring';

const statusTone = (status: string) => status === 'active' || status === 'success' ? 'green' : status === 'paused' || status === 'skipped' ? 'orange' : status === 'cancelled' ? 'gray' : 'red';

export function RecurringDetailPage() {
  const { id } = useParams();
  const { data: rule, isLoading, error } = useRecurringRule(id || '');
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  const walletNameById = createNameById(walletsData?.wallets ?? []);
  const categoryNameById = createNameById(categoriesData?.categories ?? []);

  if (isLoading) return <AppLayout title="Recurring Detail" description="Loading..."><div className="p-8">Loading...</div></AppLayout>;
  if (error || !rule) return <AppLayout title="Recurring Detail" description="Loading..."><div className="p-8 text-red-500">Error loading recurring rule</div></AppLayout>;

  // Mock run history since it's not in the rule object directly from the API
  // In a real app, we would fetch this from a separate endpoint or it would be included
  const runHistory: RecurringRun[] = [];
  const sourceWallet = walletLabel(walletNameById, rule.wallet_id);
  const destinationWallet = walletLabel(walletNameById, rule.to_wallet_id);
  const ruleCategory = categoryLabel(categoryNameById, rule.category_id, rule.type);

  return (
    <AppLayout title="Recurring Detail" description="Rule configuration, next run, and recent execution history.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● {rule.status}</span><h2>{rule.name}</h2><p>{rule.note}</p></div>
          <div className="app-hero-actions"><Button to="/recurring">Back</Button><Button to={`/recurring/${rule.id}/edit`}><AppIcon name="edit" /> Edit</Button><Button to={`/recurring/${rule.id}/run`} variant="primary"><AppIcon name="run" /> Manual Run</Button></div>
        </section>
        
        <section className="stat-grid">
          <Card className="stat-card"><span>Amount</span><strong><Amount value={rule.amount_minor} type={rule.type === 'income' ? 'income' : 'expense'} /></strong><small>{rule.type}</small></Card>
          <Card className="stat-card blue"><span>Frequency</span><strong>{rule.frequency}</strong><small>caldate schedule</small></Card>
          <Card className="stat-card orange"><span>Next Run</span><strong>{new Date(rule.next_run_at).toLocaleDateString()}</strong><small>scheduler target</small></Card>
          <Card className="stat-card"><span>Status</span><strong>{rule.status}</strong><small>{sourceWallet}</small></Card>
        </section>
        
        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Run History</h3><p>Audit trail dari recurring_transaction_runs.</p></div><Button to={`/recurring/${rule.id}/history`} size="small"><AppIcon name="history" /> Full History</Button></div>
            <DataTable<RecurringRun> 
              data={runHistory} 
              getRowKey={(run) => run.id} 
              columns={[
                { key: 'scheduled', header: 'Scheduled', render: (run) => new Date(run.scheduled_for).toLocaleString() }, 
                { key: 'executed', header: 'Executed', render: (run) => new Date(run.created_at).toLocaleString() }, 
                { key: 'status', header: 'Type', render: (run) => <Badge tone="blue">{run.run_type}</Badge> }, 
                { key: 'tx', header: 'Transaction', render: (run) => run.transaction_id ? <Badge tone="green">{run.transaction_id}</Badge> : '-' }
              ]} 
            />
          </Card>
          
          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Rule Metadata</h3><p>Konfigurasi utama rule.</p></div></div>
            <div className="metric-list">
              <div><span>Source wallet</span><strong>{sourceWallet}</strong></div>
              {rule.to_wallet_id ? <div><span>Destination</span><strong>{destinationWallet}</strong></div> : null}
              <div><span>Category</span><strong>{ruleCategory}</strong></div>
              <div><span>Status</span><strong><Badge tone={statusTone(rule.status)}>{rule.status}</Badge></strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
