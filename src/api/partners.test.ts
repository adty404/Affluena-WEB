import { describe, it, expect, vi, beforeEach } from 'vitest'
import { invitePartner, listPartners, respondPartner, revokePartner } from './partners'
import { setTokens, clearTokens } from '../lib/token'

const expectedBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

function mockFetch(body: unknown, status = 200) {
  // Mirror the real API: status-only responses (201/200/204 from gin's
  // c.Status) carry no body and no JSON content-type.
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    body === null
      ? new Response(null, { status })
      : new Response(JSON.stringify(body), {
          status,
          headers: { 'content-type': 'application/json' },
        })
  )
}

describe('partners api ("Berbagi Dompet")', () => {
  beforeEach(() => {
    clearTokens()
    vi.restoreAllMocks()
    setTokens({ access_token: 'tok', refresh_token: 'ref' })
  })

  it('lists links from GET /api/v1/partners', async () => {
    const link = {
      id: 'l-1',
      direction: 'owned',
      status: 'pending',
      user_id: 'u-2',
      email: 'viewer@example.com',
      name: 'Viewer',
      created_at: '2026-07-01T00:00:00Z',
      updated_at: '2026-07-01T00:00:00Z',
    }
    const fetchMock = mockFetch({ partners: [link] })

    const res = await listPartners()

    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toBe(`${expectedBaseUrl}/api/v1/partners`)
    expect(init?.method).toBe('GET')
    expect(res.partners).toEqual([link])
  })

  it('tolerates a null partners list (empty on the API side)', async () => {
    mockFetch({ partners: null })
    const res = await listPartners()
    expect(res.partners ?? []).toEqual([])
  })

  it('invites by email via POST /api/v1/partners/invites', async () => {
    const fetchMock = mockFetch(null, 201)

    await invitePartner({ email: 'friend@example.com' })

    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toBe(`${expectedBaseUrl}/api/v1/partners/invites`)
    expect(init?.method).toBe('POST')
    expect(JSON.parse(String(init?.body))).toEqual({ email: 'friend@example.com' })
  })

  it('responds to an invite via PATCH /api/v1/partners/:id', async () => {
    const fetchMock = mockFetch(null, 200)

    await respondPartner('link-9', { status: 'joined' })

    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toBe(`${expectedBaseUrl}/api/v1/partners/link-9`)
    expect(init?.method).toBe('PATCH')
    expect(JSON.parse(String(init?.body))).toEqual({ status: 'joined' })
  })

  it('revokes a link via DELETE /api/v1/partners/:id', async () => {
    const fetchMock = mockFetch(null, 204)

    await revokePartner('link-9')

    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toBe(`${expectedBaseUrl}/api/v1/partners/link-9`)
    expect(init?.method).toBe('DELETE')
  })

  it('surfaces the API error for a share-limit conflict', async () => {
    mockFetch({ error: 'You can share with at most 5 people. Remove someone first to add another.' }, 409)

    await expect(invitePartner({ email: 'sixth@example.com' })).rejects.toMatchObject({
      status: 409,
      error: 'You can share with at most 5 people. Remove someone first to add another.',
    })
  })
})
