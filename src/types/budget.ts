export type BudgetStatus = 'safe' | 'warning' | 'exceeded';
export type BudgetPeriod = 'monthly' | 'quarterly' | 'yearly';

export type Budget = {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: 'food' | 'transport' | 'shopping' | 'bills' | 'categories';
  period: string;
  periodType: BudgetPeriod;
  limit: number;
  actual: number;
  forecast: number;
  warningThreshold: number;
  exceededThreshold: number;
  status: BudgetStatus;
  note: string;
};

export type BudgetAlert = {
  id: string;
  budgetId: string;
  categoryName: string;
  title: string;
  message: string;
  threshold: 80 | 100;
  status: 'unread' | 'read';
  severity: 'warning' | 'danger' | 'info';
  createdAt: string;
};

export type BudgetReportItem = Budget & {
  variance: number;
  dailyAllowance: number;
  recommendation: string;
};
