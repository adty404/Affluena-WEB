import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../lib/token'
import type { ApiError, EmptyBody } from './types'

const ENV: ImportMetaEnv | undefined = (import.meta as { env?: ImportMetaEnv }).env
const BASE_URL = ENV?.VITE_API_BASE_URL ?? 'http://localhost:8080'

let refreshing: Promise<boolean> | null = null

async function doRefresh(): Promise<boolean> {
  const refresh = getRefreshToken()
  if (!refresh) return false
  const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }),
  })
  if (!res.ok) {
    clearTokens()
    const PUBLIC_PATHS = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/onboarding']
    if (typeof window !== 'undefined' && !PUBLIC_PATHS.includes(window.location.pathname)) {
      window.location.assign('/login?reason=expired')
    }
    return false
  }
  const data = (await res.json()) as {
    tokens: { access_token: string; refresh_token: string }
  }
  setTokens(data.tokens)
  return true
}

export interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Record<string, string | number | boolean | undefined | null>
  signal?: AbortSignal
  /** skip auth header (used by login/register/refresh themselves) */
  anonymous?: boolean
}

function buildUrl(path: string, query?: ApiFetchOptions['query']): string {
  const url = new URL(
    path.startsWith('http') ? path : `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
  )
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
    }
  }
  return url.toString()
}

export async function apiFetch<T = unknown>(
  path: string,
  opts: ApiFetchOptions = {}
): Promise<T> {
  const { method = 'GET', body, query, signal, anonymous } = opts

  const headers = new Headers({ 'content-type': 'application/json', accept: 'application/json' })
  if (!anonymous) {
    const access = getAccessToken()
    if (access) headers.set('authorization', `Bearer ${access}`)
  }

  const init: RequestInit = {
    method,
    headers,
    signal,
    body: body === undefined || body === null ? undefined : JSON.stringify(body),
  }

  let res = await fetch(buildUrl(path, query), init)

  if (res.status === 401 && !anonymous) {
    if (!refreshing) refreshing = doRefresh().finally(() => {
      refreshing = null
    })
    const ok = await refreshing
    if (ok) {
      const access = getAccessToken()
      if (access) headers.set('authorization', `Bearer ${access}`)
      res = await fetch(buildUrl(path, query), init)
    }
  }

  if (!res.ok) {
    let message = res.statusText
    try {
      const errBody = (await res.json()) as { error?: string }
      if (errBody?.error) message = errBody.error
    } catch {
      // non-JSON error; keep statusText
    }
    const err: ApiError = { error: message, status: res.status }
    throw err
  }

  if (res.status === 204) return undefined as T
  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) return undefined as T
  if (method === 'DELETE' || method === 'PUT') {
    const text = await res.text()
    if (!text) return undefined as T
    return JSON.parse(text) as T
  }
  return (await res.json()) as T
}

export type { EmptyBody }
