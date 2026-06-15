import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { mockRecurringRules } from '../../data/mockRecurring';

export function RecurringRunPage() {
  const { id } = useParams();
  const rule = mockRecurringRules.find((item) => item.id === id) ?? mockRecurringRules[0];
  const { showToast } = useToast();

  return (
    <AppLayout title="Manual Run" description="Execute one recurring rule manually with confirmation preview.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Manual Run</span><h2>Jalankan {rule.title} secara manual.</h2><p>Manual run membuat transaksi dari rule yang sama dan menyimpan run history.</p></div><div className="app-hero-actions"><Button to={`/recurring/${rule.id}`}>Back</Button><Button variant="primary" onClick={() => showToast('Recurring rule executed and run history created.')}><AppIcon name="run" /> Execute Now</Button></div></section>
        <section className="form-detail-grid"><Card className="panel-card"><div className="panel-head"><div><h3>Run Confirmation</h3><p>Review data sebelum manual execution.</p></div></div><form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Recurring rule executed and run history created.'); }}><div className="form-two"><label><span>Rule</span><Input defaultValue={rule.title} readOnly /></label><label><span>Run Date</span><Input type="datetime-local" defaultValue="2026-06-14T17:00" /></label></div><div className="form-two"><label><span>Wallet</span><Input defaultValue={rule.walletName} readOnly /></label><label><span>Amount</span><Input defaultValue={`Rp ${rule.amount.toLocaleString('id-ID')}`} /></label></div><div className="form-two"><label><span>Execution Mode</span><Select><option>Create transaction now</option><option>Dry run validation only</option></Select></label><label><span>Duplicate Guard</span><Select><option>Block if same schedule already ran</option><option>Allow manual duplicate</option></Select></label></div><label><span>Run Note</span><Textarea defaultValue="Manual run requested by user from recurring detail page." /></label><div className="form-row-between"><Button to={`/recurring/${rule.id}`}>Cancel</Button><Button type="submit" variant="primary"><AppIcon name="run" /> Execute Rule</Button></div></form></Card><Card className="panel-card side-metrics-card"><div className="panel-head"><div><h3>Transaction Preview</h3><p>Dampak run terhadap wallet.</p></div></div><div className="metric-list"><div><span>Type</span><strong>{rule.type}</strong></div><div><span>Amount</span><strong><Amount value={rule.amount} type={rule.type === 'income' ? 'income' : 'expense'} /></strong></div><div><span>Wallet</span><strong>{rule.walletName}</strong></div><div><span>History result</span><strong>success / failed / skipped</strong></div></div></Card></section>
      </div>
    </AppLayout>
  );
}
