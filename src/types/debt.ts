export type DebtType = 'payable' | 'receivable';
export type DebtStatus = 'open' | 'partial' | 'paid' | 'overdue' | 'due_soon';

export type DebtPayment = {
  id: string;
  date: string;
  walletName: string;
  amount: number;
  transactionId: string;
  note: string;
};

export type Debt = {
  id: string;
  title: string;
  type: DebtType;
  counterparty: string;
  originalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: DebtStatus;
  walletName: string;
  note: string;
  payments: DebtPayment[];
};

export type InstallmentStatus = 'active' | 'due_soon' | 'paid' | 'final_month';

export type Installment = {
  id: string;
  name: string;
  walletName: string;
  categoryName: string;
  monthlyAmount: number;
  totalTenor: number;
  paidCount: number;
  remainingPrincipal: number;
  nextDueDate: string;
  status: InstallmentStatus;
  reminderRule: string;
};

export type SubscriptionStatus = 'active' | 'due_soon' | 'paused' | 'cancelled';
export type SubscriptionCycle = 'monthly' | 'quarterly' | 'yearly';

export type Subscription = {
  id: string;
  name: string;
  categoryName: string;
  walletName: string;
  amount: number;
  cycle: SubscriptionCycle;
  nextRenewalDate: string;
  status: SubscriptionStatus;
  reminderRule: string;
};
