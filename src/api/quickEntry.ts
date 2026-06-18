import { apiFetch } from './client';
import type { QuickEntryTemplate, QuickEntryTemplateListResponse } from '../types/quickEntry';
import type { QuickEntryTemplateInput } from '../schemas/quickEntry';
import type { Transaction } from '../types/transaction';

export const quickEntryApi = {
  list: async (params?: { limit?: number; offset?: number; sort?: string }) => {
    return apiFetch<QuickEntryTemplateListResponse>('/api/v1/quick-entry-templates', {
      method: 'GET',
      query: params as Record<string, string | number | boolean | null | undefined>,
    });
  },

  get: async (id: string) => {
    return apiFetch<QuickEntryTemplate>(`/api/v1/quick-entry-templates/${id}`);
  },

  create: async (data: QuickEntryTemplateInput) => {
    return apiFetch<QuickEntryTemplate>('/api/v1/quick-entry-templates', {
      method: 'POST',
      body: data,
    });
  },

  update: async (id: string, data: QuickEntryTemplateInput) => {
    return apiFetch<QuickEntryTemplate>(`/api/v1/quick-entry-templates/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  delete: async (id: string) => {
    return apiFetch<void>(`/api/v1/quick-entry-templates/${id}`, {
      method: 'DELETE',
    });
  },

  execute: async (id: string, data?: { transaction_at?: string; note?: string }) => {
    return apiFetch<{ transaction: Transaction }>(`/api/v1/quick-entry-templates/${id}/execute`, {
      method: 'POST',
      body: data || {},
    });
  },
};
