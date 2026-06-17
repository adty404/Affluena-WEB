import { apiFetch } from './client'
import type {
  Wallet,
  WalletCreateRequest,
  WalletInviteRequest,
  WalletListResponse,
  WalletMemberResponse,
  WalletUpdateRequest,
} from '../types/wallet'

export interface ListParams {
  limit?: number
  offset?: number
  sort?: string
}

export function listWallets(params: ListParams = {}) {
  return apiFetch<WalletListResponse>('/api/v1/wallets', {
    method: 'GET',
    query: {
      limit: params.limit,
      offset: params.offset,
      sort: params.sort,
    },
  })
}

export function getWallet(id: string) {
  return apiFetch<Wallet>(`/api/v1/wallets/${id}`)
}

export function createWallet(payload: WalletCreateRequest) {
  return apiFetch<Wallet>('/api/v1/wallets', {
    method: 'POST',
    body: payload,
  })
}

export function updateWallet(id: string, payload: WalletUpdateRequest) {
  return apiFetch<Wallet>(`/api/v1/wallets/${id}`, {
    method: 'PUT',
    body: payload,
  })
}

export function deleteWallet(id: string) {
  return apiFetch<void>(`/api/v1/wallets/${id}`, {
    method: 'DELETE',
  })
}

export function inviteMember(walletId: string, payload: WalletInviteRequest) {
  return apiFetch<{ status: string }>(`/api/v1/wallets/${walletId}/invites`, {
    method: 'POST',
    body: payload,
  })
}

export function respondToInvite(
  walletId: string,
  memberId: string,
  payload: WalletMemberResponse
) {
  return apiFetch<{ status: string }>(
    `/api/v1/wallets/${walletId}/members/${memberId}`,
    {
      method: 'PATCH',
      body: payload,
    }
  )
}
