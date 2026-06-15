import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { BudgetInsightCard } from '../../components/budgets/BudgetInsightCard';
import { mockBudgets, mockBudgetTransactions } from '../../data/mockBudgets';
import type { Transaction } from '../../types/transaction';

export function BudgetDetailPage() {
  const { id } = useParams();
  const budget = useMemo(() => mockBudgets.find((item) => item.id === id) ?? mockBudgets[0], [id]);
  const usage = Math.round((budget.actual / budget.limit) * 100);
  const remaining = budget.limit - budget.actual;
  const dailyAllowance = Math.max(0, Math.floor(remaining / 8));

  return (
    <AppLayout title="Budget Detail" description="Detail budget, spending trend, included transactions, dan recommendations.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Budget detail</span>
            <h2>{budget.categoryName}</h2>
            <p>{budget.note} Usage saat ini {usage}% dari limit {budget.period}.</p>
          </div>
          <div className="app-hero-actions">
            <Button to={`/budgets/${budget.id}/edit`} variant="primary"><AppIcon name="edit" /> Edit</Button>
            <Button to="/budgets/alerts"><AppIcon name="budgetAlert" /> Alerts</Button>
            <Button to="/budgets"><AppIcon name="back" /> Back</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Limit</span><strong><Amount value={budget.limit} /></strong><small>{budget.period}</small></Card>
          <Card className="stat-card"><span>Actual</span><strong><Amount value={budget.actual} type="expense" /></strong><small>{usage}% used</small></Card>
          <Card className="stat-card"><span>Remaining</span><strong><Amount value={Math.abs(remaining)} type={remaining < 0 ? 'expense' : 'income'} /></strong><small>{remaining < 0 ? 'Over budget' : 'Available'}</small></Card>
          <Card className="stat-card"><span>Daily Allowance</span><strong><Amount value={dailyAllowance} /></strong><small>Until period end</small></Card>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Spending Trend</h3><p>Actual spending vs budget pace.</p></div><Badge tone={budget.status === 'safe' ? 'green' : budget.status === 'warning' ? 'orange' : 'red'}>{budget.status}</Badge></div>
            <div className="budget-chart" aria-label="Budget trend chart">
              <div className="budget-chart-line pace" />
              <div className="budget-chart-line actual" />
              <div className="chart-legend"><span><i className="actual-dot" /> Actual</span><span><i className="pace-dot" /> Budget pace</span></div>
            </div>
            <ProgressBar value={usage} tone={budget.status === 'safe' ? 'green' : budget.status === 'warning' ? 'orange' : 'red'} />
          </Card>
          <div className="grid-stack">
            <BudgetInsightCard icon="health" title="Budget health" tone={budget.status === 'safe' ? 'green' : budget.status === 'warning' ? 'orange' : 'red'}>{budget.status === 'safe' ? 'Budget masih aman, lanjutkan spending discipline sampai akhir periode.' : budget.status === 'warning' ? 'Budget mendekati limit, review transaksi mendatang sebelum submit.' : 'Budget sudah terlampaui, pause pengeluaran non-esensial.'}</BudgetInsightCard>
            <BudgetInsightCard icon="calendar" title="Daily allowance" tone="blue">Sisa alokasi harian sekitar <Amount value={dailyAllowance} /> agar tetap on-track.</BudgetInsightCard>
          </div>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Transactions Included</h3><p>Transaksi expense kategori {budget.categoryName} yang dihitung ke budget.</p></div><Button to="/transactions/filter" size="small"><AppIcon name="filter" /> Filter Tx</Button></div>
          <DataTable<Transaction>
            data={mockBudgetTransactions}
            getRowKey={(transaction) => transaction.id}
            columns={[
              { key: 'title', header: 'Transaction', render: (transaction) => <div className="table-title"><strong>{transaction.title}</strong><small>{transaction.note}</small></div> },
              { key: 'wallet', header: 'Wallet', render: (transaction) => transaction.walletName },
              { key: 'date', header: 'Date', render: (transaction) => transaction.date },
              { key: 'tags', header: 'Tags', render: (transaction) => <div className="tag-row">{transaction.tags.map((tag) => <Badge key={tag} tone="gray">#{tag}</Badge>)}</div> },
              { key: 'amount', header: 'Amount', align: 'right', render: (transaction) => <Amount value={transaction.amount} type="expense" /> },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
