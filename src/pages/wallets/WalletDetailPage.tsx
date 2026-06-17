import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Amount } from '../../components/finance/Amount';
import { useWallet } from '../../hooks/useWallets';
import { walletTypeLabels } from '../../schemas/wallet';
import { formatIDR } from '../../lib/money';
import { fromRFC3339 } from '../../lib/dates';

export function WalletDetailPage() {
  const { id } = useParams();
  const { data: wallet, isLoading, error } = useWallet(id);

  if (isLoading) {
    return (
      <AppLayout title="Wallet Detail" description="Memuat…">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Memuat wallet</span><strong>…</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  if (error || !wallet) {
    return (
      <AppLayout title="Wallet Detail" description="Wallet tidak ditemukan.">
        <div className="dashboard-page grid-stack">
          <Card className="panel-card">
            <div className="readiness-list">
              <div><span>Error</span><strong>{(error as { error?: string } | null)?.error ?? 'Wallet tidak ditemukan'}</strong></div>
            </div>
            <div className="modal-actions"><Button to="/wallets">Back to list</Button></div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const shared = wallet.role && wallet.role !== 'owner';
  const created = fromRFC3339(wallet.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const updated = fromRFC3339(wallet.updated_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <AppLayout title="Wallet Detail" description={`${walletTypeLabels[wallet.type]} · ${wallet.currency_code}`}>
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge className="dark">{shared ? `Shared · ${wallet.role}` : 'Private wallet'}</Badge>
            <h2>{wallet.name}</h2>
            <p>Dibuat {created}. Update terakhir {updated}.</p>
          </div>
          <div className="app-hero-actions">
            <Button to={`/wallets/${wallet.id}/edit`}>Edit</Button>
            {shared ? <Button to={`/wallets/${wallet.id}/sharing`}>Sharing</Button> : null}
            <Button to="/wallets">Back</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Saldo</span><strong><Amount value={wallet.balance_minor} /></strong><small>{wallet.currency_code}</small></Card>
          <Card className="stat-card blue"><span>Tipe</span><strong>{walletTypeLabels[wallet.type]}</strong><small>Wallet type</small></Card>
          <Card className="stat-card green"><span>Akses</span><strong>{wallet.role ?? '—'}</strong><small>{wallet.share_status ?? '—'}</small></Card>
          <Card className="stat-card orange"><span>Wallet ID</span><strong style={{ fontSize: 12, wordBreak: 'break-all' }}>{wallet.id}</strong><small>Backend identifier</small></Card>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Metadata</h3><p>Info wallet dari backend.</p></div></div>
          <div className="readiness-list">
            <div><span>Nama</span><strong>{wallet.name}</strong></div>
            <div><span>Tipe</span><strong>{walletTypeLabels[wallet.type]}</strong></div>
            <div><span>Currency</span><strong>{wallet.currency_code}</strong></div>
            <div><span>Saldo (minor)</span><strong>{wallet.balance_minor.toLocaleString('id-ID')}</strong></div>
            <div><span>Display</span><strong>{formatIDR(wallet.balance_minor)}</strong></div>
            <div><span>Owner ID</span><strong style={{ wordBreak: 'break-all' }}>{wallet.user_id}</strong></div>
          </div>
        </Card>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Aktivitas Terbaru</h3><p>Aktivitas transaksi akan muncul setelah Plan 4 (Transactions) terintegrasi.</p></div></div>
          <div className="readiness-list">
            <div><span>Status</span><strong>Menunggu integrasi transaksi</strong></div>
            <div><span>Filter by wallet</span><strong>GET /api/v1/transactions?wallet_id=...</strong></div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
