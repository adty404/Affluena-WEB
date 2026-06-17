export interface AuthUser {
  id: string
  email: string
  created_at: string
  updated_at: string
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
