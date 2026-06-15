import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { mockWallets } from '../../data/mockWallets';

export function InstallmentFormPage() {
  const { showToast } = useToast();

  return (
    <AppLayout title="Add Installment" description="Create installment tracker with tenor, due day, and wallet.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Installment Form</span><h2>Buat tracker cicilan dengan jadwal pembayaran jelas.</h2><p>Installment membantu menjaga fixed outflow tetap terlihat di tracker dan dashboard.</p></div>
          <div className="app-hero-actions"><Button to="/installments">Back</Button><Button variant="primary" onClick={() => showToast('Installment saved.')}>Save</Button></div>
        </section>
        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Installment Information</h3><p>Monthly amount, tenor, paid count, dan due day.</p></div></div>
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Installment saved.'); }}>
              <div className="form-two"><label><span>Name</span><Input defaultValue="Car Installment" /></label><label><span>Wallet</span><Select>{mockWallets.map((wallet) => <option key={wallet.id}>{wallet.name}</option>)}</Select></label></div>
              <div className="form-three"><label><span>Monthly Amount</span><Input defaultValue="Rp 3.200.000" /></label><label><span>Total Tenor</span><Input type="number" defaultValue="36" /></label><label><span>Paid Count</span><Input type="number" defaultValue="15" /></label></div>
              <div className="form-two"><label><span>Start Date</span><Input type="date" defaultValue="2025-03-20" /></label><label><span>Due Day</span><Input type="number" min="1" max="31" defaultValue="20" /></label></div>
              <div className="form-two"><label><span>Category</span><Select><option>Vehicle</option><option>Electronics</option><option>Loan</option></Select></label><label><span>Reminder</span><Select><option>H-3, H-1, due date</option><option>H-7, H-3, due date</option></Select></label></div>
              <label><span>Note</span><Textarea defaultValue="Monthly installment tracked inside Affluena." /></label>
              <div className="form-row-between"><Button to="/installments">Cancel</Button><Button type="submit" variant="primary"><AppIcon name="save" /> Save Installment</Button></div>
            </form>
          </Card>
          <Card className="panel-card side-metrics-card"><div className="panel-head"><div><h3>Schedule Preview</h3><p>Perhitungan cicilan sebelum disimpan.</p></div></div><div className="metric-list"><div><span>Monthly payment</span><strong><Amount value={3200000} type="expense" /></strong></div><div><span>Remaining tenor</span><strong>21 months</strong></div><div><span>Next due</span><strong>20 Jun 2026</strong></div></div></Card>
        </section>
      </div>
    </AppLayout>
  );
}
