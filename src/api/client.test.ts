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
