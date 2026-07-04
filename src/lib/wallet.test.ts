import { describe, it, expect } from 'vitest'
import { canManageWallet } from './wallet'

describe('canManageWallet', () => {
  it('allows editing a personal wallet (no role)', () => {
    expect(canManageWallet({ role: undefined })).toBe(true)
    expect(canManageWallet({})).toBe(true)
  })

  it('allows the owner of a shared wallet', () => {
    expect(canManageWallet({ role: 'owner' })).toBe(true)
  })

  it('blocks members and viewers of a shared wallet', () => {
    expect(canManageWallet({ role: 'member' })).toBe(false)
    expect(canManageWallet({ role: 'viewer' })).toBe(false)
  })
})
