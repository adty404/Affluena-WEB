import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Amount } from '../../components/finance/Amount';
import { mockWallets, walletTypeLabels } from '../../data/mockWallets';

export function WalletDetailPage() {
  const { id } = useParams();
  const wallet = mockWallets.find((item) => item.id === id) ?? mockWallets[0];
  return (
    <AppLayout title="Wallet Detail" description="Balance movement, wallet metadata, and recent activity.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><Badge className="dark">{wallet.isShared ? 'Shared wallet' : 'Private wallet'}</Badge><h2>{wallet.name}</h2><p>{wallet.description}</p></div>
          <div className="app-hero-actions"><Button to={`/wallets/${wallet.id}/edit`}>Edit</Button>{wallet.isShared ? <Button to={`/wallets/${wallet.id}/sharing`}>Sharing</Button> : null}<Button to="/wallets">Back</Button></div>
        </section>
        <section className="stat-grid"><Card className="stat-card"><span>Balance</span><strong><Amount value={wallet.balance} /></strong><small>{wallet.currency}</small></Card><Card className="stat-card blue"><span>Type</span><strong>{walletTypeLabels[wallet.type]}</strong><small>Wallet type</small></Card><Card className="stat-card green"><span>Inflow</span><strong><Amount value={wallet.monthlyInflow} /></strong><small>This month</small></Card><Card className="stat-card orange"><span>Outflow</span><strong><Amount value={wallet.monthlyOutflow} variant="expense" /></strong><small>This month</small></Card></section>
        <section className="dashboard-grid"><Card className="panel-card chart-panel"><div className="panel-head"><div><h3>Balance Movement</h3><p>Placeholder chart untuk wallet activity.</p></div></div><div className="cashflow-chart"><svg viewBox="0 0 760 250" preserveAspectRatio="none"><path d="M40 210 C110 170, 170 190, 240 140 C310 94, 380 122, 450 76 C540 18, 620 68, 720 38" fill="none" stroke="#10b981" strokeWidth="5" strokeLinecap="round"/><path d="M40 210 C110 170, 170 190, 240 140 C310 94, 380 122, 450 76 C540 18, 620 68, 720 38 L720 250 L40 250 Z" fill="rgba(16,185,129,.13)"/></svg></div></Card><Card className="panel-card"><div className="panel-head"><div><h3>Recent Activity</h3><p>Latest wallet movements.</p></div></div><div className="transaction-list"><div className="transaction-row"><div className="transaction-icon income">+</div><div><strong>Salary received</strong><span>Today · Salary</span></div><Amount value={9600000} variant="income" /></div><div className="transaction-row"><div className="transaction-icon">-</div><div><strong>Grocery shopping</strong><span>Yesterday · Food</span></div><Amount value={150000} variant="expense" /></div><div className="transaction-row"><div className="transaction-icon">↕</div><div><strong>Transfer to Cash Wallet</strong><span>12 Jun · Transfer</span></div><Amount value={500000} /></div></div></Card></section>
      </div>
    </AppLayout>
  );
}
