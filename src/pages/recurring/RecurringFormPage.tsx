import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { mockWallets } from '../../data/mockWallets';
import { flatCategories } from '../../data/mockCategories';
import { mockRecurringRules } from '../../data/mockRecurring';

export function RecurringFormPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const existing = mockRecurringRules.find((rule) => rule.id === id);
  const isEdit = Boolean(existing);

  return (
    <AppLayout title={isEdit ? 'Edit Recurring Rule' : 'Add Recurring Rule'} description="Configure frequency, wallet, category, amount, and status.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Recurring Rule</span><h2>{isEdit ? 'Update rule dengan status dan next run yang jelas.' : 'Buat transaksi otomatis yang tetap bisa dikontrol manual.'}</h2><p>Rule tidak langsung menyentuh backend. UI ini menyiapkan struktur caldate dan run scheduler.</p></div><div className="app-hero-actions"><Button to="/recurring">Back</Button><Button variant="primary" onClick={() => showToast('Recurring rule saved.')}>Save Rule</Button></div></section>
        <section className="form-detail-grid"><Card className="panel-card"><div className="panel-head"><div><h3>Rule Information</h3><p>Semua field utama recurring transaction.</p></div></div><form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Recurring rule saved.'); }}><div className="form-two"><label><span>Title</span><Input defaultValue={existing?.title ?? 'Monthly Salary'} /></label><label><span>Type</span><Select defaultValue={existing?.type ?? 'income'}><option value="income">Income</option><option value="expense">Expense</option><option value="transfer">Transfer</option></Select></label></div><div className="form-two"><label><span>Wallet</span><Select defaultValue={existing?.walletName}>{mockWallets.map((wallet) => <option key={wallet.id}>{wallet.name}</option>)}</Select></label><label><span>Destination Wallet</span><Select defaultValue={existing?.destinationWalletName ?? ''}><option value="">Not used</option>{mockWallets.map((wallet) => <option key={wallet.id}>{wallet.name}</option>)}</Select></label></div><div className="form-two"><label><span>Category</span><Select defaultValue={existing?.categoryName}>{flatCategories.slice(0, 8).map((category) => <option key={category.id}>{category.name}</option>)}</Select></label><label><span>Amount</span><Input defaultValue={`Rp ${(existing?.amount ?? 14500000).toLocaleString('id-ID')}`} /></label></div><div className="form-three"><label><span>Frequency</span><Select defaultValue={existing?.frequency ?? 'monthly'}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></Select></label><label><span>Start Date</span><Input type="date" defaultValue={existing?.startDate ?? '2026-06-25'} /></label><label><span>Status</span><Select defaultValue={existing?.status ?? 'active'}><option value="active">Active</option><option value="paused">Paused</option><option value="cancelled">Cancelled</option></Select></label></div><label><span>Note</span><Textarea defaultValue={existing?.note ?? 'Auto-post this rule on the scheduled date.'} /></label><div className="form-row-between"><Button to="/recurring">Cancel</Button><Button type="submit" variant="primary"><AppIcon name="save" /> Save Rule</Button></div></form></Card><Card className="panel-card side-metrics-card"><div className="panel-head"><div><h3>Next Run Preview</h3><p>Preview scheduler sebelum disimpan.</p></div></div><div className="metric-list"><div><span>Next run</span><strong>{existing?.nextRunDate ?? '2026-06-25'}</strong></div><div><span>Estimated amount</span><strong><Amount value={existing?.amount ?? 14500000} type={(existing?.type ?? 'income') === 'income' ? 'income' : 'expense'} /></strong></div><div><span>Status behavior</span><strong>Active runs automatically, paused skips safely.</strong></div></div></Card></section>
      </div>
    </AppLayout>
  );
}
