import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useDebts } from '../../hooks/useDebts';
import { useInstallments, useSubscriptions } from '../../hooks/useTrackers';

type TrackerItem = { id: string; title: string; module: string; walletName: string; amount: number; dueDate: string; status: string; to: string };

export function TrackerPage() {
  const { data: debtsData, isLoading: isLoadingDebts } = useDebts();
  const { data: installmentsData, isLoading: isLoadingInstallments } = useInstallments();
  const { data: subscriptionsData, isLoading: isLoadingSubscriptions } = useSubscriptions();

  const debts = debtsData?.debts ?? [];
  const installments = installmentsData?.installments ?? [];
  const subscriptions = subscriptionsData?.subscriptions ?? [];

  const trackerItems: TrackerItem[] = [
    ...debts.map((item) => ({ id: item.id, title: item.counterparty_name, module: 'Debt', walletName: item.wallet_id, amount: item.remaining_amount_minor, dueDate: item.due_date || 'N/A', status: item.status, to: `/debts/${item.id}` })),
    ...installments.map((item) => ({ id: item.id, title: item.name, module: 'Installment', walletName: item.wallet_id, amount: item.monthly_amount_minor, dueDate: `Day ${item.due_day}`, status: item.status, to: `/installments/${item.id}/pay` })),
    ...subscriptions.map((item) => ({ id: item.id, title: item.name, module: 'Subscription', walletName: item.wallet_id, amount: item.amount_minor, dueDate: item.next_due_date, status: item.status, to: `/subscriptions/${item.id}/pay` })),
  ];

  const totalDue = installments.reduce((sum, item) => sum + item.monthly_amount_minor, 0) + subscriptions.reduce((sum, item) => sum + item.amount_minor, 0) + debts.filter(d => d.type === 'payable' && d.status === 'open').reduce((sum, item) => sum + item.remaining_amount_minor, 0);
  const dueSoon = debts.filter(d => d.status === 'open' && d.due_date).length; // Simplified

  const isLoading = isLoadingDebts || isLoadingInstallments || isLoadingSubscriptions;

  return (
    <AppLayout title="Tracker Overview" description="Unified due calendar for debts, installments, and subscriptions.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Tracker</span><h2>Semua kewajiban berkala terlihat dalam satu pusat kontrol.</h2><p>Due calendar menggabungkan debt, installment, subscription, serta reminder H-3 dan overdue.</p></div>
          <div className="app-hero-actions"><Button to="/debts/new/payable"><AppIcon name="payable" /> Add Debt</Button><Button to="/installments/new"><AppIcon name="installment" /> Add Installment</Button><Button to="/subscriptions/new" variant="primary"><AppIcon name="subscription" /> Add Subscription</Button></div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card orange"><span>Total Due Scope</span><strong><Amount value={totalDue} type="expense" /></strong><small>Debt + installment + subs</small></Card>
          <Card className="stat-card"><span>Due Soon</span><strong>{dueSoon}</strong><small>open debts</small></Card>
          <Card className="stat-card blue"><span>Subscriptions</span><strong>{subscriptions.length}</strong><small>Renewal tracked</small></Card>
          <Card className="stat-card purple"><span>Installments</span><strong>{installments.length}</strong><small>Tenor tracked</small></Card>
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
              <Button to="/debts" full><AppIcon name="receivable" /> View Debts</Button>
              <Button to="/installments" full><AppIcon name="installment" /> View Installments</Button>
              <Button to="/subscriptions" full><AppIcon name="subscription" /> View Subscriptions</Button>
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
