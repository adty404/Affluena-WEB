import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { AppIcon } from '../../components/ui/AppIcon';
import { appWidgets } from '../../data/stage1Data';
import { NAV } from '../../lib/copy';

export function AppShellPage() {
  return (
    <AppLayout title="Pusat Kendali" description="Akses cepat ke seluruh fitur Affluena dari satu halaman.">
      <div className="grid stack-lg">
        <section className="app-hero-card">
          <div>
            <Badge>● Pusat Kendali</Badge>
            <h2>Buka alur keuangan yang paling sering kamu pakai dari satu tempat.</h2>
            <p>Semua fitur utama Affluena bisa dijangkau langsung dari halaman ini.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/dashboard" variant="primary"><AppIcon name="dashboard" /> Buka {NAV.beranda}</Button>
            <Button to="/settings/profile"><AppIcon name="settings" /> {NAV.pengaturan}</Button>
          </div>
        </section>

        <section className="stat-grid">
          {appWidgets.map((widget) => (
            <article className={`stat-card ${widget.tone ?? ''}`} key={widget.title}>
              <span>{widget.title}</span>
              <strong>{widget.value}</strong>
              <small>{widget.note}</small>
            </article>
          ))}
        </section>

        <section className="dashboard-shell-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Fitur Utama</h3><p>Semua area keuanganmu siap dipakai kapan saja.</p></div></div>
            <div className="readiness-list">
              <div><span>{NAV.beranda} & {NAV.analitik}</span><Badge>Aktif</Badge></div>
              <div><span>{NAV.dompet}, {NAV.kategori} & {NAV.tag}</span><Badge>Aktif</Badge></div>
              <div><span>{NAV.transaksi}, {NAV.bagiTagihan} & {NAV.catatCepat}</span><Badge>Aktif</Badge></div>
              <div><span>{NAV.anggaran}, {NAV.utang}, {NAV.berulang} & {NAV.targetTabungan}</span><Badge>Aktif</Badge></div>
              <div><span>{NAV.laporan}, {NAV.pemberitahuan} & {NAV.pengaturan}</span><Badge>Aktif</Badge></div>
            </div>
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Akses Cepat</h3><p>Langsung ke alur yang paling sering dipakai.</p></div></div>
            <div className="quick-action-grid two-col">
              <Button to="/transactions/new"><AppIcon name="add" /> Tambah Transaksi</Button>
              <Button to="/wallets/new"><AppIcon name="wallet" /> Tambah Dompet</Button>
              <Button to="/budgets/new"><AppIcon name="budget" /> Buat Anggaran</Button>
              <Button to="/app-menu"><AppIcon name="more" /> {NAV.aksesLengkap}</Button>
              <Button to="/reports"><AppIcon name="chart" /> {NAV.laporan}</Button>
              <Button to="/settings"><AppIcon name="settings" /> {NAV.pengaturan}</Button>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
