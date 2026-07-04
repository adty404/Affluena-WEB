import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { PageMetaStrip } from '../../components/layout/PageMetaStrip';
import { useToast } from '../../components/ui/Toast';
import { useReportsOverview } from '../../hooks/useReports';
import { useReportMonth } from '../../hooks/useReportMonth';
import { useAlerts } from '../../hooks/useAlerts';
import { useExportJobs } from '../../hooks/useExportJobs';
import { MonthPicker } from '../../components/reports/MonthPicker';
import { ReportMetricCard, ReportShortcutCard, statusTone } from '../../components/reports/ReportCards';
import { exportReportCsv, formatMonthLabel } from '../../lib/reporting';
import { relativeTime } from '../../lib/auditLabels';
import { NAV } from '../../lib/copy';
import type { ReportRow } from '../../types/reporting';

export function ReportsOverviewPage() {
  const [month, setMonth] = useReportMonth();
  const { data, isLoading, isError } = useReportsOverview(month);
  const { data: alertsData } = useAlerts();
  const { data: exportsData } = useExportJobs();

  const { showToast } = useToast();

  const metrics = data?.metrics ?? [];
  const rows = data?.rows ?? [];
  const recentAlerts = (alertsData?.alerts ?? []).slice(0, 3);
  const recentExports = (exportsData?.jobs ?? []).slice(0, 3);
  const monthLabel = formatMonthLabel(month);

  const handleExport = () => {
    if (!data || (rows.length === 0 && metrics.length === 0)) {
      showToast('Tidak ada data ringkasan untuk diekspor pada periode ini.');
      return;
    }
    exportReportCsv('Ringkasan Laporan', month, data);
    showToast('Ringkasan laporan berhasil diekspor sebagai CSV.');
  };

  return (
    <AppLayout title={NAV.laporan} description="Pusat laporan arus kas, pemasukan, pengeluaran, anggaran, utang, dan target tabungan.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>Pusat Laporan</Badge>
            <h2>Semua laporan keuangan kamu ada dalam satu tempat.</h2>
            <p>Baca performa transaksi, anggaran, utang, dan target tabungan dengan cepat, lengkap dengan filter periode dan ekspor.</p>
          </div>
          <div className="app-hero-actions"><Button onClick={handleExport} variant="primary" disabled={isLoading}><AppIcon name="export" /> Ekspor Ringkasan</Button><Button to="/alerts"><AppIcon name="warning" /> Pusat Pemberitahuan</Button></div>
        </section>

        <section className="report-filter-bar">
          <MonthPicker value={month} onChange={setMonth} />
          <div className="report-meta-chip"><span>Cakupan</span><strong>Semua data</strong></div>
          <div className="report-meta-chip"><span>Baris pantauan</span><strong>{rows.length} baris</strong></div>
          <div className="report-meta-chip"><span>Metrik</span><strong>{metrics.length} kartu</strong></div>
        </section>

        {isLoading ? (
          <div className="loading-state">Memuat ringkasan laporan...</div>
        ) : isError ? (
          <Card className="panel-card"><EmptyState icon={<AppIcon name="empty" />} title="Gagal memuat ringkasan laporan" description="Periksa koneksi lalu coba lagi." /></Card>
        ) : (
          <>
            <section className="stat-grid">{metrics.map((metric) => <ReportMetricCard key={metric.id} metric={metric} />)}</section>

            <section className="entity-card-grid stable-card-grid">
              <ReportShortcutCard title="Laporan Arus Kas" description="Pergerakan bersih semua dompet per minggu dan bulan." icon="chart" to={`/reports/cashflow?month=${month}`} tone="green" />
              <ReportShortcutCard title="Laporan Pengeluaran" description="Sebaran pengeluaran per kategori, dompet, dan tren." icon="transactions" to={`/reports/expenses?month=${month}`} tone="orange" />
              <ReportShortcutCard title="Laporan Pemasukan" description="Pantau sumber pemasukan dan pemasukan berulang." icon="analytics" to={`/reports/income?month=${month}`} tone="blue" />
              <ReportShortcutCard title="Laporan Anggaran" description="Pemakaian anggaran, kategori terlampaui, dan sisa batas." icon="budgetReport" to={`/reports/budgets?month=${month}`} tone="purple" />
              <ReportShortcutCard title="Laporan Utang" description="Utang, piutang, risiko jatuh tempo, dan penagihan." icon="debt" to={`/reports/debts?month=${month}`} tone="red" />
              <ReportShortcutCard title="Laporan Target Tabungan" description="Progres, setoran, anggota, dan target yang berisiko." icon="goal" to={`/reports/goals?month=${month}`} tone="green" />
            </section>

            <section className="dashboard-grid two-col">
              <Card className="panel-card">
                <div className="panel-head"><div><h3>Pantauan Pengeluaran</h3><p>Kategori dengan perubahan tertinggi bulan ini.</p></div><Button to={`/reports/expenses?month=${month}`} size="small">Buka Laporan Pengeluaran</Button></div>
                <DataTable<ReportRow>
                  data={rows.slice(0, 3)}
                  getRowKey={(row) => row.id}
                  columns={[
                    { key: 'name', header: 'Kategori', render: (row) => <div className="table-title"><span className={`mini-icon ${row.status === 'critical' ? 'danger' : row.status === 'watch' ? 'warning' : 'safe'}`}><AppIcon name="shopping" /></span><strong>{row.name}</strong><small>{row.wallet}</small></div> },
                    { key: 'amount', header: 'Jumlah (Rp)', align: 'right', render: (row) => <Amount value={row.amount_minor} type="expense" /> },
                    { key: 'change', header: 'Perubahan', render: (row) => <Badge tone={statusTone(row.status)}>{row.change_percent}%</Badge> },
                  ]}
                />
              </Card>

              <Card className="panel-card">
                <div className="panel-head"><div><h3>Pemberitahuan Operasional</h3><p>Pemberitahuan terbaru dari anggaran, transaksi berulang, ekspor, dan utang.</p></div><Button to="/alerts" size="small">Buka Pemberitahuan</Button></div>
                {recentAlerts.length === 0 ? (
                  <EmptyState icon={<AppIcon name="warning" />} title="Belum ada pemberitahuan" description="Pemberitahuan operasional akan muncul di sini." />
                ) : (
                  <div className="metric-list">
                    {recentAlerts.map((alert) => (
                      <div key={alert.id}><span>{alert.module}</span><strong>{alert.title}</strong></div>
                    ))}
                  </div>
                )}
              </Card>
            </section>

            <Card className="panel-card">
              <div className="panel-head"><div><h3>Ekspor Terbaru</h3><p>Ekspor yang bisa langsung dibuka atau diunduh dari Pusat Ekspor.</p></div><Button to="/exports" size="small">Pusat Ekspor</Button></div>
              {recentExports.length === 0 ? (
                <EmptyState icon={<AppIcon name="download" />} title="Belum ada ekspor" description="Ekspor yang kamu buat akan muncul di sini." />
              ) : (
                <div className="metric-list">
                  {recentExports.map((job) => (
                    <div key={job.id}><span>{job.format.toUpperCase()} · {relativeTime(job.created_at)}</span><strong>{job.row_count} baris · {job.status === 'completed' ? 'Selesai' : 'Gagal'}</strong></div>
                  ))}
                </div>
              )}
            </Card>
            <PageMetaStrip
              title="Status laporan"
              items={[
                { label: 'Periode', value: monthLabel, icon: 'calendar' },
                { label: 'Baris pantauan', value: rows.length, icon: 'list' },
                { label: 'Status sinkronisasi', value: 'Tersinkron', icon: 'success' },
              ]}
              actions={[
                { label: 'Pusat Ekspor', to: '/exports', icon: 'export' },
                { label: 'Ekspor Ringkasan', onClick: handleExport, icon: 'download', variant: 'primary' },
              ]}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}
