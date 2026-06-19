import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { reportMetrics, expenseRows, exportJobs, alertMessages } from '../../data/mockReporting';
import { ReportMetricCard, ReportShortcutCard, InsightCard, statusTone } from '../../components/reports/ReportCards';
import type { ReportRow } from '../../types/reporting';

export function ReportsOverviewPage() {
  return (
    <AppLayout title="Reports" description="Pusat laporan cashflow, income, expense, budget, debt, dan goal.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>● Reports Center</Badge>
            <h2>Semua laporan finansial ada dalam satu tempat, lengkap dengan filter periode dan export.</h2>
            <p>Reports menggabungkan data transaction, budget, debt, recurring, dan goals agar user bisa membaca performa keuangan secara cepat.</p>
          </div>
          <div className="app-hero-actions"><Button to="/exports/new" variant="primary"><AppIcon name="export" /> New Export</Button><Button to="/alerts"><AppIcon name="warning" /> Alert Center</Button></div>
        </section>

        <section className="stat-grid">{reportMetrics.map((metric) => <ReportMetricCard key={metric.id} metric={metric} />)}</section>

        <section className="entity-card-grid stable-card-grid">
          <ReportShortcutCard title="Cashflow Report" description="Net movement across all wallets by week and month." icon="chart" to="/reports/cashflow" tone="green" />
          <ReportShortcutCard title="Expense Report" description="Spending distribution by category, wallet, and trend." icon="transactions" to="/reports/expenses" tone="orange" />
          <ReportShortcutCard title="Income Report" description="Income source tracking and recurring income visibility." icon="analytics" to="/reports/income" tone="blue" />
          <ReportShortcutCard title="Budget Center" description="Budget usage, exceeded categories, and remaining caps." icon="budgetReport" to="/reports/budgets" tone="purple" />
          <ReportShortcutCard title="Debt Report" description="Payable, receivable, due risk, and collection health." icon="debt" to="/reports/debts" tone="red" />
          <ReportShortcutCard title="Goal Report" description="Progress, contributions, members, and at-risk goals." icon="goal" to="/reports/goals" tone="green" />
        </section>

        <section className="dashboard-grid two-col">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Expense Watchlist</h3><p>Kategori dengan perubahan tertinggi bulan ini.</p></div><Button to="/reports/expenses" size="small">Open Expense Report</Button></div>
            <DataTable<ReportRow>
              data={expenseRows.slice(0, 3)}
              getRowKey={(row) => row.id}
              columns={[
                { key: 'name', header: 'Category', render: (row) => <div className="table-title"><span className={`mini-icon ${row.status === 'critical' ? 'danger' : row.status === 'watch' ? 'warning' : 'safe'}`}><AppIcon name="shopping" /></span><strong>{row.name}</strong><small>{row.wallet}</small></div> },
                { key: 'amount', header: 'Amount', align: 'right', render: (row) => <Amount value={row.amount} type="expense" /> },
                { key: 'change', header: 'Change', render: (row) => <Badge tone={statusTone(row.status)}>{row.changePercent}%</Badge> },
              ]}
            />
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Operational Alerts</h3><p>Notifikasi terbaru dari budget, recurring, export, dan debt.</p></div><Button to="/alerts" size="small">Open Alerts</Button></div>
            <div className="insight-list">
              {alertMessages.slice(0, 3).map((alert) => <InsightCard key={alert.id} title={alert.title} description={alert.description} severity={alert.severity} actionTo={`/alerts/${alert.id}`} />)}
            </div>
          </Card>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Latest Exports</h3><p>Export yang bisa langsung dibuka atau diunduh dari export center.</p></div><Button to="/exports" size="small">Export Center</Button></div>
          <div className="export-chip-row">
            {exportJobs.slice(0, 4).map((job) => (
              <Button key={job.id} to={`/exports/${job.id}`}><AppIcon name="download" /> Export {new Date(job.created_at).toLocaleDateString('id-ID')}</Button>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
