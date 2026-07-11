import { describe, it, expect } from 'vitest'
import { minorToMajor, majorToMinor, formatIDR, formatIDRCompact, maskedIDR } from './money'

describe('money helpers', () => {
  it('formats ultra-compact rupiah identically to mobile compactIdr', () => {
    expect(formatIDRCompact(950)).toBe('950')
    expect(formatIDRCompact(25000)).toBe('25rb')
    expect(formatIDRCompact(1000000)).toBe('1jt')
    expect(formatIDRCompact(1200000)).toBe('1,2jt')
    expect(formatIDRCompact(2500000000)).toBe('2,5M')
    expect(formatIDRCompact(-25000)).toBe('25rb') // sign is the caller's job
  })

  it('converts minor units to major decimal', () => {
    expect(minorToMajor(50000)).toBe(50000)
  })

  it('masks amounts as digit-free rupiah bullets (mobile parity)', () => {
    expect(maskedIDR()).toBe('Rp ••••••')
    expect(maskedIDR()).not.toMatch(/\d/)
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
