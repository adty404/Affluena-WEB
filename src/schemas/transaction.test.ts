import { describe, it, expect } from 'vitest'
import { transactionSchema } from './transaction'

const baseTransfer = {
  type: 'transfer' as const,
  wallet_id: 'w-source',
  to_wallet_id: 'w-dest',
  amount_minor: 100000,
  transaction_at: '2026-07-12T10:00',
}

describe('transactionSchema fee_minor (transfer admin fee)', () => {
  it('accepts a transfer without a fee', () => {
    expect(transactionSchema.safeParse(baseTransfer).success).toBe(true)
  })

  it('accepts a transfer with a non-negative integer fee', () => {
    expect(transactionSchema.safeParse({ ...baseTransfer, fee_minor: 2500 }).success).toBe(true)
    expect(transactionSchema.safeParse({ ...baseTransfer, fee_minor: 0 }).success).toBe(true)
  })

  it('rejects a negative fee', () => {
    const result = transactionSchema.safeParse({ ...baseTransfer, fee_minor: -1 })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('fee_minor'))).toBe(true)
    }
  })

  it('rejects a fractional fee (money is integer minor units)', () => {
    expect(transactionSchema.safeParse({ ...baseTransfer, fee_minor: 2500.5 }).success).toBe(false)
  })
})
