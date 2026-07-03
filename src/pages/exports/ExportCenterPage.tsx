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
import { NAV } from '../../lib/copy';
import type { ApiError } from '../../api/types';
import type { ExportJob } from '../../types/reporting';

const statusTone = (status: 'ready' | 'failed') => status === 'ready' ? 'green' : 'red';

function jobPeriod(job: ExportJob): string {
  if (job.from_at && job.to_at) {
    return `${formatTimestamp(job.from_at)} – ${formatTimestamp(job.to_at)}`;
  }
  return 'Semua waktu';
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
      showToast('Ekspor berhasil diunduh.');
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal mengunduh ekspor.');
    }
  };

  return (
    <AppLayout title={NAV.pusatEkspor} description="Buat, unduh, dan tinjau berkas ekspor CSV.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><Badge>● Ekspor</Badge><h2>Ekspor data keuangan kamu dengan riwayat yang jelas.</h2><p>Setiap berkas ekspor tercatat rapi lengkap dengan status, jumlah baris, dan periode.</p></div>
          <div className="app-hero-actions"><Button to="/exports/new" variant="primary"><AppIcon name="export" /> Ekspor Baru</Button><Button to="/reports">Laporan</Button></div>
        </section>
        <section className="stat-grid">
          <Card className="stat-card"><span>Berkas Siap</span><strong>{readyCount}</strong><small>Siap dibuka</small></Card>
          <Card className="stat-card blue"><span>Total Baris</span><strong>{totalRows.toLocaleString('id-ID')}</strong><small>Dari semua ekspor</small></Card>
          <Card className="stat-card purple"><span>Modul</span><strong>1</strong><small>Transaksi</small></Card>
          <Card className="stat-card"><span>Terbaru</span><strong>{jobs.length > 0 ? new Date(jobs[0].created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : '-'}</strong><small>Periode terakhir</small></Card>
        </section>
        <Card className="panel-card">
          <div className="panel-head"><div><h3>Riwayat Ekspor</h3><p>Semua ekspor punya status, jumlah baris, ukuran, dan detail.</p></div><Button to="/exports/new" size="small" variant="primary"><AppIcon name="add" /> Buat Ekspor</Button></div>
          {isLoading ? (
            <div className="empty-state"><p>Memuat ekspor...</p></div>
          ) : isError ? (
            <div className="empty-state"><p>Gagal memuat ekspor.</p></div>
          ) : jobs.length === 0 ? (
            <div className="empty-state"><p>Belum ada ekspor.</p></div>
          ) : (
            <DataTable<ExportJob>
              data={jobs}
              getRowKey={(job) => job.id}
              columns={[
                {
                  key: 'name',
                  header: 'Ekspor',
                  render: (job) => {
                    const name = `Ekspor ${formatTimestamp(job.created_at)}`;
                    return (
                      <div className="table-title">
                        <span className="mini-icon info"><AppIcon name="download" /></span>
                        <strong>{name}</strong>
                        <small>{jobPeriod(job)} · {job.format.toUpperCase()}</small>
                      </div>
                    );
                  }
                },
                { key: 'module', header: 'Modul', render: () => 'Transaksi' },
                { key: 'rows', header: 'Baris', align: 'right', render: (job) => job.row_count.toLocaleString('id-ID') },
                { key: 'size', header: 'Perkiraan Ukuran', render: (job) => `~${(job.row_count * 50 / 1024).toFixed(1)} KB` },
                {
                  key: 'status',
                  header: 'Status',
                  render: (job) => {
                    const displayStatus = job.status === 'completed' ? 'ready' : 'failed';
                    return <Badge tone={statusTone(displayStatus)}>{displayStatus === 'ready' ? 'Siap' : 'Gagal'}</Badge>;
                  }
                },
                {
                  key: 'action',
                  header: 'Aksi',
                  render: (job) => (
                    <div className="inline-actions">
                      <Button to={`/exports/${job.id}`} size="small">Buka</Button>
                      {job.status === 'completed' && (
                        <Button onClick={() => handleDownload(job)} size="small"><AppIcon name="download" /> Unduh</Button>
                      )}
                    </div>
                  )
                },
              ]}
            />
          )}
        </Card>
        <PageMetaStrip
          title="Status Pusat Ekspor"
          items={[
            { label: 'Terakhir diperbarui', value: jobs.length > 0 ? new Date(jobs[0].created_at).toLocaleDateString('id-ID') : 'Belum ada ekspor', icon: 'calendar' },
            { label: 'Pusat Ekspor', value: `${jobs.length} ekspor`, icon: 'export' },
            { label: 'Baris tersedia', value: totalRows.toLocaleString('id-ID'), icon: 'list' },
          ]}
          actions={[
            { label: 'Ekspor Baru', to: '/exports/new', icon: 'add', variant: 'primary' },
            { label: 'Laporan', to: '/reports', icon: 'chart' },
          ]}
        />
      </div>
    </AppLayout>
  );
}
