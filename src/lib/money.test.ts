import { describe, it, expect } from 'vitest'
import { minorToMajor, majorToMinor, formatIDR } from './money'

describe('money helpers', () => {
  it('converts minor units to major decimal', () => {
    expect(minorToMajor(50000)).toBe(50000)
  })

  it('parses formatted string back to minor units', () => {
    expect(majorToMinor('50000')).toBe(50000)
    expect(majorToMinor('50.000')).toBe(50000)
    expect(majorToMinor('Rp 50.000')).toBe(50000)
  })

  it('formats minor units for display', () => {
    expect(formatIDR(50000)).toBe('Rp 50.000')
  })
})
