import { describe, it, expect } from 'vitest'
import { toLocalDatetimeInput, toYearMonth, toYYYYMMDD } from './dates'

describe('toLocalDatetimeInput', () => {
  it('formats a Date as a local YYYY-MM-DDTHH:mm value (no timezone shift)', () => {
    // A local instant: the output must match the LOCAL wall-clock parts, not UTC.
    const d = new Date(2026, 6, 2, 9, 5) // 2 Jul 2026, 09:05 local
    expect(toLocalDatetimeInput(d)).toBe('2026-07-02T09:05')
  })

  it('zero-pads month, day, hour, and minute', () => {
    const d = new Date(2026, 0, 4, 3, 7) // 4 Jan 2026, 03:07 local
    expect(toLocalDatetimeInput(d)).toBe('2026-01-04T03:07')
  })

  it('round-trips through new Date(value).getTime()', () => {
    const original = new Date(2026, 10, 15, 14, 30)
    const value = toLocalDatetimeInput(original)
    // datetime-local values are parsed as local time by new Date(...)
    const parsed = new Date(value)
    expect(parsed.getFullYear()).toBe(original.getFullYear())
    expect(parsed.getMonth()).toBe(original.getMonth())
    expect(parsed.getDate()).toBe(original.getDate())
    expect(parsed.getHours()).toBe(original.getHours())
    expect(parsed.getMinutes()).toBe(original.getMinutes())
  })

  it('falls back to now for an invalid date instead of returning NaN', () => {
    const result = toLocalDatetimeInput(new Date('not-a-real-date'))
    expect(result).not.toContain('NaN')
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  })
})

describe('toYearMonth (local)', () => {
  it('returns the local YYYY-MM', () => {
    const d = new Date(2026, 5, 1, 0, 0) // 1 Jun 2026 local
    expect(toYearMonth(d)).toBe('2026-06')
  })
})

describe('toYYYYMMDD', () => {
  it('formats an ISO date', () => {
    expect(toYYYYMMDD(new Date('2026-06-15T00:00:00Z'))).toBe('2026-06-15')
  })
})
