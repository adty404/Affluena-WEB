import clsx from 'clsx';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon, type AppIconName } from '../../components/ui/AppIcon';
import { WalletCard } from '../../components/master-data/WalletCard';
import { Amount } from '../../components/finance/Amount';
import { itemAccentVars } from '../../components/finance/ColorPicker';
import { useWallets } from '../../hooks/useWallets';
import { NAV } from '../../lib/copy';
import { walletTypeLabels } from '../../schemas/wallet';
import { canManageWallet } from '../../lib/wallet';
import type { Wallet } from '../../types/wallet';

const walletIcons: Record<Wallet['type'], AppIconName> = {
  bank: 'bank',
  cash: 'cash',
  e_wallet: 'eWallet',
  investment: 'investment',
  goal: 'goal',
};

const walletRoleLabels: Record<string, string> = {
  owner: 'Pemilik',
  member: 'Anggota (bisa mencatat)',
  viewer: 'Hanya lihat',
};

export function WalletListPage() {
  const { data, isLoading, error } = useWallets({ limit: 100 });
  const wallets = data?.wallets ?? [];
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance_minor, 0);
  const sharedCount = wallets.filter((w) => w.role && w.role !== 'owner').length;

  const columns = [
    { key: 'name', header: 'Dompet', render: (wallet: Wallet) => {
      const accent = itemAccentVars(wallet.color);
      return (
        <div className="table-title">
          <span className={clsx('mini-icon', accent && 'has-accent')} style={accent}><AppIcon name={walletIcons[wallet.type]} /></span>
          <strong>{wallet.name}</strong>
          <small>{walletTypeLabels[wallet.type]} · {wallet.currency_code}</small>
        </div>
      );
    } },
    { key: 'type', header: 'Tipe', render: (wallet: Wallet) => walletTypeLabels[wallet.type] },
    { key: 'balance', header: 'Saldo', align: 'right' as const, render: (wallet: Wallet) => <Amount value={wallet.balance_minor} /> },
    { key: 'role', header: 'Akses', render: (wallet: Wallet) => (wallet.role ? walletRoleLabels[wallet.role] ?? wallet.role : '—') },
    { key: 'action', header: 'Aksi', render: (wallet: Wallet) => (
      <div className="inline-actions">
        <Button size="small" to={`/wallets/${wallet.id}`}>Lihat</Button>
        {canManageWallet(wallet) ? <Button size="small" to={`/wallets/${wallet.id}/edit`}>Edit</Button> : null}
      </div>
    ) },
  ];

  return (
    <AppLayout title={NAV.dompet} description="Kelola dompet tunai, bank, e-wallet, investasi, dan dompet bersama.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge className="dark">{NAV.dompet}</Badge>
            <h2>Kelola semua dompetmu — tunai, bank, e-wallet, dan dompet bersama — dalam satu tempat.</h2>
            <p>Saldo dan pergerakan tiap dompet selalu terlihat jelas, termasuk dompet yang dibagikan.</p>
          </div>
          <div className="app-hero-actions"><Button to="/wallets/new" variant="primary"><AppIcon name="add" /> Buat Dompet</Button></div>
        </section>

        {error ? (
          <Card className="panel-card">
            <EmptyState icon={<AppIcon name="empty" />} title="Gagal memuat dompet" description={(error as { error?: string }).error ?? 'Periksa koneksi lalu coba lagi.'} />
          </Card>
        ) : null}

        <section className="stat-grid">
          <Card className="stat-card"><span>Total Saldo</span><strong>{isLoading ? '…' : <Amount value={totalBalance} />}</strong><small>Dari semua dompet</small></Card>
          <Card className="stat-card blue"><span>Jumlah Dompet</span><strong>{isLoading ? '…' : wallets.length}</strong><small>Dompet aktif</small></Card>
          <Card className="stat-card purple"><span>Dompet Bersama</span><strong>{isLoading ? '…' : sharedCount}</strong><small>Dibagikan denganmu</small></Card>
        </section>

        {error ? null : isLoading ? (
          <div className="loading-state">Memuat dompet...</div>
        ) : wallets.length === 0 ? (
          <Card className="panel-card">
            <EmptyState icon={<AppIcon name="wallet" />} title="Belum ada dompet" description="Buat dompet pertamamu untuk mulai mencatat transaksi." action={<Button to="/wallets/new" variant="primary"><AppIcon name="add" /> Buat Dompet</Button>} />
          </Card>
        ) : (
          <>
            <section className="master-grid cards-4">{wallets.map((wallet) => <WalletCard key={wallet.id} wallet={wallet} />)}</section>

            <Card className="panel-card">
              <div className="panel-head"><div><h3>Daftar Dompet</h3><p>{data?.pagination.total ?? wallets.length} dompet terdaftar.</p></div><Button to="/wallets/new" size="small" variant="primary"><AppIcon name="add" /> Dompet</Button></div>
              <DataTable columns={columns} data={wallets} getRowKey={(wallet) => wallet.id} />
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
