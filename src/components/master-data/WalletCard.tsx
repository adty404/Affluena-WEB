import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AppIcon, type AppIconName } from '../ui/AppIcon';
import { Amount } from '../finance/Amount';
import type { Wallet } from '../../types/wallet';
import { walletTypeLabels } from '../../data/mockWallets';

type WalletCardProps = { wallet: Wallet };

const walletIcons: Record<Wallet['type'], AppIconName> = {
  bank: 'bank',
  cash: 'cash',
  e_wallet: 'eWallet',
  investment: 'investment',
  goal: 'goal',
};

export function WalletCard({ wallet }: WalletCardProps) {
  return (
    <article className={`wallet-card ${wallet.color}`}>
      <div className="wallet-card-top">
        <div className={`wallet-icon ${wallet.type}`} aria-hidden="true"><AppIcon name={walletIcons[wallet.type]} /></div>
        <div>
          <strong>{wallet.name}</strong>
          <span>{walletTypeLabels[wallet.type]} · {wallet.isShared ? `${wallet.memberCount} members` : 'Private'}</span>
        </div>
        <Badge tone={wallet.isShared ? 'purple' : 'green'}>{wallet.isShared ? 'Shared' : 'Private'}</Badge>
      </div>
      <div className="wallet-balance"><Amount value={wallet.balance} /></div>
      <p className="wallet-description">{wallet.description}</p>
      <div className="wallet-mini-grid">
        <div><span>Inflow</span><strong><Amount value={wallet.monthlyInflow} /></strong></div>
        <div><span>Outflow</span><strong><Amount value={wallet.monthlyOutflow} variant="expense" /></strong></div>
      </div>
      <div className="wallet-card-actions">
        <Button size="small" to={`/wallets/${wallet.id}`}>Detail</Button>
        <Button size="small" to={`/wallets/${wallet.id}/edit`}>Edit</Button>
        {wallet.isShared ? <Button size="small" to={`/wallets/${wallet.id}/sharing`}>Sharing</Button> : null}
      </div>
    </article>
  );
}
