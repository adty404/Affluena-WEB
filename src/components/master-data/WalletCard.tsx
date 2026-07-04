import clsx from 'clsx';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AppIcon, type AppIconName } from '../ui/AppIcon';
import { Amount } from '../finance/Amount';
import { itemAccentVars } from '../finance/ColorPicker';
import type { Wallet } from '../../types/wallet';
import { walletTypeLabels } from '../../schemas/wallet';
import { canManageWallet } from '../../lib/wallet';

type WalletCardProps = { wallet: Wallet };

const walletIcons: Record<Wallet['type'], AppIconName> = {
  bank: 'bank',
  cash: 'cash',
  e_wallet: 'eWallet',
  investment: 'investment',
  goal: 'goal',
};

/** Default tint by wallet type, used when the wallet has no stored color. */
function typeColorClass(type: Wallet['type']): string {
  switch (type) {
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

const walletRoleLabels: Record<string, string> = {
  owner: 'Pemilik',
  member: 'Anggota (bisa mencatat)',
  viewer: 'Hanya lihat',
};

export function WalletCard({ wallet }: WalletCardProps) {
  const shared = isShared(wallet);
  // Only the owner may edit/delete a wallet; shared viewers/members are read-only.
  const canManage = canManageWallet(wallet);
  const subtitle = shared
    ? `${walletTypeLabels[wallet.type]} · ${walletRoleLabels[wallet.role ?? ''] ?? wallet.role} · ${memberCount(wallet)} anggota`
    : walletTypeLabels[wallet.type];
  // Stored hex colors (and normalized legacy names) tint via --item-accent;
  // wallets without a color keep the type-based default tint.
  const accentStyle = itemAccentVars(wallet.color);

  return (
    <article
      className={clsx('wallet-card', accentStyle ? 'has-accent' : typeColorClass(wallet.type))}
      style={accentStyle}
    >
      <div className="wallet-card-top">
        <div className={clsx('wallet-icon', wallet.type, accentStyle && 'has-accent')} aria-hidden="true"><AppIcon name={walletIcons[wallet.type]} /></div>
        <div>
          <strong>{wallet.name}</strong>
          <span>{subtitle}</span>
        </div>
        <Badge tone={shared ? 'purple' : 'green'}>{shared ? 'Bersama' : 'Pribadi'}</Badge>
      </div>
      <div className="wallet-balance"><Amount value={wallet.balance_minor} /></div>
      <p className="wallet-description">
        {wallet.description || `${wallet.currency_code} · dibuat ${new Date(wallet.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
      </p>
      <div className="wallet-card-actions">
        <Button size="small" to={`/wallets/${wallet.id}`}>Detail</Button>
        {canManage ? <Button size="small" to={`/wallets/${wallet.id}/edit`}>Edit</Button> : null}
        {shared ? <Button size="small" to={`/wallets/${wallet.id}/sharing`}>Anggota</Button> : null}
      </div>
    </article>
  );
}
