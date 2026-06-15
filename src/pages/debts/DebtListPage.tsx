import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { FinanceOverviewCard } from '../../components/finance/FinanceOverviewCard';
import { mockDebts, debtSummary } from '../../data/mockDebtTracker';
import type { Debt } from '../../types/debt';

const tone = (status: Debt['status']) => status === 'overdue' ? 'red' : status === 'due_soon' ? 'orange' : status === 'paid' ? 'green' : 'blue';
const label = (status: Debt['status']) => status.replace('_', ' ');

export function DebtListPage() {
  return (
    <AppLayout title="Debt & Tracker" description="Payable, receivable, debt payment, and due reminder center.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Debt & Tracker</span>
            <h2>Lacak utang dan piutang tanpa kehilangan histori pembayaran.</h2>
            <p>Payable mengurangi wallet saat dibayar. Receivable menambah wallet saat ditagih dan diterima.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/debts/new/payable" variant="primary"><AppIcon name="payable" /> Add Payable</Button>
            <Button to="/debts/new/receivable"><AppIcon name="receivable" /> Add Receivable</Button>
            <Button to="/tracker"><AppIcon name="tracker" /> Tracker</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card orange"><span>Total Payable</span><strong><Amount value={debtSummary.totalPayable} type="expense" /></strong><small>Must be paid</small></Card>
          <Card className="stat-card"><span>Total Receivable</span><strong><Amount value={debtSummary.totalReceivable} type="income" /></strong><small>Need collection</small></Card>
          <Card className="stat-card blue"><span>Paid This Month</span><strong><Amount value={debtSummary.paidThisMonth} /></strong><small>Debt payments</small></Card>
          <Card className="stat-card purple"><span>Due Soon</span><strong>{debtSummary.dueSoon}</strong><small>{debtSummary.overdue} overdue</small></Card>
        </section>

        <section className="entity-card-grid stable-card-grid">
          {mockDebts.map((debt) => {
            const pct = Math.round((debt.paidAmount / debt.originalAmount) * 100);
            const isPayable = debt.type === 'payable';
            return (
              <FinanceOverviewCard
                key={debt.id}
                title={debt.title}
                subtitle={`${debt.counterparty} · Due ${debt.dueDate}`}
                icon={isPayable ? 'payable' : 'receivable'}
                iconTone={isPayable ? 'danger' : 'safe'}
                badge={debt.type}
                badgeTone={isPayable ? 'red' : 'green'}
                amount={debt.remainingAmount}
                amountType={isPayable ? 'expense' : 'income'}
                description={debt.note}
                progress={pct}
                progressTone={isPayable ? 'orange' : 'green'}
                metaLeft={`${pct}% settled`}
                metaRight={label(debt.status)}
                actions={<><Button to={`/debts/${debt.id}`} size="small">Detail</Button><Button to={`/debts/${debt.id}/pay`} size="small" variant="primary"><AppIcon name="pay" /> Pay</Button></>}
              />
            );
          })}
        </section>

        <Card className="panel-card">
          <div className="panel-head">
            <div><h3>Debt List</h3><p>Semua payable dan receivable dengan action jelas.</p></div>
            <div className="panel-actions"><Button to="/debts/new/payable" size="small"><AppIcon name="payable" /> Payable</Button><Button to="/debts/new/receivable" size="small" variant="primary"><AppIcon name="receivable" /> Receivable</Button></div>
          </div>
          <DataTable<Debt>
            data={mockDebts}
            getRowKey={(debt) => debt.id}
            columns={[
              { key: 'title', header: 'Debt', render: (debt) => <div className="table-title"><span className={`mini-icon ${debt.type === 'payable' ? 'danger' : 'safe'}`}><AppIcon name={debt.type === 'payable' ? 'payable' : 'receivable'} /></span><strong>{debt.title}</strong><small>{debt.counterparty}</small></div> },
              { key: 'type', header: 'Type', render: (debt) => <Badge tone={debt.type === 'payable' ? 'red' : 'green'}>{debt.type}</Badge> },
              { key: 'remaining', header: 'Remaining', align: 'right', render: (debt) => <Amount value={debt.remainingAmount} type={debt.type === 'payable' ? 'expense' : 'income'} /> },
              { key: 'due', header: 'Due', render: (debt) => debt.dueDate },
              { key: 'status', header: 'Status', render: (debt) => <Badge tone={tone(debt.status)}>{label(debt.status)}</Badge> },
              { key: 'action', header: 'Action', render: (debt) => <div className="inline-actions"><Button to={`/debts/${debt.id}`} size="small">View</Button><Button to={`/debts/${debt.id}/pay`} size="small">Pay</Button></div> },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
