import { apiFetch } from './client'
import type {
  AuthSession,
  AuthSessionRecord,
  AuthUser,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  UpdateAccountRequest,
} from '../types/auth'

export function register(payload: RegisterRequest) {
  return apiFetch<AuthSession>('/api/v1/auth/register', {
    method: 'POST',
    body: payload,
    anonymous: true,
  })
}

export function login(payload: LoginRequest) {
  return apiFetch<AuthSession>('/api/v1/auth/login', {
    method: 'POST',
    body: payload,
    anonymous: true,
  })
}

export function me() {
  return apiFetch<{ user: AuthUser }>('/api/v1/auth/me')
}

export function updateAccount(payload: UpdateAccountRequest) {
  return apiFetch<{ user: AuthUser }>('/api/v1/auth/account', {
    method: 'PUT',
    body: payload,
  })
}

export function changePassword(payload: ChangePasswordRequest) {
  return apiFetch<void>('/api/v1/auth/password', {
    method: 'PUT',
    body: payload,
  })
}

export function listSessions() {
  return apiFetch<{ sessions: AuthSessionRecord[] }>('/api/v1/auth/sessions')
}

export function revokeSession(sessionId: string) {
  return apiFetch<void>(`/api/v1/auth/sessions/${sessionId}`, {
    method: 'DELETE',
  })
}

export function requestPasswordReset(email: string) {
  return apiFetch<void>('/api/v1/auth/forgot-password', {
    method: 'POST',
    body: { email },
    anonymous: true,
  })
}

export function resetPassword(token: string, newPassword: string) {
  return apiFetch<void>('/api/v1/auth/reset-password', {
    method: 'POST',
    body: { token, new_password: newPassword },
    anonymous: true,
  })
}
