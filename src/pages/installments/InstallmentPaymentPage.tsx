import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { mockInstallments } from '../../data/mockDebtTracker';
import { mockWallets } from '../../data/mockWallets';

export function InstallmentPaymentPage() {
  const { id } = useParams();
  const item = mockInstallments.find((installment) => installment.id === id) ?? mockInstallments[0];
  const { showToast } = useToast();

  return (
    <AppLayout title="Pay Installment" description="Record installment payment and advance paid tenor.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Installment Payment</span><h2>Bayar {item.name} dan update progress tenor.</h2><p>Payment akan membuat expense transaction dan menambah paid count.</p></div><div className="app-hero-actions"><Button to="/installments">Back</Button><Button variant="primary" onClick={() => showToast('Installment payment recorded.')}>Confirm Payment</Button></div></section>
        <section className="form-detail-grid">
          <Card className="panel-card"><div className="panel-head"><div><h3>Payment Information</h3><p>Wallet, amount, due date, dan linked transaction.</p></div></div><form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Installment payment recorded.'); }}><div className="form-two"><label><span>Installment</span><Select defaultValue={item.id}>{mockInstallments.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</Select></label><label><span>Payment Date</span><Input type="datetime-local" defaultValue="2026-06-14T16:00" /></label></div><div className="form-two"><label><span>Wallet</span><Select>{mockWallets.map((wallet) => <option key={wallet.id}>{wallet.name}</option>)}</Select></label><label><span>Amount</span><Input defaultValue={`Rp ${item.monthlyAmount.toLocaleString('id-ID')}`} /></label></div><div className="form-two"><label><span>Category</span><Select><option>{item.categoryName}</option><option>Installment Payment</option></Select></label><label><span>Linked Transaction</span><Select><option>Create expense transaction</option><option>Mark paid without transaction</option></Select></label></div><label><span>Note</span><Textarea defaultValue={`Payment for ${item.name}.`} /></label><div className="form-row-between"><Button to="/installments">Cancel</Button><Button type="submit" variant="primary"><AppIcon name="pay" /> Pay Installment</Button></div></form></Card>
          <Card className="panel-card side-metrics-card"><div className="panel-head"><div><h3>Progress After Payment</h3><p>Tenor dan outstanding setelah submit.</p></div></div><div className="metric-list"><div><span>Paid Count</span><strong>{item.paidCount} → {Math.min(item.paidCount + 1, item.totalTenor)}</strong></div><div><span>Remaining Principal</span><strong><Amount value={Math.max(0, item.remainingPrincipal - item.monthlyAmount)} /></strong></div><div><span>Wallet Effect</span><strong><Amount value={item.monthlyAmount} type="expense" /></strong></div></div></Card>
        </section>
      </div>
    </AppLayout>
  );
}
