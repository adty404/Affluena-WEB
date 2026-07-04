import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as authApi from '../api/auth'
import { getAccessToken, setTokens, clearTokens } from '../lib/token'
import { queryClient } from '../lib/queryClient'
import type { AuthUser, LoginRequest, RegisterRequest } from '../types/auth'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (req: LoginRequest) => Promise<void>
  register: (req: RegisterRequest) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(getAccessToken()))

  const bootstrap = useCallback(async () => {
    if (!getAccessToken()) {
      setIsLoading(false)
      return
    }
    try {
      const res = await authApi.me()
      setUser(res.user)
    } catch {
      clearTokens()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  const login = useCallback(async (req: LoginRequest) => {
    const session = await authApi.login(req)
    setTokens(session.tokens)
    setUser(session.user)
  }, [])

  const register = useCallback(async (req: RegisterRequest) => {
    const session = await authApi.register(req)
    setTokens(session.tokens)
    setUser(session.user)
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
    // Drop every cached query so the next user on this tab never sees the
    // previous user's data. Runs on ALL logout paths (Topbar, Profile, etc.).
    queryClient.clear()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
