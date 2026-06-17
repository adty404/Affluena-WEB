import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AppIcon, type AppIconName } from '../ui/AppIcon';
import { Amount } from '../finance/Amount';
import type { Wallet } from '../../types/wallet';
import { walletTypeLabels } from '../../schemas/wallet';

type WalletCardProps = { wallet: Wallet };

const walletIcons: Record<Wallet['type'], AppIconName> = {
  bank: 'bank',
  cash: 'cash',
  e_wallet: 'eWallet',
  investment: 'investment',
  goal: 'goal',
};

function colorClass(wallet: Wallet): string {
  if (wallet.color) return wallet.color;
  switch (wallet.type) {
    case 'bank': return 'green';
    case 'cash': return 'blue';
    case 'e_wallet': return 'purple';
    case 'investment': return 'orange';
    default: return 'gray';
  }
}

function isShared(wallet: Wallet): boolean {
  if (!wallet.role) return false;
  return wallet.role !== 'owner';
}

function memberCount(wallet: Wallet): number {
  return wallet.members?.length ?? (isShared(wallet) ? 2 : 1);
}

export function WalletCard({ wallet }: WalletCardProps) {
  const shared = isShared(wallet);
  const subtitle = shared
    ? `${walletTypeLabels[wallet.type]} · ${wallet.role} · ${memberCount(wallet)} members`
    : walletTypeLabels[wallet.type];

  return (
    <article className={`wallet-card ${colorClass(wallet)}`}>
      <div className="wallet-card-top">
        <div className={`wallet-icon ${wallet.type}`} aria-hidden="true"><AppIcon name={walletIcons[wallet.type]} /></div>
        <div>
          <strong>{wallet.name}</strong>
          <span>{subtitle}</span>
        </div>
        <Badge tone={shared ? 'purple' : 'green'}>{shared ? 'Shared' : 'Private'}</Badge>
      </div>
      <div className="wallet-balance"><Amount value={wallet.balance_minor} /></div>
      <p className="wallet-description">
        {wallet.description || `${wallet.currency_code} · dibuat ${new Date(wallet.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
      </p>
      <div className="wallet-card-actions">
        <Button size="small" to={`/wallets/${wallet.id}`}>Detail</Button>
        <Button size="small" to={`/wallets/${wallet.id}/edit`}>Edit</Button>
        {shared ? <Button size="small" to={`/wallets/${wallet.id}/sharing`}>Sharing</Button> : null}
      </div>
    </article>
  );
}
