import { useMemo, useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { itemAccentVars } from '../../components/finance/ColorPicker';
import { CategoryIcon } from '../../components/master-data/CategoryIcon';
import { useMonthTransactions } from '../../hooks/useMonthTransactions';
import { useCategories } from '../../hooks/useCategories';
import { buildCategoryBreakdown, type CategorySlice } from '../../lib/categoryBreakdown';
import { NAV } from '../../lib/copy';
import { formatIDR } from '../../lib/money';

type TabKey = 'expense' | 'income';

function CategorySliceRow({ slice }: { slice: CategorySlice }) {
  const accent = itemAccentVars(slice.color);
  return (
    <div className="insight-cat-row">
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
    </div>
  );
}

export function InsightsPage() {
  const [tab, setTab] = useState<TabKey>('expense');
  const { data: transactions, isLoading: isLoadingTx, error } = useMonthTransactions();
  const { data: categoriesData, isLoading: isLoadingCat } = useCategories({ limit: 200 });

  const breakdown = useMemo(
    () => buildCategoryBreakdown(transactions ?? [], categoriesData?.categories ?? []),
    [transactions, categoriesData],
  );

  const isLoading = isLoadingTx || isLoadingCat;
  const monthLabel = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date());

  const slices = tab === 'expense' ? breakdown.expenseByCategory : breakdown.incomeByCategory;
  const total = tab === 'expense' ? breakdown.expenseTotalMinor : breakdown.incomeTotalMinor;

  return (
    <AppLayout title={NAV.wawasan} description="Sebaran pemasukan dan pengeluaran per kategori bulan ini.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● {NAV.wawasan}</span>
            <h2>Lihat ke mana uangmu mengalir bulan ini.</h2>
            <p>Transaksi {monthLabel} dikelompokkan per kategori — lengkap dengan porsinya terhadap total.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/dashboard/analytics"><AppIcon name="analytics" /> Analitik</Button>
            <Button to="/transactions" variant="primary"><AppIcon name="transactions" /> Semua Transaksi</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card green"><span>Pemasukan Bulan Ini</span><strong>{isLoading ? '…' : formatIDR(breakdown.incomeTotalMinor)}</strong><small>Total uang masuk</small></Card>
          <Card className="stat-card orange"><span>Pengeluaran Bulan Ini</span><strong>{isLoading ? '…' : formatIDR(breakdown.expenseTotalMinor)}</strong><small>Total uang keluar</small></Card>
          <Card className="stat-card"><span>Selisih</span><strong>{isLoading ? '…' : formatIDR(breakdown.incomeTotalMinor - breakdown.expenseTotalMinor)}</strong><small>Pemasukan − pengeluaran</small></Card>
        </section>

        <Card className="panel-card">
          <div className="panel-head">
            <div><h3>Sebaran per Kategori</h3><p>Kategori dengan porsi terbesar ditampilkan lebih dulu.</p></div>
            <div className="inline-actions">
              <Button size="small" variant={tab === 'expense' ? 'primary' : 'default'} onClick={() => setTab('expense')}>Pengeluaran</Button>
              <Button size="small" variant={tab === 'income' ? 'primary' : 'default'} onClick={() => setTab('income')}>Pemasukan</Button>
            </div>
          </div>

          {error ? (
            <p style={{ padding: '1rem', color: 'var(--danger)' }}>Gagal memuat transaksi. Periksa koneksi lalu coba lagi.</p>
          ) : isLoading ? (
            <p style={{ padding: '1rem', color: 'var(--muted)' }}>Memuat...</p>
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
                  <CategorySliceRow key={slice.categoryId ?? 'uncategorized'} slice={slice} />
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
