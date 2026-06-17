import { describe, it, expect, beforeEach } from 'vitest'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './token'

describe('token storage', () => {
  beforeEach(() => localStorage.clear())

  it('returns null when nothing stored', () => {
    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
  })

  it('persists access and refresh tokens', () => {
    setTokens({ access_token: 'a', refresh_token: 'b' })
    expect(getAccessToken()).toBe('a')
    expect(getRefreshToken()).toBe('b')
  })

  it('clears both tokens', () => {
    setTokens({ access_token: 'a', refresh_token: 'b' })
    clearTokens()
    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
  })
})
