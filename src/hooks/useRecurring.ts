import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recurringApi } from '../api/recurring';
import { invalidateFinancialQueries } from '../lib/queryClient';
import type { RecurringRuleInput } from '../schemas/recurring';

export const recurringKeys = {
  all: ['recurring'] as const,
  lists: () => [...recurringKeys.all, 'list'] as const,
  list: (filters: string) => [...recurringKeys.lists(), { filters }] as const,
  details: () => [...recurringKeys.all, 'detail'] as const,
  detail: (id: string) => [...recurringKeys.details(), id] as const,
};

export function useRecurringRules(params?: { limit?: number; offset?: number; sort?: string }) {
  return useQuery({
    queryKey: recurringKeys.list(JSON.stringify(params || {})),
    queryFn: () => recurringApi.list(params),
  });
}

export function useRecurringRule(id: string) {
  return useQuery({
    queryKey: recurringKeys.detail(id),
    queryFn: () => recurringApi.get(id),
    enabled: !!id,
  });
}

export function useCreateRecurringRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RecurringRuleInput) => recurringApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.lists() });
    },
  });
}

export function useUpdateRecurringRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RecurringRuleInput }) =>
      recurringApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recurringKeys.detail(variables.id) });
    },
  });
}

export function useDeleteRecurringRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recurringApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recurringKeys.detail(id) });
    },
  });
}

export function useRunRecurringRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: { now?: boolean } }) =>
      recurringApi.run(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: recurringKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recurringKeys.detail(variables.id) });
      // Also invalidate transactions since a new one was likely created
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      // Running a rule books a charge that moves wallet balances / dashboard / budgets
      invalidateFinancialQueries(queryClient);
    },
  });
}
