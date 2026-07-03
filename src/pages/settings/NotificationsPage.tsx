import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { EmptyState } from '../../components/ui/EmptyState';
import { SettingRow, SettingsCard, SettingsHero, SettingsToggle } from './SettingsShared';
import { useNotificationRules, useUpdateNotificationRule } from '../../hooks/useNotifications';
import type { PreferenceTone } from '../../types/settings';

const REMINDER_STORAGE_KEY = 'affluena.reminder-schedule';

type ReminderSchedule = {
  debt: string;
  installment: string;
  subscription: string;
  recurring: string;
};

const DEFAULT_SCHEDULE: ReminderSchedule = {
  debt: 'h3-h1',
  installment: 'h3-h1-due',
  subscription: 'h3',
  recurring: 'immediate',
};

function loadSchedule(): ReminderSchedule {
  try {
    const raw = localStorage.getItem(REMINDER_STORAGE_KEY);
    if (!raw) return DEFAULT_SCHEDULE;
    return { ...DEFAULT_SCHEDULE, ...(JSON.parse(raw) as Partial<ReminderSchedule>) };
  } catch {
    return DEFAULT_SCHEDULE;
  }
}

export function NotificationsPage() {
  const { showToast } = useToast();
  const { data, isLoading, isError, refetch, isFetching } = useNotificationRules();
  const { mutate, isPending, variables } = useUpdateNotificationRule();
  const [schedule, setSchedule] = useState<ReminderSchedule>(loadSchedule);

  const rules = data?.rules ?? [];

  const toggle = (id: string, currentEnabled: boolean) => {
    mutate({ id, update: { enabled: !currentEnabled } });
  };

  const changeChannel = (id: string, channel: 'email' | 'in-app' | 'both') => {
    mutate({ id, update: { channel } });
  };

  const updateSchedule = (key: keyof ReminderSchedule, value: string) => {
    setSchedule((prev) => ({ ...prev, [key]: value }));
  };

  const saveSchedule = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(schedule));
      showToast('Jadwal pengingat disimpan.');
    } catch {
      showToast('Gagal menyimpan jadwal pengingat.');
    }
  };

  return (
    <AppLayout title="Preferensi Notifikasi" description="Pengingat anggaran, jatuh tempo, transaksi berulang, dan keamanan.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Pemberitahuan" title="Atur pemberitahuan penting tanpa bikin berisik." description="Kendalikan pengingat anggaran, jatuh tempo H-3, transaksi berulang, dan keamanan sesuai kebutuhan kamu.">
          <Button to="/alerts"><AppIcon name="warning" /> Pusat Pemberitahuan</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="budgetAlert" title="Aturan Pemberitahuan" description="Aktifkan/nonaktifkan pengingat sesuai kebutuhan.">
            {isLoading ? (
              <div className="settings-list"><div><span>Memuat aturan pemberitahuan…</span></div></div>
            ) : isError ? (
              <EmptyState
                icon={<AppIcon name="warning" />}
                title="Gagal memuat aturan pemberitahuan"
                description="Periksa koneksi lalu coba lagi."
                action={<Button variant="primary" onClick={() => refetch()} disabled={isFetching}><AppIcon name="recurring" /> {isFetching ? 'Memuat…' : 'Coba lagi'}</Button>}
              />
            ) : rules.length === 0 ? (
              <EmptyState
                icon={<AppIcon name="budgetAlert" />}
                title="Belum ada aturan pemberitahuan"
                description="Aturan pemberitahuan akan muncul setelah pengingat diaktifkan di akun kamu."
              />
            ) : (
              <div className="settings-list">
                {rules.map((rule) => {
                  const isUpdating = isPending && variables?.id === rule.id;
                  return (
                    <SettingRow key={rule.id} title={rule.title} description={rule.description} aside={<SettingsToggle checked={rule.enabled} onChange={() => toggle(rule.id, rule.enabled)} disabled={isUpdating} label={`Aktifkan/nonaktifkan ${rule.title}`} />}>
                      <div className="setting-row-controls">
                        <Badge tone={rule.tone as PreferenceTone}>{rule.enabled ? 'Aktif' : 'Nonaktif'}</Badge>
                        <Select
                          value={rule.channel}
                          onChange={(e) => changeChannel(rule.id, e.target.value as 'email' | 'in-app' | 'both')}
                          disabled={isUpdating}
                          aria-label={`Saluran ${rule.title}`}
                        >
                          <option value="email">Email</option>
                          <option value="in-app">Dalam aplikasi</option>
                          <option value="both">Email + dalam aplikasi</option>
                        </Select>
                      </div>
                    </SettingRow>
                  );
                })}
              </div>
            )}
          </SettingsCard>

          <SettingsCard icon="calendar" title="Jadwal Pengingat" description="Jadwal bawaan untuk jatuh tempo dan transaksi berulang. Tersimpan di perangkat ini.">
            <form className="form-stack" onSubmit={saveSchedule}>
              <label>
                <span>Pengingat jatuh tempo utang</span>
                <Select value={schedule.debt} onChange={(e) => updateSchedule('debt', e.target.value)}>
                  <option value="h3-h1">H-3 dan H-1</option>
                  <option value="h7-h3-h1">H-7, H-3, H-1</option>
                </Select>
              </label>
              <label>
                <span>Pengingat cicilan</span>
                <Select value={schedule.installment} onChange={(e) => updateSchedule('installment', e.target.value)}>
                  <option value="h3-h1-due">H-3, H-1, hari jatuh tempo</option>
                  <option value="due">Hari jatuh tempo saja</option>
                </Select>
              </label>
              <label>
                <span>Perpanjangan langganan</span>
                <Select value={schedule.subscription} onChange={(e) => updateSchedule('subscription', e.target.value)}>
                  <option value="h3">H-3 sebelum perpanjangan</option>
                  <option value="h7">H-7 sebelum perpanjangan</option>
                </Select>
              </label>
              <label>
                <span>Pemberitahuan transaksi berulang gagal</span>
                <Select value={schedule.recurring} onChange={(e) => updateSchedule('recurring', e.target.value)}>
                  <option value="immediate">Segera</option>
                  <option value="daily">Ringkasan harian</option>
                </Select>
              </label>
              <Button type="submit" variant="primary"><AppIcon name="save" /> Simpan Jadwal</Button>
            </form>
          </SettingsCard>
        </section>
      </div>
    </AppLayout>
  );
}
