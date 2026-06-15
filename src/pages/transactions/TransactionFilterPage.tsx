import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

export function TransactionFilterPage() {
  const { showToast } = useToast();
  return (
    <AppLayout title="Transaction Filter" description="Advanced filters for transaction search and reporting.">
      <div className="dashboard-page grid-stack"><section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Advanced filter</span><h2>Cari transaksi berdasarkan periode, type, wallet, category, tags, dan amount.</h2><p>Filter ini nanti bisa dipakai sebagai base export CSV dan analytics drilldown.</p></div><div className="app-hero-actions"><Button to="/transactions">Back</Button><Button variant="primary" onClick={() => showToast('Filter applied successfully.')}>Apply Filter</Button></div></section><Card className="panel-card"><div className="panel-head"><div><h3>Filter Criteria</h3><p>Form advanced filter.</p></div></div><form className="form-stack" onSubmit={(e) => { e.preventDefault(); showToast('Filter applied successfully.'); }}><div className="form-two"><label><span>Keyword</span><Input placeholder="Search note/title" /></label><label><span>Type</span><Select><option>All types</option><option>Income</option><option>Expense</option><option>Transfer</option><option>Adjustment</option></Select></label></div><div className="form-two"><label><span>Date From</span><Input type="date" defaultValue="2026-06-01" /></label><label><span>Date To</span><Input type="date" defaultValue="2026-06-30" /></label></div><div className="form-two"><label><span>Wallet</span><Select><option>All wallets</option><option>Bank BCA</option><option>Cash Wallet</option><option>OVO</option></Select></label><label><span>Category</span><Select><option>All categories</option><option>Food & Drink</option><option>Transportation</option><option>Salary</option></Select></label></div><div className="form-two"><label><span>Min Amount</span><Input placeholder="Rp 0" /></label><label><span>Max Amount</span><Input placeholder="Rp 10.000.000" /></label></div><div className="form-row-between"><Button to="/transactions">Reset</Button><Button type="submit" variant="primary">Apply Filter</Button></div></form></Card></div>
    </AppLayout>
  );
}
