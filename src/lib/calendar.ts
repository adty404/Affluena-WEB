import type { Transaction } from '../types/transaction'

/** One local calendar day's money activity. */
export interface CalendarDaySummary {
  incomeMinor: number
  expenseMinor: number
  /** Every transaction of the day (incl. transfer/adjustment), oldest first. */
  transactions: Transaction[]
}

/** A whole month of transactions, aggregated per local day. */
export interface CalendarMonthBuckets {
  incomeMinor: number
  expenseMinor: number
  /** Keyed by day-of-month (1-based); days without activity are absent. */
  days: Map<number, CalendarDaySummary>
}

/**
 * Buckets transactions into per-day summaries for one month, mirroring
 * mobile's `calendarMonthProvider`:
 *
 * - `month` is **1-based** (Januari = 1), matching the `yyyy-MM` month key.
 * - Rows whose `transaction_at` falls outside the month **by LOCAL day** are
 *   dropped (the fetch window is widened ±1 day, so callers must not assume
 *   pre-filtered input). Invalid dates are dropped too.
 * - Only `income`/`expense` count toward the totals; `transfer`/`adjustment`
 *   rows still appear in the day's transaction list.
 * - Each day's transactions are sorted oldest-first.
 */
export function bucketByLocalDay(
  transactions: readonly Transaction[],
  year: number,
  month: number,
): CalendarMonthBuckets {
  const byDay = new Map<number, Transaction[]>()
  for (const tx of transactions) {
    const at = new Date(tx.transaction_at)
    if (Number.isNaN(at.getTime())) continue
    if (at.getFullYear() !== year || at.getMonth() + 1 !== month) continue
    const list = byDay.get(at.getDate())
    if (list) list.push(tx)
    else byDay.set(at.getDate(), [tx])
  }

  let monthIncome = 0
  let monthExpense = 0
  const days = new Map<number, CalendarDaySummary>()
  for (const day of [...byDay.keys()].sort((a, b) => a - b)) {
    const txs = byDay.get(day)!
    txs.sort((a, b) => new Date(a.transaction_at).getTime() - new Date(b.transaction_at).getTime())
    let income = 0
    let expense = 0
    for (const tx of txs) {
      if (tx.type === 'income') income += tx.amount_minor
      else if (tx.type === 'expense') expense += tx.amount_minor
      // transfer / adjustment: listed, but counted in neither total.
    }
    monthIncome += income
    monthExpense += expense
    days.set(day, { incomeMinor: income, expenseMinor: expense, transactions: txs })
  }

  return { incomeMinor: monthIncome, expenseMinor: monthExpense, days }
}

/** Weekday column headers, Monday-start (mirrors mobile's Kalender). */
export const WEEKDAYS_ID = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'] as const

const MONTH_YEAR_ID = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' })
const DAY_MONTH_YEAR_ID = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

/** `"Juli 2026"` — month heading label (`month` is 1-based). */
export function monthLabelID(year: number, month: number): string {
  return MONTH_YEAR_ID.format(new Date(year, month - 1, 1))
}

/** `"3 Juli 2026"` — long day label for headings and aria-labels. */
export function dayLabelID(year: number, month: number, day: number): string {
  return DAY_MONTH_YEAR_ID.format(new Date(year, month - 1, day))
}

/** Leading blank cells before day 1 in a Monday-start 7-column grid (0–6). */
export function mondayStartOffset(year: number, month: number): number {
  return (new Date(year, month - 1, 1).getDay() + 6) % 7
}

/** Number of days in the (1-based) month, leap-year aware. */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/** A calendar day as year + 1-based month + day-of-month. */
export interface CalendarDate {
  year: number
  month: number
  day: number
}

/**
 * Step a calendar day by `delta` days (usually ±1), crossing month and year
 * boundaries. `Date` normalises overflow — day 0 rolls to the last day of the
 * previous month, day 32 to the next month — so this handles month ends, leap
 * days, and year wraps without special cases. `month` is 1-based in and out.
 */
export function stepDay(year: number, month: number, day: number, delta: number): CalendarDate {
  const d = new Date(year, month - 1, day + delta)
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
}
