/**
 * Pure helper for the Beranda "Tren kekayaan bersih" sparkline. Ported 1:1 from
 * mobile's `buildNetWorthSeries`
 * (`lib/features/dashboard/application/net_worth_series.dart`) so both clients
 * draw the same series.
 *
 * The API has no historical net-worth endpoint, but it does expose the monthly
 * cashflow trend — and net worth moves by exactly the net cashflow each month.
 * So the series is reconstructed by anchoring the CURRENT net worth on the
 * newest month and walking BACKWARD: the previous month's closing net worth =
 * this month's closing net worth minus this month's net cashflow.
 *
 * **Known limitation**: the cashflow trend only sees income/expense
 * transactions. Wallet INITIAL balances and `adjustment` transactions change
 * the real balance without appearing in the trend, so their amounts are
 * effectively back-propagated into every reconstructed (older) point. As an
 * interim mitigation the series is CLAMPED to start at the month the user's
 * earliest wallet was created (via `monthKeys` + `earliestWalletCreatedAt`):
 * points older than that would claim wealth existed before any wallet did, so
 * they are dropped. Within the clamped window the distortion remains — a truly
 * accurate history needs API support (per-bucket adjustment + initial-balance
 * deltas).
 *
 * `monthlyNetCashflowsMinor` is ordered oldest → newest, one entry per month,
 * with the LAST entry being the current (anchor) month. The returned series
 * preserves that order; its last element is exactly `currentNetWorthMinor`.
 * Negative-cashflow months produce a rising step backward (money left, so the
 * past balance was higher).
 *
 * `monthKeys` is the parallel list of the trend buckets' month labels — any
 * string starting `YYYY-MM` (the API may send either `2026-06` or a full
 * RFC3339 timestamp, see CLAUDE.md). `earliestWalletCreatedAt` is the RFC3339
 * `created_at` of the user's oldest wallet. When either is absent or malformed,
 * or the lengths mismatch, clamping is skipped (fail-open) and the full series
 * is returned.
 *
 * An empty input returns an empty series (nothing to draw).
 */
export function buildNetWorthSeries(
  currentNetWorthMinor: number,
  monthlyNetCashflowsMinor: number[],
  options: {
    monthKeys?: readonly string[];
    earliestWalletCreatedAt?: string | null;
  } = {},
): number[] {
  if (monthlyNetCashflowsMinor.length === 0) return [];

  const series = new Array<number>(monthlyNetCashflowsMinor.length).fill(0);
  series[series.length - 1] = currentNetWorthMinor;
  for (let i = series.length - 1; i > 0; i -= 1) {
    series[i - 1] = series[i] - monthlyNetCashflowsMinor[i];
  }

  const start = clampStartIndex(
    options.monthKeys,
    series.length,
    options.earliestWalletCreatedAt,
  );
  return start === 0 ? series : series.slice(start);
}

/**
 * The first series index whose month is >= the earliest wallet's creation
 * month, or 0 (no clamping) when the inputs are absent, malformed, or
 * mismatched. The anchor (newest) point is always kept: even when every bucket
 * predates the wallet, the current net worth itself is real.
 */
function clampStartIndex(
  monthKeys: readonly string[] | undefined,
  seriesLength: number,
  earliestWalletCreatedAt: string | null | undefined,
): number {
  if (!monthKeys || !earliestWalletCreatedAt) return 0;
  if (monthKeys.length !== seriesLength) return 0;

  const earliestMonth = monthPrefix(earliestWalletCreatedAt);
  if (earliestMonth === null) return 0;

  for (let i = 0; i < monthKeys.length; i += 1) {
    const month = monthPrefix(monthKeys[i]);
    if (month === null) return 0; // Malformed bucket label: fail open.
    // Same-format `YYYY-MM` strings compare correctly lexicographically.
    if (month >= earliestMonth) return i;
  }
  return seriesLength - 1;
}

/** The `YYYY-MM` prefix of an API date/bucket label, or null when malformed. */
function monthPrefix(value: string): string | null {
  const match = /^\d{4}-\d{2}/.exec(value);
  return match ? match[0] : null;
}
