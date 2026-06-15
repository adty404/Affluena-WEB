import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { exportJobs } from '../../data/mockReporting';
import type { ExportJob } from '../../types/reporting';

const statusTone = (status: ExportJob['status']) => status === 'ready' ? 'green' : status === 'processing' ? 'orange' : 'red';

export function ExportCenterPage() {
  return (
    <AppLayout title="Export Center" description="Generate, download, and review CSV/XLSX exports.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><Badge>● Export</Badge><h2>Export data lintas modul dengan histori yang jelas.</h2><p>Export center mengelola CSV/XLSX untuk transactions, reports, budget, debt, dan goals.</p></div>
          <div className="app-hero-actions"><Button to="/exports/new" variant="primary"><AppIcon name="export" /> New Export</Button><Button to="/reports">Reports</Button></div>
        </section>
        <section className="stat-grid">
          <Card className="stat-card"><span>Ready Files</span><strong>{exportJobs.filter((job) => job.status === 'ready').length}</strong><small>Can be opened</small></Card>
          <Card className="stat-card blue"><span>Total Rows</span><strong>{exportJobs.reduce((sum, job) => sum + job.rows, 0)}</strong><small>Across exports</small></Card>
          <Card className="stat-card purple"><span>Modules</span><strong>5</strong><small>Transactions, Budget, Goals</small></Card>
          <Card className="stat-card"><span>Latest</span><strong>Jun 2026</strong><small>Most recent period</small></Card>
        </section>
        <Card className="panel-card">
          <div className="panel-head"><div><h3>Export History</h3><p>Semua export punya status, jumlah row, size, dan detail.</p></div><Button to="/exports/new" size="small" variant="primary"><AppIcon name="add" /> Create Export</Button></div>
          <DataTable<ExportJob>
            data={exportJobs}
            getRowKey={(job) => job.id}
            columns={[
              { key: 'name', header: 'Export', render: (job) => <div className="table-title"><span className="mini-icon info"><AppIcon name="download" /></span><strong>{job.name}</strong><small>{job.period} · {job.format}</small></div> },
              { key: 'module', header: 'Module', render: (job) => job.module },
              { key: 'rows', header: 'Rows', align: 'right', render: (job) => job.rows.toLocaleString('id-ID') },
              { key: 'size', header: 'Size', render: (job) => job.size },
              { key: 'status', header: 'Status', render: (job) => <Badge tone={statusTone(job.status)}>{job.status}</Badge> },
              { key: 'action', header: 'Action', render: (job) => <div className="inline-actions"><Button to={`/exports/${job.id}`} size="small">Open</Button><Button to={`/exports/${job.id}`} size="small"><AppIcon name="download" /> Download</Button></div> },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
