import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { SettingRow, SettingsCard, SettingsHero } from './SettingsShared';
import { useMe } from '../../hooks/useMe';
import { useUpdateAccount } from '../../hooks/useAuthSettings';
import { fileToAvatarDataUrl, isValidAvatarUrl } from '../../lib/avatar';
import type { ApiError } from '../../api/types';

const accountSchema = z.object({
  name: z.string().max(100, 'Maksimal 100 karakter'),
  // Foto profil: '' (tanpa foto), data:image/... (unggahan, format yang sama
  // dengan mobile), atau URL http(s) lama. Tidak ada lagi input URL manual.
  avatar_url: z.string().refine(isValidAvatarUrl, 'Foto profil tidak valid.'),
});
type AccountValues = z.infer<typeof accountSchema>;

export function AccountSettingsPage() {
  const { showToast } = useToast();
  const { data: meData } = useMe();
  const updateMut = useUpdateAccount();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processingPhoto, setProcessingPhoto] = useState(false);

  const form = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    values: {
      name: meData?.user.name ?? '',
      avatar_url: meData?.user.avatar_url ?? '',
    },
  });

  const avatarUrl = form.watch('avatar_url');
  const avatarInitial = (meData?.user.name || meData?.user.email || 'U').charAt(0).toUpperCase();

  async function onPickPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Allow re-picking the same file after "Hapus foto".
    event.target.value = '';
    if (!file) return;
    setProcessingPhoto(true);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      form.setValue('avatar_url', dataUrl, { shouldDirty: true, shouldValidate: true });
    } catch {
      showToast('Gagal memproses foto. Coba gambar lain.');
    } finally {
      setProcessingPhoto(false);
    }
  }

  function onClearPhoto() {
    form.setValue('avatar_url', '', { shouldDirty: true, shouldValidate: true });
  }

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
    <AppLayout title="Pengaturan Akun" description="Kelola identitas akun (nama, foto profil).">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="Akun" title="Profil akun Affluena." description="Perbarui nama dan foto profil. Email tidak bisa diubah (hubungi admin jika perlu).">
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
              <div className="avatar-field-block">
                <span className="avatar-field-label">Foto profil</span>
                <div className="avatar-field">
                  <UserAvatar src={avatarUrl} fallback={avatarInitial} size="xl" />
                  <div className="avatar-field-actions">
                    <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={processingPhoto || updateMut.isPending}>
                      <AppIcon name="profile" /> {processingPhoto ? 'Memproses…' : 'Pilih foto'}
                    </Button>
                    {avatarUrl ? (
                      <Button type="button" variant="danger" onClick={onClearPhoto} disabled={processingPhoto || updateMut.isPending}>
                        <AppIcon name="delete" /> Hapus foto
                      </Button>
                    ) : null}
                  </div>
                </div>
                <span className="field-help">Foto diperkecil otomatis supaya ringan. Jangan lupa tekan Simpan Akun setelah memilih foto.</span>
                {form.formState.errors.avatar_url && <span className="form-error">{form.formState.errors.avatar_url.message}</span>}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onPickPhoto}
                  style={{ display: 'none' }}
                  aria-label="Pilih foto profil"
                />
              </div>
              <div className="form-row-between">
                <Button to="/settings">Batal</Button>
                <Button type="submit" variant="primary" disabled={form.formState.isSubmitting || updateMut.isPending || processingPhoto}>
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
