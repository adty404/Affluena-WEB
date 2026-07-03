import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingRow, SettingsCard, SettingsHero } from './SettingsShared';
import { useMe } from '../../hooks/useMe';
import { useUpdateAccount } from '../../hooks/useAuthSettings';
import type { ApiError } from '../../api/types';

const accountSchema = z.object({
  name: z.string().max(100, 'Maksimal 100 karakter'),
  avatar_url: z.string().url('URL avatar tidak valid').or(z.literal('')),
});
type AccountValues = z.infer<typeof accountSchema>;

export function AccountSettingsPage() {
  const { showToast } = useToast();
  const { data: meData } = useMe();
  const updateMut = useUpdateAccount();

  const form = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    values: {
      name: meData?.user.name ?? '',
      avatar_url: meData?.user.avatar_url ?? '',
    },
  });

  async function onSubmit(values: AccountValues) {
    try {
      await updateMut.mutateAsync(values);
      showToast('Profil akun diperbarui.');
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal memperbarui profil.');
    }
  }

  return (
    <AppLayout title="Pengaturan Akun" description="Kelola identitas akun (nama, avatar).">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Akun" title="Profil akun Affluena." description="Perbarui nama dan avatar. Email tidak bisa diubah (hubungi admin jika perlu).">
          <Button to="/settings"><AppIcon name="back" /> Pengaturan</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="profile" title="Identitas Akun" description="Data utama akun.">
            <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <label>
                <span>Email akun</span>
                <Input defaultValue={meData?.user.email ?? ''} disabled />
              </label>
              <label>
                <span>Nama</span>
                <Input {...form.register('name')} />
                {form.formState.errors.name && <span className="form-error">{form.formState.errors.name.message}</span>}
              </label>
              <label>
                <span>URL Avatar</span>
                <Input type="url" placeholder="https://..." {...form.register('avatar_url')} />
                {form.formState.errors.avatar_url && <span className="form-error">{form.formState.errors.avatar_url.message}</span>}
              </label>
              <div className="form-row-between">
                <Button to="/settings">Batal</Button>
                <Button type="submit" variant="primary" disabled={form.formState.isSubmitting || updateMut.isPending}>
                  <AppIcon name="save" /> {updateMut.isPending ? 'Menyimpan…' : 'Simpan Akun'}
                </Button>
              </div>
            </form>
          </SettingsCard>

          <SettingsCard icon="success" title="Kesehatan Akun" description="Status kesiapan akun.">
            <div className="settings-list">
              <SettingRow title="Email terverifikasi" description="Email siap dipakai untuk pengingat dan notifikasi keamanan." aside={<Badge>Terverifikasi</Badge>} />
              <SettingRow title="Audit aktivitas" description="Aktivitas akun kamu tercatat dan bisa dilihat di Riwayat Aktivitas." aside={<Badge tone="purple">Aktif</Badge>} />
              <SettingRow title="Isolasi data" description="Semua halaman hanya menampilkan data milikmu sendiri." aside={<Badge>Terlindungi</Badge>} />
            </div>
          </SettingsCard>
        </section>
      </div>
    </AppLayout>
  );
}
