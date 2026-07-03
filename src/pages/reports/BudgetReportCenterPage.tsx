import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { PageMetaStrip } from '../../components/layout/PageMetaStrip';
import { useToast } from '../../components/ui/Toast';
import { useBudgetReport } from '../../hooks/useBudgets';
import { useReportMonth } from '../../hooks/useReportMonth';
import { MonthPicker } from '../../components/reports/MonthPicker';
import { ReportBarChart, ReportMetricCard, statusLabel, statusTone } from '../../components/reports/ReportCards';
import { exportReportCsv, formatMonthLabel } from '../../lib/reporting';
import { shortRef } from '../../lib/auditLabels';
import { NAV } from '../../lib/copy';
import type { ReportRow, ReportMetric } from '../../types/reporting';

export function BudgetReportCenterPage() {
  const [month, setMonth] = useReportMonth();
  const { data, isLoading, isError } = useBudgetReport(month);
  const { showToast } = useToast();
  const monthLabel = formatMonthLabel(month);

  const rows: ReportRow[] = data?.report.map(item => ({
    id: item.id,
    name: item.category_id,
    category: 'Anggaran',
    amount_minor: item.spent_minor,
    previous_amount_minor: item.limit_minor,
    change_percent: item.usage_percent,
    wallet: 'Semua',
    status: item.usage_percent > 100 ? 'critical' : item.usage_percent > 80 ? 'watch' : 'healthy'
  })) ?? [];

  const metrics: ReportMetric[] = data?.summary ? [
    { id: 'limit', label: 'Total Batas', value_minor: data.summary.total_limit_minor, helper: 'Total batas anggaran', tone: 'blue' },
    { id: 'spent', label: 'Total Terpakai', value_minor: data.summary.total_spent_minor, helper: 'Total pemakaian', tone: 'orange' },
    { id: 'remaining', label: 'Sisa', value_minor: data.summary.total_remaining_minor, helper: 'Total sisa anggaran', tone: 'green' },
  ] : [];

  const handleExport = () => {
    if (rows.length === 0 && metrics.length === 0) {
      showToast('Tidak ada data anggaran untuk diekspor pada periode ini.');
      return;
    }
    exportReportCsv('Laporan Anggaran', month, { metrics, rows });
    showToast('Laporan anggaran berhasil diekspor sebagai CSV.');
  };

  return (
    <AppLayout title={NAV.laporanAnggaran} description="Pemakaian anggaran, sisa batas, dan kategori yang terlampaui.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>● Anggaran · {monthLabel}</Badge>
            <h2>Lihat kategori anggaran mana yang aman, hampir habis, atau terlampaui.</h2>
            <p>Pemakaian setiap anggaran dihitung langsung dari transaksi pengeluaran kamu.</p>
          </div>
          <div className="app-hero-actions"><Button to="/reports">Kembali ke Laporan</Button><Button onClick={handleExport} variant="primary" disabled={isLoading}><AppIcon name="export" /> Ekspor</Button></div>
        </section>

        <section className="report-filter-bar">
          <MonthPicker value={month} onChange={setMonth} />
          <Card className="filter-card"><span>Dompet</span><strong>Semua dompet</strong></Card>
          <Card className="filter-card"><span>Kategori</span><strong>Kategori anggaran</strong></Card>
          <Card className="filter-card"><span>Baris</span><strong>{rows.length} baris</strong></Card>
        </section>

        {isLoading ? (
          <Card className="panel-card"><div className="empty-state"><p>Memuat laporan...</p></div></Card>
        ) : isError ? (
          <Card className="panel-card"><div className="empty-state"><p>Gagal memuat laporan.</p></div></Card>
        ) : rows.length === 0 && metrics.length === 0 ? (
          <Card className="panel-card"><div className="empty-state"><p>Tidak ada data anggaran untuk {monthLabel}.</p></div></Card>
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
                  <div className="metric-cell"><span>Tertinggi</span><strong>{rows[0] ? `Kategori ${shortRef(rows[0].name)}` : '-'}</strong><small><Amount value={rows[0]?.amount_minor ?? 0} /></small></div>
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
                  { key: 'name', header: 'Nama', render: (row) => <div className="table-title"><span className={`mini-icon ${row.status === 'critical' ? 'danger' : row.status === 'watch' ? 'warning' : row.status === 'growth' ? 'info' : 'safe'}`}><AppIcon name="budgetReport" /></span><strong>Kategori {shortRef(row.name)}</strong><small>{row.category}</small></div> },
                  { key: 'wallet', header: 'Dompet', render: (row) => row.wallet },
                  { key: 'amount', header: 'Terpakai (Rp)', align: 'right', render: (row) => <Amount value={row.amount_minor} type="expense" /> },
                  { key: 'previous', header: 'Batas (Rp)', align: 'right', render: (row) => <Amount value={row.previous_amount_minor} /> },
                  { key: 'change', header: 'Pemakaian', render: (row) => <Badge tone={statusTone(row.status)}>{row.change_percent}%</Badge> },
                  { key: 'status', header: 'Status', render: (row) => <Badge tone={statusTone(row.status)}>{statusLabel(row.status)}</Badge> },
                ]}
              />
            </Card>
            <PageMetaStrip
              title="Status laporan anggaran"
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
