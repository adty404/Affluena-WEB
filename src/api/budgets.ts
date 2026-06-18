import { apiFetch } from './client';
import type {
  Budget,
  BudgetCreateRequest,
  BudgetListResponse,
  BudgetUpdateRequest,
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
