import type { Transaction } from './transaction';

export type RecurringFrequency = 'weekly' | 'monthly';
export type RecurringStatus = 'active' | 'paused' | 'cancelled';
export type RecurringType = 'income' | 'expense' | 'transfer' | 'adjustment';

export interface RecurringRule {
  id: string;
  user_id: string;
  name: string;
  type: RecurringType;
  wallet_id: string;
  to_wallet_id?: string;
  category_id?: string;
  amount_minor: number;
  frequency: RecurringFrequency;
  interval_count: number;
  next_run_at: string;
  end_at?: string;
  last_run_at?: string;
  status: RecurringStatus;
  note: string;
  /** Optional UI metadata: `#RRGGBB` hex, '' = no color. */
  color?: string;
  /** Optional UI metadata: client-defined semantic icon id, '' = default icon. */
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface RecurringRun {
  id: string;
  rule_id: string;
  user_id: string;
  scheduled_for: string;
  transaction_id?: string;
  run_type: 'manual' | 'scheduled';
  created_at: string;
  transaction?: Transaction;
  rule?: RecurringRule;
}

export interface RecurringRuleListResponse {
  recurring_transactions: RecurringRule[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}
