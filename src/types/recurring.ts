export type RecurringStatus = 'active' | 'paused' | 'cancelled';
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type RecurringRunStatus = 'success' | 'failed' | 'skipped';

export type RecurringRun = {
  id: string;
  scheduledAt: string;
  executedAt: string;
  status: RecurringRunStatus;
  transactionId?: string;
  message: string;
};

export type RecurringRule = {
  id: string;
  title: string;
  type: 'income' | 'expense' | 'transfer';
  walletName: string;
  destinationWalletName?: string;
  categoryName?: string;
  amount: number;
  frequency: RecurringFrequency;
  startDate: string;
  nextRunDate: string;
  lastRunDate?: string;
  status: RecurringStatus;
  note: string;
  runHistory: RecurringRun[];
};
