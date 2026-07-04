import { describe, it, expect } from 'vitest'
import { canManageWallet, canRecordToWallet } from './wallet'

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

describe('canRecordToWallet', () => {
  it('allows recording to an owned or member (writable) wallet', () => {
    expect(canRecordToWallet({ type: 'cash' })).toBe(true)
    expect(canRecordToWallet({ type: 'bank', role: 'owner' })).toBe(true)
    expect(canRecordToWallet({ type: 'e_wallet', role: 'member' })).toBe(true)
  })

  it('blocks read-only viewer wallets (API rejects writes → silent create failure)', () => {
    expect(canRecordToWallet({ type: 'bank', role: 'viewer' })).toBe(false)
  })

  it('blocks goal wallets (funded via goal contributions, not manual transactions)', () => {
    expect(canRecordToWallet({ type: 'goal', role: 'owner' })).toBe(false)
    expect(canRecordToWallet({ type: 'goal' })).toBe(false)
  })
})
