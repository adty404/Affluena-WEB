import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingRow, SettingsCard, SettingsHero } from './SettingsShared';
import { useChangePassword } from '../../hooks/useAuthSettings';
import type { ApiError } from '../../api/types';

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Password lama wajib diisi'),
  new_password: z.string().min(8, 'Password baru minimal 8 karakter'),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirm_password'],
});
type PasswordValues = z.infer<typeof passwordSchema>;

export function SecuritySettingsPage() {
  const { showToast } = useToast();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const changeMut = useChangePassword();

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: '', new_password: '', confirm_password: '' },
  });

  async function onSubmit(values: PasswordValues) {
    try {
      await changeMut.mutateAsync({
        current_password: values.current_password,
        new_password: values.new_password,
      });
      setPasswordOpen(false);
      form.reset();
      showToast('Password berhasil diubah.');
    } catch (err) {
      const apiErr = err as ApiError;
      const msg = apiErr.status === 401 ? 'Password lama salah.' : apiErr.error || 'Gagal mengubah password.';
      showToast(msg);
    }
  }

  return (
    <AppLayout title="Security Settings" description="Password, login alert, dan session protection.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Security" title="Proteksi akun Affluena." description="Ubah password dan kelola session aktif.">
          <Button to="/settings/sessions"><AppIcon name="history" /> Sessions</Button>
          <Button variant="primary" onClick={() => setPasswordOpen(true)}><AppIcon name="edit" /> Change Password</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="warning" title="Protection Rules" description="Kontrol keamanan yang aktif.">
            <div className="settings-list">
              <SettingRow title="Password policy" description="Minimum 8 characters (backend rule)." aside={<Badge>Strong</Badge>} />
              <SettingRow title="Session timeout" description="Refresh token berlaku 30 hari." aside={<Badge tone="blue">30 days</Badge>} />
              <SettingRow title="2FA" description="Backend belum mendukung 2FA native." aside={<Badge tone="orange">Not implemented</Badge>} />
              <SettingRow title="Login alerts" description="Backend belum mengirim login alert email." aside={<Badge tone="orange">Not implemented</Badge>} />
            </div>
          </SettingsCard>

          <SettingsCard icon="history" title="Recent Security Events" description="Pantau aktivitas keamanan lewat activity log.">
            <div className="settings-timeline">
              <div><Badge>Lihat</Badge><strong>Activity Log</strong><span>Riwayat aktivitas akun tersedia di halaman Activities</span></div>
            </div>
            <div className="modal-actions left-actions"><Button to="/activities"><AppIcon name="list" /> View Activities</Button></div>
          </SettingsCard>
        </section>

        <Modal open={passwordOpen} title="Change Password" description="Masukkan password lama dan password baru." onClose={() => setPasswordOpen(false)}>
          <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <label>
              <span>Current password</span>
              <Input type="password" autoComplete="current-password" {...form.register('current_password')} />
              {form.formState.errors.current_password && <span className="form-error">{form.formState.errors.current_password.message}</span>}
            </label>
            <label>
              <span>New password</span>
              <Input type="password" autoComplete="new-password" {...form.register('new_password')} />
              {form.formState.errors.new_password && <span className="form-error">{form.formState.errors.new_password.message}</span>}
            </label>
            <label>
              <span>Confirm password</span>
              <Input type="password" autoComplete="new-password" {...form.register('confirm_password')} />
              {form.formState.errors.confirm_password && <span className="form-error">{form.formState.errors.confirm_password.message}</span>}
            </label>
            <div className="modal-actions">
              <Button onClick={() => setPasswordOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={form.formState.isSubmitting || changeMut.isPending}>
                <AppIcon name="save" /> {changeMut.isPending ? 'Memproses…' : 'Update Password'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
