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
  current_password: z.string().min(1, 'Kata sandi lama wajib diisi'),
  new_password: z.string().min(8, 'Kata sandi baru minimal 8 karakter'),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: 'Konfirmasi kata sandi tidak cocok',
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
      showToast('Kata sandi berhasil diubah.');
    } catch (err) {
      const apiErr = err as ApiError;
      const msg = apiErr.status === 401 ? 'Kata sandi lama salah.' : apiErr.error || 'Gagal mengubah kata sandi.';
      showToast(msg);
    }
  }

  return (
    <AppLayout title="Pengaturan Keamanan" description="Kata sandi, notifikasi masuk, dan proteksi sesi.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Keamanan" title="Proteksi akun Affluena." description="Ubah kata sandi dan kelola sesi aktif.">
          <Button to="/settings/sessions"><AppIcon name="history" /> Sesi</Button>
          <Button variant="primary" onClick={() => setPasswordOpen(true)}><AppIcon name="edit" /> Ubah Kata Sandi</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="warning" title="Aturan Proteksi" description="Kontrol keamanan yang aktif.">
            <div className="settings-list">
              <SettingRow title="Kebijakan kata sandi" description="Minimal 8 karakter." aside={<Badge>Kuat</Badge>} />
              <SettingRow title="Masa berlaku sesi" description="Sesi masuk berlaku 30 hari." aside={<Badge tone="blue">30 hari</Badge>} />
              <SettingRow title="2FA" description="Verifikasi dua langkah belum tersedia." aside={<Badge tone="orange">Belum tersedia</Badge>} />
              <SettingRow title="Notifikasi masuk" description="Email pemberitahuan saat ada yang masuk ke akun belum tersedia." aside={<Badge tone="orange">Belum tersedia</Badge>} />
            </div>
          </SettingsCard>

          <SettingsCard icon="history" title="Peristiwa Keamanan Terbaru" description="Pantau aktivitas keamanan lewat riwayat aktivitas.">
            <div className="settings-timeline">
              <div><Badge>Lihat</Badge><strong>Riwayat Aktivitas</strong><span>Riwayat aktivitas akun tersedia di halaman Riwayat Aktivitas</span></div>
            </div>
            <div className="modal-actions left-actions"><Button to="/activities"><AppIcon name="list" /> Lihat Riwayat Aktivitas</Button></div>
          </SettingsCard>
        </section>

        <Modal open={passwordOpen} title="Ubah Kata Sandi" description="Masukkan kata sandi lama dan kata sandi baru." onClose={() => setPasswordOpen(false)}>
          <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <label>
              <span>Kata sandi lama</span>
              <Input type="password" autoComplete="current-password" {...form.register('current_password')} />
              {form.formState.errors.current_password && <span className="form-error">{form.formState.errors.current_password.message}</span>}
            </label>
            <label>
              <span>Kata sandi baru</span>
              <Input type="password" autoComplete="new-password" {...form.register('new_password')} />
              {form.formState.errors.new_password && <span className="form-error">{form.formState.errors.new_password.message}</span>}
            </label>
            <label>
              <span>Konfirmasi kata sandi</span>
              <Input type="password" autoComplete="new-password" {...form.register('confirm_password')} />
              {form.formState.errors.confirm_password && <span className="form-error">{form.formState.errors.confirm_password.message}</span>}
            </label>
            <div className="modal-actions">
              <Button onClick={() => setPasswordOpen(false)}>Batal</Button>
              <Button type="submit" variant="primary" disabled={form.formState.isSubmitting || changeMut.isPending}>
                <AppIcon name="save" /> {changeMut.isPending ? 'Memproses…' : 'Perbarui Kata Sandi'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
