import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  listTransactions,
  splitBill,
  type TransactionListParams,
  updateTransaction,
} from '../api/transactions'
import type {
  TransactionCreateRequest,
  TransactionUpdateRequest,
  SplitTransactionRequest,
} from '../types/transaction'
import { queryKeys, invalidateFinancialQueries } from '../lib/queryClient'

export function useTransactions(params: TransactionListParams = {}) {
  return useQuery({
    queryKey: queryKeys.transactions.list(params as Record<string, unknown>),
    queryFn: () => listTransactions(params),
  })
}

export function useTransaction(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.transactions.detail(id) : ['transactions', 'detail', 'undefined'],
    queryFn: () => getTransaction(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: TransactionCreateRequest) => createTransaction(payload),
    onSuccess: () => {
      invalidateFinancialQueries(qc)
    },
  })
}

export function useUpdateTransaction(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: TransactionUpdateRequest) => updateTransaction(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.transactions.detail(id) })
      invalidateFinancialQueries(qc)
    },
  })
}

export function useDeleteTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      invalidateFinancialQueries(qc)
    },
  })
}

export function useSplitBill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SplitTransactionRequest) => splitBill(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.debts.all })
      invalidateFinancialQueries(qc)
    },
  })
}
