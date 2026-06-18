import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  changePassword,
  listSessions,
  revokeSession,
  updateAccount,
} from '../api/auth'
import type {
  ChangePasswordRequest,
  UpdateAccountRequest,
} from '../types/auth'
import { queryKeys } from '../lib/queryClient'

export function useUpdateAccount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateAccountRequest) => updateAccount(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.me })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => changePassword(payload),
  })
}

export function useSessions() {
  return useQuery({
    queryKey: ['auth', 'sessions'],
    queryFn: () => listSessions(),
  })
}

export function useRevokeSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) => revokeSession(sessionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['auth', 'sessions'] })
    },
  })
}
