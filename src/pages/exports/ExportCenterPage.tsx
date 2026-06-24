import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { PageMetaStrip } from '../../components/layout/PageMetaStrip';
import { useToast } from '../../components/ui/Toast';
import { useExportJobs } from '../../hooks/useExportJobs';
import { getExportCSV } from '../../api/export';
import { formatTimestamp } from '../../lib/auditLabels';
import type { ApiError } from '../../api/types';
import type { ExportJob } from '../../types/reporting';

const statusTone = (status: 'ready' | 'failed') => status === 'ready' ? 'green' : 'red';

function jobPeriod(job: ExportJob): string {
  if (job.from_at && job.to_at) {
    return `${formatTimestamp(job.from_at)} – ${formatTimestamp(job.to_at)}`;
  }
  return 'All time';
}

export function ExportCenterPage() {
  const { data, isLoading, isError } = useExportJobs();
  const { showToast } = useToast();
  const jobs = data?.jobs ?? [];

  const readyCount = jobs.filter((job) => job.status === 'completed').length;
  const totalRows = jobs.reduce((sum, job) => sum + job.row_count, 0);

  const handleDownload = async (job: ExportJob) => {
    try {
      const blob = await getExportCSV(job.from_at || undefined, job.to_at || undefined);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-${job.id}.${job.format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast('Export berhasil diunduh.');
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal mengunduh export.');
    }
  };

  return (
    <AppLayout title="Export Center" description="Generate, download, and review CSV/XLSX exports.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><Badge>● Export</Badge><h2>Export data lintas modul dengan histori yang jelas.</h2><p>Export center mengelola CSV/XLSX untuk transactions, reports, budget, debt, dan goals.</p></div>
          <div className="app-hero-actions"><Button to="/exports/new" variant="primary"><AppIcon name="export" /> New Export</Button><Button to="/reports">Reports</Button></div>
        </section>
        <section className="stat-grid">
          <Card className="stat-card"><span>Ready Files</span><strong>{readyCount}</strong><small>Can be opened</small></Card>
          <Card className="stat-card blue"><span>Total Rows</span><strong>{totalRows.toLocaleString('id-ID')}</strong><small>Across exports</small></Card>
          <Card className="stat-card purple"><span>Modules</span><strong>1</strong><small>Transactions</small></Card>
          <Card className="stat-card"><span>Latest</span><strong>{jobs.length > 0 ? new Date(jobs[0].created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : '-'}</strong><small>Most recent period</small></Card>
        </section>
        <Card className="panel-card">
          <div className="panel-head"><div><h3>Export History</h3><p>Semua export punya status, jumlah row, size, dan detail.</p></div><Button to="/exports/new" size="small" variant="primary"><AppIcon name="add" /> Create Export</Button></div>
          {isLoading ? (
            <div className="empty-state"><p>Loading exports...</p></div>
          ) : isError ? (
            <div className="empty-state"><p>Failed to load exports.</p></div>
          ) : jobs.length === 0 ? (
            <div className="empty-state"><p>No exports found.</p></div>
          ) : (
            <DataTable<ExportJob>
              data={jobs}
              getRowKey={(job) => job.id}
              columns={[
                { 
                  key: 'name', 
                  header: 'Export', 
                  render: (job) => {
                    const name = `Export ${formatTimestamp(job.created_at)}`;
                    return (
                      <div className="table-title">
                        <span className="mini-icon info"><AppIcon name="download" /></span>
                        <strong>{name}</strong>
                        <small>{jobPeriod(job)} · {job.format.toUpperCase()}</small>
                      </div>
                    );
                  }
                },
                { key: 'module', header: 'Module', render: () => 'Transactions' },
                { key: 'rows', header: 'Rows', align: 'right', render: (job) => job.row_count.toLocaleString('id-ID') },
                { key: 'size', header: 'Est. size', render: (job) => `~${(job.row_count * 50 / 1024).toFixed(1)} KB` },
                { 
                  key: 'status', 
                  header: 'Status', 
                  render: (job) => {
                    const displayStatus = job.status === 'completed' ? 'ready' : 'failed';
                    return <Badge tone={statusTone(displayStatus)}>{displayStatus}</Badge>;
                  } 
                },
                { 
                  key: 'action', 
                  header: 'Action', 
                  render: (job) => (
                    <div className="inline-actions">
                      <Button to={`/exports/${job.id}`} size="small">Open</Button>
                      {job.status === 'completed' && (
                        <Button onClick={() => handleDownload(job)} size="small"><AppIcon name="download" /> Download</Button>
                      )}
                    </div>
                  )
                },
              ]}
            />
          )}
        </Card>
        <PageMetaStrip
          title="Export Center status"
          items={[
            { label: 'Last updated', value: jobs.length > 0 ? new Date(jobs[0].created_at).toLocaleDateString('id-ID') : 'No exports yet', icon: 'calendar' },
            { label: 'Export Center', value: `${jobs.length} jobs`, icon: 'export' },
            { label: 'Rows available', value: totalRows.toLocaleString('id-ID'), icon: 'list' },
          ]}
          actions={[
            { label: 'New Export', to: '/exports/new', icon: 'add', variant: 'primary' },
            { label: 'Reports', to: '/reports', icon: 'chart' },
          ]}
        />
      </div>
    </AppLayout>
  );
}
