import { apiFetch } from './client';
import type {
  Budget,
  BudgetCreateRequest,
  BudgetListResponse,
  BudgetUpdateRequest,
  BudgetAlertsResponse,
  BudgetReportResponse,
} from '../types/budget';

export interface BudgetListParams {
  month?: string; // YYYY-MM
  limit?: number;
  offset?: number;
  sort?: string;
}

export function listBudgets(params: BudgetListParams = {}) {
  return apiFetch<BudgetListResponse>('/api/v1/category-budgets', {
    method: 'GET',
    query: {
      month: params.month,
      limit: params.limit,
      offset: params.offset,
      sort: params.sort,
    },
  });
}

export function getBudget(id: string) {
  return apiFetch<Budget>(`/api/v1/category-budgets/${id}`);
}

export function createBudget(payload: BudgetCreateRequest) {
  return apiFetch<Budget>('/api/v1/category-budgets', {
    method: 'POST',
    body: payload,
  });
}

export function updateBudget(id: string, payload: BudgetUpdateRequest) {
  return apiFetch<Budget>(`/api/v1/category-budgets/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export function deleteBudget(id: string) {
  return apiFetch<void>(`/api/v1/category-budgets/${id}`, {
    method: 'DELETE',
  });
}

export function getBudgetAlerts(month?: string) {
  const query: Record<string, string> = {};
  if (month) query.month = month;
  
  return apiFetch<BudgetAlertsResponse>('/api/v1/category-budgets/alerts', {
    method: 'GET',
    query,
  });
}

export function getBudgetReport(month?: string) {
  const query: Record<string, string> = {};
  if (month) query.month = month;
  
  return apiFetch<BudgetReportResponse>('/api/v1/category-budgets/report', {
    method: 'GET',
    query,
  });
}
