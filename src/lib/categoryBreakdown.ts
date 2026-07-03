import type { Category } from '../types/category'
import type { Transaction } from '../types/transaction'

/** The neutral bucket for transactions with no (or an unknown) category. */
export const UNCATEGORIZED_NAME = 'Tanpa kategori'

export interface CategorySlice {
  /** The category id, or null for the "Tanpa kategori" bucket. */
  categoryId: string | null
  name: string
  /** Chosen semantic icon id ('' = fallback), from the resolved category. */
  icon: string
  /** Chosen `#RRGGBB` color ('' = none / uncategorized). */
  color: string
  /** For icon fallback: expense vs income glyph. */
  type: 'income' | 'expense'
  amountMinor: number
  /** Share of this type's month total, 0–100. */
  percentOfTotal: number
}

export interface CategoryBreakdown {
  expenseByCategory: CategorySlice[]
  incomeByCategory: CategorySlice[]
  expenseTotalMinor: number
  incomeTotalMinor: number
}

/**
 * Groups a month's transactions by category into expense/income breakdowns,
 * mirroring mobile's `currentMonthCategoryBreakdownProvider`: income and expense
 * are summed separately (transfers/adjustments ignored), each bucket joined to
 * the category catalog for its name/icon/color, and a null/unknown category
 * collapses into a shared "Tanpa kategori" bucket. Slices are sorted desc by
 * amount.
 */
export function buildCategoryBreakdown(
  transactions: readonly Transaction[],
  categories: readonly Category[],
): CategoryBreakdown {
  const categoryById = new Map(categories.map((c) => [c.id, c]))
  const UNCATEGORIZED_KEY = ''

  const expenseByKey = new Map<string, number>()
  const incomeByKey = new Map<string, number>()
  let expenseTotal = 0
  let incomeTotal = 0

  for (const tx of transactions) {
    const key = tx.category_id && categoryById.has(tx.category_id) ? tx.category_id : UNCATEGORIZED_KEY
    if (tx.type === 'income') {
      incomeByKey.set(key, (incomeByKey.get(key) ?? 0) + tx.amount_minor)
      incomeTotal += tx.amount_minor
    } else if (tx.type === 'expense') {
      expenseByKey.set(key, (expenseByKey.get(key) ?? 0) + tx.amount_minor)
      expenseTotal += tx.amount_minor
    }
    // transfer / adjustment: ignored (they don't belong to a spend/earn category).
  }

  const slicesFor = (byKey: Map<string, number>, total: number, fallbackType: 'income' | 'expense'): CategorySlice[] => {
    const slices: CategorySlice[] = []
    for (const [key, amountMinor] of byKey) {
      const percentOfTotal = total <= 0 ? 0 : (amountMinor / total) * 100
      const category = key ? categoryById.get(key) : undefined
      if (!category) {
        slices.push({ categoryId: null, name: UNCATEGORIZED_NAME, icon: '', color: '', type: fallbackType, amountMinor, percentOfTotal })
      } else {
        slices.push({
          categoryId: category.id,
          name: category.name,
          icon: category.icon ?? '',
          color: category.color ?? '',
          type: category.type,
          amountMinor,
          percentOfTotal,
        })
      }
    }
    return slices.sort((a, b) => b.amountMinor - a.amountMinor)
  }

  return {
    expenseByCategory: slicesFor(expenseByKey, expenseTotal, 'expense'),
    incomeByCategory: slicesFor(incomeByKey, incomeTotal, 'income'),
    expenseTotalMinor: expenseTotal,
    incomeTotalMinor: incomeTotal,
  }
}
