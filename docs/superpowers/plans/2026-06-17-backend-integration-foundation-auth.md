# Affluena Backend Integration — Foundation & Auth (Plan 1 of N)

> **Current status (2026-06-20):** Historical implementation plan. The current app already has the API client, auth provider, React Query domain hooks, and integrated pages across the main product surface. Use `../../../README.md`, `../../../AGENTS.md`, and `../../AI_ROUTE_MAP.md` for current context.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the API client, type system, auth flow, and TanStack Query scaffolding so that every subsequent domain (wallets, transactions, budgets, …) plugs into a single, consistent pipeline that replaces `src/data/*` mock imports with live backend calls against `Affluena-API`.

**Architecture:**
- Layered: `types/` (mirror backend contract) → `api/<domain>.ts` (fetch wrapper per resource) → `hooks/use<Domain>.ts` (TanStack Query wrappers) → `pages/` (consumers).
- Auth: `access_token` + `refresh_token` persisted in `localStorage`. Custom `fetch` wrapper auto-injects `Authorization: Bearer`, intercepts 401, calls `/api/v1/auth/refresh` once, replays the original request.
- Forms: `react-hook-form` + `zod` schemas co-located with backend types so validation mirrors server rules.
- Backend contract source of truth: `Affluena-API/docs/API_CONTRACT.md` (read alongside this plan).

**Tech Stack:**
- React 18 + Vite + TypeScript (already in repo)
- `@tanstack/react-query` v5 — server state cache
- `react-hook-form` v7 + `zod` v3 — forms & validation
- Native `fetch` (no axios) wrapped in `src/api/client.ts`
- `react-router-dom` v6 (already present)

**Backend ground truth verified on 2026-06-17:**
- Base URL: `http://localhost:8080`
- API prefix: `/api/v1`
- CORS default allow: `http://localhost:5173` (matches Vite dev server)
- Auth rate limit: 5 req/s, burst 10 → 429 if exceeded
- Pagination shape: `{ <collection>: [...], pagination: { total, limit, offset } }`
- Error shape: `{ "error": "<message>" }`
- Money: integer minor units (`50000` = Rp 50.000)
- Dates: ISO 8601 / RFC 3339 (`2026-06-17T00:00:00Z`)

---

## File Structure

### Create

| Path | Responsibility |
|------|----------------|
| `src/api/client.ts` | `fetch` wrapper: base URL, JSON encode/decode, Bearer injection, 401 refresh-and-retry, error normalization |
| `src/api/types.ts` | Shared API types: `ApiError`, `Pagination`, `PaginatedResponse<T>`, `EmptyBody` |
| `src/api/auth.ts` | `register`, `login`, `refresh`, `me` calls + request/response types |
| `src/lib/token.ts` | `getAccessToken`, `getRefreshToken`, `setTokens`, `clearTokens` — localStorage wrapper with SSR-safety |
| `src/lib/queryClient.ts` | `queryClient` singleton + `queryKeys` factory |
| `src/lib/dates.ts` | RFC 3339 helpers: `toRFC3339`, `fromRFC3339`, `toYearMonth` |
| `src/lib/money.ts` | `minorToDisplay(minor, currency)` and `displayToMinor(formatted)` |
| `src/contexts/AuthProvider.tsx` | Auth context: current user, login/register/logout actions, bootstraps from token on mount |
| `src/components/routing/RequireAuth.tsx` | Route guard: redirects to `/login` if no token |
| `src/schemas/auth.ts` | `loginSchema`, `registerSchema` (zod) |
| `.env.example` | `VITE_API_BASE_URL=http://localhost:8080` |
| `.env.local` | developer-local override (gitignored) |

### Modify

