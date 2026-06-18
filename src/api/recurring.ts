import { apiFetch } from './client';
import type { RecurringRule, RecurringRuleListResponse, RecurringRun } from '../types/recurring';
import type { RecurringRuleInput } from '../schemas/recurring';

export const recurringApi = {
  list: async (params?: { limit?: number; offset?: number; sort?: string }) => {
    return apiFetch<RecurringRuleListResponse>('/api/v1/recurring-transactions', {
      method: 'GET',
      query: params as Record<string, string | number | boolean | null | undefined>,
    });
  },

  get: async (id: string) => {
    return apiFetch<RecurringRule>(`/api/v1/recurring-transactions/${id}`);
  },

  create: async (data: RecurringRuleInput) => {
    return apiFetch<RecurringRule>('/api/v1/recurring-transactions', {
      method: 'POST',
      body: data,
    });
  },

  update: async (id: string, data: RecurringRuleInput) => {
    return apiFetch<RecurringRule>(`/api/v1/recurring-transactions/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  delete: async (id: string) => {
    return apiFetch<void>(`/api/v1/recurring-transactions/${id}`, {
      method: 'DELETE',
    });
  },

  run: async (id: string, data?: { now?: boolean }) => {
    return apiFetch<RecurringRun>(`/api/v1/recurring-transactions/${id}/run`, {
      method: 'POST',
      body: data || {},
    });
  },
};
