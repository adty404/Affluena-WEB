import type { Wallet, WalletRole } from '../types/wallet'

/**
 * Whether the current user may edit/delete this wallet. Only the owner can —
 * shared `member`/`viewer` wallets are read-only. A wallet with no `role` is a
 * personal wallet the user owns.
 */
export function canManageWallet(wallet: Pick<Wallet, 'role'> | { role?: WalletRole }): boolean {
  return !wallet.role || wallet.role === 'owner'
}
