import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { NAV } from '../../lib/copy';
import { SettingMetric, SettingsCard, SettingsHero } from './SettingsShared';

const modules = [NAV.beranda, NAV.dompet, NAV.transaksi, NAV.anggaran, NAV.utang, NAV.cicilan, NAV.langganan, NAV.berulang, NAV.targetTabungan, NAV.laporan];

export function AboutPage() {
  return (
    <AppLayout title="Tentang Affluena" description="Informasi aplikasi, versi, dan cakupan fitur.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge={`● ${NAV.tentang}`} title="Affluena, aplikasi keuangan pribadi kamu." description="Pengaturan, keamanan, dan privasi membantu kamu mengelola akun dengan aman.">
          <Button to="/settings/ui-audit"><AppIcon name="widgets" /> Audit UI</Button>
          <Button to="/settings" variant="primary"><AppIcon name="settings" /> {NAV.pengaturan}</Button>
        </SettingsHero>

        <section className="settings-metric-grid">
          <SettingMetric label="Versi aplikasi" value="0.5.0" />
          <SettingMetric label="Fitur utama" value="10" tone="blue" />
          <SettingMetric label="Mata uang" value="Rp (IDR)" tone="purple" />
          <SettingMetric label="Bahasa" value="Indonesia" tone="orange" />
        </section>

        <section className="dashboard-grid">
          <SettingsCard icon="success" title="Fitur yang Bisa Kamu Pakai" description="Semua fitur utama siap dipakai dari satu aplikasi.">
            <div className="module-chip-grid">
              {modules.map((module) => <Badge key={module} tone="blue">{module}</Badge>)}
            </div>
          </SettingsCard>

          <SettingsCard icon="list" title="Cakupan Aplikasi" description="Ringkasan area utama Affluena untuk kamu.">
            <div className="settings-list compact">
              <div><span>Akun</span><strong>Masuk aman dan kelola sesi</strong></div>
              <div><span>Keuangan inti</span><strong>Dompet, kategori, tag, transaksi</strong></div>
              <div><span>Perencanaan</span><strong>Anggaran, utang, target tabungan, transaksi berulang</strong></div>
              <div><span>Riwayat</span><strong>Riwayat aktivitas, pemberitahuan, ekspor</strong></div>
              <div><span>Pengaturan</span><strong>Profil, keamanan, notifikasi, privasi</strong></div>
            </div>
          </SettingsCard>
        </section>
      </div>
    </AppLayout>
  );
}
