import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { mockDebts } from '../../data/mockDebtTracker';
import { mockWallets } from '../../data/mockWallets';

export function DebtPaymentPage() {
  const { id } = useParams();
  const debt = mockDebts.find((item) => item.id === id) ?? mockDebts[0];
  const { showToast } = useToast();
  const samplePayment = Math.min(1500000, debt.remainingAmount);
  const remainingAfter = debt.remainingAmount - samplePayment;

  return (
    <AppLayout title="Pay Debt" description="Record payable payment or receivable collection with wallet effect.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Payment</span><h2>{debt.type === 'payable' ? 'Bayar utang dan kurangi saldo wallet.' : 'Terima pembayaran piutang dan tambah saldo wallet.'}</h2><p>Payment otomatis memperbarui remaining balance dan bisa membuat linked transaction.</p></div>
          <div className="app-hero-actions"><Button to={`/debts/${debt.id}`}>Back</Button><Button variant="primary" onClick={() => showToast('Debt payment recorded and linked transaction prepared.')}><AppIcon name="pay" /> Confirm Payment</Button></div>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Payment Information</h3><p>Amount, wallet, dan linked transaction behavior.</p></div></div>
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Debt payment recorded and linked transaction prepared.'); }}>
              <div className="form-two"><label><span>Debt</span><Select defaultValue={debt.id}>{mockDebts.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</Select></label><label><span>Payment Date</span><Input type="datetime-local" defaultValue="2026-06-14T15:30" /></label></div>
              <div className="form-two"><label><span>Wallet</span><Select>{mockWallets.map((wallet) => <option key={wallet.id}>{wallet.name}</option>)}</Select></label><label><span>Payment Amount</span><Input defaultValue={`Rp ${samplePayment.toLocaleString('id-ID')}`} /></label></div>
              <div className="form-two"><label><span>Linked Transaction</span><Select><option>Create transaction automatically</option><option>Link existing transaction</option><option>Payment only</option></Select></label><label><span>Category</span><Select><option>{debt.type === 'payable' ? 'Debt Payment' : 'Loan Collection'}</option><option>Other</option></Select></label></div>
              <label><span>Note</span><Textarea defaultValue={`Payment for ${debt.title}.`} /></label>
              <div className="form-row-between"><Button to={`/debts/${debt.id}`}>Cancel</Button><Button type="submit" variant="primary"><AppIcon name="pay" /> Record Payment</Button></div>
            </form>
          </Card>

          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Payment Preview</h3><p>Saldo dan remaining balance setelah submit.</p></div></div>
            <div className="metric-list payment-preview-list">
              <div><span>Remaining Before</span><strong><Amount value={debt.remainingAmount} /></strong></div>
              <div><span>Payment</span><strong><Amount value={samplePayment} type={debt.type === 'payable' ? 'expense' : 'income'} /></strong></div>
              <div><span>Remaining After</span><strong><Amount value={remainingAfter} /></strong></div>
              <div><span>Wallet Effect</span><strong>{debt.type === 'payable' ? 'Wallet decreases' : 'Wallet increases'}</strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
