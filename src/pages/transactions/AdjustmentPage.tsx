import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { BalanceDeltaPreview } from '../../components/transactions/BalanceDeltaPreview';
import { mockWallets } from '../../data/mockWallets';

export function AdjustmentPage() {
  const { showToast } = useToast();
  return (
    <AppLayout title="Balance Adjustment" description="Manual correction for wallet balance reconciliation.">
      <div className="dashboard-page grid-stack"><section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Adjustment</span><h2>Adjustment untuk koreksi saldo, bukan pengeluaran normal.</h2><p>Gunakan note/reason yang jelas karena adjustment memengaruhi balance langsung dan butuh audit trail.</p></div><div className="app-hero-actions"><Button to="/transactions">Back</Button><Button variant="primary" onClick={() => showToast('Adjustment saved successfully.')}>Save Adjustment</Button></div></section><section className="dashboard-grid transaction-entry-grid"><Card className="panel-card"><div className="panel-head"><div><h3>Adjustment Information</h3><p>Wallet, delta amount, dan reason.</p></div></div><form className="form-stack" onSubmit={(e) => { e.preventDefault(); showToast('Adjustment saved successfully.'); }}><div className="form-two"><label><span>Wallet</span><Select>{mockWallets.map((wallet) => <option key={wallet.id}>{wallet.name}</option>)}</Select></label><label><span>Adjustment Type</span><Select><option>Increase balance</option><option>Decrease balance</option></Select></label></div><div className="form-two"><label><span>Amount</span><Input defaultValue="Rp 125.000" /></label><label><span>Date</span><Input type="datetime-local" defaultValue="2026-06-14T18:00" /></label></div><label><span>Reason</span><Textarea defaultValue="Manual correction after cash reconciliation." /></label><div className="form-row-between"><Button to="/transactions">Cancel</Button><Button type="submit" variant="primary">Save Adjustment</Button></div></form></Card><BalanceDeltaPreview title="Adjustment Preview" before={2500000} delta={125000} after={2625000} description="Adjustment bisa positif atau negatif sesuai reconciliation." /></section></div>
    </AppLayout>
  );
}
