import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { mockRecurringRules } from '../../data/mockRecurring';
import type { RecurringRun } from '../../types/recurring';

const tone = (status: RecurringRun['status']) => status === 'success' ? 'green' : status === 'skipped' ? 'orange' : 'red';

export function RecurringHistoryPage() {
  const { id } = useParams();
  const rule = mockRecurringRules.find((item) => item.id === id) ?? mockRecurringRules[0];

  return (
    <AppLayout title="Run History" description="Execution history for recurring transaction rule.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Run History</span><h2>{rule.title}</h2><p>History membantu audit scheduler, manual run, skipped run, dan failed run.</p></div><div className="app-hero-actions"><Button to={`/recurring/${rule.id}`}>Back</Button><Button to={`/recurring/${rule.id}/run`} variant="primary"><AppIcon name="run" /> Manual Run</Button></div></section>
        <Card className="panel-card"><div className="panel-head"><div><h3>Execution History</h3><p>Data dari recurring_transaction_runs.</p></div><Button to="/recurring" size="small"><AppIcon name="list" /> All Rules</Button></div><DataTable<RecurringRun> data={rule.runHistory} getRowKey={(run) => run.id} columns={[{ key: 'scheduled', header: 'Scheduled At', render: (run) => run.scheduledAt }, { key: 'executed', header: 'Executed At', render: (run) => run.executedAt }, { key: 'status', header: 'Status', render: (run) => <Badge tone={tone(run.status)}>{run.status}</Badge> }, { key: 'transaction', header: 'Transaction', render: (run) => run.transactionId ? <Badge tone="blue">{run.transactionId}</Badge> : '-' }, { key: 'message', header: 'Message', render: (run) => run.message }]} /></Card>
      </div>
    </AppLayout>
  );
}
