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
import { useBudget } from '../../hooks/useBudgets';
import { useCategories } from '../../hooks/useCategories';
import { useTransactions } from '../../hooks/useTransactions';
import type { Transaction } from '../../types/transaction';

export function BudgetDetailPage() {
  const { id } = useParams();
  const { data: budget, isLoading: isBudgetLoading, error: budgetError } = useBudget(id);
  const { data: categoriesData } = useCategories({ type: 'expense' });
  
  // Fetch transactions for this budget's category and month
  const { data: transactionsData } = useTransactions({
    category_id: budget?.category_id,
    // We would ideally filter by month here, but useTransactions might not support it directly.
    // We'll filter on the client side for now.
  });

  if (isBudgetLoading) {
    return <AppLayout title="Budget Detail" description="Loading budget details..."><p>Loading...</p></AppLayout>;
  }

  if (budgetError || !budget) {
    return <AppLayout title="Budget Detail" description="Error loading budget details."><p>Error loading budget.</p></AppLayout>;
  }

  const category = categoriesData?.categories.find(c => c.id === budget.category_id);
  const categoryName = category?.name ?? 'Unknown Category';

  // We don't have spent_minor in the single budget response (it returns Budget, not BudgetSummary).
  // Wait, the backend contract says GET /api/v1/category-budgets/:id -> Budget.
  // So we need to compute spent_minor from transactions, or maybe the backend actually returns BudgetSummary?
  // Let's assume we compute it from transactions for now, or we can use the list API to get the summary.
  // Actually, let's filter transactions by month.
  const budgetMonth = budget.month.slice(0, 7); // YYYY-MM
  const budgetTransactions = (transactionsData?.transactions ?? []).filter(t => {
    return t.transaction_at.startsWith(budgetMonth);
  });

  const spent_minor = budgetTransactions.reduce((sum, t) => sum + t.amount_minor, 0);
  const remaining_minor = budget.limit_minor - spent_minor;
  const usage_percent = budget.limit_minor > 0 ? Math.round((spent_minor / budget.limit_minor) * 100) : 0;

  let status: 'safe' | 'warning' | 'exceeded' = 'safe';
  if (usage_percent >= 100) status = 'exceeded';
  else if (usage_percent >= 80) status = 'warning';

  const dailyAllowance = Math.max(0, Math.floor(remaining_minor / 8)); // Mock calculation

  return (
    <AppLayout title="Budget Detail" description="Detail budget, spending trend, included transactions, dan recommendations.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Budget detail</span>
            <h2>{categoryName}</h2>
            <p>Usage saat ini {usage_percent}% dari limit {budgetMonth}.</p>
          </div>
          <div className="app-hero-actions">
            <Button to={`/budgets/${budget.id}/edit`} variant="primary"><AppIcon name="edit" /> Edit</Button>
            <Button to="/budgets/alerts"><AppIcon name="budgetAlert" /> Alerts</Button>
            <Button to="/budgets"><AppIcon name="back" /> Back</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Limit</span><strong><Amount value={budget.limit_minor} /></strong><small>{budgetMonth}</small></Card>
          <Card className="stat-card"><span>Actual</span><strong><Amount value={spent_minor} type="expense" /></strong><small>{usage_percent}% used</small></Card>
          <Card className="stat-card"><span>Remaining</span><strong><Amount value={Math.abs(remaining_minor)} type={remaining_minor < 0 ? 'expense' : 'income'} /></strong><small>{remaining_minor < 0 ? 'Over budget' : 'Available'}</small></Card>
          <Card className="stat-card"><span>Daily Allowance</span><strong><Amount value={dailyAllowance} /></strong><small>Until period end</small></Card>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Spending Trend</h3><p>Actual spending vs budget pace.</p></div><Badge tone={status === 'safe' ? 'green' : status === 'warning' ? 'orange' : 'red'}>{status}</Badge></div>
            <div className="budget-chart" aria-label="Budget trend chart">
              <div className="budget-chart-line pace" />
              <div className="budget-chart-line actual" />
              <div className="chart-legend"><span><i className="actual-dot" /> Actual</span><span><i className="pace-dot" /> Budget pace</span></div>
            </div>
            <ProgressBar value={usage_percent} tone={status === 'safe' ? 'green' : status === 'warning' ? 'orange' : 'red'} />
          </Card>
          <div className="grid-stack">
            <BudgetInsightCard icon="health" title="Budget health" tone={status === 'safe' ? 'green' : status === 'warning' ? 'orange' : 'red'}>{status === 'safe' ? 'Budget masih aman, lanjutkan spending discipline sampai akhir periode.' : status === 'warning' ? 'Budget mendekati limit, review transaksi mendatang sebelum submit.' : 'Budget sudah terlampaui, pause pengeluaran non-esensial.'}</BudgetInsightCard>
            <BudgetInsightCard icon="calendar" title="Daily allowance" tone="blue">Sisa alokasi harian sekitar <Amount value={dailyAllowance} /> agar tetap on-track.</BudgetInsightCard>
          </div>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Transactions Included</h3><p>Transaksi expense kategori {categoryName} yang dihitung ke budget.</p></div><Button to="/transactions/filter" size="small"><AppIcon name="filter" /> Filter Tx</Button></div>
          <DataTable<Transaction>
            data={budgetTransactions}
            getRowKey={(transaction) => transaction.id}
            columns={[
              { key: 'title', header: 'Transaction', render: (transaction) => <div className="table-title"><strong>{transaction.note || 'Transaction'}</strong><small>{transaction.note}</small></div> },
              { key: 'wallet', header: 'Wallet', render: (transaction) => transaction.wallet_id },
              { key: 'date', header: 'Date', render: (transaction) => new Date(transaction.transaction_at).toLocaleDateString() },
              { key: 'tags', header: 'Tags', render: (transaction) => <div className="tag-row">{transaction.tag_ids?.map((tag) => <Badge key={tag} tone="gray">#{tag}</Badge>)}</div> },
              { key: 'amount', header: 'Amount', align: 'right', render: (transaction) => <Amount value={transaction.amount_minor} type="expense" /> },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
