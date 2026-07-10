import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Select } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingsCard, SettingsHero } from './SettingsShared';
import { useExportCSV } from '../../hooks/useExports';
import { deleteAccount } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';
import type { ApiError } from '../../api/types';

function rangeToDates(range: string): { from?: string; to?: string } {
  if (range === 'this-year') {
    const now = new Date();
    const from = new Date(now.getFullYear(), 0, 1).toISOString();
    const to = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999).toISOString();
    return { from, to };
  }
  return {};
}

export function DataSettingsPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dateRange, setDateRange] = useState('all-time');
  const exportMut = useExportCSV();

  function closeDeleteModal() {
    if (isDeleting) return;
    setDeleteOpen(false);
    setDeletePassword('');
    setDeleteError(null);
  }

  async function handleDeleteAccount(event: React.FormEvent) {
    event.preventDefault();
    if (!deletePassword) {
      setDeleteError('Masukkan kata sandimu untuk konfirmasi.');
      return;
    }
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccount({ password: deletePassword });
      // The account is gone server-side; drop local session + cached data and
      // land on the login screen.
      logout();
      navigate('/login', { replace: true });
      showToast('Akunmu sudah dihapus. Sampai jumpa lagi.');
    } catch (err) {
      const apiErr = err as ApiError;
      setDeleteError(apiErr.error || 'Gagal menghapus akun. Periksa kata sandimu lalu coba lagi.');
      setIsDeleting(false);
    }
  }

  async function handleExport(event: React.FormEvent) {
    event.preventDefault();
    try {
      const { from, to } = rangeToDates(dateRange);
      const blob = await exportMut.mutateAsync({ from, to });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `affluena-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast('Ekspor data pribadi berhasil diunduh.');
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal membuat ekspor.');
    }
  }

  return (
    <AppLayout title="Data & Siklus Akun" description="Ekspor data pribadi, retensi data, dan hapus akun.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="Data" title="Alat data untuk ekspor dan siklus hidup akun." description="Kamu bisa membuat ekspor data pribadi dan menghapus akunmu secara permanen kapan saja.">
          <Button to="/exports/new"><AppIcon name="export" /> Buat Ekspor</Button>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}><AppIcon name="delete" /> Hapus Akun</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="download" title="Ekspor Data Pribadi" description="Unduh transaksi dan data penting dari Affluena sebagai file CSV.">
            <form className="form-stack" onSubmit={handleExport}>
              <div className="form-two">
                <label><span>Rentang tanggal</span><Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}><option value="all-time">Semua waktu</option><option value="this-year">Tahun ini</option></Select></label>
                <label><span>Format</span><Select value="csv" disabled><option value="csv">Paket CSV</option></Select></label>
              </div>
              <Button type="submit" variant="primary" disabled={exportMut.isPending}><AppIcon name="download" /> {exportMut.isPending ? 'Menyiapkan…' : 'Buat Ekspor'}</Button>
              <span className="muted-text">Butuh format atau filter lain? Gunakan Pusat Ekspor.</span>
            </form>
          </SettingsCard>

          <SettingsCard icon="list" title="Kebijakan Retensi & Penghapusan" description="Yang terjadi saat akunmu dihapus.">
            <div className="settings-list compact">
              <div><span>Semua data finansial</span><strong>Dihapus permanen seketika</strong></div>
              <div><span>Berbagi Dompet</span><strong>Dicabut otomatis (dua arah)</strong></div>
              <div><span>Sesi masuk</span><strong>Langsung dicabut di semua perangkat</strong></div>
              <div><span>Pemulihan</span><strong>Tidak ada — penghapusan tidak bisa dibatalkan</strong></div>
              <div><span>Sebelum menghapus</span><strong>Ekspor dulu datamu bila masih diperlukan</strong></div>
            </div>
            <div className="modal-actions left-actions"><Button to="/exports/history"><AppIcon name="history" /> Riwayat Ekspor</Button></div>
          </SettingsCard>
        </section>

        <Modal open={deleteOpen} title="Hapus Akun" description="Akun dan seluruh datamu dihapus permanen — tidak bisa dibatalkan." onClose={closeDeleteModal}>
          <div className="notice-card danger-note"><strong>Penting:</strong> semua dompet, transaksi, anggaran, target, dan data lainnya ikut terhapus seketika. Sesi masuk dicabut dan Berbagi Dompet dihentikan. Ekspor dulu datamu jika masih dibutuhkan.</div>
          <form className="form-stack" onSubmit={handleDeleteAccount}>
            <label>
              <span>Konfirmasi kata sandi</span>
              <Input
                type="password"
                autoComplete="current-password"
                placeholder="Kata sandimu saat ini"
                value={deletePassword}
                onChange={(event) => setDeletePassword(event.target.value)}
                disabled={isDeleting}
              />
              {deleteError && <span className="form-error">{deleteError}</span>}
            </label>
            <div className="modal-actions">
              <Button type="button" onClick={closeDeleteModal} disabled={isDeleting}>Batal</Button>
              <Button type="submit" variant="danger" disabled={isDeleting || !deletePassword}><AppIcon name="delete" /> {isDeleting ? 'Menghapus…' : 'Hapus Akun Permanen'}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
