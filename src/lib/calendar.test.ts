import { describe, it, expect } from 'vitest'
import {
  bucketByLocalDay,
  dayLabelID,
  daysInMonth,
  mondayStartOffset,
  monthLabelID,
} from './calendar'
import type { Transaction } from '../types/transaction'

function tx(partial: Partial<Transaction>): Transaction {
  return {
    id: Math.random().toString(36).slice(2),
    user_id: 'u1',
    type: 'expense',
    wallet_id: 'w1',
    amount_minor: 0,
    tag_ids: [],
    transaction_at: '2026-07-15T12:00:00Z',
    note: '',
    created_at: '2026-07-01T00:00:00Z',
    updated_at: '2026-07-01T00:00:00Z',
    ...partial,
  }
}

/**
 * RFC3339 string for a LOCAL wall-clock instant, so assertions about "local
 * day" bucketing hold in whatever timezone the test runner uses.
 */
function atLocal(year: number, month: number, day: number, hour = 12): string {
  return new Date(year, month - 1, day, hour).toISOString()
}

describe('bucketByLocalDay', () => {
  it('drops rows outside the month by local day (widened ±1 day window)', () => {
    const rows = [
      tx({ transaction_at: atLocal(2026, 6, 30), amount_minor: 1000 }),
      tx({ transaction_at: atLocal(2026, 7, 1), amount_minor: 2000 }),
      tx({ transaction_at: atLocal(2026, 7, 31), amount_minor: 3000 }),
      tx({ transaction_at: atLocal(2026, 8, 1), amount_minor: 4000 }),
      tx({ transaction_at: 'not-a-date', amount_minor: 9000 }),
    ]
    const b = bucketByLocalDay(rows, 2026, 7)
    expect([...b.days.keys()]).toEqual([1, 31])
    expect(b.expenseMinor).toBe(5000)
    expect(b.incomeMinor).toBe(0)
  })

  it('lists transfers/adjustments in the day but counts them in neither total', () => {
    const rows = [
      tx({ type: 'income', transaction_at: atLocal(2026, 7, 3), amount_minor: 5000 }),
      tx({ type: 'transfer', transaction_at: atLocal(2026, 7, 3), amount_minor: 7000 }),
      tx({ type: 'adjustment', transaction_at: atLocal(2026, 7, 3), amount_minor: 300 }),
    ]
    const b = bucketByLocalDay(rows, 2026, 7)
    const day = b.days.get(3)!
    expect(day.transactions).toHaveLength(3)
    expect(day.incomeMinor).toBe(5000)
    expect(day.expenseMinor).toBe(0)
    expect(b.incomeMinor).toBe(5000)
    expect(b.expenseMinor).toBe(0)
  })

  it('sums income/expense per day and across the month, sorting each day oldest-first', () => {
    const rows = [
      tx({ id: 'late', type: 'expense', transaction_at: atLocal(2026, 7, 3, 20), amount_minor: 1500 }),
      tx({ id: 'early', type: 'expense', transaction_at: atLocal(2026, 7, 3, 8), amount_minor: 500 }),
      tx({ type: 'income', transaction_at: atLocal(2026, 7, 10), amount_minor: 10000 }),
    ]
    const b = bucketByLocalDay(rows, 2026, 7)
    expect(b.days.size).toBe(2)
    expect(b.days.get(3)).toMatchObject({ incomeMinor: 0, expenseMinor: 2000 })
    expect(b.days.get(10)).toMatchObject({ incomeMinor: 10000, expenseMinor: 0 })
    expect(b.days.get(3)!.transactions.map((t) => t.id)).toEqual(['early', 'late'])
    expect(b.incomeMinor).toBe(10000)
    expect(b.expenseMinor).toBe(2000)
    expect(b.days.has(15)).toBe(false)
  })

  it('returns empty buckets for no input', () => {
    const b = bucketByLocalDay([], 2026, 7)
    expect(b.days.size).toBe(0)
    expect(b.incomeMinor).toBe(0)
    expect(b.expenseMinor).toBe(0)
  })
})

describe('calendar date helpers', () => {
  it('labels months and days in Indonesian', () => {
    expect(monthLabelID(2026, 7)).toBe('Juli 2026')
    expect(dayLabelID(2026, 7, 3)).toBe('3 Juli 2026')
  })

  it('computes Monday-start leading blanks', () => {
    expect(mondayStartOffset(2026, 7)).toBe(2) // 1 Juli 2026 = Rabu
    expect(mondayStartOffset(2026, 6)).toBe(0) // 1 Juni 2026 = Senin
  })

  it('knows month lengths incl. leap years', () => {
    expect(daysInMonth(2026, 7)).toBe(31)
    expect(daysInMonth(2026, 2)).toBe(28)
    expect(daysInMonth(2028, 2)).toBe(29)
  })
})
