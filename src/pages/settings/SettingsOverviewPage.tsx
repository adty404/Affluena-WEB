import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingsCard, SettingsHero, SettingMetric } from './SettingsShared';

const settingsLinks = [
  { to: '/settings/profile', icon: 'profile' as const, title: 'Profile', description: 'Name, email, handle, and display identity.' },
  { to: '/settings/account', icon: 'settings' as const, title: 'Account', description: 'Account status, plan, and connected identity.' },
  { to: '/settings/security', icon: 'warning' as const, title: 'Security', description: 'Password, 2FA, and login protection.' },
  { to: '/settings/sessions', icon: 'history' as const, title: 'Sessions', description: 'Active devices and login history.' },
  { to: '/settings/notifications', icon: 'budgetAlert' as const, title: 'Notifications', description: 'Budget, due date, recurring, and security alerts.' },
  { to: '/settings/preferences', icon: 'calendar' as const, title: 'Preferences', description: 'Currency, date format, language, and appearance.' },
  { to: '/settings/privacy', icon: 'health' as const, title: 'Privacy', description: 'Data visibility, privacy controls, and audit access.' },
  { to: '/settings/data', icon: 'download' as const, title: 'Data', description: 'Export personal data and account deletion.' },
  { to: '/settings/help', icon: 'list' as const, title: 'Help', description: 'FAQ and support guidance.' },
  { to: '/settings/about', icon: 'success' as const, title: 'About', description: 'Version, modules, and app information.' },
  { to: '/settings/ui-audit', icon: 'widgets' as const, title: 'UI Audit', description: 'Final responsive, action, and accessibility checklist.' },
];

export function SettingsOverviewPage() {
  return (
    <AppLayout title="Settings" description="Account, security, notification, privacy, and final app preferences.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Settings" title="Settings center untuk finalisasi pengalaman Affluena." description="Kelola profil, keamanan, sesi aktif, preferensi notifikasi, data privacy, bantuan, dan audit UI dari satu tempat.">
          <Button to="/settings/security"><AppIcon name="warning" /> Security</Button>
          <Button to="/settings/profile" variant="primary"><AppIcon name="profile" /> Edit Profile</Button>
        </SettingsHero>

        <section className="settings-metric-grid">
          <SettingMetric label="Profile completion" value="100%" />
          <SettingMetric label="Security posture" value="Strong" tone="blue" />
          <SettingMetric label="Active sessions" value="3" tone="purple" />
          <SettingMetric label="Alerts enabled" value="4/5" tone="orange" />
        </section>

        <section className="settings-card-grid">
          {settingsLinks.map((item) => (
            <SettingsCard key={item.to} icon={item.icon} title={item.title} description={item.description}>
              <div className="settings-card-actions">
                <Badge tone="gray">Configured</Badge>
                <Button to={item.to} size="small"><AppIcon name="edit" /> Open</Button>
              </div>
            </SettingsCard>
          ))}
        </section>
      </div>
    </AppLayout>
  );
}
