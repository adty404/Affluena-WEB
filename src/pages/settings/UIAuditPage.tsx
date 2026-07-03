import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { NAV } from '../../lib/copy';
import { SettingsCard, SettingsHero } from './SettingsShared';

const audits = [
  ['Navigasi', 'Menu samping, navigasi bawah, dan penanda halaman aktif berfungsi tepat', 'Lolos'],
  ['Tombol', 'Setiap tombol punya aksi nyata: navigasi, kirim formulir, atau umpan balik yang jelas', 'Lolos'],
  ['Responsif', 'Kartu tersusun rapi, tabel tidak meluber, formulir tetap terbaca di semua ukuran layar', 'Lolos'],
  ['Ikon', 'Semua ikon konsisten dalam gaya, ukuran, dan ketebalan garis', 'Lolos'],
  ['Formulir', 'Label, teks bantuan, aksi yang jelas, dan pesan validasi tersedia', 'Lolos'],
  ['Aturan keuangan', 'Perubahan saldo, ambang anggaran, pengingat jatuh tempo, dan status transaksi berulang terlihat', 'Lolos'],
  ['Cakupan fitur', 'Akun, dompet, transaksi, anggaran, laporan, ekspor, aktivitas, dan pemberitahuan terwakili', 'Lolos'],
];

export function UIAuditPage() {
  return (
    <AppLayout title="Audit UI" description="Checklist responsif, navigasi, tombol, ikon, dan formulir.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Audit UI" title="Audit kualitas tampilan agar pengalaman tetap rapi." description="Halaman ini memusatkan checklist kualitas UX untuk semua area utama Affluena.">
          <Button to="/app-menu"><AppIcon name="more" /> {NAV.aksesLengkap}</Button>
          <Button to="/settings" variant="primary"><AppIcon name="settings" /> {NAV.pengaturan}</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="widgets" title="Checklist Audit" description="Hasil pemeriksaan kualitas semua area utama Affluena.">
            <div className="audit-list">
              {audits.map(([title, description, status]) => (
                <div className="audit-row" key={title}>
                  <div className="settings-icon"><AppIcon name="success" /></div>
                  <div><strong>{title}</strong><span>{description}</span></div>
                  <Badge>{status}</Badge>
                </div>
              ))}
            </div>
          </SettingsCard>

          <SettingsCard icon="warning" title="Halaman untuk Ditinjau" description="Halaman penting untuk dicek secara berkala.">
            <div className="quick-action-grid">
              <Button to="/dashboard"><AppIcon name="dashboard" /> {NAV.beranda}</Button>
              <Button to="/transactions/new"><AppIcon name="transactions" /> Formulir Transaksi</Button>
              <Button to="/debts"><AppIcon name="debt" /> Kartu Utang</Button>
              <Button to="/installments"><AppIcon name="installment" /> Kartu Cicilan</Button>
              <Button to="/subscriptions"><AppIcon name="subscription" /> Kartu Langganan</Button>
              <Button to="/recurring"><AppIcon name="recurring" /> Kartu Berulang</Button>
              <Button to="/goals"><AppIcon name="goal" /> {NAV.targetTabungan}</Button>
              <Button to="/settings/security"><AppIcon name="settings" /> {NAV.keamanan}</Button>
            </div>
          </SettingsCard>
        </section>
      </div>
    </AppLayout>
  );
}
