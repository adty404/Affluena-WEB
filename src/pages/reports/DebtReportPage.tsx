import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { debtReportRows, reportMetrics } from '../../data/mockReporting';
import { ReportBarChart, ReportMetricCard, statusTone } from '../../components/reports/ReportCards';
import type { ReportRow } from '../../types/reporting';

const rows = debtReportRows;

export function DebtReportPage() {
  return (
    <AppLayout title="Debt Report" description="Payable, receivable, due risk, and collection health.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>● Debt · Active Items</Badge>
            <h2>Debt report mengukur outstanding payable dan receivable yang perlu ditindaklanjuti.</h2>
            <p>Report ini membantu menentukan prioritas bayar dan tagih.</p>
          </div>
          <div className="app-hero-actions"><Button to="/reports">Back to Reports</Button><Button to="/exports/new" variant="primary"><AppIcon name="export" /> Export</Button></div>
        </section>

        <section className="report-filter-bar">
          <Card className="filter-card"><span>Period</span><strong>June 2026</strong></Card>
          <Card className="filter-card"><span>Wallet</span><strong>All wallets</strong></Card>
          <Card className="filter-card"><span>Category</span><strong>Debt items</strong></Card>
          <Card className="filter-card"><span>Generated</span><strong>14 Jun 2026</strong></Card>
        </section>

        <section className="stat-grid">{reportMetrics.slice(0, 4).map((metric) => <ReportMetricCard key={metric.id} metric={metric} />)}</section>

        <section className="dashboard-grid two-col">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Trend Overview</h3><p>Bar visual menggunakan data ringkasan report.</p></div><Button to="/exports/new" size="small">Export Chart Data</Button></div>
            <ReportBarChart rows={rows} />
          </Card>
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Report Insights</h3><p>Ringkasan actionable dari laporan ini.</p></div></div>
            <div className="metric-list compact-metrics">
              <div className="metric-cell"><span>Highest</span><strong>{rows[0]?.name}</strong><small><Amount value={rows[0]?.amount ?? 0} /></small></div>
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
              { key: 'name', header: 'Name', render: (row) => <div className="table-title"><span className={`mini-icon ${row.status === 'critical' ? 'danger' : row.status === 'watch' ? 'warning' : row.status === 'growth' ? 'info' : 'safe'}`}><AppIcon name="debt" /></span><strong>{row.name}</strong><small>{row.category}</small></div> },
              { key: 'wallet', header: 'Wallet', render: (row) => row.wallet },
              { key: 'amount', header: 'Current', align: 'right', render: (row) => <Amount value={row.amount} type="expense" /> },
              { key: 'previous', header: 'Reference', align: 'right', render: (row) => <Amount value={row.previousAmount} /> },
              { key: 'change', header: 'Change', render: (row) => <Badge tone={statusTone(row.status)}>{row.changePercent}%</Badge> },
              { key: 'status', header: 'Status', render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
