import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { PageMetaStrip } from '../../components/layout/PageMetaStrip';
import { useToast } from '../../components/ui/Toast';
import { useGoalReport } from '../../hooks/useReports';
import { useReportMonth } from '../../hooks/useReportMonth';
import { MonthPicker } from '../../components/reports/MonthPicker';
import { ReportBarChart, ReportMetricCard, statusLabel, statusTone } from '../../components/reports/ReportCards';
import { exportReportCsv, formatMonthLabel } from '../../lib/reporting';
import type { ReportRow } from '../../types/reporting';

export function GoalReportPage() {
  const [month, setMonth] = useReportMonth();
  const { data, isLoading, isError } = useGoalReport(month);
  const { showToast } = useToast();

  const rows = data?.rows ?? [];
  const metrics = data?.metrics ?? [];
  const monthLabel = formatMonthLabel(month);

  const handleExport = () => {
    if (!data || (rows.length === 0 && metrics.length === 0)) {
      showToast('Tidak ada data target tabungan untuk diekspor pada periode ini.');
      return;
    }
    exportReportCsv('Laporan Target Tabungan', month, data);
    showToast('Laporan target tabungan berhasil diekspor sebagai CSV.');
  };

  return (
    <AppLayout title="Laporan Target Tabungan" description="Progres target, kesehatan setoran, dan status target bersama.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>● Target Tabungan · {monthLabel}</Badge>
            <h2>Lihat target, dana terkumpul, dan progres setiap target tabungan.</h2>
            <p>Termasuk target pribadi dan target bersama dengan setoran anggota.</p>
          </div>
          <div className="app-hero-actions"><Button to="/reports">Kembali ke Laporan</Button><Button onClick={handleExport} variant="primary" disabled={isLoading}><AppIcon name="export" /> Ekspor</Button></div>
        </section>

        <section className="report-filter-bar">
          <MonthPicker value={month} onChange={setMonth} />
          <Card className="filter-card"><span>Dompet</span><strong>Semua dompet</strong></Card>
          <Card className="filter-card"><span>Kategori</span><strong>Target tabungan</strong></Card>
          <Card className="filter-card"><span>Baris</span><strong>{rows.length} baris</strong></Card>
        </section>

        {isLoading ? (
          <Card className="panel-card"><div className="empty-state"><p>Memuat laporan...</p></div></Card>
        ) : isError ? (
          <Card className="panel-card"><div className="empty-state"><p>Gagal memuat laporan.</p></div></Card>
        ) : rows.length === 0 && metrics.length === 0 ? (
          <Card className="panel-card"><div className="empty-state"><p>Tidak ada data target tabungan untuk {monthLabel}.</p></div></Card>
        ) : (
          <>
            <section className="stat-grid">{metrics.slice(0, 4).map((metric) => <ReportMetricCard key={metric.id} metric={metric} />)}</section>

            <section className="dashboard-grid two-col">
              <Card className="panel-card">
                <div className="panel-head"><div><h3>Ringkasan Tren</h3><p>Visual batang dari data ringkasan laporan.</p></div><Button onClick={handleExport} size="small">Ekspor Data Grafik</Button></div>
                <ReportBarChart rows={rows} />
              </Card>
              <Card className="panel-card">
                <div className="panel-head"><div><h3>Wawasan Laporan</h3><p>Ringkasan penting dari laporan ini.</p></div></div>
                <div className="metric-list compact-metrics">
                  <div className="metric-cell"><span>Tertinggi</span><strong>{rows[0]?.name ?? '-'}</strong><small><Amount value={rows[0]?.amount_minor ?? 0} /></small></div>
                  <div className="metric-cell"><span>Perlu Ditinjau</span><strong>{rows.filter((row) => row.status === 'critical' || row.status === 'watch').length} baris</strong><small>Status pantau dan kritis</small></div>
                  <div className="metric-cell"><span>Baris</span><strong>{rows.length}</strong><small>Periode berjalan</small></div>
                  <div className="metric-cell"><span>Periode</span><strong>{monthLabel}</strong><small>Bulan laporan</small></div>
                </div>
              </Card>
            </section>

            <Card className="panel-card">
              <div className="panel-head"><div><h3>Tabel Laporan</h3><p>Data detail dengan status dan tren.</p></div><Button onClick={handleExport} size="small" variant="primary"><AppIcon name="download" /> Unduh CSV</Button></div>
              <DataTable<ReportRow>
                data={rows}
                getRowKey={(row) => row.id}
                columns={[
                  { key: 'name', header: 'Nama', render: (row) => <div className="table-title"><span className={`mini-icon ${row.status === 'critical' ? 'danger' : row.status === 'watch' ? 'warning' : row.status === 'growth' ? 'info' : 'safe'}`}><AppIcon name="goal" /></span><strong>{row.name}</strong><small>{row.category}</small></div> },
                  { key: 'wallet', header: 'Dompet', render: (row) => row.wallet },
                  { key: 'amount', header: 'Saat Ini (Rp)', align: 'right', render: (row) => <Amount value={row.amount_minor} type="income" /> },
                  { key: 'previous', header: 'Pembanding (Rp)', align: 'right', render: (row) => <Amount value={row.previous_amount_minor} /> },
                  { key: 'change', header: 'Perubahan', render: (row) => <Badge tone={statusTone(row.status)}>{row.change_percent}%</Badge> },
                  { key: 'status', header: 'Status', render: (row) => <Badge tone={statusTone(row.status)}>{statusLabel(row.status)}</Badge> },
                ]}
              />
            </Card>
            <PageMetaStrip
              title="Status laporan target tabungan"
              items={[
                { label: 'Periode', value: monthLabel, icon: 'calendar' },
                { label: 'Baris', value: rows.length, icon: 'list' },
                { label: 'Status sinkronisasi', value: 'Tersinkron', icon: 'success' },
              ]}
              actions={[
                { label: 'Kembali ke Laporan', to: '/reports', icon: 'back' },
                { label: 'Ekspor CSV', onClick: handleExport, icon: 'download', variant: 'primary' },
              ]}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}
