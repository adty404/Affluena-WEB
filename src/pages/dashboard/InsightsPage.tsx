import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { StatGrid } from '../../components/finance/DashboardWidgets';
import { itemAccentVars } from '../../components/finance/ColorPicker';
import { CategoryIcon } from '../../components/master-data/CategoryIcon';
import { useMonthTransactions } from '../../hooks/useMonthTransactions';
import { useCategories } from '../../hooks/useCategories';
import { buildCategoryBreakdown, type CategorySlice } from '../../lib/categoryBreakdown';
import { NAV } from '../../lib/copy';
import { formatIDR } from '../../lib/money';
import type { DashboardStat } from '../../types/dashboard';

type TabKey = 'expense' | 'income';

function CategorySliceRow({ slice, onSelect }: { slice: CategorySlice; onSelect?: () => void }) {
  const accent = itemAccentVars(slice.color);
  const content = (
    <>
      <span className={accent ? 'category-icon has-accent' : `category-icon ${slice.type === 'income' ? 'green' : 'orange'}`} style={accent}>
        <CategoryIcon icon={slice.icon} type={slice.type} />
      </span>
      <div className="insight-cat-main">
        <div className="insight-cat-title">
          <strong>{slice.name}</strong>
          <span>{formatIDR(slice.amountMinor)}</span>
        </div>
        <ProgressBar value={slice.percentOfTotal} tone={slice.type === 'income' ? 'green' : 'orange'} />
      </div>
      <span className="insight-cat-percent">{slice.percentOfTotal.toFixed(0)}%</span>
    </>
  );

  if (onSelect) {
    return (
      <button type="button" className="insight-cat-row is-link" onClick={onSelect} title={`Lihat transaksi ${slice.name} bulan ini`}>
        {content}
      </button>
    );
  }
  return <div className="insight-cat-row">{content}</div>;
}

export function InsightsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('expense');
  const { data: transactions, isLoading: isLoadingTx, error } = useMonthTransactions();
  const { data: categoriesData, isLoading: isLoadingCat } = useCategories({ limit: 200 });

  // The period shown is the current month; opening a category filters the
  // transaction list to that category within the same month window (the API
  // uses `transaction_at >= from AND < to`, so `to` is the first of next month).
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const periodFrom = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const periodTo = `${nextMonth.getFullYear()}-${pad(nextMonth.getMonth() + 1)}-01`;
  const openCategory = (categoryId: string) => {
    navigate(`/transactions?category_id=${categoryId}&from=${periodFrom}&to=${periodTo}`);
  };

  const breakdown = useMemo(
    () => buildCategoryBreakdown(transactions ?? [], categoriesData?.categories ?? []),
    [transactions, categoriesData],
  );

  const isLoading = isLoadingTx || isLoadingCat;
  const monthLabel = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date());

  const slices = tab === 'expense' ? breakdown.expenseByCategory : breakdown.incomeByCategory;
  const total = tab === 'expense' ? breakdown.expenseTotalMinor : breakdown.incomeTotalMinor;

  const netMinor = breakdown.incomeTotalMinor - breakdown.expenseTotalMinor;
  const summaryStats: DashboardStat[] = [
    { label: 'Pemasukan Bulan Ini', value: isLoading ? '…' : formatIDR(breakdown.incomeTotalMinor), note: 'Total uang masuk', tone: 'green' },
    { label: 'Pengeluaran Bulan Ini', value: isLoading ? '…' : formatIDR(breakdown.expenseTotalMinor), note: 'Total uang keluar', tone: 'orange' },
    { label: 'Selisih', value: isLoading ? '…' : formatIDR(netMinor), note: 'Pemasukan − pengeluaran', tone: isLoading ? undefined : netMinor < 0 ? 'red' : 'green' },
  ];

  return (
    <AppLayout title={NAV.wawasan} description="Sebaran pemasukan dan pengeluaran per kategori bulan ini.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge className="dark">{NAV.wawasan}</Badge>
            <h2>Ke mana perginya uangmu bulan ini?</h2>
            <p>Transaksi {monthLabel} dikelompokkan per kategori. Ketuk kategori untuk melihat daftar transaksinya.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/dashboard/analytics"><AppIcon name="analytics" /> Analitik</Button>
            <Button to="/transactions" variant="primary"><AppIcon name="transactions" /> Semua Transaksi</Button>
          </div>
        </section>

        <StatGrid stats={summaryStats} className="three" />

        <Card className="panel-card">
          <div className="panel-head">
            <div><h3>Sebaran per Kategori</h3><p>Kategori dengan porsi terbesar ditampilkan lebih dulu.</p></div>
            <div className="inline-actions">
              <Button size="small" variant={tab === 'expense' ? 'primary' : 'default'} onClick={() => setTab('expense')}>Pengeluaran</Button>
              <Button size="small" variant={tab === 'income' ? 'primary' : 'default'} onClick={() => setTab('income')}>Pemasukan</Button>
            </div>
          </div>

          {error ? (
            <p className="panel-note danger">Gagal memuat transaksi. Periksa koneksi lalu coba lagi.</p>
          ) : isLoading ? (
            <p className="panel-note">Memuat...</p>
          ) : slices.length === 0 ? (
            <EmptyState
              icon={<AppIcon name="chart" />}
              title={tab === 'expense' ? 'Belum ada pengeluaran' : 'Belum ada pemasukan'}
              description={`Belum ada transaksi ${tab === 'expense' ? 'pengeluaran' : 'pemasukan'} bulan ini untuk dirangkum per kategori.`}
              action={<Button to="/transactions/new" variant="primary"><AppIcon name="add" /> Catat Transaksi</Button>}
            />
          ) : (
            <>
              <div className="insight-cat-total">
                <span>Total {tab === 'expense' ? 'Pengeluaran' : 'Pemasukan'}</span>
                <strong>{formatIDR(total)}</strong>
                <Badge tone={tab === 'expense' ? 'orange' : 'green'}>{slices.length} kategori</Badge>
              </div>
              <div className="insight-cat-list">
                {slices.map((slice) => (
                  <CategorySliceRow
                    key={slice.categoryId ?? 'uncategorized'}
                    slice={slice}
                    onSelect={slice.categoryId ? () => openCategory(slice.categoryId!) : undefined}
                  />
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
