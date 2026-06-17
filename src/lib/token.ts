const ACCESS_KEY = 'affluena.access_token'
const REFRESH_KEY = 'affluena.refresh_token'

export interface TokenPair {
  access_token: string
  refresh_token: string
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(REFRESH_KEY)
}

export function setTokens(pair: TokenPair): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACCESS_KEY, pair.access_token)
  window.localStorage.setItem(REFRESH_KEY, pair.refresh_token)
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ACCESS_KEY)
  window.localStorage.removeItem(REFRESH_KEY)
}
