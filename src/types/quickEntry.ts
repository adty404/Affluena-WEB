import type { TransactionType } from './transaction';

export type QuickEntryTemplate = {
  id: string;
  name: string;
  type: TransactionType;
  walletId: string;
  walletName: string;
  categoryId?: string;
  categoryName?: string;
  amount: number;
  note: string;
  tags: string[];
  lastUsed: string;
  usageCount: number;
};
