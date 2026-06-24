import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Input';
import { useWallets } from '../../hooks/useWallets';
import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';

interface FilterState {
  type: string;
  wallet_id: string;
  category_id: string;
  tag_id: string;
  from: string;
  to: string;
}

const emptyFilters: FilterState = {
  type: '',
  wallet_id: '',
  category_id: '',
  tag_id: '',
  from: '',
  to: '',
};

export function TransactionFilterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  const { data: tagsData } = useTags();

  const [filters, setFilters] = useState<FilterState>({
    type: searchParams.get('type') ?? '',
    wallet_id: searchParams.get('wallet_id') ?? '',
    category_id: searchParams.get('category_id') ?? '',
    tag_id: searchParams.get('tag_id') ?? '',
    from: searchParams.get('from') ?? '',
    to: searchParams.get('to') ?? '',
  });

  const update = (key: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  const buildQuery = () => {
    const params = new URLSearchParams();
    (Object.keys(filters) as (keyof FilterState)[]).forEach((key) => {
      const value = filters[key].trim();
      if (value) params.set(key, value);
    });
    return params.toString();
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const query = buildQuery();
    navigate(query ? `/transactions?${query}` : '/transactions');
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(emptyFilters);
  };

  return (
    <AppLayout title="Transaction Filter" description="Advanced filters for transaction search and reporting.">
      <div className="dashboard-page grid-stack filter-workspace">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Advanced filter</span>
            <h2>Cari transaksi berdasarkan periode, type, wallet, category, dan tag.</h2>
            <p>Filter diterapkan langsung ke daftar transaksi dan dapat dipakai sebagai base export dan analytics.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/transactions">Back</Button>
            <Button variant="primary" onClick={handleApply}>Apply Filter</Button>
          </div>
        </section>
        <Card className="panel-card filter-criteria-card">
          <div className="panel-head">
            <div><h3>Filter Criteria</h3><p>Pilih kriteria lalu terapkan ke daftar transaksi.</p></div>
          </div>
          <form className="form-stack filter-form" onSubmit={handleApply} onReset={handleReset}>
            <div className="form-two">
              <label>
                <span>Type</span>
                <Select value={filters.type} onChange={update('type')}>
                  <option value="">All types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="transfer">Transfer</option>
                  <option value="adjustment">Adjustment</option>
                </Select>
              </label>
              <label>
                <span>Tag</span>
                <Select value={filters.tag_id} onChange={update('tag_id')}>
                  <option value="">All tags</option>
                  {(tagsData?.tags ?? []).map((tag) => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
                </Select>
              </label>
            </div>
            <div className="form-two">
              <label>
                <span>Date From</span>
                <Input type="date" value={filters.from} onChange={update('from')} />
              </label>
              <label>
                <span>Date To</span>
                <Input type="date" value={filters.to} onChange={update('to')} />
              </label>
            </div>
            <div className="form-two">
              <label>
                <span>Wallet</span>
                <Select value={filters.wallet_id} onChange={update('wallet_id')}>
                  <option value="">All wallets</option>
                  {(walletsData?.wallets ?? []).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </Select>
              </label>
              <label>
                <span>Category</span>
                <Select value={filters.category_id} onChange={update('category_id')}>
                  <option value="">All categories</option>
                  {(categoriesData?.categories ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </label>
            </div>
            <div className="form-row-between filter-actions-sticky">
              <Button type="reset">Reset</Button>
              <Button type="submit" variant="primary">Apply Filter</Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
