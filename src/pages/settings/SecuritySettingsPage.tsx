import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Select } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingRow, SettingsCard, SettingsHero, SettingsToggle } from './SettingsShared';

export function SecuritySettingsPage() {
  const { showToast } = useToast();
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlert, setLoginAlert] = useState(true);
  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <AppLayout title="Security Settings" description="Password, 2FA, login alert, dan session protection.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Security" title="Proteksi akun sebelum data finance disambungkan ke API." description="Ubah password, aktifkan 2FA, dan atur login alert agar akses akun tetap aman.">
          <Button to="/settings/sessions"><AppIcon name="history" /> Sessions</Button>
          <Button variant="primary" onClick={() => setPasswordOpen(true)}><AppIcon name="edit" /> Change Password</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="warning" title="Protection Rules" description="Kontrol keamanan yang aktif di akun ini.">
            <div className="settings-list">
              <SettingRow title="Two-factor authentication" description="Require verification code when logging in from a new device." aside={<SettingsToggle checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} label="Toggle two factor authentication" />} />
              <SettingRow title="New device login alert" description="Send email and in-app alert for new device login." aside={<SettingsToggle checked={loginAlert} onChange={() => setLoginAlert(!loginAlert)} label="Toggle login alert" />} />
              <SettingRow title="Session timeout" description="Automatically ask users to login again after inactivity." aside={<Badge tone="blue">30 minutes</Badge>} />
              <SettingRow title="Password policy" description="Minimum 12 characters with symbol and number." aside={<Badge>Strong</Badge>} />
            </div>
          </SettingsCard>

          <SettingsCard icon="history" title="Recent Security Events" description="Ringkasan event keamanan dari activity dan system logs.">
            <div className="settings-timeline">
              <div><Badge>Success</Badge><strong>Login from Chrome</strong><span>Jakarta · Today 21:08</span></div>
              <div><Badge tone="red">Blocked</Badge><strong>Unknown device blocked</strong><span>Singapore · Yesterday 23:41</span></div>
              <div><Badge tone="blue">Updated</Badge><strong>2FA recovery code generated</strong><span>12 Jun 2026</span></div>
            </div>
            <div className="modal-actions left-actions"><Button to="/system-logs"><AppIcon name="list" /> View System Logs</Button></div>
          </SettingsCard>
        </section>

        <Modal open={passwordOpen} title="Change Password" description="Masukkan password lama dan password baru." onClose={() => setPasswordOpen(false)}>
          <form className="form-stack" onSubmit={(event) => { event.preventDefault(); setPasswordOpen(false); showToast('Password changed. Other devices will be asked to sign in again.'); }}>
            <label><span>Current password</span><Input type="password" required /></label>
            <div className="form-two">
              <label><span>New password</span><Input type="password" required /></label>
              <label><span>Confirm password</span><Input type="password" required /></label>
            </div>
            <label><span>Sign out other devices</span><Select defaultValue="yes"><option value="yes">Yes, after password change</option><option value="no">No, keep trusted devices</option></Select></label>
            <div className="modal-actions"><Button onClick={() => setPasswordOpen(false)}>Cancel</Button><Button type="submit" variant="primary"><AppIcon name="save" /> Update Password</Button></div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
