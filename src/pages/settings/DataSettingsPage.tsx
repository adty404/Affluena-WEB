import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Select } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingsCard, SettingsHero } from './SettingsShared';
import { useExportCSV } from '../../hooks/useExports';
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
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [dateRange, setDateRange] = useState('all-time');
  const exportMut = useExportCSV();

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
        <SettingsHero badge="● Data" title="Alat data untuk ekspor dan siklus hidup akun." description="Kamu bisa membuat ekspor data pribadi dan menghapus akun dengan konfirmasi yang aman.">
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

          <SettingsCard icon="list" title="Kebijakan Retensi & Penghapusan" description="Aturan data ketika akun ditutup.">
            <div className="settings-list compact">
              <div><span>Transaksi</span><strong>Disertakan dalam ekspor sebelum penghapusan</strong></div>
              <div><span>Berbagi Dompet</span><strong>Dicabut otomatis</strong></div>
              <div><span>Sesi masuk</span><strong>Langsung dicabut</strong></div>
              <div><span>Riwayat aktivitas</span><strong>Dianonimkan setelah akun ditutup</strong></div>
              <div><span>Masa pemulihan</span><strong>7 hari masa tunggu penghapusan</strong></div>
            </div>
            <div className="modal-actions left-actions"><Button to="/exports/history"><AppIcon name="history" /> Riwayat Ekspor</Button></div>
          </SettingsCard>
        </section>

        <Modal open={deleteOpen} title="Hapus Akun" description={'Ketik "DELETE" untuk mengaktifkan tombol hapus akun.'} onClose={() => setDeleteOpen(false)}>
          <div className="notice-card danger-note"><strong>Penting:</strong> akun akan masuk masa tunggu penghapusan 7 hari. Semua sesi masuk dicabut dan Berbagi Dompet dihentikan.</div>
          <form className="form-stack" onSubmit={(event) => { event.preventDefault(); setDeleteOpen(false); setConfirmText(''); showToast('Permintaan hapus akun tercatat. Tim Affluena akan memproses penutupan akun.'); }}>
            <label><span>Konfirmasi</span><Input value={confirmText} onChange={(event) => setConfirmText(event.target.value)} placeholder="DELETE" /></label>
            <div className="modal-actions"><Button onClick={() => setDeleteOpen(false)}>Batal</Button><Button type="submit" variant="danger" disabled={confirmText !== 'DELETE'}><AppIcon name="delete" /> Konfirmasi Hapus</Button></div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
