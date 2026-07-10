import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input, Select } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { useToast } from '../../components/ui/Toast';
import { useExportCSV } from '../../hooks/useExports';
import { listExportJobs } from '../../api/export';
import { queryKeys } from '../../lib/queryClient';
import type { ApiError } from '../../api/types';

export function ExportNewPage() {
  const [created, setCreated] = useState(false);
  const [resultRows, setResultRows] = useState(0);
  const [resultSize, setResultSize] = useState('');
  const [latestJobId, setLatestJobId] = useState<string | null>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const exportMut = useExportCSV();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fromDate = formData.get('from') as string;
    const toDate = formData.get('to') as string;

    let from: string | undefined;
    let to: string | undefined;

    if (fromDate) {
      from = new Date(fromDate).toISOString();
    }
    if (toDate) {
      const toDateObj = new Date(toDate);
      toDateObj.setHours(23, 59, 59, 999);
      to = toDateObj.toISOString();
    }

    try {
      const blob = await exportMut.mutateAsync({ from, to });

      // Trigger the browser download of the actual CSV bytes.
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Derive a real row count from the downloaded CSV (header line excluded).
      const text = await blob.text();
      const lineCount = text.split('\n').filter((line) => line.trim().length > 0).length;
      const rows = Math.max(0, lineCount - 1);
      setResultRows(rows);
      setResultSize(`${(blob.size / 1024).toFixed(1)} KB`);

      // The API records an export_jobs audit row; refresh the list and grab the
      // real job id so "Buka Hasil" routes to a genuine export detail page.
      queryClient.invalidateQueries({ queryKey: ['exportJobs'] });
      try {
        const jobs = await queryClient.fetchQuery({
          queryKey: queryKeys.exportJobs.list(1, 0),
          queryFn: () => listExportJobs(1, 0),
        });
        setLatestJobId(jobs.jobs[0]?.id ?? null);
      } catch {
        setLatestJobId(null);
      }

      setCreated(true);
      showToast('Ekspor berhasil diunduh.');
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal membuat ekspor.');
    }
  }

  const openLatest = () => {
    if (latestJobId) {
      navigate(`/exports/${latestJobId}`);
    } else {
      navigate('/exports');
    }
  };

  // Default the export range to the current month (first day → last day), local
  // time, instead of a hardcoded stale month.
  const pad = (n: number) => String(n).padStart(2, '0');
  const today = new Date();
  const firstOfMonth = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-01`;
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const lastOfMonth = `${lastDay.getFullYear()}-${pad(lastDay.getMonth() + 1)}-${pad(lastDay.getDate())}`;

  return (
    <AppLayout title="Buat Ekspor" description="Buat ekspor data CSV dengan pilihan modul dan periode yang jelas.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><Badge>Ekspor Baru</Badge><h2>Pilih modul, periode, dan format, lalu buat berkas ekspor.</h2><p>Berkas CSV langsung terunduh dan tercatat di riwayat ekspor dengan status dan jumlah baris sebenarnya.</p></div><div className="app-hero-actions"><Button to="/exports">Kembali</Button><Button onClick={openLatest} variant="primary" disabled={!created}><AppIcon name="download" /> Buka Terbaru</Button></div></section>
        <section className="dashboard-grid two-col">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Konfigurasi Ekspor</h3><p>Atur modul, format, dan rentang tanggal data yang mau kamu ekspor.</p></div></div>
            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-two"><label className="field"><span>Modul</span><Select defaultValue="Transactions"><option value="Transactions">Transaksi</option></Select></label><label className="field"><span>Format</span><Select defaultValue="CSV"><option>CSV</option></Select></label></div>
              <div className="form-two"><label className="field"><span>Tanggal mulai</span><Input type="date" name="from" defaultValue={firstOfMonth} /></label><label className="field"><span>Tanggal akhir</span><Input type="date" name="to" defaultValue={lastOfMonth} /></label></div>
              <label className="field"><span>Nama ekspor</span><Input defaultValue="Ekspor Transaksi" /><small>Dipakai sebagai usulan nama berkas unduhan.</small></label>
              <div className="form-actions"><Button to="/exports">Batal</Button><Button type="submit" variant="primary" disabled={exportMut.isPending}><AppIcon name="export" /> {exportMut.isPending ? 'Membuat...' : 'Buat Ekspor'}</Button></div>
            </form>
          </Card>
          <Card className="panel-card export-result-card">
            <div className="mini-icon safe"><AppIcon name={created ? 'success' : 'export'} /></div>
            <h3>{created ? 'Ekspor selesai' : 'Pratinjau ekspor'}</h3>
            <p>{created ? 'Berkas sudah diunduh dan tercatat di riwayat ekspor. Buka detail untuk mengunduh ulang.' : 'Konfigurasi ini akan menghasilkan berkas CSV untuk periode yang dipilih.'}</p>
            <div className="metric-list compact-metrics">
              <div className="metric-cell"><span>Baris</span><strong>{created ? resultRows.toLocaleString('id-ID') : 'Dihitung saat ekspor'}</strong><small>{created ? 'Baris yang disertakan' : 'Sesuai periode terpilih'}</small></div>
              <div className="metric-cell"><span>{created ? 'Ukuran' : 'Format'}</span><strong>{created ? resultSize : 'CSV'}</strong><small>{created ? 'Berkas terunduh' : 'Kompatibel dengan aplikasi spreadsheet'}</small></div>
            </div>
            <div className="inline-actions"><Button onClick={openLatest} variant={created ? 'primary' : 'default'} disabled={!created}>Buka Hasil</Button><Button to="/exports">Riwayat</Button></div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
