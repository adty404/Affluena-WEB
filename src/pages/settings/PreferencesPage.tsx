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
  amountHelper: 'Pakai pemisah ribuan yang jelas, contoh Rp 1.500.000',
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
      showToast('Gagal menyimpan preferensi.');
    }
  };

  return (
    <AppLayout title="Preferensi Aplikasi" description="Mata uang, bahasa, format tanggal, dan tampilan aplikasi.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="Preferensi" title="Preferensi dibuat jelas untuk aplikasi keuangan Indonesia." description="Atur mata uang, format tanggal, bahasa, zona waktu, dan kenyamanan tampilan aplikasi.">
          <Button to="/settings"><AppIcon name="back" /> Pengaturan</Button>
          <Button variant="primary" onClick={() => persist('Preferensi tersimpan.')}><AppIcon name="save" /> Simpan Preferensi</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="settings" title="Lokalisasi" description="Format angka, tanggal, dan wilayah. Tersimpan di perangkat ini.">
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); persist('Preferensi lokalisasi tersimpan.'); }}>
              <div className="form-two">
                <label><span>Mata uang</span><Select value={prefs.currency} onChange={(e) => update('currency', e.target.value)}><option value="IDR">IDR</option><option value="USD">USD</option><option value="SGD">SGD</option></Select></label>
                <label><span>Tampilan mata uang</span><Select value={prefs.currencyDisplay} onChange={(e) => update('currencyDisplay', e.target.value)}><option value="symbol">Rp 12.500.000</option><option value="code">IDR 12.500.000</option></Select></label>
              </div>
              <div className="form-two">
                <label><span>Format tanggal</span><Select value={prefs.dateFormat} onChange={(e) => update('dateFormat', e.target.value)}><option value="dd-mmm-yyyy">14 Jun 2026</option><option value="yyyy-mm-dd">2026-06-14</option></Select></label>
                <label><span>Zona waktu</span><Select value={prefs.timezone} onChange={(e) => update('timezone', e.target.value)}><option value="Asia/Jakarta">Asia/Jakarta</option><option value="Asia/Singapore">Asia/Singapore</option><option value="UTC">UTC</option></Select></label>
              </div>
              <div className="form-two">
                <label><span>Bahasa</span><Select value={prefs.language} onChange={(e) => update('language', e.target.value)}><option value="id">Bahasa Indonesia</option><option value="en">English</option></Select></label>
                <label><span>Hari pertama dalam minggu</span><Select value={prefs.firstDayOfWeek} onChange={(e) => update('firstDayOfWeek', e.target.value)}><option value="monday">Senin</option><option value="sunday">Minggu</option></Select></label>
              </div>
              <Button type="submit" variant="primary"><AppIcon name="save" /> Simpan Lokalisasi</Button>
            </form>
          </SettingsCard>

          <SettingsCard icon="widgets" title="Tampilan & Isian Bawaan" description="Form dan tampilan kartu tetap konsisten.">
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); persist('Preferensi tampilan tersimpan.'); }}>
              <label><span>Kepadatan tampilan</span><Select value={prefs.density} onChange={(e) => update('density', e.target.value)}><option value="comfortable">Nyaman</option><option value="compact">Ringkas</option></Select></label>
              <label><span>Tipe transaksi bawaan</span><Select value={prefs.defaultTxType} onChange={(e) => update('defaultTxType', e.target.value)}><option value="expense">Pengeluaran</option><option value="income">Pemasukan</option><option value="transfer">Transfer</option></Select></label>
              <label><span>Teks bantuan jumlah bawaan</span><Input value={prefs.amountHelper} onChange={(e) => update('amountHelper', e.target.value)} /></label>
              <label><span>Halaman awal setelah masuk</span><Select value={prefs.startPage} onChange={(e) => update('startPage', e.target.value)}><option value="dashboard">Beranda</option><option value="transactions">Transaksi</option><option value="budgets">Anggaran</option></Select></label>
              <Button type="submit" variant="primary"><AppIcon name="save" /> Simpan Tampilan</Button>
            </form>
          </SettingsCard>
        </section>
      </div>
    </AppLayout>
  );
}
