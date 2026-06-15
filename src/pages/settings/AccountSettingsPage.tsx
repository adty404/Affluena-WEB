import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Select } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingRow, SettingsCard, SettingsHero } from './SettingsShared';

export function AccountSettingsPage() {
  const { showToast } = useToast();
  const [planOpen, setPlanOpen] = useState(false);

  return (
    <AppLayout title="Account Settings" description="Kelola status akun, plan, dan identitas utama.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Account" title="Akun Affluena aktif dan siap tersambung ke backend auth." description="Halaman ini menyiapkan pengaturan user, plan, email, dan status akun sebelum integrasi API.">
          <Button to="/settings"><AppIcon name="back" /> Settings</Button>
          <Button variant="primary" onClick={() => setPlanOpen(true)}><AppIcon name="settings" /> Manage Plan</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="profile" title="Account Identity" description="Data utama akun dan status verifikasi.">
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Account identity updated.'); }}>
              <div className="form-two">
                <label><span>Account email</span><Input defaultValue="adty404@gmail.com" /></label>
                <label><span>Username</span><Input defaultValue="adty404" /></label>
              </div>
              <div className="form-two">
                <label><span>Account status</span><Select defaultValue="verified"><option value="verified">Verified</option><option value="review">Under review</option></Select></label>
                <label><span>Plan</span><Select defaultValue="personal-pro"><option value="personal-pro">Personal Pro</option><option value="personal">Personal</option></Select></label>
              </div>
              <div className="form-row-between"><Button to="/settings">Cancel</Button><Button type="submit" variant="primary"><AppIcon name="save" /> Save Account</Button></div>
            </form>
          </SettingsCard>

          <SettingsCard icon="success" title="Account Health" description="Status kesiapan akun untuk modul finance.">
            <div className="settings-list">
              <SettingRow title="Email verified" description="Email siap dipakai untuk reminder dan security alert." aside={<Badge>Verified</Badge>} />
              <SettingRow title="Default wallet" description="Bank BCA dipakai sebagai default saat membuat transaksi." aside={<Badge tone="blue">Bank BCA</Badge>} />
              <SettingRow title="Activity audit" description="User activity dan API log tersambung ke Reports & Audit." aside={<Badge tone="purple">Active</Badge>} />
              <SettingRow title="Data isolation" description="Semua halaman memakai scope user sendiri." aside={<Badge>Protected</Badge>} />
            </div>
          </SettingsCard>
        </section>

        <Modal open={planOpen} title="Manage Personal Pro" description="Pilih aksi plan yang ingin dilakukan." onClose={() => setPlanOpen(false)}>
          <div className="quick-action-grid two-col">
            <Button to="/settings/data"><AppIcon name="download" /> Export data</Button>
            <Button to="/settings/notifications"><AppIcon name="budgetAlert" /> Reminder settings</Button>
            <Button onClick={() => { setPlanOpen(false); showToast('Billing contact copied to clipboard.'); }}><AppIcon name="copy" /> Copy billing contact</Button>
            <Button onClick={() => { setPlanOpen(false); showToast('Plan receipt is ready in Export Center.'); }}><AppIcon name="export" /> Create receipt</Button>
          </div>
          <div className="modal-actions"><Button onClick={() => setPlanOpen(false)}>Close</Button></div>
        </Modal>
      </div>
    </AppLayout>
  );
}
