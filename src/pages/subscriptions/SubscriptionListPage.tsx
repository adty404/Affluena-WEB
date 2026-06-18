import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { FinanceOverviewCard } from '../../components/finance/FinanceOverviewCard';
import { useSubscriptions } from '../../hooks/useTrackers';
import type { Subscription } from '../../types/tracker';

const statusTone = (status: Subscription['status']) => status === 'cancelled' ? 'red' : status === 'active' ? 'blue' : 'orange';

export function SubscriptionListPage() {
  const { data, isLoading } = useSubscriptions();
  const subscriptions = data?.subscriptions ?? [];

  const monthlyBurn = subscriptions.reduce((sum, item) => sum + (item.billing_cycle === 'weekly' ? item.amount_minor * 4 : item.amount_minor), 0);

  return (
    <AppLayout title="Subscriptions" description="Track renewal date, monthly burn, and subscription payments.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Subscription Tracker</span><h2>Lacak langganan digital, renewal date, dan monthly burn.</h2><p>Subscription payment dapat membuat expense transaction agar cashflow tetap akurat.</p></div>
          <div className="app-hero-actions"><Button to="/tracker"><AppIcon name="tracker" /> Tracker</Button><Button to="/subscriptions/new" variant="primary"><AppIcon name="add" /> Add Subscription</Button></div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Active Subs</span><strong>{subscriptions.length}</strong><small>Tracked services</small></Card>
          <Card className="stat-card orange"><span>Monthly Burn</span><strong><Amount value={monthlyBurn} type="expense" /></strong><small>Normalized monthly</small></Card>
          <Card className="stat-card blue"><span>Annualized</span><strong><Amount value={monthlyBurn * 12} /></strong><small>Projection</small></Card>
          <Card className="stat-card purple"><span>Due Soon</span><strong>0</strong><small>Renewals</small></Card>
        </section>

        <section className="entity-card-grid stable-card-grid">
          {subscriptions.map((item) => (
            <FinanceOverviewCard
              key={item.id}
              title={item.name}
              subtitle={`Wallet ${item.wallet_id} · ${item.billing_cycle}`}
              icon="subscription"
              iconTone="info"
              badge={item.status.replace('_', ' ')}
              badgeTone={statusTone(item.status)}
              amount={item.amount_minor}
              amountType="expense"
              description={`Paid from ${item.wallet_id}. Next renewal ${item.next_due_date}.`}
              metaLeft={item.account_detail}
              metaRight={item.billing_cycle}
              actions={<><Button to={`/subscriptions/${item.id}/pay`} size="small" variant="primary"><AppIcon name="pay" /> Pay</Button><Button to={`/subscriptions/${item.id}/edit`} size="small"><AppIcon name="edit" /> Edit</Button></>}
            />
          ))}
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Subscription List</h3><p>Renewal schedule dan action pembayaran.</p></div><Button to="/subscriptions/new" size="small" variant="primary"><AppIcon name="add" /> Add</Button></div>
          <DataTable<Subscription>
            data={subscriptions}
            getRowKey={(item) => item.id}
            columns={[
              { key: 'name', header: 'Name', render: (item) => <div className="table-title"><span className="mini-icon info"><AppIcon name="subscription" /></span><strong>{item.name}</strong></div> },
              { key: 'wallet', header: 'Wallet', render: (item) => item.wallet_id },
              { key: 'cycle', header: 'Cycle', render: (item) => item.billing_cycle },
              { key: 'amount', header: 'Amount', align: 'right', render: (item) => <Amount value={item.amount_minor} type="expense" /> },
              { key: 'renewal', header: 'Next Renewal', render: (item) => item.next_due_date },
              { key: 'status', header: 'Status', render: (item) => <Badge tone={statusTone(item.status)}>{item.status.replace('_', ' ')}</Badge> },
              { key: 'action', header: 'Action', render: (item) => <div className="inline-actions"><Button to={`/subscriptions/${item.id}/pay`} size="small">Pay</Button><Button to={`/subscriptions/${item.id}/edit`} size="small">Edit</Button></div> },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
