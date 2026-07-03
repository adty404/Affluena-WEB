import { describe, it, expect } from 'vitest'
import { buildCategoryBreakdown, UNCATEGORIZED_NAME } from './categoryBreakdown'
import type { Category } from '../types/category'
import type { Transaction } from '../types/transaction'

function tx(partial: Partial<Transaction>): Transaction {
  return {
    id: Math.random().toString(36).slice(2),
    user_id: 'u1',
    type: 'expense',
    wallet_id: 'w1',
    amount_minor: 0,
    tag_ids: [],
    transaction_at: '2026-07-01T00:00:00Z',
    note: '',
    created_at: '2026-07-01T00:00:00Z',
    updated_at: '2026-07-01T00:00:00Z',
    ...partial,
  }
}

function cat(id: string, type: Category['type'], extra: Partial<Category> = {}): Category {
  return {
    id,
    user_id: 'u1',
    name: id,
    type,
    created_at: '2026-07-01T00:00:00Z',
    updated_at: '2026-07-01T00:00:00Z',
    ...extra,
  }
}

describe('buildCategoryBreakdown', () => {
  it('sums income and expense separately and ignores transfers/adjustments', () => {
    const categories = [cat('food', 'expense'), cat('salary', 'income')]
    const transactions = [
      tx({ type: 'expense', category_id: 'food', amount_minor: 3000 }),
      tx({ type: 'expense', category_id: 'food', amount_minor: 1000 }),
      tx({ type: 'income', category_id: 'salary', amount_minor: 10000 }),
      tx({ type: 'transfer', amount_minor: 5000 }),
      tx({ type: 'adjustment', amount_minor: 500 }),
    ]
    const b = buildCategoryBreakdown(transactions, categories)
    expect(b.expenseTotalMinor).toBe(4000)
    expect(b.incomeTotalMinor).toBe(10000)
    expect(b.expenseByCategory).toHaveLength(1)
    expect(b.expenseByCategory[0]).toMatchObject({ categoryId: 'food', amountMinor: 4000, percentOfTotal: 100 })
    expect(b.incomeByCategory[0]).toMatchObject({ categoryId: 'salary', amountMinor: 10000 })
  })

  it('buckets missing/unknown categories into "Tanpa kategori" and sorts desc by amount', () => {
    const categories = [cat('food', 'expense')]
    const transactions = [
      tx({ type: 'expense', category_id: 'food', amount_minor: 2000 }),
      tx({ type: 'expense', category_id: undefined, amount_minor: 5000 }),
      tx({ type: 'expense', category_id: 'ghost', amount_minor: 1000 }),
    ]
    const b = buildCategoryBreakdown(transactions, categories)
    // Uncategorized (5000) + ghost (1000) collapse into one null bucket = 6000.
    expect(b.expenseTotalMinor).toBe(8000)
    expect(b.expenseByCategory[0]).toMatchObject({ categoryId: null, name: UNCATEGORIZED_NAME, amountMinor: 6000 })
    expect(b.expenseByCategory[1]).toMatchObject({ categoryId: 'food', amountMinor: 2000 })
  })

  it('carries a category chosen icon and color onto its slice', () => {
    const categories = [cat('food', 'expense', { icon: 'food', color: '#C2553F' })]
    const transactions = [tx({ type: 'expense', category_id: 'food', amount_minor: 1000 })]
    const b = buildCategoryBreakdown(transactions, categories)
    expect(b.expenseByCategory[0]).toMatchObject({ icon: 'food', color: '#C2553F', type: 'expense' })
  })

  it('reports zero percent when a type has no total', () => {
    const b = buildCategoryBreakdown([], [])
    expect(b.expenseByCategory).toHaveLength(0)
    expect(b.incomeTotalMinor).toBe(0)
  })
})
