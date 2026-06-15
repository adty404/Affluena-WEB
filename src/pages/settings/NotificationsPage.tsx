import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { notificationRules } from '../../data/mockSettings';
import { SettingRow, SettingsCard, SettingsHero, SettingsToggle } from './SettingsShared';

export function NotificationsPage() {
  const { showToast } = useToast();
  const [rules, setRules] = useState(notificationRules);
  const toggle = (id: string) => setRules((items) => items.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item));

  return (
    <AppLayout title="Notification Preferences" description="Budget, due date, recurring, security, dan summary reminder.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Notifications" title="Atur alert penting tanpa membuat inbox berisik." description="Rule ini selaras dengan budget alert, due reminder H-3, recurring run, dan security alert di system map.">
          <Button to="/alerts"><AppIcon name="warning" /> Alert Center</Button>
          <Button variant="primary" onClick={() => showToast('Notification preferences saved.')}><AppIcon name="save" /> Save Rules</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="budgetAlert" title="Alert Rules" description="Aktifkan/nonaktifkan reminder berdasarkan modul.">
            <div className="settings-list">
              {rules.map((rule) => (
                <SettingRow key={rule.id} title={rule.title} description={rule.description} aside={<SettingsToggle checked={rule.enabled} onChange={() => toggle(rule.id)} label={`Toggle ${rule.title}`} />}>
                  <div className="setting-row-controls">
                    <Badge tone={rule.tone}>{rule.enabled ? 'Enabled' : 'Disabled'}</Badge>
                    <Select defaultValue={rule.channel} aria-label={`${rule.title} channel`}>
                      <option value="email">Email</option>
                      <option value="in-app">In-app</option>
                      <option value="both">Email + in-app</option>
                    </Select>
                  </div>
                </SettingRow>
              ))}
            </div>
          </SettingsCard>

          <SettingsCard icon="calendar" title="Reminder Schedule" description="Jadwal default untuk due date dan recurring alert.">
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Reminder schedule saved.'); }}>
              <label><span>Debt due reminder</span><Select defaultValue="h3-h1"><option value="h3-h1">H-3 and H-1</option><option value="h7-h3-h1">H-7, H-3, H-1</option></Select></label>
              <label><span>Installment reminder</span><Select defaultValue="h3-h1-due"><option value="h3-h1-due">H-3, H-1, due day</option><option value="due">Due day only</option></Select></label>
              <label><span>Subscription renewal</span><Select defaultValue="h3"><option value="h3">H-3 before renewal</option><option value="h7">H-7 before renewal</option></Select></label>
              <label><span>Recurring failure alert</span><Select defaultValue="immediate"><option value="immediate">Immediately</option><option value="daily">Daily digest</option></Select></label>
              <Button type="submit" variant="primary"><AppIcon name="save" /> Save Schedule</Button>
            </form>
          </SettingsCard>
        </section>
      </div>
    </AppLayout>
  );
}
