import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { mockWallets } from '../../data/mockWallets';
import { flatCategories } from '../../data/mockCategories';

export function QuickEntryFormPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const isEdit = Boolean(id);
  return (
    <AppLayout title={isEdit ? 'Edit Quick Entry' : 'New Quick Entry'} description="Create reusable transaction template.">
      <div className="dashboard-page grid-stack"><section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Quick Entry Form</span><h2>{isEdit ? 'Edit template transaksi rutin.' : 'Buat template transaksi rutin.'}</h2><p>Execute quick entry wajib memakai confirmation modal saat production.</p></div><div className="app-hero-actions"><Button to="/quick-entry">Back</Button><Button variant="primary" onClick={() => showToast('Quick entry template saved successfully.')}>Save Template</Button></div></section><Card className="panel-card"><div className="panel-head"><div><h3>Template Information</h3><p>Field template untuk transaksi cepat.</p></div></div><form className="form-stack" onSubmit={(e) => { e.preventDefault(); showToast('Quick entry template saved successfully.'); }}><div className="form-two"><label><span>Name</span><Input defaultValue="Daily Lunch" /></label><label><span>Type</span><Select defaultValue="expense"><option value="expense">Expense</option><option value="income">Income</option></Select></label></div><div className="form-two"><label><span>Wallet</span><Select>{mockWallets.map((wallet) => <option key={wallet.id}>{wallet.name}</option>)}</Select></label><label><span>Category</span><Select>{flatCategories.slice(0, 8).map((cat) => <option key={cat.id}>{cat.name}</option>)}</Select></label></div><div className="form-two"><label><span>Amount</span><Input defaultValue="Rp 45.000" /></label><label><span>Tags</span><Input defaultValue="daily, office" /></label></div><label><span>Note</span><Textarea defaultValue="Lunch at office." /></label><div className="form-row-between"><Button to="/quick-entry">Cancel</Button><Button type="submit" variant="primary">Save Template</Button></div></form></Card></div>
    </AppLayout>
  );
}
