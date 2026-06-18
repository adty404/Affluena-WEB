import { apiFetch } from './client';
import { Installment, InstallmentPayment, Subscription, SubscriptionPayment } from '../types/tracker';
import { 
  CreateInstallmentInput, UpdateInstallmentInput, PayInstallmentInput,
  CreateSubscriptionInput, UpdateSubscriptionInput, PaySubscriptionInput
} from '../schemas/tracker';

export interface GetInstallmentsParams {
  limit?: number;
  offset?: number;
  sort?: string;
}

export interface GetInstallmentsResponse {
  installments: Installment[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface GetSubscriptionsParams {
  limit?: number;
  offset?: number;
  sort?: string;
}

export interface GetSubscriptionsResponse {
  subscriptions: Subscription[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export const trackersApi = {
  // Installments
  getInstallments: async (params?: GetInstallmentsParams): Promise<GetInstallmentsResponse> => {
    return apiFetch<GetInstallmentsResponse>('/api/v1/installments', { query: params as any });
  },

  getInstallment: async (id: string): Promise<Installment> => {
    return apiFetch<Installment>(`/api/v1/installments/${id}`);
  },

  createInstallment: async (data: CreateInstallmentInput): Promise<Installment> => {
    return apiFetch<Installment>('/api/v1/installments', { method: 'POST', body: data });
  },

  updateInstallment: async (id: string, data: UpdateInstallmentInput): Promise<Installment> => {
    return apiFetch<Installment>(`/api/v1/installments/${id}`, { method: 'PUT', body: data });
  },

  deleteInstallment: async (id: string): Promise<void> => {
    await apiFetch(`/api/v1/installments/${id}`, { method: 'DELETE' });
  },

  payInstallment: async (id: string, data: PayInstallmentInput): Promise<InstallmentPayment> => {
    return apiFetch<InstallmentPayment>(`/api/v1/installments/${id}/pay`, { method: 'POST', body: data });
  },

  // Subscriptions
  getSubscriptions: async (params?: GetSubscriptionsParams): Promise<GetSubscriptionsResponse> => {
    return apiFetch<GetSubscriptionsResponse>('/api/v1/subscriptions', { query: params as any });
  },

  getSubscription: async (id: string): Promise<Subscription> => {
    return apiFetch<Subscription>(`/api/v1/subscriptions/${id}`);
  },

  createSubscription: async (data: CreateSubscriptionInput): Promise<Subscription> => {
    return apiFetch<Subscription>('/api/v1/subscriptions', { method: 'POST', body: data });
  },

  updateSubscription: async (id: string, data: UpdateSubscriptionInput): Promise<Subscription> => {
    return apiFetch<Subscription>(`/api/v1/subscriptions/${id}`, { method: 'PUT', body: data });
  },

  deleteSubscription: async (id: string): Promise<void> => {
    await apiFetch(`/api/v1/subscriptions/${id}`, { method: 'DELETE' });
  },

  paySubscription: async (id: string, data: PaySubscriptionInput): Promise<SubscriptionPayment> => {
    return apiFetch<SubscriptionPayment>(`/api/v1/subscriptions/${id}/pay`, { method: 'POST', body: data });
  },
};
