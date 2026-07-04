import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { AppIcon } from '../../components/ui/AppIcon';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { RecentTransactions, StatGrid, WalletPortfolio } from '../../components/finance/DashboardWidgets';
import { useDashboardSummary } from '../../hooks/useDashboard';
import { useCategories } from '../../hooks/useCategories';
import { useTransactions } from '../../hooks/useTransactions';
import { useWallets } from '../../hooks/useWallets';
import { categoryLabel, createNameById, walletPairLabel } from '../../lib/financeLabels';
import { formatDateID } from '../../lib/dates';
import { NAV } from '../../lib/copy';
import { formatIDR } from '../../lib/money';
import type { DashboardStat, DashboardTransaction } from '../../types/dashboard';

const mobileDashboardActions = [
  { to: '/transactions/new', icon: 'transactions', label: 'Tambah Transaksi' },
  { to: '/transactions/transfer', icon: 'arrow-up-down', label: 'Transfer' },
  { to: '/wallets/new', icon: 'wallet', label: 'Tambah Dompet' },
  { to: '/budgets/new', icon: 'budgetForm', label: NAV.anggaran },
  { to: '/goals/new', icon: 'goal', label: NAV.targetTabungan },
] as const;

export function DashboardPage() {
  const [quickOpen, setQuickOpen] = useState(false);
  
  const { data: summary, error: summaryError, refetch: refetchSummary } = useDashboardSummary();
  const { data: txData } = useTransactions({ limit: 5 });
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();

  const walletNameById = createNameById(walletsData?.wallets ?? []);
  const categoryNameById = createNameById(categoriesData?.categories ?? []);

  const stats: DashboardStat[] = summary ? [
    { label: 'Kekayaan Bersih', value: formatIDR(summary.net_worth_minor), note: 'Total aset bersih', tone: 'blue' },
    { label: 'Pemasukan Bulan Ini', value: formatIDR(summary.monthly_income_minor), note: 'Total uang masuk', tone: 'green' },
    { label: 'Pengeluaran Bulan Ini', value: formatIDR(summary.monthly_expense_minor), note: 'Total uang keluar', tone: 'red' },
    { label: 'Arus Kas', value: formatIDR(summary.monthly_cashflow_minor), note: 'Sisa uang bulan ini', tone: summary.monthly_cashflow_minor >= 0 ? 'green' : 'red' },
  ] : [
    { label: 'Kekayaan Bersih', value: '...', note: 'Memuat...' },
    { label: 'Pemasukan Bulan Ini', value: '...', note: 'Memuat...' },
    { label: 'Pengeluaran Bulan Ini', value: '...', note: 'Memuat...' },
    { label: 'Arus Kas', value: '...', note: 'Memuat...' },
  ];

  const recentTransactions: DashboardTransaction[] = (txData?.transactions ?? []).map(tx => ({
    id: tx.id,
    title: tx.note || 'Transaksi',
    category: categoryLabel(categoryNameById, tx.category_id, tx.type),
    wallet: walletPairLabel(walletNameById, tx.wallet_id, tx.to_wallet_id),
    amountMinor: tx.amount_minor,
    type: tx.type as 'income' | 'expense',
    date: formatDateID(tx.transaction_at),
  })) || [];

  const walletList = walletsData?.wallets ?? [];
  const totalWalletBalance = walletList.reduce((sum, w) => sum + w.balance_minor, 0) || 1;
  const walletPortfolio = walletList.map(w => ({
    name: w.name,
    value: formatIDR(w.balance_minor),
    percent: Math.round((w.balance_minor / totalWalletBalance) * 100),
  }));
  const netWorthValue = summary ? formatIDR(summary.net_worth_minor) : '...';
  const cashflowValue = summary ? formatIDR(summary.monthly_cashflow_minor) : '...';
  // Keep the balance-card cashflow tone neutral until data resolves so the
  // green "positive" styling doesn't flash on the '...' placeholder.
  const cashflowTone = !summary ? 'neutral' : summary.monthly_cashflow_minor < 0 ? 'expense' : 'income';

  return (
    <AppLayout title="Beranda" description="Ringkasan keuangan pribadi: arus kas, pengeluaran, dan pemberitahuan bulan ini.">
      <div className="grid stack-lg dashboard-page">
        <section className="mobile-dashboard-home" aria-label="Ringkasan beranda">
          <div className="mobile-balance-card">
            <span>Total Saldo</span>
            <strong>{netWorthValue}</strong>
            <small className={`amount ${cashflowTone}`}>Arus kas bulan ini {cashflowValue}</small>
          </div>
          <div className="mobile-dashboard-actions" aria-label="Aksi cepat">
            {mobileDashboardActions.map((action) => (
              <Button to={action.to} className="mobile-dashboard-action" key={action.to}>
                <AppIcon name={action.icon} />
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </section>

        <div className="mobile-dashboard-recent">
          <RecentTransactions items={recentTransactions} />
        </div>

        <section className="app-hero-card dashboard-hero dashboard-desktop-hero">
          <div>
            <Badge>{NAV.beranda}</Badge>
            <h2>Pantau uang masuk, uang keluar, dan kesehatan anggaran kamu di satu tempat.</h2>
            <p>Semua angka penting dan pintasan utama siap membantumu mengambil keputusan.</p>
          </div>
          <div className="app-hero-actions">
            <Button variant="primary" onClick={() => setQuickOpen(true)}><AppIcon name="add" /> Aksi Cepat</Button>
            <Button to="/dashboard/analytics"><AppIcon name="analytics" /> {NAV.analitik}</Button>
          </div>
        </section>

        <div className="dashboard-desktop-stats">
          {summaryError ? (
            <Card className="panel-card">
              <EmptyState
                icon={<AppIcon name="empty" />}
                title="Gagal memuat ringkasan"
                description="Periksa koneksi lalu coba lagi."
                action={<Button variant="primary" onClick={() => refetchSummary()}><AppIcon name="recurring" /> Coba lagi</Button>}
              />
            </Card>
          ) : (
            <StatGrid stats={stats} />
          )}
        </div>

        <section className="dashboard-grid">
          <div className="grid stack-lg">
            <div className="dashboard-recent-desktop">
              <RecentTransactions items={recentTransactions} />
            </div>
          </div>
          <div className="grid stack-lg">
            <WalletPortfolio items={walletPortfolio} />
          </div>
        </section>
      </div>

      <Modal open={quickOpen} title="Aksi Cepat" description="Pilih aksi yang ingin kamu buka." onClose={() => setQuickOpen(false)}>
        <div className="quick-action-grid two-col">
          <Button to="/transactions/new" onClick={() => setQuickOpen(false)}><AppIcon name="transactions" /> Tambah Transaksi</Button>
          <Button to="/transactions/transfer" onClick={() => setQuickOpen(false)}><AppIcon name="transactions" /> Transfer Dompet</Button>
          <Button to="/transactions/adjustment" onClick={() => setQuickOpen(false)}><AppIcon name="edit" /> Penyesuaian Saldo</Button>
          <Button to="/quick-entry" onClick={() => setQuickOpen(false)}><AppIcon name="quick" /> {NAV.catatCepat}</Button>
          <Button to="/budgets/new" onClick={() => setQuickOpen(false)}><AppIcon name="budgetForm" /> Buat Anggaran</Button>
          <Button to="/wallets/new" onClick={() => setQuickOpen(false)}><AppIcon name="wallet" /> Tambah Dompet</Button>
          <Button to="/goals/new" onClick={() => setQuickOpen(false)}><AppIcon name="goal" /> Buat Target Tabungan</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
