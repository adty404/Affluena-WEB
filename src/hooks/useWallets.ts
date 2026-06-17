import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createWallet,
  deleteWallet,
  getAnalytics,
  getWallet,
  inviteMember,
  listMembers,
  listWallets,
  updateWallet,
  type ListParams,
} from '../api/wallets'
import type {
  WalletCreateRequest,
  WalletInviteRequest,
  WalletUpdateRequest,
} from '../types/wallet'
import { queryKeys } from '../lib/queryClient'

export function useWallets(params: ListParams = {}) {
  return useQuery({
    queryKey: queryKeys.wallets.list(params as Record<string, unknown>),
    queryFn: () => listWallets(params),
  })
}

export function useWallet(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.wallets.detail(id) : ['wallets', 'detail', 'undefined'],
    queryFn: () => getWallet(id as string),
    enabled: Boolean(id),
  })
}

export function useWalletMembers(walletId: string | undefined) {
  return useQuery({
    queryKey: ['wallets', 'members', walletId ?? 'undefined'],
    queryFn: () => listMembers(walletId as string),
    enabled: Boolean(walletId),
  })
}

export function useWalletAnalytics(walletId: string | undefined, month: string) {
  return useQuery({
    queryKey: ['wallets', 'analytics', walletId ?? 'undefined', month],
    queryFn: () => getAnalytics(walletId as string, month),
    enabled: Boolean(walletId),
  })
}

export function useCreateWallet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: WalletCreateRequest) => createWallet(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.wallets.all })
    },
  })
}

export function useUpdateWallet(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: WalletUpdateRequest) => updateWallet(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.wallets.detail(id) })
      qc.invalidateQueries({ queryKey: queryKeys.wallets.all })
    },
  })
}

export function useDeleteWallet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteWallet(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.wallets.all })
    },
  })
}

export function useInviteMember(walletId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: WalletInviteRequest) => inviteMember(walletId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.wallets.detail(walletId) })
      qc.invalidateQueries({ queryKey: queryKeys.wallets.all })
      qc.invalidateQueries({ queryKey: ['wallets', 'members', walletId] })
    },
  })
}
