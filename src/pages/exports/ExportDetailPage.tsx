import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { exportJobs } from '../../data/mockReporting';

export function ExportDetailPage() {
  const { id } = useParams();
  const job = exportJobs.find((item) => item.id === id) ?? exportJobs[0];
  const ready = job.status === 'ready';
  return (
    <AppLayout title="Export Detail" description="Export result, metadata, and download access.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><Badge>● {job.format}</Badge><h2>{job.name}</h2><p>{job.module} · {job.period} · requested at {job.requestedAt}</p></div><div className="app-hero-actions"><Button to="/exports">Back</Button><Button to="/exports/new" variant="primary"><AppIcon name="export" /> New Export</Button></div></section>
        <section className="dashboard-grid two-col">
          <Card className="panel-card export-result-card"><div className={`mini-icon ${ready ? 'safe' : 'warning'}`}><AppIcon name={ready ? 'download' : 'history'} /></div><h3>{ready ? 'File ready to download' : 'File is processing'}</h3><p>{ready ? 'Metadata, rows, and file size are available. The download action keeps the export auditable from this detail page.' : 'Processing job remains visible so user understands export progress and can revisit the result later.'}</p><div className="inline-actions"><Button to="/exports" variant="primary"><AppIcon name="download" /> Download</Button><Button to="/activities">View Activity</Button></div></Card>
          <Card className="panel-card"><div className="panel-head"><div><h3>Export Metadata</h3><p>Traceable export information.</p></div></div><div className="metric-list compact-metrics"><div className="metric-cell"><span>Rows</span><strong>{job.rows.toLocaleString('id-ID')}</strong><small>Included records</small></div><div className="metric-cell"><span>Size</span><strong>{job.size}</strong><small>Current result</small></div><div className="metric-cell"><span>Status</span><strong>{job.status}</strong><small>Export lifecycle</small></div><div className="metric-cell"><span>Module</span><strong>{job.module}</strong><small>Source module</small></div></div></Card>
        </section>
      </div>
    </AppLayout>
  );
}
