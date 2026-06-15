import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { mockWallets } from '../../data/mockWallets';

export function WalletSharingPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const [inviteOpen, setInviteOpen] = useState(false);
  const wallet = mockWallets.find((item) => item.id === id) ?? mockWallets[2];

  function submitInvite() {
    setInviteOpen(true);
    showToast('Invite prepared and ready to send.');
  }

  return (
    <AppLayout title="Wallet Sharing" description="Invite members and manage wallet sharing permissions.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Sharing</span><h2>Kelola akses untuk {wallet.name}</h2><p>Status member mendukung pending, joined, dan rejected. Role dapat owner, editor, atau viewer.</p></div><div className="app-hero-actions"><Button to={`/wallets/${wallet.id}`}>Back to Detail</Button><Button variant="primary" onClick={() => setInviteOpen(true)}><AppIcon name="add" /> New Invite</Button></div></section>
        <section className="dashboard-grid"><Card className="panel-card"><div className="panel-head"><div><h3>Members</h3><p>Member yang punya akses ke wallet.</p></div></div><div className="member-list">{wallet.members.map((member) => <div className="member-row" key={member.id}><div className="avatar">{member.name.slice(0,2).toUpperCase()}</div><div><strong>{member.name}</strong><span>{member.email} · {member.role}</span></div><Badge tone={member.status === 'joined' ? 'green' : member.status === 'pending' ? 'orange' : 'red'}>{member.status}</Badge></div>)}</div></Card><Card className="panel-card"><div className="panel-head"><div><h3>Invite Member</h3><p>Undang user sebagai viewer atau editor.</p></div></div><form className="form-stack" onSubmit={(event) => { event.preventDefault(); submitInvite(); }}><label><span>Email</span><Input placeholder="friend@example.com" /></label><label><span>Role</span><Select><option>viewer</option><option>editor</option></Select></label><Button type="submit" variant="primary" full><AppIcon name="save" /> Prepare Invite</Button></form></Card></section>
      </div>

      <Modal open={inviteOpen} title="Invite Preview" description="Preview invitation sebelum dikirim ke member." onClose={() => setInviteOpen(false)}>
        <div className="readiness-list"><div><span>Wallet</span><strong>{wallet.name}</strong></div><div><span>Access</span><strong>Viewer / Editor selectable</strong></div><div><span>Status after send</span><strong>pending</strong></div></div>
        <div className="modal-actions"><Button onClick={() => setInviteOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => { setInviteOpen(false); showToast('Invite sent successfully.'); }}>Send Invite</Button></div>
      </Modal>
    </AppLayout>
  );
}
