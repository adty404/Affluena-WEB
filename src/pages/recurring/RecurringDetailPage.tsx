import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { mockRecurringRules } from '../../data/mockRecurring';
import type { RecurringRun } from '../../types/recurring';

const statusTone = (status: string) => status === 'active' || status === 'success' ? 'green' : status === 'paused' || status === 'skipped' ? 'orange' : status === 'cancelled' ? 'gray' : 'red';

export function RecurringDetailPage() {
  const { id } = useParams();
  const rule = mockRecurringRules.find((item) => item.id === id) ?? mockRecurringRules[0];

  return (
    <AppLayout title="Recurring Detail" description="Rule configuration, next run, and recent execution history.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><span className="badge dark">● {rule.status}</span><h2>{rule.title}</h2><p>{rule.note}</p></div><div className="app-hero-actions"><Button to="/recurring">Back</Button><Button to={`/recurring/${rule.id}/edit`}><AppIcon name="edit" /> Edit</Button><Button to={`/recurring/${rule.id}/run`} variant="primary"><AppIcon name="run" /> Manual Run</Button></div></section>
        <section className="stat-grid"><Card className="stat-card"><span>Amount</span><strong><Amount value={rule.amount} type={rule.type === 'income' ? 'income' : 'expense'} /></strong><small>{rule.type}</small></Card><Card className="stat-card blue"><span>Frequency</span><strong>{rule.frequency}</strong><small>caldate schedule</small></Card><Card className="stat-card orange"><span>Next Run</span><strong>{rule.nextRunDate}</strong><small>scheduler target</small></Card><Card className="stat-card"><span>Status</span><strong>{rule.status}</strong><small>{rule.walletName}</small></Card></section>
        <section className="form-detail-grid"><Card className="panel-card"><div className="panel-head"><div><h3>Run History</h3><p>Audit trail dari recurring_transaction_runs.</p></div><Button to={`/recurring/${rule.id}/history`} size="small"><AppIcon name="history" /> Full History</Button></div><DataTable<RecurringRun> data={rule.runHistory} getRowKey={(run) => run.id} columns={[{ key: 'scheduled', header: 'Scheduled', render: (run) => run.scheduledAt }, { key: 'executed', header: 'Executed', render: (run) => run.executedAt }, { key: 'status', header: 'Status', render: (run) => <Badge tone={statusTone(run.status)}>{run.status}</Badge> }, { key: 'tx', header: 'Transaction', render: (run) => run.transactionId ? <Badge tone="blue">{run.transactionId}</Badge> : '-' }, { key: 'message', header: 'Message', render: (run) => run.message }]} /></Card><Card className="panel-card side-metrics-card"><div className="panel-head"><div><h3>Rule Metadata</h3><p>Konfigurasi utama rule.</p></div></div><div className="metric-list"><div><span>Source wallet</span><strong>{rule.walletName}</strong></div>{rule.destinationWalletName ? <div><span>Destination</span><strong>{rule.destinationWalletName}</strong></div> : null}<div><span>Category</span><strong>{rule.categoryName ?? 'Not used'}</strong></div><div><span>Status</span><strong><Badge tone={statusTone(rule.status)}>{rule.status}</Badge></strong></div></div></Card></section>
      </div>
    </AppLayout>
  );
}
