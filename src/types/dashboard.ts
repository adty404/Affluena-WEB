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
  amountMinor: number;
  type: 'income' | 'expense';
  date: string;
};

export type ForecastItem = {
  title: string;
  value: string;
  note: string;
  tone: StatTone;
};

// Backend API Types

export interface DashboardSummary {
  month: string; // "YYYY-MM"
  net_worth_minor: number;
  monthly_income_minor: number;
  monthly_expense_minor: number;
  monthly_cashflow_minor: number;
  budget: {
    limit_minor: number;
    spent_minor: number;
    remaining_minor: number;
    usage_percent: number;
  };
  upcoming_subscriptions: {
    id: string;
    name: string;
    account_detail: string;
    amount_minor: number;
    next_due_date: string;
  }[];
  upcoming_installments: {
    id: string;
    name: string;
    monthly_amount_minor: number;
    remaining_months: number;
    due_date: string;
  }[];
  upcoming_debts: {
    id: string;
    type: string;
    counterparty_name: string;
    remaining_amount_minor: number;
    due_date: string;
  }[];
}

export interface CashflowTrend {
  month: string;
  income_minor: number;
  expense_minor: number;
  cashflow_minor: number;
}

export interface CashflowTrendResponse {
  trend: CashflowTrend[];
}

export interface ExpenseDistribution {
  category_id: string;
  category_name: string;
  amount_minor: number;
  percentage: number;
}

export interface ExpenseDistributionResponse {
  distribution: ExpenseDistribution[];
}

export interface DashboardForecast {
  current_expense_minor: number;
  daily_average_minor: number;
  forecasted_expense_minor: number;
  budget_limit_minor: number;
  status: "safe" | "overbudget";
}

