import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { useWallets } from '../../hooks/useWallets';
import { useCategories } from '../../hooks/useCategories';

export function TransactionFilterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Filter applied successfully.');
    navigate('/transactions');
  };

  return (
    <AppLayout title="Transaction Filter" description="Advanced filters for transaction search and reporting.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Advanced filter</span>
            <h2>Cari transaksi berdasarkan periode, type, wallet, category, tags, dan amount.</h2>
            <p>Filter ini nanti bisa dipakai sebagai base export CSV dan analytics drilldown.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/transactions">Back</Button>
            <Button variant="primary" onClick={handleApply}>Apply Filter</Button>
          </div>
        </section>
        <Card className="panel-card">
          <div className="panel-head">
            <div><h3>Filter Criteria</h3><p>Form advanced filter.</p></div>
          </div>
          <form className="form-stack" onSubmit={handleApply}>
            <div className="form-two">
              <label>
                <span>Keyword</span>
                <Input placeholder="Search note/title" />
              </label>
              <label>
                <span>Type</span>
                <Select>
                  <option value="">All types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="transfer">Transfer</option>
                  <option value="adjustment">Adjustment</option>
                </Select>
              </label>
            </div>
            <div className="form-two">
              <label>
                <span>Date From</span>
                <Input type="date" />
              </label>
              <label>
                <span>Date To</span>
                <Input type="date" />
              </label>
            </div>
            <div className="form-two">
              <label>
                <span>Wallet</span>
                <Select>
                  <option value="">All wallets</option>
                  {walletsData?.wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </Select>
              </label>
              <label>
                <span>Category</span>
                <Select>
                  <option value="">All categories</option>
                  {categoriesData?.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </label>
            </div>
            <div className="form-two">
              <label>
                <span>Min Amount</span>
                <Input placeholder="Rp 0" type="number" />
              </label>
              <label>
                <span>Max Amount</span>
                <Input placeholder="Rp 10.000.000" type="number" />
              </label>
            </div>
            <div className="form-row-between">
              <Button type="reset">Reset</Button>
              <Button type="submit" variant="primary">Apply Filter</Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
