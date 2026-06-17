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

  it('refreshes exactly once for concurrent 401s and retries with new bearer', async () => {
    setTokens({ access_token: 'stale', refresh_token: 'ref' })

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
      const url = String(input)
      if (url.endsWith('/api/v1/auth/refresh')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              tokens: { access_token: 'fresh', refresh_token: 'ref2' },
            }),
            { status: 200, headers: { 'content-type': 'application/json' } }
          )
        )
      }
      // protected endpoint: 401 first two hits (initial concurrent pair), 200 on retries
      const callsForUrl = fetchMock.mock.calls.filter((c) => String(c[0]) === url).length
      if (callsForUrl > 2) {
        return Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          })
        )
      }
      return Promise.resolve(new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 }))
    })

    const [a, b] = await Promise.all([apiFetch('/api/v1/widgets'), apiFetch('/api/v1/widgets')])

    expect(a).toEqual({ ok: true })
    expect(b).toEqual({ ok: true })

    const refreshCalls = fetchMock.mock.calls.filter((c) =>
      String(c[0]).endsWith('/api/v1/auth/refresh')
    )
    expect(refreshCalls).toHaveLength(1)

    const retryCalls = fetchMock.mock.calls.filter(
      (c) => String(c[0]).endsWith('/api/v1/widgets')
    )
    expect(retryCalls).toHaveLength(4) // 2 initial + 2 retries
    const retryAuthHeader = (retryCalls[2][1]?.headers as Headers).get('authorization')
    expect(retryAuthHeader).toBe('Bearer fresh')
  })
})
