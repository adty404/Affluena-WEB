import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useBudgetReport } from '../../hooks/useBudgets';
import { ReportBarChart, ReportMetricCard, statusTone } from '../../components/reports/ReportCards';
import type { ReportRow, ReportMetric } from '../../types/reporting';

export function BudgetReportCenterPage() {
  const month = '2026-06'; // Defaulting to current month for now
  const { data, isLoading, isError } = useBudgetReport(month);

  const rows: ReportRow[] = data?.report.map(item => ({
    id: item.id,
    name: item.category_id,
    category: 'Budget',
    amount_minor: item.spent_minor,
    previous_amount_minor: item.limit_minor,
    change_percent: item.usage_percent,
    wallet: 'All',
    status: item.usage_percent > 100 ? 'critical' : item.usage_percent > 80 ? 'watch' : 'healthy'
  })) ?? [];

  const metrics: ReportMetric[] = data?.summary ? [
    { id: 'limit', label: 'Total Limit', value_minor: data.summary.total_limit_minor, helper: 'Total budget limit', tone: 'blue' },
    { id: 'spent', label: 'Total Spent', value_minor: data.summary.total_spent_minor, helper: 'Total spent', tone: 'orange' },
    { id: 'remaining', label: 'Remaining', value_minor: data.summary.total_remaining_minor, helper: 'Total remaining', tone: 'green' },
  ] : [];

  return (
    <AppLayout title="Budget Report Center" description="Budget actual usage, remaining caps, and exceeded categories.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>● Budget · June 2026</Badge>
            <h2>Budget report memperlihatkan kategori mana yang aman, warning, atau exceeded.</h2>
            <p>Report ini terhubung dengan category budget dan expense transaction.</p>
          </div>
          <div className="app-hero-actions"><Button to="/reports">Back to Reports</Button><Button to="/exports/new" variant="primary"><AppIcon name="export" /> Export</Button></div>
        </section>

        <section className="report-filter-bar">
          <Card className="filter-card"><span>Period</span><strong>June 2026</strong></Card>
          <Card className="filter-card"><span>Wallet</span><strong>All wallets</strong></Card>
          <Card className="filter-card"><span>Category</span><strong>Budget categories</strong></Card>
          <Card className="filter-card"><span>Generated</span><strong>14 Jun 2026</strong></Card>
        </section>

        {isLoading ? (
          <Card className="panel-card"><div className="empty-state"><p>Loading report...</p></div></Card>
        ) : isError ? (
          <Card className="panel-card"><div className="empty-state"><p>Failed to load report.</p></div></Card>
        ) : (
          <>
            <section className="stat-grid">{metrics.slice(0, 4).map((metric) => <ReportMetricCard key={metric.id} metric={metric} />)}</section>

            <section className="dashboard-grid two-col">
              <Card className="panel-card">
                <div className="panel-head"><div><h3>Trend Overview</h3><p>Bar visual menggunakan data ringkasan report.</p></div><Button to="/exports/new" size="small">Export Chart Data</Button></div>
                <ReportBarChart rows={rows} />
              </Card>
              <Card className="panel-card">
                <div className="panel-head"><div><h3>Report Insights</h3><p>Ringkasan actionable dari laporan ini.</p></div></div>
                <div className="metric-list compact-metrics">
                  <div className="metric-cell"><span>Highest</span><strong>{rows[0]?.name ?? '-'}</strong><small><Amount value={rows[0]?.amount_minor ?? 0} /></small></div>
                  <div className="metric-cell"><span>Needs Review</span><strong>{rows.filter((row) => row.status === 'critical' || row.status === 'watch').length} rows</strong><small>Watch and critical status</small></div>
                  <div className="metric-cell"><span>Rows</span><strong>{rows.length}</strong><small>Current filter result</small></div>
                  <div className="metric-cell"><span>Action</span><strong>Export ready</strong><small>CSV can be generated</small></div>
                </div>
              </Card>
            </section>

            <Card className="panel-card">
              <div className="panel-head"><div><h3>Report Table</h3><p>Data detail dengan status dan trend.</p></div><Button to="/exports/new" size="small" variant="primary"><AppIcon name="download" /> Download CSV</Button></div>
              <DataTable<ReportRow>
                data={rows}
                getRowKey={(row) => row.id}
                columns={[
                  { key: 'name', header: 'Name', render: (row) => <div className="table-title"><span className={`mini-icon ${row.status === 'critical' ? 'danger' : row.status === 'watch' ? 'warning' : row.status === 'growth' ? 'info' : 'safe'}`}><AppIcon name="budgetReport" /></span><strong>{row.name}</strong><small>{row.category}</small></div> },
                  { key: 'wallet', header: 'Wallet', render: (row) => row.wallet },
                  { key: 'amount', header: 'Current', align: 'right', render: (row) => <Amount value={row.amount_minor} type="expense" /> },
                  { key: 'previous', header: 'Reference', align: 'right', render: (row) => <Amount value={row.previous_amount_minor} /> },
                  { key: 'change', header: 'Change', render: (row) => <Badge tone={statusTone(row.status)}>{row.change_percent}%</Badge> },
                  { key: 'status', header: 'Status', render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
                ]}
              />
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
