import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { mockSubscriptions } from '../../data/mockDebtTracker';
import { mockWallets } from '../../data/mockWallets';

export function SubscriptionPaymentPage() {
  const { id } = useParams();
  const item = mockSubscriptions.find((subscription) => subscription.id === id) ?? mockSubscriptions[0];
  const { showToast } = useToast();

  return (
    <AppLayout title="Pay Subscription" description="Record renewal payment and create transaction.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Subscription Payment</span><h2>Bayar {item.name} dan update renewal schedule.</h2><p>Payment akan membuat expense transaction dan memindahkan next renewal sesuai cycle.</p></div><div className="app-hero-actions"><Button to="/subscriptions">Back</Button><Button variant="primary" onClick={() => showToast('Subscription payment recorded.')}>Confirm Payment</Button></div></section>
        <section className="form-detail-grid"><Card className="panel-card"><div className="panel-head"><div><h3>Payment Information</h3><p>Wallet, amount, renewal date, dan linked transaction.</p></div></div><form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Subscription payment recorded.'); }}><div className="form-two"><label><span>Subscription</span><Select defaultValue={item.id}>{mockSubscriptions.map((sub) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}</Select></label><label><span>Payment Date</span><Input type="datetime-local" defaultValue="2026-06-14T16:30" /></label></div><div className="form-two"><label><span>Wallet</span><Select>{mockWallets.map((wallet) => <option key={wallet.id}>{wallet.name}</option>)}</Select></label><label><span>Amount</span><Input defaultValue={`Rp ${item.amount.toLocaleString('id-ID')}`} /></label></div><div className="form-two"><label><span>Category</span><Select><option>{item.categoryName}</option><option>Subscription</option></Select></label><label><span>Linked Transaction</span><Select><option>Create expense transaction</option><option>Payment only</option></Select></label></div><label><span>Note</span><Textarea defaultValue={`Renewal payment for ${item.name}.`} /></label><div className="form-row-between"><Button to="/subscriptions">Cancel</Button><Button type="submit" variant="primary"><AppIcon name="pay" /> Pay Subscription</Button></div></form></Card><Card className="panel-card side-metrics-card"><div className="panel-head"><div><h3>Renewal After Payment</h3><p>Schedule berikutnya setelah submit.</p></div></div><div className="metric-list"><div><span>Amount</span><strong><Amount value={item.amount} type="expense" /></strong></div><div><span>Current renewal</span><strong>{item.nextRenewalDate}</strong></div><div><span>Next cycle</span><strong>{item.cycle}</strong></div><div><span>Wallet effect</span><strong>Wallet decreases</strong></div></div></Card></section>
      </div>
    </AppLayout>
  );
}
