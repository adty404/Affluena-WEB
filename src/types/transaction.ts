export type TransactionType = 'income' | 'expense' | 'transfer' | 'adjustment';

export type Transaction = {
  id: string;
  user_id: string;
  type: TransactionType;
  wallet_id: string;
  to_wallet_id?: string;
  category_id?: string;
  amount_minor: number;
  tag_ids: string[];
  transaction_at: string;
  note: string;
  created_at: string;
  updated_at: string;
};

export type TransactionListResponse = {
  transactions: Transaction[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
};

export type TransactionCreateRequest = {
  type: TransactionType;
  wallet_id: string;
  to_wallet_id?: string;
  category_id?: string;
  amount_minor: number;
  tag_ids?: string[];
  transaction_at: string;
  note?: string;
};

export type TransactionUpdateRequest = TransactionCreateRequest;

export type TransactionSplit = {
  counterparty_name: string;
  amount_minor: number;
  disbursement_category_id: string;
  payment_category_id: string;
};

export type SplitTransactionRequest = {
  wallet_id: string;
  category_id?: string;
  total_amount_minor: number;
  transaction_at?: string;
  note?: string;
  tag_ids?: string[];
  splits: TransactionSplit[];
};

export type SplitTransactionResponse = {
  transaction_id: string;
  debt_ids: string[];
};

export type SplitParticipant = {
  id: string;
  name: string;
  contact: string;
  shareAmount: number;
  status: 'pending' | 'paid' | 'reminded';
};
