import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Select } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingsCard, SettingsHero } from './SettingsShared';

export function DataSettingsPage() {
  const { showToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  return (
    <AppLayout title="Data & Account Lifecycle" description="Export personal data, retention, dan delete account.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Data" title="Data tools untuk export dan lifecycle akun." description="User bisa membuat export personal data dan menjalankan delete account flow dengan confirmation yang aman.">
          <Button to="/exports/new"><AppIcon name="export" /> Create Export</Button>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}><AppIcon name="delete" /> Delete Account</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="download" title="Personal Data Export" description="Export semua data penting dari module Affluena.">
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Personal data export job created. Open Export Center to download when ready.'); }}>
              <div className="form-two">
                <label><span>Export scope</span><Select defaultValue="all"><option value="all">All personal finance data</option><option value="transactions">Transactions only</option><option value="audit">Activity and API logs</option></Select></label>
                <label><span>Format</span><Select defaultValue="csv"><option value="csv">CSV bundle</option><option value="json">JSON archive</option></Select></label>
              </div>
              <div className="form-two">
                <label><span>Date range</span><Select defaultValue="all-time"><option value="all-time">All time</option><option value="this-year">This year</option><option value="custom">Custom range</option></Select></label>
                <label><span>Delivery</span><Select defaultValue="download-center"><option value="download-center">Export Center</option><option value="email-link">Email secure link</option></Select></label>
              </div>
              <Button type="submit" variant="primary"><AppIcon name="download" /> Generate Export</Button>
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
          <form className="form-stack" onSubmit={(event) => { event.preventDefault(); setDeleteOpen(false); showToast('Account deletion request created with 7-day recovery window.'); }}>
            <label><span>Confirmation</span><Input value={confirmText} onChange={(event) => setConfirmText(event.target.value)} /></label>
            <div className="modal-actions"><Button onClick={() => setDeleteOpen(false)}>Cancel</Button><Button type="submit" variant="danger" disabled={confirmText !== 'DELETE'}><AppIcon name="delete" /> Confirm Delete</Button></div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
