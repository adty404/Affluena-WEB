import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { PageMetaStrip } from '../../components/layout/PageMetaStrip';
import { useIncomeReport } from '../../hooks/useReports';
import { ReportBarChart, ReportMetricCard, statusTone } from '../../components/reports/ReportCards';
import type { ReportRow } from '../../types/reporting';

export function IncomeReportPage() {
  const month = '2026-06'; // Defaulting to current month for now
  const { data, isLoading, isError } = useIncomeReport(month);

  const rows = data?.rows ?? [];
  const metrics = data?.metrics ?? [];

  return (
    <AppLayout title="Income Report" description="Income source, recurring income, and collection tracking.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>● Income · June 2026</Badge>
            <h2>Semua sumber pemasukan terlihat bersama recurring income dan collection.</h2>
            <p>Membantu user membedakan salary, freelance, interest, dan receivable collection.</p>
          </div>
          <div className="app-hero-actions"><Button to="/reports">Back to Reports</Button><Button to="/exports/new" variant="primary"><AppIcon name="export" /> Export</Button></div>
        </section>

        <section className="report-filter-bar">
          <Card className="filter-card"><span>Period</span><strong>June 2026</strong></Card>
          <Card className="filter-card"><span>Wallet</span><strong>All wallets</strong></Card>
          <Card className="filter-card"><span>Category</span><strong>Income only</strong></Card>
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
                  { key: 'name', header: 'Name', render: (row) => <div className="table-title"><span className={`mini-icon ${row.status === 'critical' ? 'danger' : row.status === 'watch' ? 'warning' : row.status === 'growth' ? 'info' : 'safe'}`}><AppIcon name="analytics" /></span><strong>{row.name}</strong><small>{row.category}</small></div> },
                  { key: 'wallet', header: 'Wallet', render: (row) => row.wallet },
                  { key: 'amount', header: 'Current', align: 'right', render: (row) => <Amount value={row.amount_minor} type="income" /> },
                  { key: 'previous', header: 'Reference', align: 'right', render: (row) => <Amount value={row.previous_amount_minor} /> },
                  { key: 'change', header: 'Change', render: (row) => <Badge tone={statusTone(row.status)}>{row.change_percent}%</Badge> },
                  { key: 'status', header: 'Status', render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
                ]}
              />
            </Card>
            <PageMetaStrip
              title="Income report status"
              items={[
                { label: 'Last updated', value: 'June 2026', icon: 'calendar' },
                { label: 'Rows', value: rows.length, icon: 'list' },
                { label: 'Sync status', value: 'Report API', icon: 'success' },
              ]}
              actions={[
                { label: 'Back to Reports', to: '/reports', icon: 'back' },
                { label: 'Export CSV', to: '/exports/new', icon: 'download', variant: 'primary' },
              ]}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}
