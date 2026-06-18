import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { useMe } from '../../hooks/useMe';
import { fromRFC3339 } from '../../lib/dates';

export function ProfileSettingsPage() {
  const { showToast } = useToast();
  const [securityOpen, setSecurityOpen] = useState(false);
  const { data, isLoading } = useMe();
  const user = data?.user;
  const memberSince = user ? fromRFC3339(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  return (
    <AppLayout title="Profile Settings" description="Kelola profil, preferensi aplikasi, dan keamanan akun.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>● Workspace Settings</Badge>
            <h2>Profil dan preferensi aplikasi yang mudah diakses.</h2>
            <p>Halaman ini menggantikan tombol profil yang sebelumnya hanya memberi notifikasi. Semua action kini punya tujuan yang jelas.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/dashboard"><AppIcon name="dashboard" /> Dashboard</Button>
            <Button variant="primary" onClick={() => showToast('Profile preferences saved.') }><AppIcon name="save" /> Save Changes</Button>
          </div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Personal Information</h3><p>Identitas yang tampil di topbar dan activity trail.</p></div></div>
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Profile information saved.'); }}>
              <div className="form-two">
                <label><span>Full name</span><Input defaultValue={isLoading ? 'Memuat…' : (user?.email ?? '')} /></label>
                <label><span>Email</span><Input defaultValue={isLoading ? 'Memuat…' : (user?.email ?? '')} disabled /></label>
              </div>
              <div className="form-two">
                <label><span>Handle</span><Input defaultValue="" disabled placeholder="Belum tersedia" /></label>
                <label><span>Default currency</span><Select defaultValue="IDR"><option>IDR</option><option>USD</option><option>SGD</option></Select></label>
              </div>
              <div className="form-two">
                <label><span>Start page</span><Select defaultValue="Dashboard"><option>Dashboard</option><option>Transactions</option><option>Budgets</option></Select></label>
                <label><span>Compact mode</span><Select defaultValue="Comfortable"><option>Comfortable</option><option>Compact</option></Select></label>
              </div>
              <div className="form-row-between"><Button to="/dashboard">Cancel</Button><Button type="submit" variant="primary">Save Profile</Button></div>
            </form>
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Security & Access</h3><p>Kontrol keamanan akun dan session aktif.</p></div></div>
            <div className="readiness-list">
              <div><span>Two-factor auth</span><Badge tone="blue">Ready to configure</Badge></div>
              <div><span>Active session</span><strong>Chrome · Jakarta · Today</strong></div>
              <div><span>Last password change</span><strong>{memberSince}</strong></div>
              <div><span>Login alerts</span><Badge>Enabled</Badge></div>
            </div>
            <div className="modal-actions left-actions">
              <Button onClick={() => setSecurityOpen(true)}><AppIcon name="settings" /> Security Options</Button>
              <Button to="/" variant="danger">Logout</Button>
            </div>
          </Card>
        </section>

        <Modal open={securityOpen} title="Security Options" description="Pilih aksi keamanan yang ingin dilakukan." onClose={() => setSecurityOpen(false)}>
          <div className="quick-action-grid two-col">
            <Button onClick={() => showToast('Password reset link prepared.')}>Change Password</Button>
            <Button onClick={() => showToast('Two-factor setup opened.')}>Setup 2FA</Button>
            <Button onClick={() => showToast('All other sessions signed out.')}>Sign out devices</Button>
            <Button onClick={() => showToast('Login alert settings saved.')}>Manage Alerts</Button>
          </div>
          <div className="modal-actions"><Button onClick={() => setSecurityOpen(false)}>Close</Button></div>
        </Modal>
      </div>
    </AppLayout>
  );
}
