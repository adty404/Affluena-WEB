import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { BalanceDeltaPreview } from '../../components/transactions/BalanceDeltaPreview';
import { mockWallets } from '../../data/mockWallets';

export function TransferPage() {
  const { showToast } = useToast();
  return (
    <AppLayout title="Transfer Wallet" description="Move money between wallets without category.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Transfer</span><h2>Transfer mengurangi source wallet dan menambah destination wallet.</h2><p>From wallet dan To wallet tidak boleh sama. Transfer tidak memakai category.</p></div><div className="app-hero-actions"><Button to="/transactions">Back</Button><Button variant="primary" onClick={() => showToast('Transfer saved successfully.')}>Save Transfer</Button></div></section>
        <section className="dashboard-grid transaction-entry-grid">
          <Card className="panel-card"><div className="panel-head"><div><h3>Transfer Information</h3><p>Wallet source, destination, amount, dan note.</p></div></div><form className="form-stack" onSubmit={(e) => { e.preventDefault(); showToast('Transfer saved successfully.'); }}><div className="form-two"><label><span>From Wallet</span><Select>{mockWallets.map((wallet) => <option key={wallet.id}>{wallet.name}</option>)}</Select></label><label><span>To Wallet</span><Select defaultValue="OVO">{mockWallets.map((wallet) => <option key={wallet.id}>{wallet.name}</option>)}</Select></label></div><div className="form-two"><label><span>Amount</span><Input defaultValue="Rp 500.000" /></label><label><span>Date</span><Input type="datetime-local" defaultValue="2026-06-14T13:00" /></label></div><label><span>Note</span><Textarea defaultValue="Top up e-wallet for commute and daily spending." /></label><div className="form-row-between"><Button to="/transactions">Cancel</Button><Button type="submit" variant="primary">Save Transfer</Button></div></form></Card>
          <div className="grid-stack"><BalanceDeltaPreview title="Source Wallet" before={12500000} delta={-500000} after={12000000} description="Source wallet berkurang." /><BalanceDeltaPreview title="Destination Wallet" before={720000} delta={500000} after={1220000} description="Destination wallet bertambah." /></div>
        </section>
      </div>
    </AppLayout>
  );
}
