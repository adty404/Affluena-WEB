import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { useDebt } from '../../hooks/useDebts';
import type { DebtPayment } from '../../types/debt';

export function DebtDetailPage() {
  const { id } = useParams();
  const { data: debt, isLoading } = useDebt(id ?? '');

  if (isLoading) {
    return (
      <AppLayout title="Debt Detail" description="Loading...">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Loading</span><strong>...</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  if (!debt) {
    return (
      <AppLayout title="Debt Detail" description="Not found">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Error</span><strong>Debt not found</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  const progress = debt.principal_amount_minor > 0 ? Math.round((debt.paid_amount_minor / debt.principal_amount_minor) * 100) : 0;

  return (
    <AppLayout title="Debt Detail" description="Remaining balance, payment history, and debt activity.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● {debt.type}</span>
            <h2>{debt.counterparty_name}</h2>
            <p>{debt.note}</p>
          </div>
          <div className="app-hero-actions"><Button to="/debts">Back</Button><Button to={`/debts/${debt.id}/pay`} variant="primary"><AppIcon name="pay" /> Record Payment</Button></div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Original</span><strong><Amount value={debt.principal_amount_minor} /></strong><small>{debt.counterparty_name}</small></Card>
          <Card className="stat-card"><span>Paid</span><strong><Amount value={debt.paid_amount_minor} type="income" /></strong><small>{progress}% settled</small></Card>
          <Card className="stat-card orange"><span>Remaining</span><strong><Amount value={debt.remaining_amount_minor} type={debt.type === 'payable' ? 'expense' : 'income'} /></strong><small>Due {debt.due_date || 'N/A'}</small></Card>
          <Card className="stat-card blue"><span>Status</span><strong>{debt.status.replace('_', ' ')}</strong><small>Wallet: {debt.wallet_id}</small></Card>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Payment History</h3><p>Semua pembayaran terkait debt ini.</p></div><Button to={`/debts/${debt.id}/pay`} size="small" variant="primary"><AppIcon name="pay" /> Pay</Button></div>
            <DataTable<DebtPayment>
              data={debt.payments || []}
              getRowKey={(payment) => payment.id}
              columns={[
                { key: 'date', header: 'Date', render: (payment) => payment.paid_at },
                { key: 'transaction', header: 'Transaction', render: (payment) => <Badge tone="blue">{payment.transaction_id}</Badge> },
                { key: 'amount', header: 'Amount', align: 'right', render: (payment) => <Amount value={payment.amount_minor} type="income" /> },
                { key: 'note', header: 'Note', render: (payment) => payment.note },
              ]}
            />
          </Card>

          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Settlement Progress</h3><p>Payment tidak boleh melebihi remaining amount.</p></div></div>
            <div className="metric-list">
              <div><span>Progress</span><strong>{progress}%</strong></div>
              <ProgressBar value={progress} tone={debt.type === 'payable' ? 'orange' : 'green'} />
              <div><span>Wallet effect</span><strong>{debt.type === 'payable' ? 'Expense when paid' : 'Income when collected'}</strong></div>
              <div><span>Due status</span><strong><Badge tone={debt.status === 'cancelled' ? 'red' : debt.status === 'paid' ? 'green' : 'orange'}>{debt.status.replace('_', ' ')}</Badge></strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
