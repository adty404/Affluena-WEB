import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { BudgetAlertItem } from '../../components/budgets/BudgetAlertItem';
import { useBudgetAlerts } from '../../hooks/useBudgets';
import { NAV } from '../../lib/copy';

export function BudgetAlertsPage() {
  const { showToast } = useToast();
  const { data, isLoading } = useBudgetAlerts();
  
  const alerts = data?.alerts ?? [];
  const unread = alerts.filter((alert) => !alert.notified_at).length;
  const warning = alerts.filter((alert) => alert.severity === 'warning').length;
  const danger = alerts.filter((alert) => alert.severity === 'danger').length;

  return (
    <AppLayout title={NAV.notifikasiAnggaran} description="Pemberitahuan saat anggaran mendekati atau melewati batas.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">Anggaran</span>
            <h2>Tahu lebih awal saat anggaranmu mulai menipis.</h2>
            <p>Kamu mendapat pemberitahuan saat pengeluaran mendekati batas dan saat batas terlampaui, jadi bisa langsung ambil tindakan.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/budgets" variant="primary"><AppIcon name="budget" /> Anggaran</Button>
            <Button to="/budgets/report"><AppIcon name="budgetReport" /> Laporan</Button>
            <Button onClick={() => showToast('Semua notifikasi anggaran ditandai dibaca.')}><AppIcon name="success" /> Tandai Dibaca</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Belum Dibaca</span><strong>{unread}</strong><small>Perlu perhatian</small></Card>
          <Card className="stat-card"><span>Peringatan</span><strong>{warning}</strong><small>Mendekati batas</small></Card>
          <Card className="stat-card"><span>Terlampaui</span><strong>{danger}</strong><small>Melewati batas</small></Card>
          <Card className="stat-card"><span>Pengiriman</span><strong>Sekali</strong><small>Tanpa notifikasi berulang</small></Card>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Notifikasi Aktif</h3><p>Notifikasi yang perlu ditindaklanjuti.</p></div><Button size="small" onClick={() => showToast('Filter: belum dibaca, peringatan, terlampaui.')}><AppIcon name="filter" /> Filter</Button></div>
            <div className="budget-alert-list large">
              {isLoading ? (
                <p>Memuat notifikasi...</p>
              ) : alerts.length > 0 ? (
                alerts.map((alert) => <BudgetAlertItem key={alert.id} alert={alert} />)
              ) : (
                <p>Tidak ada notifikasi aktif.</p>
              )}
            </div>
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Kapan Notifikasi Dikirim</h3><p>Dua tingkat pemberitahuan untuk tiap anggaran.</p></div></div>
            <div className="readiness-list">
              <div><span>Peringatan</span><Badge tone="orange">penggunaan ≥ 80%</Badge></div>
              <div><span>Terlampaui</span><Badge tone="red">penggunaan ≥ 100%</Badge></div>
              <div><span>Sumber</span><Badge tone="blue">transaksi pengeluaran</Badge></div>
              <div><span>Cakupan</span><Badge tone="purple">per kategori per bulan</Badge></div>
            </div>
          </Card>
        </section>

        {alerts.length === 0 && !isLoading && (
          <EmptyState
            title="Semua Anggaran Terkendali"
            description="Belum ada anggaran yang mendekati batas. Terus pertahankan!"
            action={<Button to="/budgets" variant="primary"><AppIcon name="budget" /> Kembali ke Anggaran</Button>}
          />
        )}
      </div>
    </AppLayout>
  );
}
