import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { BudgetInsightCard } from '../../components/budgets/BudgetInsightCard';
import type { BudgetReportItem } from '../../types/budget';
import { useCategories } from '../../hooks/useCategories';
import { useBudgetReport } from '../../hooks/useBudgets';

const statusTone = {
  safe: 'green',
  warning: 'orange',
  exceeded: 'red',
} as const;

export function BudgetReportPage() {
  const { showToast } = useToast();
  const [exportOpen, setExportOpen] = useState(false);
  const { data: categoriesData } = useCategories({ type: 'expense' });
  const { data, isLoading } = useBudgetReport();

  const report = data?.report ?? [];
  const summary = data?.summary ?? {
    total_limit_minor: 0,
    total_spent_minor: 0,
    total_remaining_minor: 0,
    safe_count: 0,
    warning_count: 0,
    exceeded_count: 0,
    daily_allowance_minor: 0,
    forecast_minor: 0,
  };

  return (
    <AppLayout title="Budget Report" description="Budget vs actual report, chart, insight, dan export action.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Budget report</span>
            <h2>Bandingkan budget vs actual untuk pengambilan keputusan.</h2>
            <p>Report ini memperlihatkan kategori mana yang aman, mendekati limit, atau melebihi budget.</p>
          </div>
          <div className="app-hero-actions">
            <Button variant="primary" onClick={() => setExportOpen(true)}><AppIcon name="export" /> Export CSV</Button>
            <Button to="/budgets/alerts"><AppIcon name="budgetAlert" /> Alerts</Button>
            <Button to="/budgets"><AppIcon name="budget" /> Budgets</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Total Budget</span><strong><Amount value={summary.total_limit_minor} /></strong><small>Current Month</small></Card>
          <Card className="stat-card"><span>Total Actual</span><strong><Amount value={summary.total_spent_minor} type="expense" /></strong><small>{summary.total_limit_minor > 0 ? Math.round((summary.total_spent_minor / summary.total_limit_minor) * 100) : 0}% used</small></Card>
          <Card className="stat-card"><span>Remaining</span><strong><Amount value={summary.total_remaining_minor} type="income" /></strong><small>Available</small></Card>
          <Card className="stat-card"><span>Forecast</span><strong><Amount value={summary.forecast_minor} /></strong><small>Possible overspend</small></Card>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Budget vs Actual Chart</h3><p>Visual comparison untuk tiap category.</p></div><Badge tone="blue">Current Month</Badge></div>
            <div className="budget-bars" aria-label="Budget versus actual chart">
              {isLoading ? (
                <p>Loading chart...</p>
              ) : report.length > 0 ? (
                report.map((item) => {
                  const actualPercent = Math.min(120, item.usage_percent);
                  const category = (categoriesData?.categories ?? []).find(c => c.id === item.category_id);
                  const categoryName = category?.name ?? 'Unknown Category';
                  const status = item.usage_percent >= 100 ? 'exceeded' : item.usage_percent >= 80 ? 'warning' : 'safe';
                  return (
                    <div className="budget-bar-row" key={item.id}>
                      <span>{categoryName}</span>
                      <div className="budget-bar-track"><i className="limit" style={{ width: '100%' }} /><i className={`actual ${status}`} style={{ width: `${Math.min(100, actualPercent)}%` }} /></div>
                      <strong>{actualPercent}%</strong>
                    </div>
                  );
                })
              ) : (
                <p>No budget data available.</p>
              )}
            </div>
          </Card>

          <div className="grid-stack">
            <BudgetInsightCard icon="warning" title="Shopping needs action" tone="red">Shopping sudah over budget dan perlu pembatasan pengeluaran non-esensial.</BudgetInsightCard>
            <BudgetInsightCard icon="transport" title="Transportation close to limit" tone="orange">Transportation mendekati limit; gunakan daily cap sampai akhir periode.</BudgetInsightCard>
            <BudgetInsightCard icon="health" title="Food still controlled" tone="green">Food masih aman tetapi tetap perlu dipantau.</BudgetInsightCard>
          </div>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Report Table</h3><p>Budget, actual, remaining, status, dan forecast.</p></div><Button size="small" onClick={() => setExportOpen(true)}><AppIcon name="export" /> Export</Button></div>
          <DataTable<BudgetReportItem>
            data={report}
            getRowKey={(item) => item.id}
            columns={[
              { 
                key: 'category', 
                header: 'Category', 
                render: (item) => {
                  const category = (categoriesData?.categories ?? []).find(c => c.id === item.category_id);
                  const categoryName = category?.name ?? 'Unknown Category';
                  const categoryIcon = 'categories';
                  const status = item.usage_percent >= 100 ? 'exceeded' : item.usage_percent >= 80 ? 'warning' : 'safe';
                  return (
                    <div className="table-title">
                      <span className={`mini-icon ${status}`}><AppIcon name={categoryIcon} /></span>
                      <strong>{categoryName}</strong>
                      <small>{item.recommendation}</small>
                    </div>
                  );
                } 
              },
              { key: 'budget', header: 'Budget', align: 'right', render: (item) => <Amount value={item.limit_minor} /> },
              { key: 'actual', header: 'Actual', align: 'right', render: (item) => <Amount value={item.spent_minor} type="expense" /> },
              { key: 'remaining', header: 'Remaining', align: 'right', render: (item) => <Amount value={Math.abs(item.variance_minor)} type={item.variance_minor < 0 ? 'expense' : 'income'} /> },
              { key: 'daily_allowance', header: 'Daily Allowance', align: 'right', render: (item) => <Amount value={item.daily_allowance_minor} /> },
              { 
                key: 'status', 
                header: 'Status', 
                render: (item) => {
                  const status = item.usage_percent >= 100 ? 'exceeded' : item.usage_percent >= 80 ? 'warning' : 'safe';
                  return <Badge tone={statusTone[status]}>{status}</Badge>;
                } 
              },
            ]}
          />
        </Card>
      </div>

      <Modal open={exportOpen} title="Export Budget Report" description="Pilih format dan cakupan data sebelum report diekspor." onClose={() => setExportOpen(false)}>
        <div className="quick-action-grid two-col">
          <Button onClick={() => showToast('CSV export prepared.') }><AppIcon name="export" /> CSV</Button>
          <Button onClick={() => showToast('PDF summary prepared.') }><AppIcon name="download" /> PDF Summary</Button>
          <Button onClick={() => showToast('Current table copied.') }><AppIcon name="copy" /> Copy Table</Button>
          <Button onClick={() => showToast('Share link prepared.') }><AppIcon name="more" /> Share Link</Button>
        </div>
        <div className="modal-actions"><Button onClick={() => setExportOpen(false)}>Close</Button><Button variant="primary" onClick={() => { setExportOpen(false); showToast('Budget report export completed.'); }}>Export Now</Button></div>
      </Modal>
    </AppLayout>
  );
}
