import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { WalletCard } from '../../components/master-data/WalletCard';
import { Amount } from '../../components/finance/Amount';
import { mockWallets, walletTypeLabels } from '../../data/mockWallets';
import type { Wallet } from '../../types/wallet';

export function WalletListPage() {
  const totalBalance = mockWallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const sharedCount = mockWallets.filter((wallet) => wallet.isShared).length;
  const columns = [
    { key: 'name', header: 'Wallet', render: (wallet: Wallet) => <div><strong>{wallet.name}</strong><span className="table-subtitle">{wallet.description}</span></div> },
    { key: 'type', header: 'Type', render: (wallet: Wallet) => walletTypeLabels[wallet.type] },
    { key: 'balance', header: 'Balance', align: 'right' as const, render: (wallet: Wallet) => <Amount value={wallet.balance} /> },
    { key: 'sharing', header: 'Sharing', render: (wallet: Wallet) => wallet.isShared ? `${wallet.memberCount} members` : 'Private' },
    { key: 'activity', header: 'Last Activity', render: (wallet: Wallet) => wallet.lastActivity },
    { key: 'action', header: 'Action', render: (wallet: Wallet) => <div className="inline-actions"><Button size="small" to={`/wallets/${wallet.id}`}>View</Button><Button size="small" to={`/wallets/${wallet.id}/edit`}>Edit</Button></div> },
  ];

  return (
    <AppLayout title="Wallets" description="Manage cash, bank, e-wallet, investment, and shared wallets.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Master Data</span>
            <h2>Semua wallet terlihat jelas, termasuk shared wallet dan balance movement.</h2>
            <p>Wallet dipakai oleh transaction, transfer, adjustment, quick entry, budget, debt, dan recurring module.</p>
          </div>
          <div className="app-hero-actions"><Button to="/wallets/new" variant="primary">+ Create Wallet</Button><Button to="/wallets/1/sharing">Manage Sharing</Button></div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Total Balance</span><strong><Amount value={totalBalance} /></strong><small>Across all wallets</small></Card>
          <Card className="stat-card blue"><span>Wallet Count</span><strong>{mockWallets.length}</strong><small>Active wallets</small></Card>
          <Card className="stat-card purple"><span>Shared Wallets</span><strong>{sharedCount}</strong><small>Collaboration enabled</small></Card>
          <Card className="stat-card orange"><span>Monthly Outflow</span><strong><Amount value={8050000} variant="expense" /></strong><small>From wallet activity</small></Card>
        </section>

        <section className="master-grid cards-4">{mockWallets.map((wallet) => <WalletCard key={wallet.id} wallet={wallet} />)}</section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Wallet Table</h3><p>Pattern table untuk list, pagination, dan action wallet.</p></div><Button to="/wallets/new" size="small" variant="primary">+ Wallet</Button></div>
          <DataTable columns={columns} data={mockWallets} getRowKey={(wallet) => wallet.id} />
        </Card>
      </div>
    </AppLayout>
  );
}
