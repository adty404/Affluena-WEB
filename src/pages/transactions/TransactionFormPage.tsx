import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { BalanceDeltaPreview } from '../../components/transactions/BalanceDeltaPreview';
import { mockWallets } from '../../data/mockWallets';
import { flatCategories } from '../../data/mockCategories';

export function TransactionFormPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const isEdit = Boolean(id);

  return (
    <AppLayout title={isEdit ? 'Edit Transaction' : 'New Transaction'} description="Create income or expense transaction with category and tags.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Income / Expense</span><h2>{isEdit ? 'Update transaction dengan reverse old delta lalu apply new delta.' : 'Buat income atau expense transaction.'}</h2><p>Form ini memakai wallet, category, amount, note, dan multiple tags dengan preview balance delta yang jelas.</p></div>
          <div className="app-hero-actions"><Button to="/transactions">Back</Button><Button variant="primary" onClick={() => showToast('Transaction saved successfully.')}>Save</Button></div>
        </section>
        <section className="dashboard-grid transaction-entry-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Transaction Information</h3><p>Pilih type, wallet, category, dan amount.</p></div></div>
            <form className="form-stack" onSubmit={(e) => { e.preventDefault(); showToast('Transaction saved successfully.'); }}>
              <div className="form-two"><label><span>Type</span><Select defaultValue="expense"><option value="expense">Expense</option><option value="income">Income</option></Select></label><label><span>Wallet</span><Select>{mockWallets.map((wallet) => <option key={wallet.id}>{wallet.name}</option>)}</Select></label></div>
              <div className="form-two"><label><span>Category</span><Select>{flatCategories.slice(0, 8).map((cat) => <option key={cat.id}>{cat.name}</option>)}</Select></label><label><span>Amount</span><Input defaultValue="Rp 450.000" /></label></div>
              <div className="form-two"><label><span>Date</span><Input type="datetime-local" defaultValue="2026-06-14T09:20" /></label><label><span>Tags</span><Input defaultValue="family, monthly" /></label></div>
              <label><span>Note</span><Textarea defaultValue="Monthly groceries and household supplies." /></label>
              <div className="form-row-between"><Button to="/transactions">Cancel</Button><Button type="submit" variant="primary">Save Transaction</Button></div>
            </form>
          </Card>
          <BalanceDeltaPreview title="Wallet Balance Preview" before={12500000} delta={-450000} after={12050000} description="Expense mengurangi saldo wallet setelah transaction posted." />
        </section>
      </div>
    </AppLayout>
  );
}
