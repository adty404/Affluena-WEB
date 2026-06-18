export type BudgetStatus = 'safe' | 'warning' | 'exceeded';

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  month: string; // RFC3339
  limit_minor: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetSummary {
  id: string;
  user_id: string;
  category_id: string;
  month: string;
  limit_minor: number;
  spent_minor: number;
  remaining_minor: number;
  usage_percent: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetListResponse {
  budgets: BudgetSummary[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface BudgetCreateRequest {
  category_id: string;
  month: string; // YYYY-MM
  limit_minor: number;
}

export interface BudgetUpdateRequest {
  category_id: string;
  month: string; // YYYY-MM
  limit_minor: number;
}

export interface BudgetAlert {
  id: string;
  budgetId: string;
  categoryName: string;
  title: string;
  message: string;
  threshold: 80 | 100;
  status: 'unread' | 'read';
  severity: 'warning' | 'danger' | 'info';
  createdAt: string;
}

export interface BudgetReportItem extends BudgetSummary {
  variance: number;
  dailyAllowance: number;
  recommendation: string;
}
