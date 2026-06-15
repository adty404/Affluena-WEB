import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { mockSplitParticipants } from '../../data/mockTransactions';

export function SplitBillPage() {
  const { showToast } = useToast();
  const [participantOpen, setParticipantOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const total = 960000;
  const receivable = mockSplitParticipants.reduce((sum, item) => sum + item.shareAmount, 0);
  const userShare = total - receivable;

  return (
    <AppLayout title="Split Bill" description="Create one expense transaction and receivable debts for participants.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Split Bill</span><h2>Split bill harus atomic: expense berhasil, receivable debt juga harus berhasil.</h2><p>Jika debt creation gagal, semua write sebaiknya rollback. UI menampilkan total bill, user share, participant share, dan receivable total.</p></div><div className="app-hero-actions"><Button to="/transactions">Back</Button><Button variant="primary" onClick={() => setConfirmOpen(true)}><AppIcon name="split" /> Create Split Bill</Button></div></section>
        <section className="stat-grid"><Card className="stat-card"><span>Total Bill</span><strong><Amount value={total} variant="expense" /></strong><small>Dinner bill</small></Card><Card className="stat-card blue"><span>User Share</span><strong><Amount value={userShare} variant="expense" /></strong><small>Final expense</small></Card><Card className="stat-card purple"><span>Receivable</span><strong><Amount value={receivable} variant="income" /></strong><small>Created as debt</small></Card><Card className="stat-card orange"><span>Participants</span><strong>{mockSplitParticipants.length}</strong><small>Team members</small></Card></section>
        <section className="dashboard-grid transaction-entry-grid"><Card className="panel-card"><div className="panel-head"><div><h3>Bill Information</h3><p>Expense transaction source.</p></div></div><form className="form-stack"><div className="form-two"><label><span>Wallet</span><Select><option>Bank BCA</option><option>Cash Wallet</option></Select></label><label><span>Category</span><Select><option>Food & Drink</option><option>Entertainment</option></Select></label></div><div className="form-two"><label><span>Total Amount</span><Input defaultValue="Rp 960.000" /></label><label><span>Date</span><Input type="datetime-local" defaultValue="2026-06-11T20:10" /></label></div><label><span>Note</span><Textarea defaultValue="Team dinner split bill." /></label></form></Card><Card className="panel-card"><div className="panel-head"><div><h3>Participants</h3><p>Receivable debt per participant.</p></div><Button size="small" onClick={() => setParticipantOpen(true)}><AppIcon name="add" /> Add</Button></div><div className="participant-list">{mockSplitParticipants.map((item) => <div key={item.id} className="participant-row"><div><strong>{item.name}</strong><span>{item.contact}</span></div><Amount value={item.shareAmount} variant="income" /><Badge tone={item.status === 'paid' ? 'green' : item.status === 'reminded' ? 'orange' : 'blue'}>{item.status}</Badge></div>)}</div></Card></section>
      </div>

      <Modal open={participantOpen} title="Add Participant" description="Tambahkan participant dan share amount untuk receivable debt." onClose={() => setParticipantOpen(false)}>
        <form className="form-stack" onSubmit={(event) => { event.preventDefault(); setParticipantOpen(false); showToast('Participant added to split bill.'); }}>
          <div className="form-two"><label><span>Name</span><Input placeholder="Participant name" /></label><label><span>Email / Contact</span><Input placeholder="friend@example.com" /></label></div>
          <label><span>Share Amount</span><Input defaultValue="Rp 240.000" /></label>
          <div className="modal-actions"><Button onClick={() => setParticipantOpen(false)}>Cancel</Button><Button type="submit" variant="primary">Add Participant</Button></div>
        </form>
      </Modal>

      <Modal open={confirmOpen} title="Create Split Bill" description="Review atomic write plan sebelum split bill dibuat." onClose={() => setConfirmOpen(false)}>
        <div className="readiness-list"><div><span>Expense transaction</span><strong><Amount value={userShare} variant="expense" /></strong></div><div><span>Receivable debts</span><strong><Amount value={receivable} variant="income" /></strong></div><div><span>Participants</span><strong>{mockSplitParticipants.length} people</strong></div><div><span>Rollback rule</span><strong>Cancel all writes if one fails</strong></div></div>
        <div className="modal-actions"><Button onClick={() => setConfirmOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => { setConfirmOpen(false); showToast('Split bill created successfully.'); }}>Confirm Split Bill</Button></div>
      </Modal>
    </AppLayout>
  );
}
