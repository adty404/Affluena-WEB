import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { AppIcon } from '../../components/ui/AppIcon';
import { CashflowChart, ExpenseDistribution, RecentTransactions, StatGrid, WalletPortfolio } from '../../components/finance/DashboardWidgets';
import { dashboardStats, expenseSlices, recentTransactions, walletPortfolio } from '../../data/mockDashboard';

export function DashboardPage() {
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <AppLayout title="Dashboard" description="Overview finansial personal, cashflow, spending, dan alert bulan ini.">
      <div className="grid stack-lg dashboard-page">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>● Dashboard</Badge>
            <h2>Financial command center untuk memantau uang masuk, keluar, dan kesehatan budget.</h2>
            <p>Dashboard memakai data demo terstruktur dan semua shortcut utama diarahkan ke flow yang relevan.</p>
          </div>
          <div className="app-hero-actions">
            <Button variant="primary" onClick={() => setQuickOpen(true)}><AppIcon name="add" /> Quick Action</Button>
            <Button to="/dashboard/analytics"><AppIcon name="analytics" /> Analytics</Button>
          </div>
        </section>

        <StatGrid stats={dashboardStats} />

        <section className="dashboard-grid">
          <div className="grid stack-lg">
            <CashflowChart />
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
