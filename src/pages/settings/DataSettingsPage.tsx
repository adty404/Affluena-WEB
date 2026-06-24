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
      showToast('Personal data export berhasil diunduh.');
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal membuat export.');
    }
  }

  return (
    <AppLayout title="Data & Account Lifecycle" description="Export personal data, retention, dan delete account.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Data" title="Data tools untuk export dan lifecycle akun." description="User bisa membuat export personal data dan menjalankan delete account flow dengan confirmation yang aman.">
          <Button to="/exports/new"><AppIcon name="export" /> Create Export</Button>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}><AppIcon name="delete" /> Delete Account</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="download" title="Personal Data Export" description="Unduh transaksi dan data penting dari Affluena sebagai file CSV.">
            <form className="form-stack" onSubmit={handleExport}>
              <div className="form-two">
                <label><span>Date range</span><Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}><option value="all-time">All time</option><option value="this-year">This year</option></Select></label>
                <label><span>Format</span><Select value="csv" disabled><option value="csv">CSV bundle</option></Select></label>
              </div>
              <Button type="submit" variant="primary" disabled={exportMut.isPending}><AppIcon name="download" /> {exportMut.isPending ? 'Menyiapkan…' : 'Generate Export'}</Button>
              <span className="muted-text">Butuh format atau filter modul lain? Gunakan Export Center.</span>
            </form>
          </SettingsCard>

          <SettingsCard icon="list" title="Retention & Delete Policy" description="Aturan data ketika akun ditutup.">
            <div className="settings-list compact">
              <div><span>Transactions</span><strong>Included in export before deletion</strong></div>
              <div><span>Wallet shares</span><strong>Revoked automatically</strong></div>
              <div><span>Refresh tokens</span><strong>Revoked immediately</strong></div>
              <div><span>API logs</span><strong>Anonymized after account closure</strong></div>
              <div><span>Recovery window</span><strong>7 days soft-delete period</strong></div>
            </div>
            <div className="modal-actions left-actions"><Button to="/exports/history"><AppIcon name="history" /> Export History</Button></div>
          </SettingsCard>
        </section>

        <Modal open={deleteOpen} title="Delete Account" description="Ketik DELETE untuk mengaktifkan tombol delete account." onClose={() => setDeleteOpen(false)}>
          <div className="notice-card danger-note"><strong>Important:</strong> akun akan masuk 7-day soft-delete window. Semua refresh token dicabut dan wallet sharing direvoke.</div>
          <form className="form-stack" onSubmit={(event) => { event.preventDefault(); setDeleteOpen(false); setConfirmText(''); showToast('Permintaan hapus akun tercatat. Tim Affluena akan memproses penutupan akun.'); }}>
            <label><span>Confirmation</span><Input value={confirmText} onChange={(event) => setConfirmText(event.target.value)} placeholder="DELETE" /></label>
            <div className="modal-actions"><Button onClick={() => setDeleteOpen(false)}>Cancel</Button><Button type="submit" variant="danger" disabled={confirmText !== 'DELETE'}><AppIcon name="delete" /> Confirm Delete</Button></div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
