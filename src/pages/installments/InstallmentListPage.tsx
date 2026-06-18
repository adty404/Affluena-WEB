import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { FinanceOverviewCard } from '../../components/finance/FinanceOverviewCard';
import { useInstallments } from '../../hooks/useTrackers';
import type { Installment } from '../../types/tracker';

const statusTone = (status: Installment['status']) => status === 'cancelled' ? 'red' : status === 'paid' ? 'green' : 'blue';

export function InstallmentListPage() {
  const { data, isLoading } = useInstallments();
  const installments = data?.installments ?? [];

  const monthlyDue = installments.reduce((sum, item) => sum + item.monthly_amount_minor, 0);
  const outstanding = installments.reduce((sum, item) => sum + (item.monthly_amount_minor * item.remaining_months), 0);

  return (
    <AppLayout title="Installments" description="Track installment tenor, outstanding balance, and monthly due schedule.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Installment Tracker</span><h2>Pantau cicilan tetap, sisa tenor, dan pembayaran berikutnya.</h2><p>Setiap installment punya wallet pembayaran, monthly amount, tenor, paid count, dan reminder yang jelas.</p></div>
          <div className="app-hero-actions"><Button to="/tracker"><AppIcon name="tracker" /> Tracker</Button><Button to="/installments/new" variant="primary"><AppIcon name="add" /> Add Installment</Button></div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Active Items</span><strong>{installments.length}</strong><small>Installments</small></Card>
          <Card className="stat-card orange"><span>Monthly Due</span><strong><Amount value={monthlyDue} type="expense" /></strong><small>Fixed outflow</small></Card>
          <Card className="stat-card blue"><span>Outstanding</span><strong><Amount value={outstanding} /></strong><small>Remaining principal</small></Card>
          <Card className="stat-card purple"><span>Due Soon</span><strong>0</strong><small>Next 7 days</small></Card>
        </section>

        <section className="entity-card-grid stable-card-grid">
          {installments.map((item) => {
            const paidCount = item.tenor_months - item.remaining_months;
            const pct = item.tenor_months > 0 ? Math.round((paidCount / item.tenor_months) * 100) : 0;
            return (
              <FinanceOverviewCard
                key={item.id}
                title={item.name}
                subtitle={`${paidCount} of ${item.tenor_months} months · Wallet ${item.wallet_id}`}
                icon="installment"
                iconTone="info"
                badge={item.status.replace('_', ' ')}
                badgeTone={statusTone(item.status)}
                amount={item.monthly_amount_minor}
                amountType="expense"
                description={<>Remaining principal <Amount value={item.monthly_amount_minor * item.remaining_months} /></>}
                progress={pct}
                progressTone="blue"
                metaLeft={`${pct}% completed`}
                metaRight={`Due Day ${item.due_day}`}
                actions={<><Button to={`/installments/${item.id}/pay`} size="small" variant="primary"><AppIcon name="pay" /> Pay</Button><Button to={`/installments/${item.id}/edit`} size="small"><AppIcon name="edit" /> Edit</Button></>}
              />
            );
          })}
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Installment List</h3><p>Daftar cicilan aktif dan jadwal berikutnya.</p></div><Button to="/installments/new" size="small" variant="primary"><AppIcon name="add" /> Add</Button></div>
          <DataTable<Installment>
            data={installments}
            getRowKey={(item) => item.id}
            columns={[
              { key: 'name', header: 'Name', render: (item) => <div className="table-title"><span className="mini-icon info"><AppIcon name="installment" /></span><strong>{item.name}</strong></div> },
              { key: 'wallet', header: 'Wallet', render: (item) => item.wallet_id },
              { key: 'monthly', header: 'Monthly', align: 'right', render: (item) => <Amount value={item.monthly_amount_minor} type="expense" /> },
              { key: 'tenor', header: 'Tenor', render: (item) => `${item.tenor_months - item.remaining_months}/${item.tenor_months}` },
              { key: 'due', header: 'Due Day', render: (item) => item.due_day },
              { key: 'status', header: 'Status', render: (item) => <Badge tone={statusTone(item.status)}>{item.status.replace('_', ' ')}</Badge> },
              { key: 'action', header: 'Action', render: (item) => <div className="inline-actions"><Button to={`/installments/${item.id}/pay`} size="small">Pay</Button><Button to={`/installments/${item.id}/edit`} size="small">Edit</Button></div> },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
