import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { BudgetCard } from '../../components/budgets/BudgetCard';
import { BudgetAlertItem } from '../../components/budgets/BudgetAlertItem';
import { mockBudgets, mockBudgetAlerts, budgetSummary } from '../../data/mockBudgets';
import type { Budget } from '../../types/budget';

const statusTone = {
  safe: 'green',
  warning: 'orange',
  exceeded: 'red',
} as const;

export function BudgetListPage() {
  const overallUsage = Math.round((budgetSummary.totalActual / budgetSummary.totalLimit) * 100);

  return (
    <AppLayout title="Budgets" description="Monthly category budget, progress usage, alert threshold, dan budget health.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero budget-hero">
          <div>
            <span className="badge dark">● Budget module</span>
            <h2>Kontrol pengeluaran bulanan per kategori dengan alert otomatis.</h2>
            <p>Budget memakai category budget, menghitung actual spending dari transaksi expense, lalu memberi alert saat usage mencapai 80% dan 100%.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/budgets/new" variant="primary"><AppIcon name="add" /> Create Budget</Button>
            <Button to="/budgets/alerts"><AppIcon name="budgetAlert" /> Alerts</Button>
            <Button to="/budgets/report"><AppIcon name="budgetReport" /> Report</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Total Limit</span><strong><Amount value={budgetSummary.totalLimit} /></strong><small>{budgetSummary.activeCount} active budgets</small></Card>
          <Card className="stat-card"><span>Actual Spent</span><strong><Amount value={budgetSummary.totalActual} type="expense" /></strong><small>{overallUsage}% overall usage</small></Card>
          <Card className="stat-card"><span>Safe</span><strong>{budgetSummary.safeCount}</strong><small>Below 80%</small></Card>
          <Card className="stat-card"><span>Need Action</span><strong>{budgetSummary.warningCount + budgetSummary.exceededCount}</strong><small>Warning or exceeded</small></Card>
        </section>

        <section className="budget-card-grid">
          {mockBudgets.slice(0, 3).map((budget, index) => <BudgetCard key={budget.id} budget={budget} featured={index === 0} />)}
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head">
              <div><h3>Budget List</h3><p>Category budget table dengan status safe, warning, dan exceeded.</p></div>
              <div className="panel-actions"><Button to="/budgets/new" size="small" variant="primary"><AppIcon name="add" /> Add</Button><Button to="/budgets/report" size="small"><AppIcon name="chart" /> Report</Button></div>
            </div>
            <DataTable<Budget>
              data={mockBudgets}
              getRowKey={(budget) => budget.id}
              columns={[
                { key: 'category', header: 'Category', render: (budget) => <div className="table-title"><span className={`mini-icon ${budget.status}`}><AppIcon name={budget.categoryIcon} /></span><strong>{budget.categoryName}</strong><small>{budget.period}</small></div> },
                { key: 'limit', header: 'Limit', align: 'right', render: (budget) => <Amount value={budget.limit} /> },
                { key: 'actual', header: 'Actual', align: 'right', render: (budget) => <Amount value={budget.actual} type="expense" /> },
                { key: 'usage', header: 'Usage', render: (budget) => { const usage = Math.round((budget.actual / budget.limit) * 100); return <div className="table-progress"><ProgressBar value={usage} tone={budget.status === 'safe' ? 'green' : budget.status === 'warning' ? 'orange' : 'red'} /><span>{usage}%</span></div>; } },
                { key: 'status', header: 'Status', render: (budget) => <Badge tone={statusTone[budget.status]}>{budget.status}</Badge> },
                { key: 'action', header: 'Action', render: (budget) => <div className="inline-actions"><Button to={`/budgets/${budget.id}`} size="small">View</Button><Button to={`/budgets/${budget.id}/edit`} size="small">Edit</Button></div> },
              ]}
            />
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Latest Alerts</h3><p>Alert dari threshold 80% dan 100%.</p></div><Button to="/budgets/alerts" size="small">Open</Button></div>
            <div className="budget-alert-list">
              {mockBudgetAlerts.map((alert) => <BudgetAlertItem key={alert.id} alert={alert} />)}
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
