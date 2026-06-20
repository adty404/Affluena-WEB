import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { AppIcon } from '../../components/ui/AppIcon';
import { CashflowChart, ExpenseDistribution, RecentTransactions, StatGrid, WalletPortfolio } from '../../components/finance/DashboardWidgets';
import { useDashboardSummary, useCashflowTrend, useExpenseDistribution } from '../../hooks/useDashboard';
import { useCategories } from '../../hooks/useCategories';
import { useTransactions } from '../../hooks/useTransactions';
import { useWallets } from '../../hooks/useWallets';
import { categoryLabel, createNameById, walletPairLabel } from '../../lib/financeLabels';
import { formatIDR } from '../../lib/money';
import type { DashboardStat, ExpenseSlice, DashboardTransaction } from '../../types/dashboard';

export function DashboardPage() {
  const [quickOpen, setQuickOpen] = useState(false);
  
  const { data: summary } = useDashboardSummary();
  const { data: trendData } = useCashflowTrend(6);
  const { data: expenseData } = useExpenseDistribution();
  const { data: txData } = useTransactions({ limit: 5 });
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();

  const walletNameById = createNameById(walletsData?.wallets ?? []);
  const categoryNameById = createNameById(categoriesData?.categories ?? []);

  const stats: DashboardStat[] = summary ? [
    { label: 'Net Worth', value: formatIDR(summary.net_worth_minor), note: 'Total aset bersih', tone: 'blue' },
    { label: 'Monthly Income', value: formatIDR(summary.monthly_income_minor), note: 'Pemasukan bulan ini', tone: 'green' },
    { label: 'Monthly Expense', value: formatIDR(summary.monthly_expense_minor), note: 'Pengeluaran bulan ini', tone: 'red' },
    { label: 'Cashflow', value: formatIDR(summary.monthly_cashflow_minor), note: 'Sisa uang bulan ini', tone: summary.monthly_cashflow_minor >= 0 ? 'green' : 'red' },
  ] : [
    { label: 'Net Worth', value: '...', note: 'Loading...' },
    { label: 'Monthly Income', value: '...', note: 'Loading...' },
    { label: 'Monthly Expense', value: '...', note: 'Loading...' },
    { label: 'Cashflow', value: '...', note: 'Loading...' },
  ];

  const expenseSlices: ExpenseSlice[] = (expenseData?.distribution ?? []).map((d, i) => {
    const tones: ('green' | 'blue' | 'orange' | 'purple' | 'red' | 'gray')[] = ['blue', 'purple', 'orange', 'green', 'red', 'gray'];
    return {
      label: d.category_name,
      amount: formatIDR(d.amount_minor),
      percent: d.percentage,
      tone: tones[i % tones.length],
    };
  }) || [];

  const recentTransactions: DashboardTransaction[] = (txData?.transactions ?? []).map(tx => ({
    id: tx.id,
    title: tx.note || 'Transaction',
    category: categoryLabel(categoryNameById, tx.category_id, tx.type),
    wallet: walletPairLabel(walletNameById, tx.wallet_id, tx.to_wallet_id),
    amount: formatIDR(tx.amount_minor),
    type: tx.type as 'income' | 'expense',
    date: new Date(tx.transaction_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
  })) || [];

  const walletList = walletsData?.wallets ?? [];
  const totalWalletBalance = walletList.reduce((sum, w) => sum + w.balance_minor, 0) || 1;
  const walletPortfolio = walletList.map(w => ({
    name: w.name,
    value: formatIDR(w.balance_minor),
    percent: Math.round((w.balance_minor / totalWalletBalance) * 100),
  }));

  return (
    <AppLayout title="Dashboard" description="Overview finansial personal, cashflow, spending, dan alert bulan ini.">
      <div className="grid stack-lg dashboard-page">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>● Dashboard</Badge>
            <h2>Financial command center untuk memantau uang masuk, keluar, dan kesehatan budget.</h2>
            <p>Dashboard memakai data live dari backend dan semua shortcut utama diarahkan ke flow yang relevan.</p>
          </div>
          <div className="app-hero-actions">
            <Button variant="primary" onClick={() => setQuickOpen(true)}><AppIcon name="add" /> Quick Action</Button>
            <Button to="/dashboard/analytics"><AppIcon name="analytics" /> Analytics</Button>
          </div>
        </section>

        <StatGrid stats={stats} />

        <section className="dashboard-grid">
          <div className="grid stack-lg">
            <CashflowChart trend={trendData?.trend} />
            <RecentTransactions items={recentTransactions} />
          </div>
          <div className="grid stack-lg">
            <ExpenseDistribution items={expenseSlices} />
            <WalletPortfolio items={walletPortfolio} />
          </div>
        </section>
      </div>

      <Modal open={quickOpen} title="Quick Action" description="Pilih flow yang ingin dibuka. Semua action memiliki tujuan halaman yang jelas." onClose={() => setQuickOpen(false)}>
        <div className="quick-action-grid two-col">
          <Button to="/transactions/new" onClick={() => setQuickOpen(false)}><AppIcon name="transactions" /> Add Transaction</Button>
          <Button to="/transactions/transfer" onClick={() => setQuickOpen(false)}><AppIcon name="transactions" /> Transfer Wallet</Button>
          <Button to="/transactions/adjustment" onClick={() => setQuickOpen(false)}><AppIcon name="edit" /> Balance Adjustment</Button>
          <Button to="/transactions/split" onClick={() => setQuickOpen(false)}><AppIcon name="split" /> Split Bill</Button>
          <Button to="/quick-entry" onClick={() => setQuickOpen(false)}><AppIcon name="quick" /> Execute Quick Entry</Button>
          <Button to="/budgets/new" onClick={() => setQuickOpen(false)}><AppIcon name="budgetForm" /> Create Budget</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
