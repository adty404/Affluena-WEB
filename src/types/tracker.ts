import { Transaction } from './transaction';

export type InstallmentStatus = 'active' | 'paid' | 'cancelled';

export interface Installment {
  id: string;
  user_id: string;
  name: string;
  wallet_id: string;
  category_id: string;
  total_amount_minor: number;
  monthly_amount_minor: number;
  tenor_months: number;
  remaining_months: number;
  start_date: string;
  due_day: number;
  status: InstallmentStatus;
  note: string;
  /** Optional UI metadata: `#RRGGBB` hex, '' = no color. */
  color?: string;
  /** Optional UI metadata: client-defined semantic icon id, '' = default icon. */
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface InstallmentPayment {
  id: string;
  user_id: string;
  installment_id: string;
  transaction_id: string;
  amount_minor: number;
  paid_at: string;
  note: string;
  created_at: string;
  installment?: Installment;
  transaction?: Transaction;
}

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';
export type SubscriptionCycle = 'weekly' | 'monthly';

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  account_detail: string;
  wallet_id: string;
  category_id: string;
  amount_minor: number;
  billing_cycle: SubscriptionCycle;
  next_due_date: string;
  status: SubscriptionStatus;
  note: string;
  /** Optional UI metadata: `#RRGGBB` hex, '' = no color. */
  color?: string;
  /** Optional UI metadata: client-defined semantic icon id, '' = default icon. */
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPayment {
  id: string;
  user_id: string;
  subscription_id: string;
  transaction_id: string;
  amount_minor: number;
  paid_at: string;
  note: string;
  created_at: string;
  subscription?: Subscription;
  transaction?: Transaction;
}
