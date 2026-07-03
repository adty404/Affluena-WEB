export type BudgetStatus = 'safe' | 'warning' | 'exceeded';

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  month: string; // RFC3339
  limit_minor: number;
  /** Optional UI metadata: `#RRGGBB` hex, '' = no color. */
  color?: string;
  /** Optional UI metadata: client-defined semantic icon id, '' = default icon. */
  icon?: string;
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
  color?: string;
  icon?: string;
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
  color?: string;
  icon?: string;
}

export interface BudgetUpdateRequest {
  category_id: string;
  month: string; // YYYY-MM
  limit_minor: number;
  color?: string;
  icon?: string;
}

export interface BudgetAlert {
  id: string;
  budget_id: string;
  category_id: string;
  category_name: string;
  title: string;
  message: string;
  threshold: 80 | 100;
  severity: 'warning' | 'danger';
  usage_percent: number;
  spent_minor: number;
  limit_minor: number;
  notified_at: string | null;
  month: string;
}

export interface BudgetReportItem extends BudgetSummary {
  variance_minor: number;
  daily_allowance_minor: number;
  recommendation: string;
}

export interface BudgetReportSummary {
  total_limit_minor: number;
  total_spent_minor: number;
  total_remaining_minor: number;
  safe_count: number;
  warning_count: number;
  exceeded_count: number;
  daily_allowance_minor: number;
  forecast_minor: number;
}

export interface BudgetAlertsResponse {
  alerts: BudgetAlert[];
}

export interface BudgetReportResponse {
  report: BudgetReportItem[];
  summary: BudgetReportSummary;
}
