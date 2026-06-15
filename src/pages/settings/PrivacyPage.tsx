import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingRow, SettingsCard, SettingsHero, SettingsToggle } from './SettingsShared';

export function PrivacyPage() {
  const { showToast } = useToast();
  const [maskAmounts, setMaskAmounts] = useState(false);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [auditOpen, setAuditOpen] = useState(false);

  return (
    <AppLayout title="Data Privacy" description="Kontrol data visibility, masking, dan audit access.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Privacy" title="Privacy control untuk data finansial personal." description="Masking nominal, audit data, dan export personal data dibuat transparan agar user percaya pada aplikasi.">
          <Button to="/settings/data"><AppIcon name="download" /> Data Tools</Button>
          <Button variant="primary" onClick={() => setAuditOpen(true)}><AppIcon name="list" /> Privacy Audit</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="health" title="Privacy Controls" description="Atur visibility data sensitif di layar dan report.">
            <div className="settings-list">
              <SettingRow title="Mask financial amounts" description="Sembunyikan nominal di dashboard saat sedang presentasi atau layar dibagikan." aside={<SettingsToggle checked={maskAmounts} onChange={() => setMaskAmounts(!maskAmounts)} label="Toggle amount masking" />} />
              <SettingRow title="Allow product analytics" description="Kirim event UI anonim untuk memperbaiki UX tanpa menjual data pengguna." aside={<SettingsToggle checked={shareAnalytics} onChange={() => setShareAnalytics(!shareAnalytics)} label="Toggle product analytics" />} />
              <SettingRow title="Export audit trail" description="Sertakan user activities dan API logs saat export data pribadi." aside={<Badge tone="blue">Enabled</Badge>} />
              <SettingRow title="Data retention" description="Activity logs dipertahankan selama 12 bulan untuk audit user." aside={<Badge tone="gray">12 months</Badge>} />
            </div>
          </SettingsCard>

          <SettingsCard icon="warning" title="Privacy Events" description="Event penting yang terkait data sensitif.">
            <div className="settings-timeline">
              <div><Badge>Viewed</Badge><strong>Wallet balance report opened</strong><span>Today 20:10 · Dashboard</span></div>
              <div><Badge tone="blue">Exported</Badge><strong>CSV export created</strong><span>Yesterday · Transactions</span></div>
              <div><Badge tone="orange">Changed</Badge><strong>Notification channel updated</strong><span>12 Jun 2026 · Settings</span></div>
            </div>
            <div className="modal-actions left-actions"><Button to="/activities"><AppIcon name="history" /> Open Activity Log</Button></div>
          </SettingsCard>
        </section>

        <Modal open={auditOpen} title="Privacy Audit Result" description="Ringkasan audit privacy untuk sesi ini." onClose={() => setAuditOpen(false)}>
          <div className="settings-list compact">
            <div><span>User isolation</span><strong>Passed</strong></div>
            <div><span>Financial amount masking</span><strong>{maskAmounts ? 'Enabled' : 'Available, currently off'}</strong></div>
            <div><span>Personal data export</span><strong>Available from Data Tools</strong></div>
            <div><span>Deletion flow</span><strong>Requires typed confirmation</strong></div>
          </div>
          <div className="modal-actions"><Button onClick={() => setAuditOpen(false)}>Close</Button><Button to="/settings/data" variant="primary">Open Data Tools</Button></div>
        </Modal>
      </div>
    </AppLayout>
  );
}
