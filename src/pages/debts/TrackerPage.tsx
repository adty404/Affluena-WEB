import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { mockDebts, mockInstallments, mockSubscriptions, debtSummary } from '../../data/mockDebtTracker';

type TrackerItem = { id: string; title: string; module: string; walletName: string; amount: number; dueDate: string; status: string; to: string };

const trackerItems: TrackerItem[] = [
  ...mockDebts.map((item) => ({ id: item.id, title: item.title, module: 'Debt', walletName: item.walletName, amount: item.remainingAmount, dueDate: item.dueDate, status: item.status, to: `/debts/${item.id}` })),
  ...mockInstallments.map((item) => ({ id: item.id, title: item.name, module: 'Installment', walletName: item.walletName, amount: item.monthlyAmount, dueDate: item.nextDueDate, status: item.status, to: `/installments/${item.id}/pay` })),
  ...mockSubscriptions.map((item) => ({ id: item.id, title: item.name, module: 'Subscription', walletName: item.walletName, amount: item.amount, dueDate: item.nextRenewalDate, status: item.status, to: `/subscriptions/${item.id}/pay` })),
];

export function TrackerPage() {
  const totalDue = mockInstallments.reduce((sum, item) => sum + item.monthlyAmount, 0) + mockSubscriptions.reduce((sum, item) => sum + item.amount, 0) + debtSummary.totalPayable;

  return (
    <AppLayout title="Tracker Overview" description="Unified due calendar for debts, installments, and subscriptions.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Tracker</span><h2>Semua kewajiban berkala terlihat dalam satu pusat kontrol.</h2><p>Due calendar menggabungkan debt, installment, subscription, serta reminder H-3 dan overdue.</p></div>
          <div className="app-hero-actions"><Button to="/debts/new/payable"><AppIcon name="payable" /> Add Debt</Button><Button to="/installments/new"><AppIcon name="installment" /> Add Installment</Button><Button to="/subscriptions/new" variant="primary"><AppIcon name="subscription" /> Add Subscription</Button></div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card orange"><span>Total Due Scope</span><strong><Amount value={totalDue} type="expense" /></strong><small>Debt + installment + subs</small></Card>
          <Card className="stat-card"><span>Due Soon</span><strong>{debtSummary.dueSoon}</strong><small>Next 7 days</small></Card>
          <Card className="stat-card blue"><span>Subscriptions</span><strong>{mockSubscriptions.length}</strong><small>Renewal tracked</small></Card>
          <Card className="stat-card purple"><span>Installments</span><strong>{mockInstallments.length}</strong><small>Tenor tracked</small></Card>
        </section>

        <section className="dashboard-grid tracker-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Due Calendar</h3><p>Calendar style cards, responsive and readable on mobile.</p></div><Button to="/recurring" size="small"><AppIcon name="recurring" /> Automation</Button></div>
            <div className="due-calendar-grid">
              <div className="due-day today"><strong>14</strong><span>Today</span></div>
              <div className="due-day warn"><strong>15</strong><span>H-3 Split Bill</span></div>
              <div className="due-day"><strong>16</strong><span>No due</span></div>
              <div className="due-day warn"><strong>17</strong><span>H-3 KTA</span></div>
              <div className="due-day danger"><strong>18</strong><span>Split Bill</span></div>
              <div className="due-day blue"><strong>19</strong><span>Netflix</span></div>
              <div className="due-day danger"><strong>20</strong><span>KTA + Car</span></div>
            </div>
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Priority Queue</h3><p>Action paling penting untuk hari ini.</p></div></div>
            <div className="compact-action-list">
              <Button to="/debts/debt-friend-loan/pay" full><AppIcon name="receivable" /> Collect overdue receivable</Button>
              <Button to="/debts/debt-dinner-split/pay" full><AppIcon name="pay" /> Record split bill payment</Button>
              <Button to="/subscriptions/sub-netflix/pay" full><AppIcon name="subscription" /> Pay Netflix renewal</Button>
              <Button to="/installments/inst-car/pay" full><AppIcon name="installment" /> Pay car installment</Button>
            </div>
          </Card>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Unified Tracker Table</h3><p>All financial commitments with clear next action.</p></div></div>
          <DataTable<TrackerItem>
            data={trackerItems}
            getRowKey={(item) => `${item.module}-${item.id}`}
            columns={[
              { key: 'title', header: 'Item', render: (item) => <div className="table-title"><span className="mini-icon safe"><AppIcon name={item.module === 'Debt' ? 'debt' : item.module === 'Installment' ? 'installment' : 'subscription'} /></span><strong>{item.title}</strong><small>{item.module}</small></div> },
              { key: 'wallet', header: 'Wallet', render: (item) => item.walletName },
              { key: 'amount', header: 'Amount', align: 'right', render: (item) => <Amount value={item.amount} type="expense" /> },
              { key: 'due', header: 'Due', render: (item) => item.dueDate },
              { key: 'status', header: 'Status', render: (item) => <Badge tone={item.status.includes('due') || item.status.includes('final') ? 'orange' : item.status.includes('overdue') ? 'red' : 'blue'}>{item.status.replace('_', ' ')}</Badge> },
              { key: 'action', header: 'Action', render: (item) => <Button to={item.to} size="small">Open</Button> },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
