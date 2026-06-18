import { apiFetch } from './client'
import type {
  Transaction,
  TransactionCreateRequest,
  TransactionListResponse,
  TransactionUpdateRequest,
  SplitTransactionRequest,
  SplitTransactionResponse,
} from '../types/transaction'

export interface TransactionListParams {
  type?: string
  wallet_id?: string
  category_id?: string
  tag_id?: string
  from?: string
  to?: string
  limit?: number
  offset?: number
  sort?: string
}

export function listTransactions(params: TransactionListParams = {}) {
  return apiFetch<TransactionListResponse>('/api/v1/transactions', {
    method: 'GET',
    query: params as Record<string, string | number | boolean | null | undefined>,
  })
}

export function getTransaction(id: string) {
  return apiFetch<Transaction>(`/api/v1/transactions/${id}`)
}

export function createTransaction(payload: TransactionCreateRequest) {
  return apiFetch<Transaction>('/api/v1/transactions', {
    method: 'POST',
    body: payload,
  })
}

export function updateTransaction(id: string, payload: TransactionUpdateRequest) {
  return apiFetch<Transaction>(`/api/v1/transactions/${id}`, {
    method: 'PUT',
    body: payload,
  })
}

export function deleteTransaction(id: string) {
  return apiFetch<void>(`/api/v1/transactions/${id}`, {
    method: 'DELETE',
  })
}

export function splitBill(payload: SplitTransactionRequest) {
  return apiFetch<SplitTransactionResponse>('/api/v1/transactions/split', {
    method: 'POST',
    body: payload,
  })
}
