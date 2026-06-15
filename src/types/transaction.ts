export type TransactionType = 'income' | 'expense' | 'transfer' | 'adjustment';

export type TransactionStatus = 'posted' | 'pending' | 'failed';

export type Transaction = {
  id: string;
  type: TransactionType;
  title: string;
  note: string;
  walletId: string;
  walletName: string;
  destinationWalletId?: string;
  destinationWalletName?: string;
  categoryId?: string;
  categoryName?: string;
  amount: number;
  date: string;
  tags: string[];
  status: TransactionStatus;
};

export type SplitParticipant = {
  id: string;
  name: string;
  contact: string;
  shareAmount: number;
  status: 'pending' | 'paid' | 'reminded';
};
