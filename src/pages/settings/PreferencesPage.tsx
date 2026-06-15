import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingsCard, SettingsHero } from './SettingsShared';

export function PreferencesPage() {
  const { showToast } = useToast();

  return (
    <AppLayout title="App Preferences" description="Currency, locale, language, date format, dan tampilan aplikasi.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Preferences" title="Preferensi dibuat jelas untuk finance app Indonesia-first." description="Atur currency minor unit, format tanggal, bahasa, timezone, dan kenyamanan tampilan tanpa mengubah brand green Affluena.">
          <Button to="/settings"><AppIcon name="back" /> Settings</Button>
          <Button variant="primary" onClick={() => showToast('Preferences saved.')}><AppIcon name="save" /> Save Preferences</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="settings" title="Localization" description="Format angka, tanggal, dan wilayah.">
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Localization preferences saved.'); }}>
              <div className="form-two">
                <label><span>Currency</span><Select defaultValue="IDR"><option>IDR</option><option>USD</option><option>SGD</option></Select></label>
                <label><span>Currency display</span><Select defaultValue="symbol"><option value="symbol">Rp 12.500.000</option><option value="code">IDR 12.500.000</option></Select></label>
              </div>
              <div className="form-two">
                <label><span>Date format</span><Select defaultValue="dd-mmm-yyyy"><option value="dd-mmm-yyyy">14 Jun 2026</option><option value="yyyy-mm-dd">2026-06-14</option></Select></label>
                <label><span>Timezone</span><Select defaultValue="Asia/Jakarta"><option>Asia/Jakarta</option><option>Asia/Singapore</option><option>UTC</option></Select></label>
              </div>
              <div className="form-two">
                <label><span>Language</span><Select defaultValue="id"><option value="id">Bahasa Indonesia</option><option value="en">English</option></Select></label>
                <label><span>First day of week</span><Select defaultValue="monday"><option value="monday">Monday</option><option value="sunday">Sunday</option></Select></label>
              </div>
              <Button type="submit" variant="primary"><AppIcon name="save" /> Save Localization</Button>
            </form>
          </SettingsCard>

          <SettingsCard icon="widgets" title="Appearance & Input Defaults" description="UX form dan tampilan card tetap konsisten.">
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Appearance preferences saved.'); }}>
              <label><span>Density</span><Select defaultValue="comfortable"><option value="comfortable">Comfortable</option><option value="compact">Compact</option></Select></label>
              <label><span>Default transaction type</span><Select defaultValue="expense"><option value="expense">Expense</option><option value="income">Income</option><option value="transfer">Transfer</option></Select></label>
              <label><span>Default amount helper</span><Input defaultValue="Use minor unit formatting and clear thousands separator" /></label>
              <label><span>Start page after login</span><Select defaultValue="dashboard"><option value="dashboard">Dashboard</option><option value="transactions">Transactions</option><option value="budgets">Budgets</option></Select></label>
              <Button type="submit" variant="primary"><AppIcon name="save" /> Save Appearance</Button>
            </form>
          </SettingsCard>
        </section>
      </div>
    </AppLayout>
  );
}
