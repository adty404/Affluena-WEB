import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBudget,
  deleteBudget,
  getBudget,
  listBudgets,
  type BudgetListParams,
  updateBudget,
  getBudgetAlerts,
  getBudgetReport,
} from '../api/budgets';
import type {
  BudgetCreateRequest,
  BudgetUpdateRequest,
} from '../types/budget';
import { queryKeys } from '../lib/queryClient';

export function useBudgets(params: BudgetListParams = {}) {
  return useQuery({
    queryKey: queryKeys.budgets.list(params.month),
    queryFn: () => listBudgets(params),
  });
}

export function useBudget(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.budgets.detail(id) : ['budgets', 'detail', 'undefined'],
    queryFn: () => getBudget(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BudgetCreateRequest) => createBudget(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.budgets.all });
    },
  });
}

export function useUpdateBudget(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BudgetUpdateRequest) => updateBudget(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.budgets.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.budgets.all });
    },
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.budgets.all });
    },
  });
}

export function useBudgetAlerts(month?: string) {
  return useQuery({
    queryKey: queryKeys.budgets.alerts(month),
    queryFn: () => getBudgetAlerts(month),
  });
}

export function useBudgetReport(month?: string) {
  return useQuery({
    queryKey: queryKeys.budgets.report(month),
    queryFn: () => getBudgetReport(month),
  });
}
