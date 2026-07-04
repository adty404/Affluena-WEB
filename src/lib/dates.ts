export function toRFC3339(d: Date): string {
  return d.toISOString()
}

export function fromRFC3339(s: string): Date {
  return new Date(s)
}

export function toYearMonth(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${yyyy}-${mm}`
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/**
 * Format a Date as the LOCAL `YYYY-MM-DDTHH:mm` value an
 * `<input type="datetime-local">` expects. Using the raw ISO string
 * (`toISOString().slice(0,16)`) here is a bug: it is UTC, so a local instant
 * gets shifted by the timezone offset (e.g. 7h in WIB) and lands on the wrong
 * day/month. If `d` is invalid (e.g. a malformed `transaction_at`), fall back
 * to the current local time so the field is never left blank/NaN.
 */
export function toLocalDatetimeInput(d: Date): string {
  const safe = Number.isNaN(d.getTime()) ? new Date() : d
  return `${safe.getFullYear()}-${pad(safe.getMonth() + 1)}-${pad(safe.getDate())}T${pad(safe.getHours())}:${pad(safe.getMinutes())}`
}

export function toYYYYMMDD(d: Date): string {
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Format a date value (RFC3339 string, Date, or ms) as an Indonesian date,
 * e.g. `1 Jun 2026`. API dates are full RFC3339 timestamps even for DATE
 * columns, so parse defensively and fall back to '-' on empty/invalid input
 * instead of rendering `Invalid Date` or a raw ISO string.
 */
export function formatDateID(value: string | number | Date | null | undefined): string {
  if (value === null || value === undefined || value === '') return '-'
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Like {@link formatDateID} but includes the time, e.g. `1 Jun 2026, 20.10`.
 */
export function formatDateTimeID(value: string | number | Date | null | undefined): string {
  if (value === null || value === undefined || value === '') return '-'
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
