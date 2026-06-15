import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { mockWallets } from '../../data/mockWallets';

export function SubscriptionFormPage() {
  const { showToast } = useToast();
  return (
    <AppLayout title="Add Subscription" description="Create subscription with renewal cycle and reminder.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Subscription Form</span><h2>Buat langganan dengan renewal cycle dan reminder.</h2><p>Data subscription masuk ke tracker dan monthly burn summary.</p></div><div className="app-hero-actions"><Button to="/subscriptions">Back</Button><Button variant="primary" onClick={() => showToast('Subscription saved.')}>Save</Button></div></section>
        <section className="form-detail-grid"><Card className="panel-card"><div className="panel-head"><div><h3>Subscription Information</h3><p>Service, wallet, cycle, renewal, dan action behavior.</p></div></div><form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Subscription saved.'); }}><div className="form-two"><label><span>Name</span><Input defaultValue="Netflix" /></label><label><span>Wallet</span><Select>{mockWallets.map((wallet) => <option key={wallet.id}>{wallet.name}</option>)}</Select></label></div><div className="form-three"><label><span>Amount</span><Input defaultValue="Rp 186.000" /></label><label><span>Cycle</span><Select><option>Monthly</option><option>Quarterly</option><option>Yearly</option></Select></label><label><span>Status</span><Select><option>Active</option><option>Paused</option><option>Cancelled</option></Select></label></div><div className="form-two"><label><span>Next Renewal</span><Input type="date" defaultValue="2026-06-19" /></label><label><span>Reminder</span><Select><option>H-3, H-1, renewal day</option><option>H-7, H-3, renewal day</option></Select></label></div><div className="form-two"><label><span>Category</span><Select><option>Entertainment</option><option>Productivity</option><option>Storage</option></Select></label><label><span>Transaction Behavior</span><Select><option>Ask before renewal</option><option>Auto-create transaction</option></Select></label></div><label><span>Note</span><Textarea defaultValue="Streaming subscription paid monthly." /></label><div className="form-row-between"><Button to="/subscriptions">Cancel</Button><Button type="submit" variant="primary"><AppIcon name="save" /> Save Subscription</Button></div></form></Card><Card className="panel-card side-metrics-card"><div className="panel-head"><div><h3>Renewal Preview</h3><p>Pengaruh subscription pada monthly burn.</p></div></div><div className="metric-list"><div><span>Monthly amount</span><strong><Amount value={186000} type="expense" /></strong></div><div><span>Next renewal</span><strong>19 Jun 2026</strong></div><div><span>Reminder</span><strong>H-3, H-1, renewal day</strong></div></div></Card></section>
      </div>
    </AppLayout>
  );
}
