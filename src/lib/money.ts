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
