import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { useSessions } from '../../hooks/useAuthSettings';
import { useNotificationRules } from '../../hooks/useNotifications';
import { NAV } from '../../lib/copy';
import { SettingsCard, SettingsHero, SettingMetric } from './SettingsShared';

const settingsLinks = [
  { to: '/settings/profile', icon: 'profile' as const, title: NAV.profil, description: 'Nama, email, dan identitas tampilan kamu.' },
  { to: '/settings/account', icon: 'settings' as const, title: NAV.akun, description: 'Status akun dan identitas yang terhubung.' },
  { to: '/settings/security', icon: 'warning' as const, title: NAV.keamanan, description: 'Kata sandi, 2FA, dan proteksi masuk.' },
  { to: '/settings/sessions', icon: 'history' as const, title: NAV.sesi, description: 'Perangkat aktif dan riwayat masuk.' },
  { to: '/settings/notifications', icon: 'budgetAlert' as const, title: NAV.pemberitahuan, description: 'Pemberitahuan anggaran, jatuh tempo, transaksi berulang, dan keamanan.' },
  { to: '/settings/preferences', icon: 'calendar' as const, title: NAV.preferensi, description: 'Mata uang, format tanggal, bahasa, dan tampilan.' },
  { to: '/settings/privacy', icon: 'health' as const, title: NAV.privasi, description: 'Visibilitas data, kontrol privasi, dan akses audit.' },
  { to: '/sharing', icon: 'wallet' as const, title: NAV.berbagiDompet, description: 'Undang pemantau untuk melihat semua dompetmu (hanya lihat).' },
  { to: '/settings/data', icon: 'download' as const, title: 'Data', description: 'Ekspor data pribadi dan penghapusan akun.' },
  { to: '/settings/help', icon: 'list' as const, title: NAV.bantuan, description: 'FAQ dan panduan bantuan.' },
  { to: '/settings/about', icon: 'success' as const, title: NAV.tentang, description: 'Versi dan informasi aplikasi.' },
  { to: '/settings/ui-audit', icon: 'widgets' as const, title: 'Audit UI', description: 'Checklist responsif, aksi, dan aksesibilitas.' },
];

export function SettingsOverviewPage() {
  const { data: sessionsData, isLoading: sessionsLoading } = useSessions();
  const { data: rulesData, isLoading: rulesLoading } = useNotificationRules();

  const sessions = sessionsData?.sessions ?? [];
  const activeSessions = sessions.filter((s) => !s.revoked_at).length;
  const rules = rulesData?.rules ?? [];
  const enabledRules = rules.filter((r) => r.enabled).length;

  return (
    <AppLayout title={NAV.pengaturan} description="Akun, keamanan, notifikasi, privasi, dan preferensi aplikasi.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge={NAV.pengaturan} title="Pusat pengaturan untuk pengalaman Affluena kamu." description="Kelola profil, keamanan, sesi aktif, preferensi notifikasi, privasi data, dan bantuan dari satu tempat.">
          <Button to="/settings/security"><AppIcon name="warning" /> {NAV.keamanan}</Button>
          <Button to="/settings/profile" variant="primary"><AppIcon name="profile" /> Edit Profil</Button>
        </SettingsHero>

        <section className="settings-metric-grid">
          <SettingMetric label="Sesi aktif" value={sessionsLoading ? '…' : String(activeSessions)} tone="purple" />
          <SettingMetric label="Total sesi" value={sessionsLoading ? '…' : String(sessions.length)} tone="blue" />
          <SettingMetric label="Sesi dicabut" value={sessionsLoading ? '…' : String(sessions.filter((s) => s.revoked_at).length)} />
          <SettingMetric label="Notifikasi aktif" value={rulesLoading ? '…' : `${enabledRules}/${rules.length}`} tone="orange" />
        </section>

        <section className="settings-card-grid">
          {settingsLinks.map((item) => (
            <SettingsCard key={item.to} icon={item.icon} title={item.title} description={item.description}>
              <div className="settings-card-actions">
                <Badge tone="gray">Terpasang</Badge>
                <Button to={item.to} size="small"><AppIcon name="edit" /> Buka</Button>
              </div>
            </SettingsCard>
          ))}
        </section>
      </div>
    </AppLayout>
  );
}
