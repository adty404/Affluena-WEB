import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { FinanceOverviewCard } from '../../components/finance/FinanceOverviewCard';
import { mockRecurringRules, recurringSummary } from '../../data/mockRecurring';
import type { RecurringRule } from '../../types/recurring';

const statusTone = (status: RecurringRule['status']) => status === 'active' ? 'green' : status === 'paused' ? 'orange' : 'gray';
const typeIcon = (type: RecurringRule['type']) => type === 'income' ? 'receivable' : type === 'expense' ? 'payable' : 'transactions';
const amountTone = (type: RecurringRule['type']) => type === 'income' ? 'income' : 'expense';
const iconTone = (type: RecurringRule['type'], status: RecurringRule['status']) => status === 'paused' ? 'warning' : type === 'income' ? 'safe' : type === 'expense' ? 'danger' : 'info';

export function RecurringListPage() {
  return (
    <AppLayout title="Recurring Automation" description="Recurring rules, manual run, run history, and rule status.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Automation</span><h2>Otomatisasi transaksi berulang dengan kontrol manual yang aman.</h2><p>Recurring rule menggunakan frequency, next run, status active/paused/cancelled, dan run history untuk audit.</p></div>
          <div className="app-hero-actions"><Button to="/recurring/new" variant="primary"><AppIcon name="add" /> Add Rule</Button><Button to="/recurring/rec-salary/history"><AppIcon name="history" /> Run History</Button></div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Active Rules</span><strong>{recurringSummary.active}</strong><small>Running</small></Card>
          <Card className="stat-card orange"><span>Paused</span><strong>{recurringSummary.paused}</strong><small>Needs review</small></Card>
          <Card className="stat-card"><span>Monthly Income</span><strong><Amount value={recurringSummary.monthlyIncome} type="income" /></strong><small>Auto income</small></Card>
          <Card className="stat-card purple"><span>Monthly Outflow</span><strong><Amount value={recurringSummary.monthlyOutflow} type="expense" /></strong><small>Auto expense</small></Card>
        </section>

        <section className="entity-card-grid stable-card-grid">
          {mockRecurringRules.slice(0, 3).map((rule) => (
            <FinanceOverviewCard
              key={rule.id}
              title={rule.title}
              subtitle={`${rule.frequency} · next ${rule.nextRunDate}`}
              icon={typeIcon(rule.type)}
              iconTone={iconTone(rule.type, rule.status)}
              badge={rule.status}
              badgeTone={statusTone(rule.status)}
              amount={rule.amount}
              amountType={amountTone(rule.type)}
              description={rule.note}
              metaLeft={rule.destinationWalletName ? `${rule.walletName} → ${rule.destinationWalletName}` : rule.walletName}
              metaRight={rule.categoryName ?? rule.type}
              actions={<><Button to={`/recurring/${rule.id}`} size="small">Detail</Button><Button to={`/recurring/${rule.id}/run`} size="small" variant="primary"><AppIcon name="run" /> Run</Button><Button to={`/recurring/${rule.id}/history`} size="small"><AppIcon name="history" /> History</Button></>}
            />
          ))}
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Recurring Transaction List</h3><p>Semua rule dan status eksekusinya.</p></div><Button to="/recurring/new" size="small" variant="primary"><AppIcon name="add" /> Add</Button></div>
          <DataTable<RecurringRule>
            data={mockRecurringRules}
            getRowKey={(rule) => rule.id}
            columns={[
              { key: 'title', header: 'Rule', render: (rule) => <div className="table-title"><span className="mini-icon info"><AppIcon name={typeIcon(rule.type)} /></span><strong>{rule.title}</strong><small>{rule.type} · {rule.frequency}</small></div> },
              { key: 'wallet', header: 'Wallet', render: (rule) => rule.destinationWalletName ? `${rule.walletName} → ${rule.destinationWalletName}` : rule.walletName },
              { key: 'amount', header: 'Amount', align: 'right', render: (rule) => <Amount value={rule.amount} type={amountTone(rule.type)} /> },
              { key: 'next', header: 'Next Run', render: (rule) => rule.nextRunDate },
              { key: 'status', header: 'Status', render: (rule) => <Badge tone={statusTone(rule.status)}>{rule.status}</Badge> },
              { key: 'action', header: 'Action', render: (rule) => <div className="inline-actions"><Button to={`/recurring/${rule.id}`} size="small">View</Button><Button to={`/recurring/${rule.id}/edit`} size="small">Edit</Button><Button to={`/recurring/${rule.id}/run`} size="small">Run</Button></div> },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
