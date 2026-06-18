import { apiFetch } from './client';
import { Debt, DebtPayment } from '../types/debt';
import { CreateDebtInput, UpdateDebtInput, PayDebtInput } from '../schemas/debt';

export interface GetDebtsParams {
  limit?: number;
  offset?: number;
  sort?: string;
}

export interface GetDebtsResponse {
  debts: Debt[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export const debtsApi = {
  getDebts: async (params?: GetDebtsParams): Promise<GetDebtsResponse> => {
    return apiFetch<GetDebtsResponse>('/api/v1/debts', { query: params as any });
  },

  getDebt: async (id: string): Promise<Debt> => {
    return apiFetch<Debt>(`/api/v1/debts/${id}`);
  },

  createDebt: async (data: CreateDebtInput): Promise<Debt> => {
    return apiFetch<Debt>('/api/v1/debts', { method: 'POST', body: data });
  },

  updateDebt: async (id: string, data: UpdateDebtInput): Promise<Debt> => {
    return apiFetch<Debt>(`/api/v1/debts/${id}`, { method: 'PUT', body: data });
  },

  deleteDebt: async (id: string): Promise<void> => {
    await apiFetch(`/api/v1/debts/${id}`, { method: 'DELETE' });
  },

  payDebt: async (id: string, data: PayDebtInput): Promise<DebtPayment> => {
    return apiFetch<DebtPayment>(`/api/v1/debts/${id}/pay`, { method: 'POST', body: data });
  },
};
