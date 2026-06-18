export interface AuthUser {
  id: string
  email: string
  name: string
  avatar_url: string
  created_at: string
  updated_at: string
}

export interface AuthSession {
  id: string
  user_id: string
  token_suffix: string
  user_agent?: string
  ip_address?: string
  expires_at: string
  created_at: string
  revoked_at?: string
  last_used_at?: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  access_token_expires_at?: string
  refresh_token_expires_at?: string
}

export interface AuthSession {
  user: AuthUser
  tokens: AuthTokens
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface RefreshRequest {
  refresh_token: string
}

export interface UpdateAccountRequest {
  name: string
  avatar_url: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}
