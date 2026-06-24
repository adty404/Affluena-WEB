import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trackersApi, GetInstallmentsParams, GetSubscriptionsParams } from '../api/trackers';
import { 
  CreateInstallmentInput, UpdateInstallmentInput, PayInstallmentInput,
  CreateSubscriptionInput, UpdateSubscriptionInput, PaySubscriptionInput
} from '../schemas/tracker';
import { invalidateFinancialQueries } from '../lib/queryClient';

export const INSTALLMENTS_QUERY_KEY = ['installments'];
export const SUBSCRIPTIONS_QUERY_KEY = ['subscriptions'];

// Installments
export function useInstallments(params?: GetInstallmentsParams) {
  return useQuery({
    queryKey: [...INSTALLMENTS_QUERY_KEY, params],
    queryFn: () => trackersApi.getInstallments(params),
  });
}

export function useInstallment(id: string) {
  return useQuery({
    queryKey: [...INSTALLMENTS_QUERY_KEY, id],
    queryFn: () => trackersApi.getInstallment(id),
    enabled: !!id,
  });
}

export function useCreateInstallment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInstallmentInput) => trackersApi.createInstallment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSTALLMENTS_QUERY_KEY });
      invalidateFinancialQueries(queryClient);
    },
  });
}

export function useUpdateInstallment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInstallmentInput }) => trackersApi.updateInstallment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: INSTALLMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...INSTALLMENTS_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteInstallment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trackersApi.deleteInstallment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSTALLMENTS_QUERY_KEY });
      invalidateFinancialQueries(queryClient);
    },
  });
}

export function usePayInstallment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PayInstallmentInput }) => trackersApi.payInstallment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: INSTALLMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...INSTALLMENTS_QUERY_KEY, variables.id] });
      invalidateFinancialQueries(queryClient);
    },
  });
}

// Subscriptions
export function useSubscriptions(params?: GetSubscriptionsParams) {
  return useQuery({
    queryKey: [...SUBSCRIPTIONS_QUERY_KEY, params],
    queryFn: () => trackersApi.getSubscriptions(params),
  });
}

export function useSubscription(id: string) {
  return useQuery({
    queryKey: [...SUBSCRIPTIONS_QUERY_KEY, id],
    queryFn: () => trackersApi.getSubscription(id),
    enabled: !!id,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubscriptionInput) => trackersApi.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY });
      invalidateFinancialQueries(queryClient);
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubscriptionInput }) => trackersApi.updateSubscription(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...SUBSCRIPTIONS_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trackersApi.deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY });
      invalidateFinancialQueries(queryClient);
    },
  });
}

export function usePaySubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PaySubscriptionInput }) => trackersApi.paySubscription(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...SUBSCRIPTIONS_QUERY_KEY, variables.id] });
      invalidateFinancialQueries(queryClient);
    },
  });
}
