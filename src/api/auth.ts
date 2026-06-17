import { apiFetch } from './client'
import type {
  AuthSession,
  AuthUser,
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
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

export function refresh(payload: RefreshRequest) {
  return apiFetch<AuthSession>('/api/v1/auth/refresh', {
    method: 'POST',
    body: payload,
    anonymous: true,
  })
}

export function me() {
  return apiFetch<{ user: AuthUser }>('/api/v1/auth/me')
}
