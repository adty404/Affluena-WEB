import { AppLayout } from '../../layouts/AppLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AppIcon, type AppIconName } from '../../components/ui/AppIcon';
import { NAV } from '../../lib/copy';

type MenuItem = readonly [string, string, AppIconName];

const menuGroups: { title: string; items: MenuItem[] }[] = [
  { title: NAV.beranda, items: [ ['/dashboard', NAV.beranda, 'dashboard'], ['/dashboard/analytics', NAV.analitik, 'analytics'], ['/dashboard/forecast', NAV.prakiraan, 'forecast'], ['/dashboard/widget-states', 'Tampilan Widget', 'widgets'] ] },
  { title: 'Data Utama', items: [ ['/wallets', NAV.dompet, 'wallet'], ['/sharing', NAV.berbagiDompet, 'profile'], ['/categories', NAV.kategori, 'categories'], ['/tags', NAV.tag, 'tags'] ] },
  { title: NAV.transaksi, items: [ ['/transactions', NAV.transaksi, 'transactions'], ['/transactions/new', 'Tambah Transaksi', 'add'], ['/transactions/split', NAV.bagiTagihan, 'split'], ['/quick-entry', NAV.catatCepat, 'quick'] ] },
  { title: NAV.anggaran, items: [ ['/budgets', NAV.anggaran, 'budget'], ['/budgets/new', 'Buat Anggaran', 'budgetForm'], ['/budgets/alerts', NAV.notifikasiAnggaran, 'budgetAlert'], ['/budgets/report', NAV.laporanAnggaran, 'budgetReport'] ] },
  { title: 'Utang & Pemantau', items: [ ['/tracker', NAV.pemantauUtang, 'tracker'], ['/debts', 'Daftar Utang', 'debt'], ['/debts/new/payable', 'Tambah Utang', 'payable'], ['/debts/new/receivable', 'Tambah Piutang', 'receivable'], ['/installments', NAV.cicilan, 'installment'], ['/subscriptions', NAV.langganan, 'subscription'] ] },
  { title: NAV.berulang, items: [ ['/recurring', 'Aturan Berulang', 'recurring'], ['/recurring/new', 'Tambah Aturan Berulang', 'add'], ['/recurring/rec-salary/run', 'Jalankan Manual', 'run'], ['/recurring/rec-salary/history', 'Riwayat Eksekusi', 'history'] ] },
  { title: NAV.targetTabungan, items: [ ['/goals', NAV.targetTabungan, 'goal'], ['/goals/new', 'Tambah Target', 'add'], ['/goals/goal-emergency-fund/contribute', 'Setor ke Target', 'pay'], ['/goals/goal-vacation/members', 'Anggota Target', 'profile'] ] },
  { title: 'Laporan & Audit', items: [ ['/insights', NAV.wawasan, 'analytics'], ['/calendar', NAV.kalender, 'calendar'], ['/reports', 'Ringkasan Laporan', 'chart'], ['/reports/cashflow', 'Laporan Arus Kas', 'analytics'], ['/reports/expenses', 'Laporan Pengeluaran', 'transactions'], ['/reports/income', 'Laporan Pemasukan', 'forecast'], ['/exports', NAV.pusatEkspor, 'export'], ['/exports/new', 'Buat Ekspor', 'download'], ['/activities', NAV.riwayatAktivitas, 'history'], ['/alerts', 'Pusat Pemberitahuan', 'warning'], ['/system-logs', NAV.logSistem, 'list'] ] },
  { title: NAV.pengaturan, items: [ ['/settings', 'Pusat Pengaturan', 'settings'], ['/settings/profile', NAV.profil, 'profile'], ['/settings/account', NAV.akun, 'settings'], ['/settings/security', NAV.keamanan, 'warning'], ['/settings/sessions', NAV.sesi, 'history'], ['/settings/notifications', NAV.pemberitahuan, 'budgetAlert'], ['/settings/preferences', NAV.preferensi, 'calendar'], ['/settings/privacy', NAV.privasi, 'health'], ['/settings/data', 'Data', 'download'], ['/settings/help', 'Bantuan & FAQ', 'list'], ['/settings/about', NAV.tentang, 'success'], ['/settings/ui-audit', 'Audit UI', 'widgets'] ] },
];

export function AppMenuPage() {
  return (
    <AppLayout title={NAV.aksesLengkap} description="Akses cepat ke semua halaman dan alur utama Affluena.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>{NAV.aksesLengkap}</Badge>
            <h2>Semua akses utama tersedia dari satu halaman.</h2>
            <p>Buka halaman mana pun di Affluena langsung dari menu ini.</p>
          </div>
          <div className="app-hero-actions"><Button to="/dashboard">Kembali ke {NAV.beranda}</Button><Button to="/transactions/new" variant="primary"><AppIcon name="add" /> {NAV.catatCepat}</Button></div>
        </section>

        <section className="menu-grid">
          {menuGroups.map((group) => (
            <Card className="panel-card" key={group.title}>
              <div className="panel-head"><div><h3>{group.title}</h3><p>Pintasan halaman {group.title.toLowerCase()}.</p></div></div>
              <div className="quick-action-grid">
                {group.items.map(([to, label, icon]) => (
                  <Button key={to} to={to}><AppIcon name={icon} /> {label}</Button>
                ))}
              </div>
            </Card>
          ))}
        </section>
      </div>
    </AppLayout>
  );
}
