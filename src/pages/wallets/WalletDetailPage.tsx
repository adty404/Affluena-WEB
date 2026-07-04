import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Amount } from '../../components/finance/Amount';
import { useWallet, useWalletAnalytics } from '../../hooks/useWallets';
import { walletTypeLabels } from '../../schemas/wallet';
import { formatIDR } from '../../lib/money';
import { fromRFC3339, toYearMonth } from '../../lib/dates';
import { canManageWallet } from '../../lib/wallet';

const walletRoleLabels: Record<string, string> = {
  owner: 'Pemilik',
  member: 'Anggota (bisa mencatat)',
  viewer: 'Hanya lihat',
};

const memberStatusLabels: Record<string, string> = {
  joined: 'Bergabung',
  pending: 'Menunggu',
  rejected: 'Ditolak',
};

export function WalletDetailPage() {
  const { id } = useParams();
  const { data: wallet, isLoading, error } = useWallet(id);
  const month = toYearMonth(new Date());
  const { data: analytics } = useWalletAnalytics(id, month);

  if (isLoading) {
    return (
      <AppLayout title="Detail Dompet" description="Memuat…">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Memuat dompet</span><strong>…</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  if (error || !wallet) {
    return (
      <AppLayout title="Detail Dompet" description="Dompet tidak ditemukan.">
        <div className="dashboard-page grid-stack">
          <Card className="panel-card">
            <div className="readiness-list">
              <div><span>Error</span><strong>{(error as { error?: string } | null)?.error ?? 'Dompet tidak ditemukan'}</strong></div>
            </div>
            <div className="modal-actions"><Button to="/wallets">Kembali ke daftar</Button></div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const shared = wallet.role && wallet.role !== 'owner';
  const canManage = canManageWallet(wallet);
  const created = fromRFC3339(wallet.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const updated = fromRFC3339(wallet.updated_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const lastActivity = analytics?.last_activity_at
    ? fromRFC3339(analytics.last_activity_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : 'Belum ada aktivitas';
  const memberCount = wallet.members?.length ?? (shared ? 2 : 1);

  const inflow = analytics?.inflow_minor ?? 0;
  const outflow = analytics?.outflow_minor ?? 0;
  const net = inflow - outflow;
  const transactionCount = analytics?.transaction_count ?? 0;
  const flowMax = Math.max(inflow, outflow, 1);
  const inflowPct = Math.round((inflow / flowMax) * 100);
  const outflowPct = Math.round((outflow / flowMax) * 100);

  return (
    <AppLayout title="Detail Dompet" description={`${walletTypeLabels[wallet.type]} · ${wallet.currency_code}`}>
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge className="dark">{shared ? `Dompet bersama · ${walletRoleLabels[wallet.role ?? ''] ?? wallet.role} · ${memberCount} anggota` : 'Dompet pribadi'}</Badge>
            <h2>{wallet.name}</h2>
            <p>{wallet.description || `Dibuat ${created}. Terakhir diperbarui ${updated}.`}</p>
          </div>
          <div className="app-hero-actions">
            {canManage ? <Button to={`/wallets/${wallet.id}/edit`}>Edit</Button> : null}
            {shared ? <Button to={`/wallets/${wallet.id}/sharing`}>Anggota</Button> : null}
            <Button to="/wallets">Kembali</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Saldo</span><strong><Amount value={wallet.balance_minor} /></strong><small>{wallet.currency_code}</small></Card>
          <Card className="stat-card blue"><span>Tipe</span><strong>{walletTypeLabels[wallet.type]}</strong><small>Warna: {wallet.color || 'bawaan'}</small></Card>
          <Card className="stat-card green"><span>Uang Masuk ({month})</span><strong><Amount value={analytics?.inflow_minor ?? 0} /></strong><small>Bulan ini</small></Card>
          <Card className="stat-card orange"><span>Uang Keluar ({month})</span><strong><Amount value={analytics?.outflow_minor ?? 0} variant="expense" /></strong><small>Bulan ini</small></Card>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Pergerakan Saldo</h3><p>{transactionCount} transaksi tercatat bulan {month}.</p></div></div>
            {transactionCount === 0 ? (
              <div className="readiness-list">
                <div><span>Status</span><strong>Belum ada aktivitas bulan ini</strong></div>
                <div><span>Aktivitas terakhir</span><strong>{lastActivity}</strong></div>
              </div>
            ) : (
              <>
                <div className="portfolio-list" style={{ marginBottom: 18 }}>
                  <div>
                    <div className="portfolio-head"><span>Uang Masuk</span><Amount value={inflow} /></div>
                    <div className="progress-bar"><span style={{ width: `${inflowPct}%` }} /></div>
                  </div>
                  <div>
                    <div className="portfolio-head"><span>Uang Keluar</span><Amount value={outflow} variant="expense" /></div>
                    <div className="progress-bar orange"><span style={{ width: `${outflowPct}%` }} /></div>
                  </div>
                </div>
                <div className="readiness-list">
                  <div><span>Selisih bulan ini</span><Amount value={net} variant={net >= 0 ? 'income' : 'expense'} /></div>
                  <div><span>Transaksi</span><strong>{transactionCount}</strong></div>
                  <div><span>Aktivitas terakhir</span><strong>{lastActivity}</strong></div>
                </div>
              </>
            )}
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Info Dompet</h3><p>Detail dompet dan saldo terkini.</p></div></div>
            <div className="readiness-list">
              <div><span>Nama</span><strong>{wallet.name}</strong></div>
              <div><span>Tipe</span><strong>{walletTypeLabels[wallet.type]}</strong></div>
              <div><span>Mata Uang</span><strong>{wallet.currency_code}</strong></div>
              <div><span>Warna</span><strong>{wallet.color || 'bawaan'}</strong></div>
              <div><span>Saldo</span><strong>{formatIDR(wallet.balance_minor)}</strong></div>
            </div>
          </Card>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Anggota Dompet</h3><p>{memberCount} orang dengan akses.</p></div></div>
          {wallet.members && wallet.members.length > 0 ? (
            <div className="member-list">
              {wallet.members.map((m) => {
                const local = m.email.split('@')[0] ?? m.email;
                const name = local.charAt(0).toUpperCase() + local.slice(1);
                return (
                  <div className="member-row" key={m.user_id}>
                    <div className="avatar">{m.email.slice(0, 2).toUpperCase()}</div>
                    <div>
                      <strong>{name}</strong>
                      <span>{m.email} · {walletRoleLabels[m.role] ?? m.role}</span>
                    </div>
                    <Badge tone={m.role === 'owner' ? 'green' : m.status === 'joined' ? 'green' : m.status === 'pending' ? 'orange' : 'red'}>{m.role === 'owner' ? 'Pemilik' : memberStatusLabels[m.status] ?? m.status}</Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="readiness-list">
              <div><span>Status</span><strong>Dompet pribadi, hanya kamu yang punya akses</strong></div>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
