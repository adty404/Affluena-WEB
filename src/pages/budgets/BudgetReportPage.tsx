import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { BudgetInsightCard } from '../../components/budgets/BudgetInsightCard';
import type { BudgetReportItem } from '../../types/budget';
import { useCategories } from '../../hooks/useCategories';
import { useBudgetReport } from '../../hooks/useBudgets';
import { NAV } from '../../lib/copy';

const statusTone = {
  safe: 'green',
  warning: 'orange',
  exceeded: 'red',
} as const;

const statusLabel = {
  safe: 'Aman',
  warning: 'Peringatan',
  exceeded: 'Terlampaui',
} as const;

export function BudgetReportPage() {
  const { showToast } = useToast();
  const [exportOpen, setExportOpen] = useState(false);
  const { data: categoriesData } = useCategories({ type: 'expense' });
  const { data, isLoading } = useBudgetReport();

  const report = data?.report ?? [];
  const summary = data?.summary ?? {
    total_limit_minor: 0,
    total_spent_minor: 0,
    total_remaining_minor: 0,
    safe_count: 0,
    warning_count: 0,
    exceeded_count: 0,
    daily_allowance_minor: 0,
    forecast_minor: 0,
  };

  return (
    <AppLayout title={NAV.laporanAnggaran} description="Perbandingan anggaran dan pengeluaran aktual per kategori.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Laporan Anggaran</span>
            <h2>Bandingkan anggaran dan pengeluaran aktual untuk ambil keputusan.</h2>
            <p>Laporan ini memperlihatkan kategori mana yang aman, mendekati batas, atau melebihi anggaran.</p>
          </div>
          <div className="app-hero-actions">
            <Button variant="primary" onClick={() => setExportOpen(true)}><AppIcon name="export" /> Ekspor CSV</Button>
            <Button to="/budgets/alerts"><AppIcon name="budgetAlert" /> Notifikasi</Button>
            <Button to="/budgets"><AppIcon name="budget" /> Anggaran</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Total Anggaran</span><strong><Amount value={summary.total_limit_minor} /></strong><small>Bulan ini</small></Card>
          <Card className="stat-card"><span>Total Aktual</span><strong><Amount value={summary.total_spent_minor} type="expense" /></strong><small>{summary.total_limit_minor > 0 ? Math.round((summary.total_spent_minor / summary.total_limit_minor) * 100) : 0}% terpakai</small></Card>
          <Card className="stat-card"><span>Sisa</span><strong><Amount value={summary.total_remaining_minor} type="income" /></strong><small>Tersedia</small></Card>
          <Card className="stat-card"><span>Prakiraan</span><strong><Amount value={summary.forecast_minor} /></strong><small>Potensi kelebihan belanja</small></Card>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Grafik Anggaran vs Aktual</h3><p>Perbandingan visual untuk tiap kategori.</p></div><Badge tone="blue">Bulan Ini</Badge></div>
            <div className="budget-bars" aria-label="Grafik anggaran versus aktual">
              {isLoading ? (
                <p>Memuat grafik...</p>
              ) : report.length > 0 ? (
                report.map((item) => {
                  const actualPercent = Math.min(120, item.usage_percent);
                  const category = (categoriesData?.categories ?? []).find(c => c.id === item.category_id);
                  const categoryName = category?.name ?? 'Kategori tidak dikenal';
                  const status = item.usage_percent >= 100 ? 'exceeded' : item.usage_percent >= 80 ? 'warning' : 'safe';
                  return (
                    <div className="budget-bar-row" key={item.id}>
                      <span>{categoryName}</span>
                      <div className="budget-bar-track"><i className="limit" style={{ width: '100%' }} /><i className={`actual ${status}`} style={{ width: `${Math.min(100, actualPercent)}%` }} /></div>
                      <strong>{actualPercent}%</strong>
                    </div>
                  );
                })
              ) : (
                <p>Belum ada data anggaran.</p>
              )}
            </div>
          </Card>

          <div className="grid-stack">
            <BudgetInsightCard icon="warning" title="Belanja perlu perhatian" tone="red">Kategori belanja sudah melebihi anggaran, tahan dulu pengeluaran yang tidak penting.</BudgetInsightCard>
            <BudgetInsightCard icon="transport" title="Transportasi mendekati batas" tone="orange">Transportasi mendekati batas; atur jatah harian sampai akhir bulan.</BudgetInsightCard>
            <BudgetInsightCard icon="health" title="Makanan masih terkendali" tone="green">Makanan masih aman, tapi tetap perlu dipantau.</BudgetInsightCard>
          </div>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Tabel Laporan</h3><p>Anggaran, aktual, sisa, status, dan prakiraan.</p></div><Button size="small" onClick={() => setExportOpen(true)}><AppIcon name="export" /> Ekspor</Button></div>
          <DataTable<BudgetReportItem>
            data={report}
            getRowKey={(item) => item.id}
            columns={[
              { 
                key: 'category',
                header: 'Kategori',
                render: (item) => {
                  const category = (categoriesData?.categories ?? []).find(c => c.id === item.category_id);
                  const categoryName = category?.name ?? 'Kategori tidak dikenal';
                  const categoryIcon = 'categories';
                  const status = item.usage_percent >= 100 ? 'exceeded' : item.usage_percent >= 80 ? 'warning' : 'safe';
                  return (
                    <div className="table-title">
                      <span className={`mini-icon ${status}`}><AppIcon name={categoryIcon} /></span>
                      <strong>{categoryName}</strong>
                      <small>{item.recommendation}</small>
                    </div>
                  );
                } 
              },
              { key: 'budget', header: 'Anggaran', align: 'right', render: (item) => <Amount value={item.limit_minor} /> },
              { key: 'actual', header: 'Aktual', align: 'right', render: (item) => <Amount value={item.spent_minor} type="expense" /> },
              { key: 'remaining', header: 'Sisa', align: 'right', render: (item) => <Amount value={Math.abs(item.variance_minor)} type={item.variance_minor < 0 ? 'expense' : 'income'} /> },
              { key: 'daily_allowance', header: 'Jatah Harian', align: 'right', render: (item) => <Amount value={item.daily_allowance_minor} /> },
              {
                key: 'status',
                header: 'Status',
                render: (item) => {
                  const status = item.usage_percent >= 100 ? 'exceeded' : item.usage_percent >= 80 ? 'warning' : 'safe';
                  return <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>;
                }
              },
            ]}
          />
        </Card>
      </div>

      <Modal open={exportOpen} title="Ekspor Laporan Anggaran" description="Pilih format dan cakupan data sebelum laporan diekspor." onClose={() => setExportOpen(false)}>
        <div className="quick-action-grid two-col">
          <Button onClick={() => showToast('Ekspor CSV disiapkan.') }><AppIcon name="export" /> CSV</Button>
          <Button onClick={() => showToast('Ringkasan PDF disiapkan.') }><AppIcon name="download" /> Ringkasan PDF</Button>
          <Button onClick={() => showToast('Tabel berhasil disalin.') }><AppIcon name="copy" /> Salin Tabel</Button>
          <Button onClick={() => showToast('Tautan berbagi disiapkan.') }><AppIcon name="more" /> Bagikan Tautan</Button>
        </div>
        <div className="modal-actions"><Button onClick={() => setExportOpen(false)}>Tutup</Button><Button variant="primary" onClick={() => { setExportOpen(false); showToast('Ekspor laporan anggaran selesai.'); }}>Ekspor Sekarang</Button></div>
      </Modal>
    </AppLayout>
  );
}
