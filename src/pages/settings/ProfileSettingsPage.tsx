import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useAuth } from '../../hooks/useAuth';
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
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [securityOpen, setSecurityOpen] = useState(false);
  const { data, isLoading } = useMe();
  const updateMut = useUpdateAccount();

  function handleLogout() {
    logout();
    showToast('Kamu telah keluar dari akun.');
    navigate('/login', { replace: true });
  }
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
      showToast('Informasi profil tersimpan.');
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal memperbarui profil.');
    }
  }

  return (
    <AppLayout title="Pengaturan Profil" description="Kelola profil, preferensi aplikasi, dan keamanan akun.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>● Profil</Badge>
            <h2>Profil dan preferensi aplikasi yang mudah diakses.</h2>
            <p>Halaman ini menggantikan tombol profil yang sebelumnya hanya memberi notifikasi. Semua aksi kini punya tujuan yang jelas.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/dashboard"><AppIcon name="dashboard" /> Beranda</Button>
            <Button variant="primary" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting || updateMut.isPending}>
              <AppIcon name="save" /> {updateMut.isPending ? 'Menyimpan…' : 'Simpan Perubahan'}
            </Button>
          </div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Informasi Pribadi</h3><p>Identitas yang tampil di bilah atas dan riwayat aktivitas.</p></div></div>
            <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div className="form-two">
                <label>
                  <span>Nama lengkap</span>
                  <Input {...form.register('name')} placeholder={isLoading ? 'Memuat…' : ''} />
                  {form.formState.errors.name && <span className="form-error">{form.formState.errors.name.message}</span>}
                </label>
                <label><span>Email</span><Input defaultValue={isLoading ? 'Memuat…' : (user?.email ?? '')} disabled /></label>
              </div>
              <div className="form-two">
                <label><span>Nama pengguna</span><Input defaultValue="" disabled placeholder="Belum tersedia" /></label>
                <label>
                  <span>Mata uang bawaan</span>
                  <Select {...form.register('currency')}>
                    <option value="IDR">IDR</option>
                    <option value="USD">USD</option>
                    <option value="SGD">SGD</option>
                  </Select>
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Halaman awal</span>
                  <Select {...form.register('start_page')}>
                    <option value="Dashboard">Beranda</option>
                    <option value="Transactions">Transaksi</option>
                    <option value="Budgets">Anggaran</option>
                  </Select>
                </label>
                <label>
                  <span>Mode ringkas</span>
                  <Select {...form.register('compact_mode')}>
                    <option value="Comfortable">Nyaman</option>
                    <option value="Compact">Ringkas</option>
                  </Select>
                </label>
              </div>
              <div className="form-row-between">
                <Button to="/dashboard">Batal</Button>
                <Button type="submit" variant="primary" disabled={form.formState.isSubmitting || updateMut.isPending}>
                  {updateMut.isPending ? 'Menyimpan…' : 'Simpan Profil'}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Keamanan & Akses</h3><p>Kontrol keamanan akun dan sesi aktif.</p></div></div>
            <div className="readiness-list">
              <div><span>Kebijakan password</span><Badge>Min. 8 karakter</Badge></div>
              <div><span>Sesi aktif</span><strong>Kelola di halaman Sesi</strong></div>
              <div><span>Anggota sejak</span><strong>{isLoading ? 'Memuat…' : memberSince}</strong></div>
              <div><span>Masa berlaku sesi</span><Badge tone="blue">30 hari</Badge></div>
            </div>
            <div className="modal-actions left-actions">
              <Button onClick={() => setSecurityOpen(true)}><AppIcon name="settings" /> Opsi Keamanan</Button>
              <Button onClick={handleLogout} variant="danger"><AppIcon name="back" /> Keluar</Button>
            </div>
          </Card>
        </section>

        <Modal open={securityOpen} title="Opsi Keamanan" description="Pilih aksi keamanan yang ingin dilakukan." onClose={() => setSecurityOpen(false)}>
          <div className="quick-action-grid two-col">
            <Button to="/settings/security">Ubah Password</Button>
            <Button to="/settings/sessions">Keluar dari perangkat lain</Button>
            <Button to="/settings/notifications">Kelola Pemberitahuan</Button>
            <Button to="/settings/privacy">Kontrol Privasi</Button>
          </div>
          <div className="modal-actions"><Button onClick={() => setSecurityOpen(false)}>Tutup</Button></div>
        </Modal>
      </div>
    </AppLayout>
  );
}
