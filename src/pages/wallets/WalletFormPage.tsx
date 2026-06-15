import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { mockWallets } from '../../data/mockWallets';

export function WalletFormPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const wallet = mockWallets.find((item) => item.id === id) ?? mockWallets[0];
  const isEdit = Boolean(id);

  return (
    <AppLayout title={isEdit ? 'Edit Wallet' : 'Create Wallet'} description="Create atau edit wallet dengan type, balance, dan sharing mode.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Wallet Form</span><h2>{isEdit ? `Edit ${wallet.name}` : 'Buat wallet baru dengan struktur data yang siap dipakai transaksi.'}</h2><p>Balance menggunakan minor unit di backend. Form ini memberi preview dan validasi UX sebelum data dikirim.</p></div>
          <div className="app-hero-actions"><Button to="/wallets"><AppIcon name="back" /> Back</Button><Button variant="primary" onClick={() => showToast('Wallet saved successfully.') }><AppIcon name="save" /> Save Wallet</Button></div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Wallet Information</h3><p>Field utama wallets table.</p></div></div>
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Wallet berhasil disimpan.'); }}>
              <div className="form-two"><label><span>Wallet name</span><Input defaultValue={wallet.name} /></label><label><span>Wallet type</span><Select defaultValue={wallet.type}><option value="cash">Cash</option><option value="bank">Bank</option><option value="e_wallet">E-Wallet</option><option value="investment">Investment</option><option value="goal">Goal Wallet</option></Select></label></div>
              <div className="form-two"><label><span>Opening balance</span><Input defaultValue={`Rp ${wallet.balance.toLocaleString('id-ID')}`} /></label><label><span>Color</span><Select defaultValue={wallet.color}><option value="green">Green</option><option value="blue">Blue</option><option value="purple">Purple</option><option value="orange">Orange</option></Select></label></div>
              <div className="form-two"><label><span>Sharing mode</span><Select defaultValue={wallet.isShared ? 'shared' : 'private'}><option value="private">Private</option><option value="shared">Shared</option></Select></label><label><span>Status</span><Select defaultValue="active"><option>active</option><option>archived</option></Select></label></div>
              <label><span>Description</span><Textarea defaultValue={wallet.description} /></label>
              <div className="form-row-between"><Button to="/wallets">Cancel</Button><div className="inline-actions"><Button variant="danger" onClick={() => setDeleteOpen(true)}><AppIcon name="delete" /> Delete</Button><Button type="submit" variant="primary"><AppIcon name="save" /> Save Wallet</Button></div></div>
            </form>
          </Card>
          <Card className="panel-card"><div className="panel-head"><div><h3>Guardrails</h3><p>Validation note untuk implementasi API nanti.</p></div></div><div className="readiness-list"><div><span>Balance consistency</span><strong>Required</strong></div><div><span>User isolation</span><strong>Required</strong></div><div><span>Wallet sharing status</span><strong>pending / joined / rejected</strong></div><div><span>Delete wallet</span><strong>confirmation required</strong></div></div></Card>
        </section>
      </div>

      <Modal open={deleteOpen} title="Delete Wallet" description="Konfirmasi sebelum wallet dihapus atau diarsipkan." onClose={() => setDeleteOpen(false)}>
        <div className="readiness-list"><div><span>Wallet</span><strong>{wallet.name}</strong></div><div><span>Balance</span><strong>Rp {wallet.balance.toLocaleString('id-ID')}</strong></div><div><span>Recommendation</span><strong>Archive if it has transactions</strong></div></div>
        <div className="modal-actions"><Button onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="danger" onClick={() => { setDeleteOpen(false); showToast('Wallet archived safely.'); }}>Archive Wallet</Button></div>
      </Modal>
    </AppLayout>
  );
}
