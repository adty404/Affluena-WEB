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
import { mockBudgetAlerts } from '../../data/mockBudgets';
import type { BudgetSummary } from '../../types/budget';
import { useBudgets } from '../../hooks/useBudgets';
import { useCategories } from '../../hooks/useCategories';

const statusTone = {
  safe: 'green',
  warning: 'orange',
  exceeded: 'red',
} as const;

export function BudgetListPage() {
  const { data: budgetsData, isLoading, error } = useBudgets();
  const { data: categoriesData } = useCategories({ type: 'expense' });

  const budgets = budgetsData?.budgets ?? [];
  
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit_minor, 0);
  const totalActual = budgets.reduce((sum, b) => sum + b.spent_minor, 0);
  const overallUsage = totalLimit > 0 ? Math.round((totalActual / totalLimit) * 100) : 0;
  
  const safeCount = budgets.filter(b => b.usage_percent < 80).length;
  const warningCount = budgets.filter(b => b.usage_percent >= 80 && b.usage_percent < 100).length;
  const exceededCount = budgets.filter(b => b.usage_percent >= 100).length;

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
          <Card className="stat-card"><span>Total Limit</span><strong><Amount value={totalLimit} /></strong><small>{budgets.length} active budgets</small></Card>
          <Card className="stat-card"><span>Actual Spent</span><strong><Amount value={totalActual} type="expense" /></strong><small>{overallUsage}% overall usage</small></Card>
          <Card className="stat-card"><span>Safe</span><strong>{safeCount}</strong><small>Below 80%</small></Card>
          <Card className="stat-card"><span>Need Action</span><strong>{warningCount + exceededCount}</strong><small>Warning or exceeded</small></Card>
        </section>

        {isLoading ? (
          <p>Loading budgets...</p>
        ) : error ? (
          <p>Error loading budgets.</p>
        ) : budgets.length === 0 ? (
          <Card className="panel-card"><p>No budgets found. Create one to get started.</p></Card>
        ) : (
          <>
            <section className="budget-card-grid">
              {budgets.slice(0, 3).map((budget, index) => <BudgetCard key={budget.id} budget={budget} featured={index === 0} />)}
            </section>

            <section className="dashboard-grid">
              <Card className="panel-card">
                <div className="panel-head">
                  <div><h3>Budget List</h3><p>Category budget table dengan status safe, warning, dan exceeded.</p></div>
                  <div className="panel-actions"><Button to="/budgets/new" size="small" variant="primary"><AppIcon name="add" /> Add</Button><Button to="/budgets/report" size="small"><AppIcon name="chart" /> Report</Button></div>
                </div>
                <DataTable<BudgetSummary>
                  data={budgets}
                  getRowKey={(budget) => budget.id}
                  columns={[
                    { 
                      key: 'category', 
                      header: 'Category', 
                      render: (budget) => {
                        const category = categoriesData?.categories.find(c => c.id === budget.category_id);
                        const categoryName = category?.name ?? 'Unknown Category';
                        const categoryIcon = 'categories';
                        let status: 'safe' | 'warning' | 'exceeded' = 'safe';
                        if (budget.usage_percent >= 100) status = 'exceeded';
                        else if (budget.usage_percent >= 80) status = 'warning';
                        
                        return (
                          <div className="table-title">
                            <span className={`mini-icon ${status}`}><AppIcon name={categoryIcon} /></span>
                            <strong>{categoryName}</strong>
                            <small>{budget.month}</small>
                          </div>
                        );
                      } 
                    },
                    { key: 'limit', header: 'Limit', align: 'right', render: (budget) => <Amount value={budget.limit_minor} /> },
                    { key: 'actual', header: 'Actual', align: 'right', render: (budget) => <Amount value={budget.spent_minor} type="expense" /> },
                    { 
                      key: 'usage', 
                      header: 'Usage', 
                      render: (budget) => { 
                        const usage = budget.usage_percent; 
                        let status: 'safe' | 'warning' | 'exceeded' = 'safe';
                        if (usage >= 100) status = 'exceeded';
                        else if (usage >= 80) status = 'warning';
                        return (
                          <div className="table-progress">
                            <ProgressBar value={usage} tone={status === 'safe' ? 'green' : status === 'warning' ? 'orange' : 'red'} />
                            <span>{usage}%</span>
                          </div>
                        ); 
                      } 
                    },
                    { 
                      key: 'status', 
                      header: 'Status', 
                      render: (budget) => {
                        let status: 'safe' | 'warning' | 'exceeded' = 'safe';
                        if (budget.usage_percent >= 100) status = 'exceeded';
                        else if (budget.usage_percent >= 80) status = 'warning';
                        return <Badge tone={statusTone[status]}>{status}</Badge>;
                      } 
                    },
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
          </>
        )}
      </div>
    </AppLayout>
  );
}
