export type StatTone = 'green' | 'blue' | 'orange' | 'purple' | 'red' | 'gray';

export type DashboardStat = {
  label: string;
  value: string;
  note: string;
  tone?: StatTone;
};

export type CashflowPoint = {
  label: string;
  income: number;
  expense: number;
};

export type ExpenseSlice = {
  label: string;
  amount: string;
  percent: number;
  tone: StatTone;
};

export type DashboardTransaction = {
  id: string;
  title: string;
  category: string;
  wallet: string;
  amount: string;
  type: 'income' | 'expense';
  date: string;
};

export type ForecastItem = {
  title: string;
  value: string;
  note: string;
  tone: StatTone;
};