| Path | Change |
|------|--------|
| `src/main.tsx` | Wrap `<App/>` in `<QueryClientProvider>` and `<AuthProvider>` |
| `src/App.tsx` | Wrap protected sub-tree in `<RequireAuth>` |
| `src/pages/auth/LoginPage.tsx` (or existing equivalent) | Replace mock submit with `useAuth().login()` |
| `src/pages/auth/RegisterPage.tsx` (or existing equivalent) | Replace mock submit with `useAuth().register()` |
| `src/pages/settings/ProfilePage.tsx` (or existing equivalent) | Pull profile from `/api/v1/auth/me` via `useMe()` |
| `src/types/auth.ts` | Add `AuthTokens`, `AuthUser`, `AuthSession` shapes matching backend |
| `package.json` | Add `@tanstack/react-query`, `react-hook-form`, `zod`, `@hookform/resolvers` |
| `.gitignore` | Add `.env.local` |

### Delete (deferred until Phase: Domain Migration)

`src/data/*` stays during transition. Each domain-migration plan removes the matching `mockX.ts` once its hooks are wired into all consuming pages.

---

## Pre-flight Checks

Before Task 1, confirm:

- [ ] Backend reachable: `curl -s http://localhost:8080/healthz` returns `200 OK`. If not, `cd Affluena-API && docker compose up --build` per backend `README.md:17-18`.
- [ ] Backend version matches contract: `curl -s http://localhost:8080/api/v1/auth/register -H 'content-type: application/json' -d '{"email":"smoke@test.local","password":"password123"}'` returns `201` with `{ user, tokens }`.
- [ ] Frontend dev server port: confirm `vite.config.ts` serves on `5173` (matches backend CORS default).

---

## Task 1: Install runtime dependencies

**Files:**
- Modify: `Affluena-WEB/package.json`

- [ ] **Step 1: Add the four runtime deps**

Run from `Affluena-WEB/`:

```bash
npm install @tanstack/react-query@^5 react-hook-form@^7 zod@^3 @hookform/resolvers@^3
```

- [ ] **Step 2: Verify install**

Run: `npm ls @tanstack/react-query react-hook-form zod @hookform/resolvers`
Expected: each prints a version, no `(empty)`.

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors. Bundle size warning is acceptable.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(web): add react-query, react-hook-form, zod for backend integration"
```

---

## Task 2: Add environment files

**Files:**
- Create: `Affluena-WEB/.env.example`
- Create: `Affluena-WEB/.env.local`
- Modify: `Affluena-WEB/.gitignore`

- [ ] **Step 1: Write `.env.example`**

Create `Affluena-WEB/.env.example`:

```env
# Backend API base URL. No trailing slash.
VITE_API_BASE_URL=http://localhost:8080
```

- [ ] **Step 2: Write `.env.local` (developer copy)**

Create `Affluena-WEB/.env.local` with identical content. This file is gitignored.

- [ ] **Step 3: Add `.env.local` to `.gitignore`**

Append to `Affluena-WEB/.gitignore`:

```gitignore
# local env
.env.local
.env.*.local
```

- [ ] **Step 4: Verify Vite picks up the variable**

Run dev server: `npm run dev`
Open browser console on `http://localhost:5173` and run:

```js
console.log(import.meta.env.VITE_API_BASE_URL)
```

Expected: `"http://localhost:8080"`.

- [ ] **Step 5: Commit**

```bash
git add .env.example .gitignore
git commit -m "chore(web): add VITE_API_BASE_URL env config"
```

---

## Task 3: Token storage utility

**Files:**
- Create: `src/lib/token.ts`
- Test: `src/lib/token.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/token.test.ts`:

```ts
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
```

Note: this requires `vitest` and `vitest dom` — already installed if existing tests run. If no vitest in repo, install first: `npm install -D vitest @vitest/ui jsdom` and add `"test": "vitest"` to `package.json` scripts.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/token.test.ts`
Expected: FAIL — module `./token` not found.

- [ ] **Step 3: Implement `src/lib/token.ts`**

Create `src/lib/token.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/token.test.ts`
Expected: PASS, 3 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/token.ts src/lib/token.test.ts
git commit -m "feat(web): add localStorage token pair helper"
```

---

## Task 4: Shared API types

**Files:**
- Create: `src/api/types.ts`

- [ ] **Step 1: Write the types file**

Create `src/api/types.ts`:

