import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debtsApi, GetDebtsParams } from '../api/debts';
import { CreateDebtInput, UpdateDebtInput, PayDebtInput } from '../schemas/debt';
import { invalidateFinancialQueries } from '../lib/queryClient';

export const DEBTS_QUERY_KEY = ['debts'];

export function useDebts(params?: GetDebtsParams) {
  return useQuery({
    queryKey: [...DEBTS_QUERY_KEY, params],
    queryFn: () => debtsApi.getDebts(params),
  });
}

export function useDebt(id: string) {
  return useQuery({
    queryKey: [...DEBTS_QUERY_KEY, id],
    queryFn: () => debtsApi.getDebt(id),
    enabled: !!id,
  });
}

export function useCreateDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDebtInput) => debtsApi.createDebt(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBTS_QUERY_KEY });
      invalidateFinancialQueries(queryClient);
    },
  });
}

export function useUpdateDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDebtInput }) => debtsApi.updateDebt(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DEBTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...DEBTS_QUERY_KEY, variables.id] });
      // Editing due_date/status changes the dashboard's upcoming_debts widget.
      invalidateFinancialQueries(queryClient);
    },
  });
}

export function useDeleteDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => debtsApi.deleteDebt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBTS_QUERY_KEY });
      invalidateFinancialQueries(queryClient);
    },
  });
}

export function usePayDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PayDebtInput }) => debtsApi.payDebt(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DEBTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...DEBTS_QUERY_KEY, variables.id] });
      invalidateFinancialQueries(queryClient);
    },
  });
}
