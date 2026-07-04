import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { BudgetInsightCard } from '../../components/budgets/BudgetInsightCard';
import { useBudget, useBudgets, useBudgetReport } from '../../hooks/useBudgets';
import { useCategories } from '../../hooks/useCategories';
import { useTransactions } from '../../hooks/useTransactions';
import { useWallets } from '../../hooks/useWallets';
import { useTags } from '../../hooks/useTags';
import { formatDateID, toYearMonth } from '../../lib/dates';
import type { Transaction } from '../../types/transaction';

const statusLabel = {
  safe: 'Aman',
  warning: 'Peringatan',
  exceeded: 'Terlampaui',
} as const;

export function BudgetDetailPage() {
  const { id } = useParams();
  const { data: budget, isLoading: isBudgetLoading, error: budgetError } = useBudget(id);
  const { data: categoriesData } = useCategories({ type: 'expense' });
  const { data: walletsData } = useWallets();
  const { data: tagsData } = useTags();

  const budgetMonth = budget ? budget.month.slice(0, 7) : undefined; // YYYY-MM

  // Authoritative spending/remaining/usage come from the budget summary list and report.
  const { data: summaryList } = useBudgets(budgetMonth ? { month: budgetMonth } : {});
  const { data: reportData } = useBudgetReport(budgetMonth);

  // Transactions for this category + month drive the "included transactions" table.
  const monthStart = budgetMonth ? `${budgetMonth}-01` : undefined;
  // Upper bound = first day of the NEXT month, so the query doesn't pull in
  // later months' expenses.
  const monthEnd = (() => {
    if (!budgetMonth) return undefined;
    const [y, m] = budgetMonth.split('-').map(Number);
    const next = new Date(y, m, 1); // m is 1-based → Date month index gives next month
    return toYearMonth(next) + '-01';
  })();
  const { data: transactionsData } = useTransactions(
    budget
      ? {
          type: 'expense',
          category_id: budget.category_id,
          from: monthStart,
          to: monthEnd,
        }
      : {},
  );

  if (isBudgetLoading) {
    return <AppLayout title="Detail Anggaran" description="Memuat detail anggaran..."><div className="loading-state">Memuat...</div></AppLayout>;
  }

  if (budgetError || !budget) {
    return <AppLayout title="Detail Anggaran" description="Gagal memuat detail anggaran."><Card className="panel-card"><EmptyState icon={<AppIcon name="empty" />} title="Gagal memuat anggaran" description="Periksa koneksi lalu coba lagi." action={<Button to="/budgets"><AppIcon name="back" /> Kembali</Button>} /></Card></AppLayout>;
  }

  const category = (categoriesData?.categories ?? []).find(c => c.id === budget.category_id);
  const categoryName = category?.name ?? 'Kategori tidak dikenal';
  const monthLabel = new Date(budget.month).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  const budgetTransactions = (transactionsData?.transactions ?? []).filter(
    // Bucket by LOCAL month so this matches the server-computed spent total at
    // the WIB day boundary (a raw UTC slice diverges there).
    (t) => t.type === 'expense' && toYearMonth(new Date(t.transaction_at)) === budgetMonth,
  );

  // Prefer authoritative figures from the API summary/report; fall back to local computation.
  const summary = (summaryList?.budgets ?? []).find((b) => b.id === budget.id);
  const reportItem = (reportData?.report ?? []).find((r) => r.id === budget.id);

  const localSpent = budgetTransactions.reduce((sum, t) => sum + t.amount_minor, 0);
  const spent_minor = summary?.spent_minor ?? reportItem?.spent_minor ?? localSpent;
  const remaining_minor = summary?.remaining_minor ?? reportItem?.remaining_minor ?? budget.limit_minor - spent_minor;
  const usage_percent =
    summary?.usage_percent ??
    reportItem?.usage_percent ??
    (budget.limit_minor > 0 ? Math.round((spent_minor / budget.limit_minor) * 100) : 0);
  const usageDisplay = Math.round(usage_percent);

  let status: 'safe' | 'warning' | 'exceeded' = 'safe';
  if (usage_percent >= 100) status = 'exceeded';
  else if (usage_percent >= 80) status = 'warning';

  // Daily allowance = remaining budget spread over the days left in the month.
  // Use the API value when available; otherwise compute remaining-days locally.
  const computeDailyAllowance = () => {
    if (remaining_minor <= 0) return 0;
    const [yearStr, monthStr] = (budgetMonth ?? '').split('-');
    const year = Number(yearStr);
    const monthIdx = Number(monthStr) - 1;
    if (!year || Number.isNaN(monthIdx)) return 0;
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const now = new Date();
    const isCurrentMonth = now.getFullYear() === year && now.getMonth() === monthIdx;
    const daysLeft = isCurrentMonth ? Math.max(1, daysInMonth - now.getDate() + 1) : daysInMonth;
    return Math.floor(remaining_minor / daysLeft);
  };
  const dailyAllowance = reportItem?.daily_allowance_minor ?? computeDailyAllowance();

  return (
    <AppLayout title="Detail Anggaran" description="Detail anggaran, tren pengeluaran, dan transaksi yang dihitung.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge className="dark">Detail Anggaran</Badge>
            <h2>{categoryName}</h2>
            <p>Penggunaan saat ini {usageDisplay}% dari batas bulan {monthLabel}.</p>
          </div>
          <div className="app-hero-actions">
            <Button to={`/budgets/${budget.id}/edit`} variant="primary"><AppIcon name="edit" /> Edit</Button>
            <Button to="/budgets/alerts"><AppIcon name="budgetAlert" /> Notifikasi</Button>
            <Button to="/budgets"><AppIcon name="back" /> Kembali</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Batas</span><strong><Amount value={budget.limit_minor} /></strong><small>{monthLabel}</small></Card>
          <Card className="stat-card"><span>Aktual</span><strong><Amount value={spent_minor} type="expense" /></strong><small>{usageDisplay}% terpakai</small></Card>
          <Card className="stat-card"><span>Sisa</span><strong><Amount value={Math.abs(remaining_minor)} type={remaining_minor < 0 ? 'expense' : 'income'} /></strong><small>{remaining_minor < 0 ? 'Melebihi anggaran' : 'Tersedia'}</small></Card>
          <Card className="stat-card"><span>Jatah Harian</span><strong><Amount value={dailyAllowance} /></strong><small>Sampai akhir bulan</small></Card>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Tren Pengeluaran</h3><p>Pengeluaran aktual vs laju anggaran.</p></div><Badge tone={status === 'safe' ? 'green' : status === 'warning' ? 'orange' : 'red'}>{statusLabel[status]}</Badge></div>
            <div className="budget-chart" aria-label={`Ilustrasi tren: pemakaian ${usageDisplay}% dari batas`}>
              <div className="budget-chart-line pace" />
              {/* Actual line slope reflects real usage: flatter when safe,
                  steeper as usage climbs (capped for readability). */}
              <div className="budget-chart-line actual" style={{ transform: `rotate(-${Math.min(24, Math.round(usage_percent * 0.2))}deg)` }} />
              <div className="chart-legend"><span><i className="actual-dot" /> Aktual</span><span><i className="pace-dot" /> Laju anggaran</span></div>
            </div>
            <ProgressBar value={Math.min(100, usageDisplay)} tone={status === 'safe' ? 'green' : status === 'warning' ? 'orange' : 'red'} />
          </Card>
          <div className="grid-stack">
            <BudgetInsightCard icon="health" title="Kesehatan anggaran" tone={status === 'safe' ? 'green' : status === 'warning' ? 'orange' : 'red'}>{status === 'safe' ? 'Anggaran masih aman, pertahankan pola belanjamu sampai akhir bulan.' : status === 'warning' ? 'Anggaran mendekati batas, cek lagi rencana pengeluaranmu.' : 'Anggaran sudah terlampaui, tahan dulu pengeluaran yang tidak penting.'}</BudgetInsightCard>
            <BudgetInsightCard icon="calendar" title="Jatah harian" tone="blue">Sisa alokasi harian sekitar <Amount value={dailyAllowance} /> agar tetap sesuai rencana.</BudgetInsightCard>
          </div>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Transaksi yang Dihitung</h3><p>Pengeluaran kategori {categoryName} yang dihitung ke anggaran ini.</p></div><Button to={`/transactions/filter?type=expense&category_id=${budget.category_id}`} size="small"><AppIcon name="filter" /> Filter Transaksi</Button></div>
          <DataTable<Transaction>
            data={budgetTransactions}
            getRowKey={(transaction) => transaction.id}
            columns={[
              { key: 'title', header: 'Transaksi', render: (transaction) => { const walletName = (walletsData?.wallets ?? []).find((w) => w.id === transaction.wallet_id)?.name; return <div className="table-title"><strong>{transaction.note || categoryName}</strong>{walletName ? <small>{walletName}</small> : null}</div>; } },
              { key: 'wallet', header: 'Dompet', render: (transaction) => (walletsData?.wallets ?? []).find((w) => w.id === transaction.wallet_id)?.name ?? '—' },
              { key: 'date', header: 'Tanggal', render: (transaction) => formatDateID(transaction.transaction_at) },
              { key: 'tags', header: 'Tag', render: (transaction) => <div className="tag-row">{transaction.tag_ids?.map((tagId) => <Badge key={tagId} tone="gray">#{(tagsData?.tags ?? []).find((t) => t.id === tagId)?.name ?? tagId}</Badge>)}</div> },
              { key: 'amount', header: 'Jumlah', align: 'right', render: (transaction) => <Amount value={transaction.amount_minor} type="expense" /> },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
