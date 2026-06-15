import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingMetric, SettingsCard, SettingsHero } from './SettingsShared';

const modules = ['Foundation', 'Dashboard', 'Master Data', 'Transactions', 'Budget', 'Debt & Tracker', 'Automation', 'Goals', 'Reports & Audit', 'Settings'];

export function AboutPage() {
  return (
    <AppLayout title="About Affluena" description="Informasi aplikasi, versi, dan cakupan modul.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● About" title="Affluena, personal finance web app yang siap dihubungkan ke backend." description="Settings, security, privacy, dan final audit page membantu user mengelola akun dengan aman.">
          <Button to="/settings/ui-audit"><AppIcon name="widgets" /> UI Audit</Button>
          <Button to="/settings" variant="primary"><AppIcon name="settings" /> Settings</Button>
        </SettingsHero>

        <section className="settings-metric-grid">
          <SettingMetric label="Frontend version" value="0.5.0" />
          <SettingMetric label="Modules completed" value="10" tone="blue" />
          <SettingMetric label="Primary stack" value="React + Vite" tone="purple" />
          <SettingMetric label="Styling" value="Vanilla CSS" tone="orange" />
        </section>

        <section className="dashboard-grid">
          <SettingsCard icon="success" title="Implemented Modules" description="Semua tahap utama sudah punya halaman nyata dan route aktif.">
            <div className="module-chip-grid">
              {modules.map((module) => <Badge key={module} tone="blue">{module}</Badge>)}
            </div>
          </SettingsCard>

          <SettingsCard icon="list" title="Backend Alignment" description="Selaras dengan modul di system map Affluena.">
            <div className="settings-list compact">
              <div><span>Auth</span><strong>users, refresh_tokens</strong></div>
              <div><span>Core finance</span><strong>wallets, categories, tags, transactions</strong></div>
              <div><span>Planning</span><strong>budgets, debts, goals, recurring rules</strong></div>
              <div><span>Audit</span><strong>activities, api logs, alerts, export</strong></div>
              <div><span>Settings</span><strong>profile, security, notification, privacy</strong></div>
            </div>
          </SettingsCard>
        </section>
      </div>
    </AppLayout>
  );
}
