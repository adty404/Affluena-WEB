import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { PageMetaStrip } from '../../components/layout/PageMetaStrip';
import { useToast } from '../../components/ui/Toast';
import { useExportJob } from '../../hooks/useExportJob';
import { getExportCSV } from '../../api/export';
import { formatTimestamp } from '../../lib/auditLabels';
import type { ApiError } from '../../api/types';

export function ExportDetailPage() {
  const { id } = useParams();
  const { data: job, isLoading, isError, refetch } = useExportJob(id || '');
  const { showToast } = useToast();

  if (isLoading) {
    return (
      <AppLayout title="Detail Ekspor" description="Hasil ekspor, informasi berkas, dan akses unduhan.">
        <div className="dashboard-page grid-stack">
          <div className="loading-state">Memuat detail ekspor...</div>
        </div>
      </AppLayout>
    );
  }

  if (isError || !job) {
    return (
      <AppLayout title="Detail Ekspor" description="Hasil ekspor, informasi berkas, dan akses unduhan.">
        <div className="dashboard-page grid-stack">
          <Card className="panel-card">
            <EmptyState icon={<AppIcon name="empty" />} title="Ekspor tidak ditemukan" description="Berkas ekspor ini gagal dimuat atau sudah tidak tersedia." action={<Button variant="primary" onClick={() => refetch()}><AppIcon name="recurring" /> Coba lagi</Button>} />
          </Card>
        </div>
      </AppLayout>
    );
  }

  const ready = job.status === 'completed';
  const period = job.from_at && job.to_at ? `${formatTimestamp(job.from_at)} – ${formatTimestamp(job.to_at)}` : 'Semua waktu';
  const name = `Ekspor ${formatTimestamp(job.created_at)}`;
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
      showToast('Ekspor berhasil diunduh.');
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal mengunduh ekspor.');
    }
  };

  return (
    <AppLayout title="Detail Ekspor" description="Hasil ekspor, informasi berkas, dan akses unduhan.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>{job.format.toUpperCase()}</Badge>
            <h2>{name}</h2>
            <p>Transaksi · {period} · dibuat pada {new Date(job.created_at).toLocaleString('id-ID')}</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/exports">Kembali</Button>
            <Button to="/exports/new" variant="primary"><AppIcon name="export" /> Ekspor Baru</Button>
          </div>
        </section>
        <section className="dashboard-grid two-col">
          <Card className="panel-card export-result-card">
            <div className={`mini-icon ${ready ? 'safe' : 'warning'}`}>
              <AppIcon name={ready ? 'download' : 'history'} />
            </div>
            <h3>{ready ? 'Berkas siap diunduh' : 'Pembuatan berkas gagal'}</h3>
            <p>{ready ? 'Jumlah baris dan ukuran berkas tersedia. Kamu bisa mengunduh ulang berkas kapan saja dari halaman ini.' : 'Ekspor ini gagal diselesaikan. Coba buat ekspor baru.'}</p>
            <div className="inline-actions">
              {ready && (
                <Button onClick={handleDownload} variant="primary"><AppIcon name="download" /> Unduh</Button>
              )}
              <Button to="/activities">Lihat Aktivitas</Button>
            </div>
          </Card>
          <Card className="panel-card">
            <div className="panel-head">
              <div>
                <h3>Informasi Ekspor</h3>
                <p>Detail berkas ekspor kamu.</p>
              </div>
            </div>
            <div className="metric-list compact-metrics">
              <div className="metric-cell">
                <span>Baris</span>
                <strong>{job.row_count.toLocaleString('id-ID')}</strong>
                <small>Baris yang disertakan</small>
              </div>
              <div className="metric-cell">
                <span>Ukuran</span>
                <strong>{size}</strong>
                <small>Perkiraan berkas</small>
              </div>
              <div className="metric-cell">
                <span>Status</span>
                <strong>{ready ? 'Siap' : 'Gagal'}</strong>
                <small>Status ekspor</small>
              </div>
              <div className="metric-cell">
                <span>Modul</span>
                <strong>Transaksi</strong>
                <small>Sumber data</small>
              </div>
            </div>
          </Card>
        </section>
        <PageMetaStrip
          title="Status detail ekspor"
          items={[
            { label: 'Terakhir diperbarui', value: new Date(job.created_at).toLocaleDateString('id-ID'), icon: 'calendar' },
            { label: 'Pusat Ekspor', value: ready ? 'Siap diunduh' : 'Gagal', icon: ready ? 'download' : 'warning' },
            { label: 'Baris tersedia', value: job.row_count.toLocaleString('id-ID'), icon: 'list' },
          ]}
          actions={[
            { label: 'Kembali ke Ekspor', to: '/exports', icon: 'back' },
            { label: 'Ekspor Baru', to: '/exports/new', icon: 'add', variant: 'primary' },
          ]}
        />
      </div>
    </AppLayout>
  );
}
