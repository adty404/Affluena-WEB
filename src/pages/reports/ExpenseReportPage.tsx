import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { PageMetaStrip } from '../../components/layout/PageMetaStrip';
import { useToast } from '../../components/ui/Toast';
import { useExpenseReport } from '../../hooks/useReports';
import { useReportMonth } from '../../hooks/useReportMonth';
import { MonthPicker } from '../../components/reports/MonthPicker';
import { ReportBarChart, ReportMetricCard, statusTone } from '../../components/reports/ReportCards';
import { exportReportCsv, formatMonthLabel } from '../../lib/reporting';
import type { ReportRow } from '../../types/reporting';

export function ExpenseReportPage() {
  const [month, setMonth] = useReportMonth();
  const { data, isLoading, isError } = useExpenseReport(month);
  const { showToast } = useToast();

  const rows = data?.rows ?? [];
  const metrics = data?.metrics ?? [];
  const monthLabel = formatMonthLabel(month);

  const handleExport = () => {
    if (!data || (rows.length === 0 && metrics.length === 0)) {
      showToast('No expense data to export for this period.');
      return;
    }
    exportReportCsv('Expense Report', month, data);
    showToast('Expense report exported as CSV.');
  };

  return (
    <AppLayout title="Expense Report" description="Spending distribution by category, wallet, and trend.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>● Expense · {monthLabel}</Badge>
            <h2>Pengeluaran terpantau per kategori dengan status safe, watch, dan critical.</h2>
            <p>Membantu user menahan kategori yang naik terlalu cepat.</p>
          </div>
          <div className="app-hero-actions"><Button to="/reports">Back to Reports</Button><Button onClick={handleExport} variant="primary" disabled={isLoading}><AppIcon name="export" /> Export</Button></div>
        </section>

        <section className="report-filter-bar">
          <MonthPicker value={month} onChange={setMonth} />
          <Card className="filter-card"><span>Wallet</span><strong>All wallets</strong></Card>
          <Card className="filter-card"><span>Category</span><strong>Expense only</strong></Card>
          <Card className="filter-card"><span>Rows</span><strong>{rows.length} rows</strong></Card>
        </section>

        {isLoading ? (
          <Card className="panel-card"><div className="empty-state"><p>Loading report...</p></div></Card>
        ) : isError ? (
          <Card className="panel-card"><div className="empty-state"><p>Failed to load report.</p></div></Card>
        ) : rows.length === 0 && metrics.length === 0 ? (
          <Card className="panel-card"><div className="empty-state"><p>No expense data for {monthLabel}.</p></div></Card>
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
                  <div className="metric-cell"><span>Highest</span><strong>{rows[0]?.name ?? '-'}</strong><small><Amount value={rows[0]?.amount_minor ?? 0} /></small></div>
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
                  { key: 'name', header: 'Name', render: (row) => <div className="table-title"><span className={`mini-icon ${row.status === 'critical' ? 'danger' : row.status === 'watch' ? 'warning' : row.status === 'growth' ? 'info' : 'safe'}`}><AppIcon name="shopping" /></span><strong>{row.name}</strong><small>{row.category}</small></div> },
                  { key: 'wallet', header: 'Wallet', render: (row) => row.wallet },
                  { key: 'amount', header: 'Current', align: 'right', render: (row) => <Amount value={row.amount_minor} type="expense" /> },
                  { key: 'previous', header: 'Reference', align: 'right', render: (row) => <Amount value={row.previous_amount_minor} /> },
                  { key: 'change', header: 'Change', render: (row) => <Badge tone={statusTone(row.status)}>{row.change_percent}%</Badge> },
                  { key: 'status', header: 'Status', render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
                ]}
              />
            </Card>
            <PageMetaStrip
              title="Expense report status"
              items={[
                { label: 'Period', value: monthLabel, icon: 'calendar' },
                { label: 'Rows', value: rows.length, icon: 'list' },
                { label: 'Sync status', value: 'Report API', icon: 'success' },
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
