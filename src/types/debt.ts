import { Transaction } from './transaction';

export type DebtType = 'payable' | 'receivable';
export type DebtStatus = 'open' | 'paid' | 'cancelled';

export interface Debt {
  id: string;
  user_id: string;
  type: DebtType;
  counterparty_name: string;
  wallet_id: string;
  disbursement_category_id: string;
  payment_category_id: string;
  origination_transaction_id: string;
  principal_amount_minor: number;
  paid_amount_minor: number;
  remaining_amount_minor: number;
  opened_at: string;
  due_date?: string;
  status: DebtStatus;
  note: string;
  created_at: string;
  updated_at: string;
  payments?: DebtPayment[];
}

export interface DebtPayment {
  id: string;
  user_id: string;
  debt_id: string;
  transaction_id: string;
  amount_minor: number;
  paid_at: string;
  note: string;
  created_at: string;
  debt?: Debt;
  transaction?: Transaction;
}
