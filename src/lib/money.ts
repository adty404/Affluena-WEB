const IDR_FORMATTER = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export function minorToMajor(minor: number, fractionDigits = 0): number {
  const factor = 10 ** fractionDigits
  return minor / factor
}

export function majorToMinor(formatted: string): number {
  const digits = formatted.replace(/[^\d-]/g, '')
  return parseInt(digits, 10) || 0
}

export function formatIDR(minor: number): string {
  return IDR_FORMATTER.format(minor)
}

/**
 * Masked rupiah for the "Penyamaran nominal" privacy setting (mirrors mobile:
 * balances/summaries render `Rp ••••••` while the working ledger stays
 * visible). Digit-free by design — never leaks magnitude.
 */
export function maskedIDR(): string {
  return 'Rp ••••••'
}

/**
 * Ultra-compact rupiah for dense surfaces (calendar day cells), mirroring
 * mobile's `MoneyFormatter.compactIdr`: 950 → `950`, 25000 → `25rb`,
 * 1200000 → `1,2jt`, 2500000000 → `2,5M`. Uses the absolute value — callers
 * add their own `+`/`−` sign.
 */
export function formatIDRCompact(minor: number): string {
  const n = Math.abs(Math.trunc(minor))
  const compact = (value: number): string => {
    const rounded = Math.round(value * 10) / 10
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace('.', ',')
  }
  if (n >= 1_000_000_000) return `${compact(n / 1_000_000_000)}M`
  if (n >= 1_000_000) return `${compact(n / 1_000_000)}jt`
  if (n >= 1_000) return `${compact(n / 1_000)}rb`
  return String(n)
}
