import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { PageMetaStrip } from '../../components/layout/PageMetaStrip';
import { useToast } from '../../components/ui/Toast';
import { useBudgetReport } from '../../hooks/useBudgets';
import { useReportMonth } from '../../hooks/useReportMonth';
import { MonthPicker } from '../../components/reports/MonthPicker';
import { ReportBarChart, ReportMetricCard, statusTone } from '../../components/reports/ReportCards';
import { exportReportCsv, formatMonthLabel } from '../../lib/reporting';
import { shortRef } from '../../lib/auditLabels';
import type { ReportRow, ReportMetric } from '../../types/reporting';

export function BudgetReportCenterPage() {
  const [month, setMonth] = useReportMonth();
  const { data, isLoading, isError } = useBudgetReport(month);
  const { showToast } = useToast();
  const monthLabel = formatMonthLabel(month);

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

  const handleExport = () => {
    if (rows.length === 0 && metrics.length === 0) {
      showToast('No budget data to export for this period.');
      return;
    }
    exportReportCsv('Budget Report', month, { metrics, rows });
    showToast('Budget report exported as CSV.');
  };

  return (
    <AppLayout title="Budget Report Center" description="Budget actual usage, remaining caps, and exceeded categories.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>● Budget · {monthLabel}</Badge>
            <h2>Budget report memperlihatkan kategori mana yang aman, warning, atau exceeded.</h2>
            <p>Report ini terhubung dengan category budget dan expense transaction.</p>
          </div>
          <div className="app-hero-actions"><Button to="/reports">Back to Reports</Button><Button onClick={handleExport} variant="primary" disabled={isLoading}><AppIcon name="export" /> Export</Button></div>
        </section>

        <section className="report-filter-bar">
          <MonthPicker value={month} onChange={setMonth} />
          <Card className="filter-card"><span>Wallet</span><strong>All wallets</strong></Card>
          <Card className="filter-card"><span>Category</span><strong>Budget categories</strong></Card>
          <Card className="filter-card"><span>Rows</span><strong>{rows.length} rows</strong></Card>
        </section>

        {isLoading ? (
          <Card className="panel-card"><div className="empty-state"><p>Loading report...</p></div></Card>
        ) : isError ? (
          <Card className="panel-card"><div className="empty-state"><p>Failed to load report.</p></div></Card>
        ) : rows.length === 0 && metrics.length === 0 ? (
          <Card className="panel-card"><div className="empty-state"><p>No budget data for {monthLabel}.</p></div></Card>
        ) : (
          <>
            <section className="stat-grid">{metrics.slice(0, 4).map((metric) => <ReportMetricCard key={metric.id} metric={metric} />)}</section>

            <section className="dashboard-grid two-col">
              <Card className="panel-card">
                <div className="panel-head"><div><h3>Trend Overview</h3><p>Bar visual menggunakan data ringkasan report.</p></div><Button onClick={handleExport} size="small">Export Chart Data</Button></div>
                <ReportBarChart rows={rows} />
              </Card>
              <Card className="panel-card">
                <div className="panel-head"><div><h3>Report Insights</h3><p>Ringkasan actionable dari laporan ini.</p></div></div>
                <div className="metric-list compact-metrics">
                  <div className="metric-cell"><span>Highest</span><strong>{rows[0] ? `Category ${shortRef(rows[0].name)}` : '-'}</strong><small><Amount value={rows[0]?.amount_minor ?? 0} /></small></div>
                  <div className="metric-cell"><span>Needs Review</span><strong>{rows.filter((row) => row.status === 'critical' || row.status === 'watch').length} rows</strong><small>Watch and critical status</small></div>
                  <div className="metric-cell"><span>Rows</span><strong>{rows.length}</strong><small>Current period</small></div>
                  <div className="metric-cell"><span>Period</span><strong>{monthLabel}</strong><small>Report month</small></div>
                </div>
              </Card>
            </section>

            <Card className="panel-card">
              <div className="panel-head"><div><h3>Report Table</h3><p>Data detail dengan status dan trend.</p></div><Button onClick={handleExport} size="small" variant="primary"><AppIcon name="download" /> Download CSV</Button></div>
              <DataTable<ReportRow>
                data={rows}
                getRowKey={(row) => row.id}
                columns={[
                  { key: 'name', header: 'Name', render: (row) => <div className="table-title"><span className={`mini-icon ${row.status === 'critical' ? 'danger' : row.status === 'watch' ? 'warning' : row.status === 'growth' ? 'info' : 'safe'}`}><AppIcon name="budgetReport" /></span><strong>Category {shortRef(row.name)}</strong><small>{row.category}</small></div> },
                  { key: 'wallet', header: 'Wallet', render: (row) => row.wallet },
                  { key: 'amount', header: 'Current', align: 'right', render: (row) => <Amount value={row.amount_minor} type="expense" /> },
                  { key: 'previous', header: 'Reference', align: 'right', render: (row) => <Amount value={row.previous_amount_minor} /> },
                  { key: 'change', header: 'Change', render: (row) => <Badge tone={statusTone(row.status)}>{row.change_percent}%</Badge> },
                  { key: 'status', header: 'Status', render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
                ]}
              />
            </Card>
            <PageMetaStrip
              title="Budget report status"
              items={[
                { label: 'Period', value: monthLabel, icon: 'calendar' },
                { label: 'Rows', value: rows.length, icon: 'list' },
                { label: 'Sync status', value: 'Budget API', icon: 'success' },
              ]}
              actions={[
                { label: 'Back to Reports', to: '/reports', icon: 'back' },
                { label: 'Export CSV', onClick: handleExport, icon: 'download', variant: 'primary' },
              ]}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}
