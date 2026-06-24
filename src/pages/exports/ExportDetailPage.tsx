import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { PageMetaStrip } from '../../components/layout/PageMetaStrip';
import { useToast } from '../../components/ui/Toast';
import { useExportJob } from '../../hooks/useExportJob';
import { getExportCSV } from '../../api/export';
import { formatTimestamp } from '../../lib/auditLabels';
import type { ApiError } from '../../api/types';

export function ExportDetailPage() {
  const { id } = useParams();
  const { data: job, isLoading, isError } = useExportJob(id || '');
  const { showToast } = useToast();

  if (isLoading) {
    return (
      <AppLayout title="Export Detail" description="Export result, metadata, and download access.">
        <div className="dashboard-page grid-stack">
          <div className="empty-state"><p>Loading export details...</p></div>
        </div>
      </AppLayout>
    );
  }

  if (isError || !job) {
    return (
      <AppLayout title="Export Detail" description="Export result, metadata, and download access.">
        <div className="dashboard-page grid-stack">
          <div className="empty-state"><p>Failed to load export details or export not found.</p></div>
        </div>
      </AppLayout>
    );
  }

  const ready = job.status === 'completed';
  const period = job.from_at && job.to_at ? `${formatTimestamp(job.from_at)} – ${formatTimestamp(job.to_at)}` : 'All time';
  const name = `Export ${formatTimestamp(job.created_at)}`;
  const size = `~${(job.row_count * 50 / 1024).toFixed(1)} KB`;

  const handleDownload = async () => {
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
    <AppLayout title="Export Detail" description="Export result, metadata, and download access.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>● {job.format.toUpperCase()}</Badge>
            <h2>{name}</h2>
            <p>Transactions · {period} · requested at {new Date(job.created_at).toLocaleString('id-ID')}</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/exports">Back</Button>
            <Button to="/exports/new" variant="primary"><AppIcon name="export" /> New Export</Button>
          </div>
        </section>
        <section className="dashboard-grid two-col">
          <Card className="panel-card export-result-card">
            <div className={`mini-icon ${ready ? 'safe' : 'warning'}`}>
              <AppIcon name={ready ? 'download' : 'history'} />
            </div>
            <h3>{ready ? 'File ready to download' : 'File generation failed'}</h3>
            <p>{ready ? 'Metadata, rows, and file size are available. The download action keeps the export auditable from this detail page.' : 'The export job failed to complete. Please try creating a new export.'}</p>
            <div className="inline-actions">
              {ready && (
                <Button onClick={handleDownload} variant="primary"><AppIcon name="download" /> Download</Button>
              )}
              <Button to="/activities">View Activity</Button>
            </div>
          </Card>
          <Card className="panel-card">
            <div className="panel-head">
              <div>
                <h3>Export Metadata</h3>
                <p>Traceable export information.</p>
              </div>
            </div>
            <div className="metric-list compact-metrics">
              <div className="metric-cell">
                <span>Rows</span>
                <strong>{job.row_count.toLocaleString('id-ID')}</strong>
                <small>Included records</small>
              </div>
              <div className="metric-cell">
                <span>Size</span>
                <strong>{size}</strong>
                <small>Current result</small>
              </div>
              <div className="metric-cell">
                <span>Status</span>
                <strong>{ready ? 'ready' : 'failed'}</strong>
                <small>Export lifecycle</small>
              </div>
              <div className="metric-cell">
                <span>Module</span>
                <strong>Transactions</strong>
                <small>Source module</small>
              </div>
            </div>
          </Card>
        </section>
        <PageMetaStrip
          title="Export detail status"
          items={[
            { label: 'Last updated', value: new Date(job.created_at).toLocaleDateString('id-ID'), icon: 'calendar' },
            { label: 'Export Center', value: ready ? 'Download ready' : 'Failed job', icon: ready ? 'download' : 'warning' },
            { label: 'Rows available', value: job.row_count.toLocaleString('id-ID'), icon: 'list' },
          ]}
          actions={[
            { label: 'Back to Exports', to: '/exports', icon: 'back' },
            { label: 'New Export', to: '/exports/new', icon: 'add', variant: 'primary' },
          ]}
        />
      </div>
    </AppLayout>
  );
}