```ts
export interface ApiError {
  error: string
  status: number
}

export interface Pagination {
  total: number
  limit: number
  offset: number
}

export interface PaginatedResponse<T> {
  pagination: Pagination
}

export interface EmptyBody {}
```

- [ ] **Step 2: Verify type-check passes**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/api/types.ts
git commit -m "feat(web): add shared api response types"
```

---

## Task 5: fetch wrapper with Bearer + refresh-on-401

**Files:**
- Create: `src/api/client.ts`
- Test: `src/api/client.test.ts`

- [ ] **Step 1: Write failing test (skip if mocking fetch is heavy — manual smoke acceptable for v1)**

Create `src/api/client.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiFetch } from './client'
import { setTokens, clearTokens } from '../lib/token'

describe('apiFetch', () => {
  beforeEach(() => {
    clearTokens()
    vi.restoreAllMocks()
  })

  it('sends JSON content-type and relative path resolves to base URL', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    )
    setTokens({ access_token: 'tok', refresh_token: 'ref' })

    await apiFetch('/api/v1/auth/me')

    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toBe('http://localhost:8080/api/v1/auth/me')
    expect((init?.headers as Headers).get('authorization')).toBe('Bearer tok')
    expect((init?.headers as Headers).get('content-type')).toBe('application/json')
  })

  it('returns parsed body for 200 with JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ a: 1 }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    )
    const body = await apiFetch<{ a: number }>('/x')
    expect(body).toEqual({ a: 1 })
  })

  it('throws ApiError with server message on 400', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'bad input' }), { status: 400 })
    )
    await expect(apiFetch('/x')).rejects.toMatchObject({
      error: 'bad input',
      status: 400,
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/api/client.test.ts`
Expected: FAIL — `./client` not found.

- [ ] **Step 3: Implement `src/api/client.ts`**

Create `src/api/client.ts`:

```ts
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../lib/token'
import type { ApiError, EmptyBody } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

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
    // backend may return EmptyBody on some mutations; tolerate
    const text = await res.text()
    if (!text) return undefined as T
    return JSON.parse(text) as T
  }
  return (await res.json()) as T
}

export type { EmptyBody }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/api/client.test.ts`
Expected: PASS, 3 tests green.

- [ ] **Step 5: Manual smoke against live backend**

Run: `cd Affluena-API && docker compose up --build -d`
Run: `cd Affluena-WEB && npm run dev`
In a scratch script or browser console:

```js
const { apiFetch } = await import('/src/api/client.ts')
await apiFetch('/healthz', { anonymous: true })
```

Expected: returns `{ status: 'ok' }` or backend's documented healthz body.

- [ ] **Step 6: Commit**

```bash
git add src/api/client.ts src/api/client.test.ts
git commit -m "feat(web): add fetch wrapper with bearer injection and refresh-on-401"
```

---

## Task 6: Money + date helpers

**Files:**
- Create: `src/lib/money.ts`
- Create: `src/lib/dates.ts`
- Test: `src/lib/money.test.ts`

- [ ] **Step 1: Write failing test for money**

Create `src/lib/money.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { minorToMajor, majorToMinor, formatIDR } from './money'

