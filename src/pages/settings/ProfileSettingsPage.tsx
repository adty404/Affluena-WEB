import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useUpdateAccount } from '../../hooks/useAuthSettings';
import { fromRFC3339 } from '../../lib/dates';
import type { ApiError } from '../../api/types';

const profileSchema = z.object({
  name: z.string().max(100, 'Maksimal 100 karakter'),
  currency: z.string(),
  start_page: z.string(),
  compact_mode: z.string(),
});
type ProfileValues = z.infer<typeof profileSchema>;

export function ProfileSettingsPage() {
  const { showToast } = useToast();
  const [securityOpen, setSecurityOpen] = useState(false);
  const { data, isLoading } = useMe();
  const updateMut = useUpdateAccount();
  const user = data?.user;
  const memberSince = user ? fromRFC3339(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name ?? '',
      currency: 'IDR',
      start_page: 'Dashboard',
      compact_mode: 'Comfortable',
    },
  });

  async function onSubmit(values: ProfileValues) {
    try {
      await updateMut.mutateAsync({
        name: values.name,
        avatar_url: user?.avatar_url ?? '',
      });
      showToast('Profile information saved.');
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal memperbarui profil.');
    }
  }

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
            <Button variant="primary" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting || updateMut.isPending}>
              <AppIcon name="save" /> {updateMut.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Personal Information</h3><p>Identitas yang tampil di topbar dan activity trail.</p></div></div>
            <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div className="form-two">
                <label>
                  <span>Full name</span>
                  <Input {...form.register('name')} placeholder={isLoading ? 'Memuat…' : ''} />
                  {form.formState.errors.name && <span className="form-error">{form.formState.errors.name.message}</span>}
                </label>
                <label><span>Email</span><Input defaultValue={isLoading ? 'Memuat…' : (user?.email ?? '')} disabled /></label>
              </div>
              <div className="form-two">
                <label><span>Handle</span><Input defaultValue="" disabled placeholder="Belum tersedia" /></label>
                <label>
                  <span>Default currency</span>
                  <Select {...form.register('currency')}>
                    <option value="IDR">IDR</option>
                    <option value="USD">USD</option>
                    <option value="SGD">SGD</option>
                  </Select>
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Start page</span>
                  <Select {...form.register('start_page')}>
                    <option value="Dashboard">Dashboard</option>
                    <option value="Transactions">Transactions</option>
                    <option value="Budgets">Budgets</option>
                  </Select>
                </label>
                <label>
                  <span>Compact mode</span>
                  <Select {...form.register('compact_mode')}>
                    <option value="Comfortable">Comfortable</option>
                    <option value="Compact">Compact</option>
                  </Select>
                </label>
              </div>
              <div className="form-row-between">
                <Button to="/dashboard">Cancel</Button>
                <Button type="submit" variant="primary" disabled={form.formState.isSubmitting || updateMut.isPending}>
                  {updateMut.isPending ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
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
            <Button to="/settings/security">Change Password</Button>
            <Button onClick={() => showToast('Two-factor setup opened.')}>Setup 2FA</Button>
            <Button to="/settings/sessions">Sign out devices</Button>
            <Button onClick={() => showToast('Login alert settings saved.')}>Manage Alerts</Button>
          </div>
          <div className="modal-actions"><Button onClick={() => setSecurityOpen(false)}>Close</Button></div>
        </Modal>
      </div>
    </AppLayout>
  );
}
