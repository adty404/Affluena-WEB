import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingsCard, SettingsHero } from './SettingsShared';

const PREFS_STORAGE_KEY = 'affluena.app-preferences';

type AppPreferences = {
  currency: string;
  currencyDisplay: string;
  dateFormat: string;
  timezone: string;
  language: string;
  firstDayOfWeek: string;
  density: string;
  defaultTxType: string;
  amountHelper: string;
  startPage: string;
};

const DEFAULT_PREFS: AppPreferences = {
  currency: 'IDR',
  currencyDisplay: 'symbol',
  dateFormat: 'dd-mmm-yyyy',
  timezone: 'Asia/Jakarta',
  language: 'id',
  firstDayOfWeek: 'monday',
  density: 'comfortable',
  defaultTxType: 'expense',
  amountHelper: 'Use minor unit formatting and clear thousands separator',
  startPage: 'dashboard',
};

function loadPrefs(): AppPreferences {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<AppPreferences>) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function PreferencesPage() {
  const { showToast } = useToast();
  const [prefs, setPrefs] = useState<AppPreferences>(loadPrefs);

  const update = (key: keyof AppPreferences, value: string) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const persist = (message: string) => {
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
      showToast(message);
    } catch {
      showToast('Gagal menyimpan preferences.');
    }
  };

  return (
    <AppLayout title="App Preferences" description="Currency, locale, language, date format, dan tampilan aplikasi.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Preferences" title="Preferensi dibuat jelas untuk finance app Indonesia-first." description="Atur currency minor unit, format tanggal, bahasa, timezone, dan kenyamanan tampilan tanpa mengubah brand green Affluena.">
          <Button to="/settings"><AppIcon name="back" /> Settings</Button>
          <Button variant="primary" onClick={() => persist('Preferences saved.')}><AppIcon name="save" /> Save Preferences</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="settings" title="Localization" description="Format angka, tanggal, dan wilayah. Tersimpan di perangkat ini.">
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); persist('Localization preferences saved.'); }}>
              <div className="form-two">
                <label><span>Currency</span><Select value={prefs.currency} onChange={(e) => update('currency', e.target.value)}><option value="IDR">IDR</option><option value="USD">USD</option><option value="SGD">SGD</option></Select></label>
                <label><span>Currency display</span><Select value={prefs.currencyDisplay} onChange={(e) => update('currencyDisplay', e.target.value)}><option value="symbol">Rp 12.500.000</option><option value="code">IDR 12.500.000</option></Select></label>
              </div>
              <div className="form-two">
                <label><span>Date format</span><Select value={prefs.dateFormat} onChange={(e) => update('dateFormat', e.target.value)}><option value="dd-mmm-yyyy">14 Jun 2026</option><option value="yyyy-mm-dd">2026-06-14</option></Select></label>
                <label><span>Timezone</span><Select value={prefs.timezone} onChange={(e) => update('timezone', e.target.value)}><option value="Asia/Jakarta">Asia/Jakarta</option><option value="Asia/Singapore">Asia/Singapore</option><option value="UTC">UTC</option></Select></label>
              </div>
              <div className="form-two">
                <label><span>Language</span><Select value={prefs.language} onChange={(e) => update('language', e.target.value)}><option value="id">Bahasa Indonesia</option><option value="en">English</option></Select></label>
                <label><span>First day of week</span><Select value={prefs.firstDayOfWeek} onChange={(e) => update('firstDayOfWeek', e.target.value)}><option value="monday">Monday</option><option value="sunday">Sunday</option></Select></label>
              </div>
              <Button type="submit" variant="primary"><AppIcon name="save" /> Save Localization</Button>
            </form>
          </SettingsCard>

          <SettingsCard icon="widgets" title="Appearance & Input Defaults" description="UX form dan tampilan card tetap konsisten.">
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); persist('Appearance preferences saved.'); }}>
              <label><span>Density</span><Select value={prefs.density} onChange={(e) => update('density', e.target.value)}><option value="comfortable">Comfortable</option><option value="compact">Compact</option></Select></label>
              <label><span>Default transaction type</span><Select value={prefs.defaultTxType} onChange={(e) => update('defaultTxType', e.target.value)}><option value="expense">Expense</option><option value="income">Income</option><option value="transfer">Transfer</option></Select></label>
              <label><span>Default amount helper</span><Input value={prefs.amountHelper} onChange={(e) => update('amountHelper', e.target.value)} /></label>
              <label><span>Start page after login</span><Select value={prefs.startPage} onChange={(e) => update('startPage', e.target.value)}><option value="dashboard">Dashboard</option><option value="transactions">Transactions</option><option value="budgets">Budgets</option></Select></label>
              <Button type="submit" variant="primary"><AppIcon name="save" /> Save Appearance</Button>
            </form>
          </SettingsCard>
        </section>
      </div>
    </AppLayout>
  );
}
