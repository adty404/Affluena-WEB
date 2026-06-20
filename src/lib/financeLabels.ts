type NamedEntity = {
  id: string;
  name: string;
};

export function createNameById<T extends NamedEntity>(items: T[]) {
  return new Map(items.map((item) => [item.id, item.name]));
}

export function walletLabel(walletNameById: Map<string, string>, walletId: string | undefined) {
  return walletId ? (walletNameById.get(walletId) ?? 'Unknown Wallet') : 'Unknown Wallet';
}

export function walletPairLabel(walletNameById: Map<string, string>, walletId: string | undefined, toWalletId?: string) {
  return toWalletId ? `${walletLabel(walletNameById, walletId)} → ${walletLabel(walletNameById, toWalletId)}` : walletLabel(walletNameById, walletId);
}

export function categoryLabel(categoryNameById: Map<string, string>, categoryId: string | undefined, type: string) {
  if (categoryId) return categoryNameById.get(categoryId) ?? 'Unknown Category';
  if (type === 'transfer') return 'Transfer';
  if (type === 'adjustment') return 'Adjustment';
  return 'Uncategorized';
}
