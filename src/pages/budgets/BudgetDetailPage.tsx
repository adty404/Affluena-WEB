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
import { useBudget, useBudgets, useBudgetReport } from '../../hooks/useBudgets';
import { useCategories } from '../../hooks/useCategories';
import { useTransactions } from '../../hooks/useTransactions';
import { useWallets } from '../../hooks/useWallets';
import { useTags } from '../../hooks/useTags';
import type { Transaction } from '../../types/transaction';

export function BudgetDetailPage() {
  const { id } = useParams();
  const { data: budget, isLoading: isBudgetLoading, error: budgetError } = useBudget(id);
  const { data: categoriesData } = useCategories({ type: 'expense' });
  const { data: walletsData } = useWallets();
  const { data: tagsData } = useTags();

  const budgetMonth = budget ? budget.month.slice(0, 7) : undefined; // YYYY-MM

  // Authoritative spending/remaining/usage come from the budget summary list and report.
  const { data: summaryList } = useBudgets(budgetMonth ? { month: budgetMonth } : {});
  const { data: reportData } = useBudgetReport(budgetMonth);

  // Transactions for this category + month drive the "included transactions" table.
  const monthStart = budgetMonth ? `${budgetMonth}-01` : undefined;
  const { data: transactionsData } = useTransactions(
    budget
      ? {
          type: 'expense',
          category_id: budget.category_id,
          from: monthStart,
        }
      : {},
  );

  if (isBudgetLoading) {
    return <AppLayout title="Budget Detail" description="Loading budget details..."><p>Loading...</p></AppLayout>;
  }

  if (budgetError || !budget) {
    return <AppLayout title="Budget Detail" description="Error loading budget details."><p>Error loading budget.</p></AppLayout>;
  }

  const category = (categoriesData?.categories ?? []).find(c => c.id === budget.category_id);
  const categoryName = category?.name ?? 'Unknown Category';

  const budgetTransactions = (transactionsData?.transactions ?? []).filter(
    (t) => t.type === 'expense' && t.transaction_at.slice(0, 7) === budgetMonth,
  );

  // Prefer authoritative figures from the API summary/report; fall back to local computation.
  const summary = (summaryList?.budgets ?? []).find((b) => b.id === budget.id);
  const reportItem = (reportData?.report ?? []).find((r) => r.id === budget.id);

  const localSpent = budgetTransactions.reduce((sum, t) => sum + t.amount_minor, 0);
  const spent_minor = summary?.spent_minor ?? reportItem?.spent_minor ?? localSpent;
  const remaining_minor = summary?.remaining_minor ?? reportItem?.remaining_minor ?? budget.limit_minor - spent_minor;
  const usage_percent =
    summary?.usage_percent ??
    reportItem?.usage_percent ??
    (budget.limit_minor > 0 ? Math.round((spent_minor / budget.limit_minor) * 100) : 0);
  const usageDisplay = Math.round(usage_percent);

  let status: 'safe' | 'warning' | 'exceeded' = 'safe';
  if (usage_percent >= 100) status = 'exceeded';
  else if (usage_percent >= 80) status = 'warning';

  // Daily allowance = remaining budget spread over the days left in the month.
  // Use the API value when available; otherwise compute remaining-days locally.
  const computeDailyAllowance = () => {
    if (remaining_minor <= 0) return 0;
    const [yearStr, monthStr] = (budgetMonth ?? '').split('-');
    const year = Number(yearStr);
    const monthIdx = Number(monthStr) - 1;
    if (!year || Number.isNaN(monthIdx)) return 0;
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const now = new Date();
    const isCurrentMonth = now.getFullYear() === year && now.getMonth() === monthIdx;
    const daysLeft = isCurrentMonth ? Math.max(1, daysInMonth - now.getDate() + 1) : daysInMonth;
    return Math.floor(remaining_minor / daysLeft);
  };
  const dailyAllowance = reportItem?.daily_allowance_minor ?? computeDailyAllowance();

  return (
    <AppLayout title="Budget Detail" description="Detail budget, spending trend, included transactions, dan recommendations.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Budget detail</span>
            <h2>{categoryName}</h2>
            <p>Usage saat ini {usageDisplay}% dari limit {budgetMonth}.</p>
          </div>
          <div className="app-hero-actions">
            <Button to={`/budgets/${budget.id}/edit`} variant="primary"><AppIcon name="edit" /> Edit</Button>
            <Button to="/budgets/alerts"><AppIcon name="budgetAlert" /> Alerts</Button>
            <Button to="/budgets"><AppIcon name="back" /> Back</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Limit</span><strong><Amount value={budget.limit_minor} /></strong><small>{budgetMonth}</small></Card>
          <Card className="stat-card"><span>Actual</span><strong><Amount value={spent_minor} type="expense" /></strong><small>{usageDisplay}% used</small></Card>
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
            <ProgressBar value={Math.min(100, usageDisplay)} tone={status === 'safe' ? 'green' : status === 'warning' ? 'orange' : 'red'} />
          </Card>
          <div className="grid-stack">
            <BudgetInsightCard icon="health" title="Budget health" tone={status === 'safe' ? 'green' : status === 'warning' ? 'orange' : 'red'}>{status === 'safe' ? 'Budget masih aman, lanjutkan spending discipline sampai akhir periode.' : status === 'warning' ? 'Budget mendekati limit, review transaksi mendatang sebelum submit.' : 'Budget sudah terlampaui, pause pengeluaran non-esensial.'}</BudgetInsightCard>
            <BudgetInsightCard icon="calendar" title="Daily allowance" tone="blue">Sisa alokasi harian sekitar <Amount value={dailyAllowance} /> agar tetap on-track.</BudgetInsightCard>
          </div>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Transactions Included</h3><p>Transaksi expense kategori {categoryName} yang dihitung ke budget.</p></div><Button to={`/transactions/filter?type=expense&category_id=${budget.category_id}`} size="small"><AppIcon name="filter" /> Filter Tx</Button></div>
          <DataTable<Transaction>
            data={budgetTransactions}
            getRowKey={(transaction) => transaction.id}
            columns={[
              { key: 'title', header: 'Transaction', render: (transaction) => <div className="table-title"><strong>{transaction.note || categoryName}</strong><small>{transaction.note}</small></div> },
              { key: 'wallet', header: 'Wallet', render: (transaction) => (walletsData?.wallets ?? []).find((w) => w.id === transaction.wallet_id)?.name ?? '—' },
              { key: 'date', header: 'Date', render: (transaction) => new Date(transaction.transaction_at).toLocaleDateString() },
              { key: 'tags', header: 'Tags', render: (transaction) => <div className="tag-row">{transaction.tag_ids?.map((tagId) => <Badge key={tagId} tone="gray">#{(tagsData?.tags ?? []).find((t) => t.id === tagId)?.name ?? tagId}</Badge>)}</div> },
              { key: 'amount', header: 'Amount', align: 'right', render: (transaction) => <Amount value={transaction.amount_minor} type="expense" /> },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
