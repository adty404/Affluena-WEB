import clsx from 'clsx';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon, type AppIconName } from '../../components/ui/AppIcon';
import { WalletCard } from '../../components/master-data/WalletCard';
import { Amount } from '../../components/finance/Amount';
import { itemAccentVars } from '../../components/finance/ColorPicker';
import { useWallets } from '../../hooks/useWallets';
import { walletTypeLabels } from '../../schemas/wallet';
import type { Wallet } from '../../types/wallet';

const walletIcons: Record<Wallet['type'], AppIconName> = {
  bank: 'bank',
  cash: 'cash',
  e_wallet: 'eWallet',
  investment: 'investment',
  goal: 'goal',
};

export function WalletListPage() {
  const { data, isLoading, error } = useWallets({ limit: 100 });
  const wallets = data?.wallets ?? [];
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance_minor, 0);
  const sharedCount = wallets.filter((w) => w.role && w.role !== 'owner').length;

  const columns = [
    { key: 'name', header: 'Wallet', render: (wallet: Wallet) => {
      const accent = itemAccentVars(wallet.color);
      return (
        <div className="table-title">
          <span className={clsx('mini-icon', accent && 'has-accent')} style={accent}><AppIcon name={walletIcons[wallet.type]} /></span>
          <strong>{wallet.name}</strong>
          <small>{walletTypeLabels[wallet.type]} · {wallet.currency_code}</small>
        </div>
      );
    } },
    { key: 'type', header: 'Type', render: (wallet: Wallet) => walletTypeLabels[wallet.type] },
    { key: 'balance', header: 'Balance', align: 'right' as const, render: (wallet: Wallet) => <Amount value={wallet.balance_minor} /> },
    { key: 'role', header: 'Akses', render: (wallet: Wallet) => wallet.role ?? '—' },
    { key: 'action', header: 'Action', render: (wallet: Wallet) => (
      <div className="inline-actions">
        <Button size="small" to={`/wallets/${wallet.id}`}>View</Button>
        <Button size="small" to={`/wallets/${wallet.id}/edit`}>Edit</Button>
      </div>
    ) },
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
          <div className="app-hero-actions"><Button to="/wallets/new" variant="primary">+ Create Wallet</Button></div>
        </section>

        {error ? (
          <Card className="panel-card">
            <div className="readiness-list">
              <div><span>Error</span><strong>{(error as { error?: string }).error ?? 'Gagal memuat wallet'}</strong></div>
            </div>
          </Card>
        ) : null}

        <section className="stat-grid">
          <Card className="stat-card"><span>Total Balance</span><strong>{isLoading ? '…' : <Amount value={totalBalance} />}</strong><small>Across all wallets</small></Card>
          <Card className="stat-card blue"><span>Wallet Count</span><strong>{isLoading ? '…' : wallets.length}</strong><small>Active wallets</small></Card>
          <Card className="stat-card purple"><span>Shared Wallets</span><strong>{isLoading ? '…' : sharedCount}</strong><small>Collaboration enabled</small></Card>
        </section>

        {isLoading ? (
          <Card className="panel-card"><div className="readiness-list"><div><span>Memuat</span><strong>…</strong></div></div></Card>
        ) : wallets.length === 0 ? (
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Belum ada wallet</h3><p>Buat wallet pertama untuk mulai mencatat transaksi.</p></div></div>
            <div className="modal-actions"><Button to="/wallets/new" variant="primary">+ Create Wallet</Button></div>
          </Card>
        ) : (
          <>
            <section className="master-grid cards-4">{wallets.map((wallet) => <WalletCard key={wallet.id} wallet={wallet} />)}</section>

            <Card className="panel-card">
              <div className="panel-head"><div><h3>Wallet Table</h3><p>{data?.pagination.total ?? wallets.length} wallet terdaftar.</p></div><Button to="/wallets/new" size="small" variant="primary">+ Wallet</Button></div>
              <DataTable columns={columns} data={wallets} getRowKey={(wallet) => wallet.id} />
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
