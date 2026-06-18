import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { useRecurringRule } from '../../hooks/useRecurring';
import type { RecurringRun } from '../../types/recurring';

export function RecurringHistoryPage() {
  const { id } = useParams();
  const { data: rule, isLoading, error } = useRecurringRule(id || '');

  if (isLoading) return <AppLayout title="Run History" description="Loading..."><div className="p-8">Loading...</div></AppLayout>;
  if (error || !rule) return <AppLayout title="Run History" description="Loading..."><div className="p-8 text-red-500">Error loading recurring rule</div></AppLayout>;

  // Mock run history since it's not in the rule object directly from the API
  const runHistory: RecurringRun[] = [];

  return (
    <AppLayout title="Run History" description="Execution history for recurring transaction rule.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Run History</span><h2>{rule.name}</h2><p>History membantu audit scheduler, manual run, skipped run, dan failed run.</p></div>
          <div className="app-hero-actions"><Button to={`/recurring/${rule.id}`}>Back</Button><Button to={`/recurring/${rule.id}/run`} variant="primary"><AppIcon name="run" /> Manual Run</Button></div>
        </section>
        
        <Card className="panel-card">
          <div className="panel-head"><div><h3>Execution History</h3><p>Data dari recurring_transaction_runs.</p></div><Button to="/recurring" size="small"><AppIcon name="list" /> All Rules</Button></div>
          <DataTable<RecurringRun> 
            data={runHistory} 
            getRowKey={(run) => run.id} 
            columns={[
              { key: 'scheduled', header: 'Scheduled At', render: (run) => new Date(run.scheduled_for).toLocaleString() }, 
              { key: 'executed', header: 'Executed At', render: (run) => new Date(run.created_at).toLocaleString() }, 
              { key: 'status', header: 'Type', render: (run) => <Badge tone="blue">{run.run_type}</Badge> }, 
              { key: 'transaction', header: 'Transaction', render: (run) => run.transaction_id ? <Badge tone="green">{run.transaction_id}</Badge> : '-' }
            ]} 
          />
        </Card>
      </div>
    </AppLayout>
  );
}
