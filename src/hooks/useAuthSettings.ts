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
import { setTokens } from '../lib/token'

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
    onSuccess: (session) => {
      // The password change revoked every other session; persist the fresh
      // token pair so this device stays signed in with the new credentials.
      setTokens(session.tokens)
    },
  })
}

export function useSessions() {
  return useQuery({
    queryKey: queryKeys.sessions,
    queryFn: () => listSessions(),
  })
}

export function useRevokeSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) => revokeSession(sessionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions })
    },
  })
}
