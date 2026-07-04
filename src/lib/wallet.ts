import type { Wallet, WalletRole } from '../types/wallet'

/**
 * Whether the current user may edit/delete this wallet. Only the owner can —
 * shared `member`/`viewer` wallets are read-only. A wallet with no `role` is a
 * personal wallet the user owns.
 */
export function canManageWallet(wallet: Pick<Wallet, 'role'> | { role?: WalletRole }): boolean {
  return !wallet.role || wallet.role === 'owner'
}

/**
 * Whether a transaction can be recorded with this wallet as its source or
 * destination. Excludes read-only shared (`viewer`) wallets — the API rejects
 * writes to them with "resource not found", so offering one in a picker makes a
 * create silently fail — and `goal`-type wallets, which are funded through the
 * goal-contribution flow, not manual transactions. Owned and `member`
 * (read+write shared) wallets are recordable.
 */
export function canRecordToWallet(wallet: Pick<Wallet, 'role' | 'type'>): boolean {
  return wallet.role !== 'viewer' && wallet.type !== 'goal'
}