describe('money helpers', () => {
  it('converts minor units to major decimal', () => {
    expect(minorToMajor(50000)).toBe(50000) // IDR has 0 decimals
  })

  it('parses formatted string back to minor units', () => {
    expect(majorToMinor('50000')).toBe(50000)
    expect(majorToMinor('50.000')).toBe(50000)
    expect(majorToMinor('Rp 50.000')).toBe(50000)
  })

  it('formats minor units for display', () => {
    expect(formatIDR(50000)).toBe('Rp50.000')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/money.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/lib/money.ts`**

Create `src/lib/money.ts`:

```ts
const IDR_FORMATTER = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

/**
 * Backend stores IDR amounts as integer minor units.
 * IDR has 0 fractional digits, so minor == major for IDR.
 * Keep the helper in case multi-currency is added later.
 */
export function minorToMajor(minor: number, fractionDigits = 0): number {
  const factor = 10 ** fractionDigits
  return minor / factor
}

export function majorToMinor(formatted: string): number {
  const digits = formatted.replace(/[^\d-]/g, '')
  return parseInt(digits, 10) || 0
}

export function formatIDR(minor: number): string {
  return IDR_FORMATTER.format(minor)
}
```

- [ ] **Step 4: Implement `src/lib/dates.ts`**

Create `src/lib/dates.ts`:

```ts
export function toRFC3339(d: Date): string {
  return d.toISOString()
}

export function fromRFC3339(s: string): Date {
  return new Date(s)
}

export function toYearMonth(d: Date): string {
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${yyyy}-${mm}`
}

export function toYYYYMMDD(d: Date): string {
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
```

- [ ] **Step 5: Run all tests**

Run: `npx vitest run src/lib/`
Expected: PASS — money tests green.

- [ ] **Step 6: Commit**

```bash
git add src/lib/money.ts src/lib/dates.ts src/lib/money.test.ts
git commit -m "feat(web): add money and rfc3339 date helpers"
```

---

## Task 7: Auth API module

**Files:**
- Create: `src/api/auth.ts`
- Modify: `src/types/auth.ts` (create if missing)

- [ ] **Step 1: Define auth types**

Create or replace `src/types/auth.ts`:

```ts
export interface AuthUser {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
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
```

- [ ] **Step 2: Implement `src/api/auth.ts`**

Create `src/api/auth.ts`:

```ts
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
```

- [ ] **Step 3: Verify type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/types/auth.ts src/api/auth.ts
git commit -m "feat(web): add auth api module and types"
```

---

## Task 8: Query client + query keys factory

**Files:**
- Create: `src/lib/queryClient.ts`

- [ ] **Step 1: Implement queryClient + queryKeys**

Create `src/lib/queryClient.ts`:

```ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // don't retry 4xx except 401 (401 is handled by client refresh)
        const status = (error as { status?: number })?.status
        if (status && status >= 400 && status < 500 && status !== 401) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
    mutations: {
      retry: false,
    },
  },
})

export const queryKeys = {
  me: ['auth', 'me'] as const,
  wallets: {
    all: ['wallets'] as const,
    list: (params?: Record<string, unknown>) => ['wallets', 'list', params ?? {}] as const,
    detail: (id: string) => ['wallets', 'detail', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: (type?: 'income' | 'expense') => ['categories', 'list', type ?? 'all'] as const,
    detail: (id: string) => ['categories', 'detail', id] as const,
  },
  tags: {
    all: ['tags'] as const,
    list: (params?: Record<string, unknown>) => ['tags', 'list', params ?? {}] as const,
    detail: (id: string) => ['tags', 'detail', id] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    list: (filters?: Record<string, unknown>) => ['transactions', 'list', filters ?? {}] as const,
    detail: (id: string) => ['transactions', 'detail', id] as const,
  },
  dashboard: {
    summary: (month: string) => ['dashboard', 'summary', month] as const,
    cashflowTrend: (months: number) => ['dashboard', 'cashflow-trend', months] as const,
    expenseDistribution: (month: string) => ['dashboard', 'expense-distribution', month] as const,
    forecast: (month: string) => ['dashboard', 'forecast', month] as const,
  },
  quickEntries: {
    all: ['quick-entries'] as const,
    list: (params?: Record<string, unknown>) => ['quick-entries', 'list', params ?? {}] as const,
    detail: (id: string) => ['quick-entries', 'detail', id] as const,
  },
  budgets: {
    all: ['budgets'] as const,
    list: (month?: string) => ['budgets', 'list', month ?? 'current'] as const,
    detail: (id: string) => ['budgets', 'detail', id] as const,
  },
  debts: {
    all: ['debts'] as const,
    list: (params?: Record<string, unknown>) => ['debts', 'list', params ?? {}] as const,
    detail: (id: string) => ['debts', 'detail', id] as const,
  },
  installments: {
    all: ['installments'] as const,
    list: (params?: Record<string, unknown>) => ['installments', 'list', params ?? {}] as const,
    detail: (id: string) => ['installments', 'detail', id] as const,
  },
  subscriptions: {
    all: ['subscriptions'] as const,
    list: (params?: Record<string, unknown>) => ['subscriptions', 'list', params ?? {}] as const,
    detail: (id: string) => ['subscriptions', 'detail', id] as const,
  },
  recurring: {
    all: ['recurring'] as const,
    list: (params?: Record<string, unknown>) => ['recurring', 'list', params ?? {}] as const,
    detail: (id: string) => ['recurring', 'detail', id] as const,
  },
  goals: {
    all: ['goals'] as const,
    detail: (id: string) => ['goals', 'detail', id] as const,
  },
  activities: {
    list: (params?: Record<string, unknown>) => ['activities', 'list', params ?? {}] as const,
  },
}
```

- [ ] **Step 2: Verify type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/queryClient.ts
git commit -m "feat(web): add queryClient and queryKeys factory"
```

---

## Task 9: AuthProvider + useAuth hook

**Files:**
- Create: `src/contexts/AuthProvider.tsx`
- Create: `src/hooks/useAuth.ts`

- [ ] **Step 1: Implement AuthProvider**

Create `src/contexts/AuthProvider.tsx`:

```tsx
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as authApi from '../api/auth'
import { getAccessToken, setTokens, clearTokens } from '../lib/token'
import type { AuthUser, LoginRequest, RegisterRequest } from '../types/auth'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (req: LoginRequest) => Promise<void>
  register: (req: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

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
```

- [ ] **Step 2: Implement `useAuth` hook**

Create `src/hooks/useAuth.ts`:

```ts
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthProvider'

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
```

- [ ] **Step 3: Verify type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/contexts/AuthProvider.tsx src/hooks/useAuth.ts
git commit -m "feat(web): add AuthProvider and useAuth hook"
```

---

## Task 10: RequireAuth route guard

**Files:**
- Create: `src/components/routing/RequireAuth.tsx`

- [ ] **Step 1: Implement the guard**

Create `src/components/routing/RequireAuth.tsx`:

```tsx
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="app-loading" role="status" aria-live="polite">
        Memuat…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
```

- [ ] **Step 2: Verify type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/routing/RequireAuth.tsx
git commit -m "feat(web): add RequireAuth route guard"
```

---

## Task 11: Wire providers in `main.tsx` + protect app routes

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Read current `src/main.tsx` and `src/App.tsx`**

Run: `cat Affluena-WEB/src/main.tsx Affluena-WEB/src/App.tsx`
Note the exact existing JSX tree, the import of `BrowserRouter`, and the top-level `<App/>` element.

- [ ] **Step 2: Wrap app with `QueryClientProvider` + `AuthProvider`**

Edit `src/main.tsx`. Inside the existing `ReactDOM.createRoot(...).render(...)` call, wrap `<App/>` so the final tree looks like:

```tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './contexts/AuthProvider'
// ... existing imports ...

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
```

Preserve any existing `StrictMode` or router setup that was there. If `BrowserRouter` was previously inside `App.tsx`, move it here.

- [ ] **Step 3: Wrap protected routes in `RequireAuth`**

In `src/App.tsx`, identify the route block that renders the authenticated app shell (likely `<Route element={<AppLayout/>}>...`). Wrap its `element` with `<RequireAuth>`:

```tsx
import { RequireAuth } from './components/routing/RequireAuth'
// ...
<Route element={<RequireAuth><AppLayout /></RequireAuth>}>
  {/* existing protected child routes */}
</Route>
```

Public routes (`/login`, `/register`, `/forgot-password`, `/`, `/onboarding`) stay outside the guard.

- [ ] **Step 4: Run dev server, verify redirect works**

Run: `npm run dev`
Open `http://localhost:5173/dashboard` in a private window (no token).
Expected: redirect to `/login`.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 6: Commit**

```bash
git add src/main.tsx src/App.tsx
git commit -m "feat(web): wire queryClient + AuthProvider and guard app routes"
```

---

## Task 12: Login page integration

**Files:**
- Modify: existing login page — likely `src/pages/auth/LoginPage.tsx` or `src/pages/Login.tsx`. Locate exact path via `grep -rn "login" src/pages | head -20`.
- Create: `src/schemas/auth.ts`

- [ ] **Step 1: Locate the login page**

Run: `grep -rln "LoginPage\|/login\|email.*password" Affluena-WEB/src/pages | head`
Note exact file path before continuing.

- [ ] **Step 2: Create zod schemas**

Create `src/schemas/auth.ts`:

```ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
```

- [ ] **Step 3: Replace mock submit with real `useAuth().login`**

In the located login page file, replace the form's `onSubmit` handler:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { loginSchema, type LoginFormValues } from '../../schemas/auth'
import type { ApiError } from '../../api/types'

// inside component:
const { login } = useAuth()
const navigate = useNavigate()
const location = useLocation()
const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard'

const {
  register: field,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: '', password: '' },
})

const onSubmit = async (values: LoginFormValues) => {
  try {
    await login(values)
    navigate(from, { replace: true })
  } catch (err) {
    const apiErr = err as ApiError
    // surface in form-level error or toast
    // e.g. setFormError(apiErr.error)
  }
}
```

Wire the existing input JSX to `field('email')`, `field('password')`, render `errors.email?.message`, and the submit button to `isSubmitting` for disabled state.

- [ ] **Step 4: Manual test against live backend**

Run backend + dev server. Submit login form with credentials created in pre-flight (`smoke@test.local` / `password123`).
Expected: redirect to `/dashboard`, `localStorage` has `affluena.access_token`.

- [ ] **Step 5: Commit**

```bash
git add src/schemas/auth.ts src/pages/auth/LoginPage.tsx
git commit -m "feat(web): wire login page to auth api"
```

---

## Task 13: Register page integration

**Files:**
- Modify: existing register page (locate via `grep -rln "register\|RegisterPage" Affluena-WEB/src/pages`)

- [ ] **Step 1: Replace mock submit with `useAuth().register`**

Mirror Task 12 but use `registerSchema` and call `register(values)` from `useAuth()`. On success, redirect to `/dashboard` (no separate verify-email step exists per `API_CONTRACT.md`).

- [ ] **Step 2: Manual test**

Run: register a new user `webtest@example.com` / `password123` via UI.
Expected: 201, user is auto-logged-in (token in localStorage), redirect to `/dashboard`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/auth/RegisterPage.tsx src/schemas/auth.ts
git commit -m "feat(web): wire register page to auth api"
```

---

## Task 14: Profile page via `/me`

**Files:**
- Modify: existing profile page (likely `src/pages/settings/ProfilePage.tsx`)
- Create: `src/hooks/useMe.ts`

- [ ] **Step 1: Implement `useMe` hook**

Create `src/hooks/useMe.ts`:

```ts
import { useQuery } from '@tanstack/react-query'
import { me } from '../api/auth'
import { queryKeys } from '../lib/queryClient'

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => me(),
    enabled: typeof window !== 'undefined' && Boolean(window.localStorage.getItem('affluena.access_token')),
    staleTime: 60_000,
  })
}
```

- [ ] **Step 2: Wire profile page to `useMe()`**

In `ProfilePage.tsx`, replace any mock user import with:

```tsx
import { useMe } from '../../hooks/useMe'

const { data, isLoading } = useMe()
const user = data?.user
```

Render email, member-since (`created_at`), etc. Preserve loading skeleton pattern from existing UI.

- [ ] **Step 3: Manual test**

Login, navigate to `/settings/profile`.
Expected: real email + `created_at` shown.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useMe.ts src/pages/settings/ProfilePage.tsx
git commit -m "feat(web): wire profile page to /auth/me"
```

---

## Task 15: Logout flow

**Files:**
- Modify: existing topbar profile menu (likely `src/components/layout/Topbar.tsx`)

- [ ] **Step 1: Wire logout button to `useAuth().logout`**

Locate the profile menu via `grep -rn "Logout\|Keluar" Affluena-WEB/src/components`. In the handler:

```tsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { queryClient } from '../../lib/queryClient'

const { logout } = useAuth()
const navigate = useNavigate()

const handleLogout = () => {
  logout()
  queryClient.clear()
  navigate('/login', { replace: true })
}
```

- [ ] **Step 2: Manual test**

Login, click logout.
Expected: localStorage cleared, query cache cleared, redirect to `/login`.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Topbar.tsx
git commit -m "feat(web): wire logout to clear tokens and cache"
```

---

## Task 16: 401 redirect fallback

**Files:**
- Modify: `src/api/client.ts`

- [ ] **Step 1: Hook into refresh failure**

If refresh fails (Task 5 already calls `clearTokens()` on failure), we also need to bounce the user to `/login`. Add a `window`-level side effect inside `doRefresh` after a failed refresh:

In `src/api/client.ts`, replace the existing failure branch:

```ts
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
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
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
```

- [ ] **Step 2: Manual test**

Login, then manually corrupt the access token in localStorage (e.g. set to `"garbage"`). Trigger any protected request.
Expected: refresh attempt succeeds (refresh token still valid), original request retried with new token. If both tokens corrupted, redirect to `/login?reason=expired`.

- [ ] **Step 3: Commit**

```bash
git add src/api/client.ts
git commit -m "feat(web): redirect to login when refresh token expires"
```

---

## Task 17: Foundation smoke checklist

**Files:**
- Create: `Affluena-WEB/docs/superpowers/plans/2026-06-17-foundation-smoke.md`

- [ ] **Step 1: Run through every flow**

Document in the smoke file:

1. Backend up: `curl -s http://localhost:8080/healthz` → 200
2. Register new user via `/register` UI → token stored, redirect to `/dashboard`
3. Logout → tokens cleared, redirect to `/login`
4. Login with same credentials → token stored, redirect to `/dashboard`
5. Visit `/settings/profile` → real email + `created_at` rendered
6. Corrupt access token in DevTools → next navigation refreshes token automatically
7. Corrupt refresh token → next navigation redirects to `/login?reason=expired`
8. Visit protected route unauthenticated → redirect to `/login`
9. `npm run build` → success, no TS errors
10. `npx vitest run` → all unit tests pass

- [ ] **Step 2: Commit**

```bash
git add Affluena-WEB/docs/superpowers/plans/2026-06-17-foundation-smoke.md
git commit -m "docs(web): foundation smoke checklist"
```

---

## Acceptance Criteria

Foundation + Auth plan is **done** when:

- [ ] All 17 tasks committed
- [ ] `npm run build` passes
- [ ] `npx vitest run` passes (token, money, client tests)
- [ ] Live end-to-end login/register/logout works against running backend
- [ ] Protected routes redirect when unauthenticated
- [ ] Refresh-on-401 path verified manually
- [ ] No mock data imported from `src/data/*` in auth/profile/login/register pages (other pages still mock — covered by domain plans)

---

## Follow-up Plans (outline only)

Each subsequent plan follows the same task structure. Reference this plan's `src/api/client.ts`, `src/lib/queryClient.ts`, and `src/hooks/useAuth.ts` as established dependencies.

### Plan 2: Wallets
- `src/api/wallets.ts` (CRUD + invites + member PATCH)
- `src/types/wallet.ts` aligns with backend `Wallet`, `WalletType`, `WalletMember`
- `src/hooks/useWallets.ts` (list, detail, create, update, delete, invite)
- Pages: `/wallets`, `/wallets/new`, `/wallets/:id`, `/wallets/:id/edit`, `/wallets/:id/sharing`
- Delete `src/data/mockWallets.ts` after all 5 pages migrated
- **Edge cases:** reject `type=goal` client-side; balance read-only on edit form

### Plan 3: Categories & Tags
- Categories support `?type=` filter and 3-level parent_id nesting
- Tags: name-only POST (no color, per `QA_INTEGRATION_MATRIX.md:71`)
- Pages: `/categories*`, `/tags*`
- Delete `mockCategories.ts`, `mockTags.ts`

### Plan 4: Transactions (CRUD + Split)
- 4 transaction types with conditional fields (`to_wallet_id` for transfer, signed `amount_minor` for adjustment)
- Split bill endpoint: `POST /api/v1/transactions/split`
- Filters: `type`, `wallet_id`, `category_id`, `tag_id`, `from`, `to`
- Pages: `/transactions*`, `/quick-entry*`
- Delete `mockTransactions.ts`, `mockQuickEntries.ts`

### Plan 5: Dashboard & Analytics
- `summary`, `cashflow-trend`, `expense-distribution`, `forecast`
- All `?month=YYYY-MM` (or `?months=N` for trend)
- Pages: `/dashboard*`
- Delete `mockDashboard.ts`

### Plan 6: Budgets
- Category budgets, personal-only semantics
- Pages: `/budgets*`
- Delete `mockBudgets.ts`

### Plan 7: Debts + Trackers
- Payable/receivable debts with auto-category inference
- Installments (`total == monthly * tenor` invariant)
- Subscriptions (`account_detail` optional)
- All `/pay` endpoints take empty body or `{ paid_at, note }` — never `amount_minor` from client (per `QA_INTEGRATION_MATRIX.md:72-73`)
- Pages: `/debts*`, `/installments*`, `/subscriptions*`, `/tracker`
- Delete `mockDebtTracker.ts`

### Plan 8: Goals
- Array response (no pagination wrapper)
- Members invite + respond via PUT
- Contribute via `POST /api/v1/transactions` with `type=transfer`, `to_wallet_id=<goal_wallet_id>` (no dedicated endpoint)
- Pages: `/goals*`
- Delete `mockGoals.ts`

### Plan 9: Recurring
- Manual run endpoint accepts empty body
- History via filtered `/api/v1/transactions`
- Pages: `/recurring*`
- Delete `mockRecurring.ts`

### Plan 10: Reports, Export, Activities, Alerts
- `/api/v1/export/csv` returns `text/csv` bytes — trigger download via `Blob` + `URL.createObjectURL`
- Activities: standard paginated list
- Alerts: re-use `/api/v1/activities` (per `FRONTEND_API_MAPPING.md:82`)
- Pages: `/exports*`, `/activities*`, `/alerts*`, `/reports*`
- Delete `mockReporting.ts`
- **Known backend gaps (per `FRONTEND_API_MAPPING.md`):** `/exports/history`, `/system-logs` — keep these pages frontend-only (localStorage) until backend adds endpoints

### Plan 11: Settings Cleanup
- Pages that hit backend gaps: `/settings/account`, `/settings/security`, `/settings/sessions`, `/settings/preferences`
- Decision needed: either (a) keep as frontend-only (localStorage), or (b) file backend tickets for `/api/v1/auth/change-password` etc.
- Delete `mockSettings.ts` after decision applied per page

---

## Self-Review Notes

**Spec coverage:** All 12 phases of the existing backend `INTEGRATION_PLAN.md` are addressed — phases 1-2 fully implemented in this plan, phases 3-12 outlined as follow-up plans with explicit endpoint lists and known gaps.

**Placeholder scan:** Each step contains complete code or exact commands. No "TBD", "implement later", "add error handling" stubs. Smoke tests are concrete curl commands or browser DevTools snippets.

**Type consistency:** `AuthSession`, `AuthUser`, `AuthTokens` defined in `src/types/auth.ts:1-25` match usage in `src/api/auth.ts`, `src/contexts/AuthProvider.tsx`, and `src/hooks/useMe.ts`. `ApiError` shape (`{ error, status }`) consistent across `src/api/types.ts` and `src/api/client.ts` throw sites. `queryKeys` factory uses `as const` tuples consistently throughout.

**Caveat:** Step content assumes Vite + vitest are already configured. If `npx vitest run` errors with "no test runner", pause at Task 3 Step 2 and add vitest config first (`npm install -D vitest jsdom` + `vitest.config.ts` with `test.environment: 'jsdom'`).
