import { describe, it, expect } from 'vitest'
import { buildNetWorthSeries } from './netWorth'

describe('buildNetWorthSeries', () => {
  it('anchors the newest point at the current net worth', () => {
    const series = buildNetWorthSeries(1000, [100, 200, 300])
    expect(series.length).toBe(3)
    expect(series[series.length - 1]).toBe(1000)
  })

  it("walks backward subtracting each month's net cashflow", () => {
    // Months (oldest → newest) with net cashflows 100, 200, 300 and a current
    // net worth of 1000:
    //   series[2] = 1000 (anchor, current month closed with +300)
    //   series[1] = 1000 - 300 = 700
    //   series[0] = 700 - 200 = 500  (cashflow[0] never subtracts — it happened
    //   DURING the oldest month, whose closing balance this is)
    expect(buildNetWorthSeries(1000, [100, 200, 300])).toEqual([500, 700, 1000])
  })

  it('a negative month raises the reconstructed past balance', () => {
    // The current month LOST 400 (net), so a month ago the balance was 400
    // higher than today.
    expect(buildNetWorthSeries(600, [0, -400])).toEqual([1000, 600])
  })

  it('preserves the oldest-to-newest order for a 12-point walk', () => {
    const cashflows = Array.from({ length: 12 }, (_, i) => (i + 1) * 10)
    const series = buildNetWorthSeries(0, cashflows)
    expect(series.length).toBe(12)
    expect(series[series.length - 1]).toBe(0)
    // Each step forward adds that month's cashflow back.
    for (let i = 1; i < series.length; i += 1) {
      expect(series[i] - series[i - 1]).toBe(cashflows[i])
    }
  })

  it('single-point input returns just the anchor', () => {
    expect(buildNetWorthSeries(4200, [999])).toEqual([4200])
  })

  it('empty input returns an empty series', () => {
    expect(buildNetWorthSeries(4200, [])).toEqual([])
  })

  it('handles a negative current net worth', () => {
    expect(buildNetWorthSeries(-500, [0, 250])).toEqual([-750, -500])
  })
})

describe('buildNetWorthSeries — earliest-wallet clamping', () => {
  // Reconstructed values without clamping: [500, 700, 1000].
  const cashflows = [100, 200, 300]
  const months = ['2026-04', '2026-05', '2026-06']

  it('drops points older than the earliest wallet creation month', () => {
    expect(
      buildNetWorthSeries(1000, cashflows, {
        monthKeys: months,
        earliestWalletCreatedAt: '2026-05-10T08:00:00Z',
      }),
    ).toEqual([700, 1000])
  })

  it('keeps the full series when the wallet predates the window', () => {
    expect(
      buildNetWorthSeries(1000, cashflows, {
        monthKeys: months,
        earliestWalletCreatedAt: '2025-01-01T00:00:00Z',
      }),
    ).toEqual([500, 700, 1000])
  })

  it('keeps only the anchor when every bucket predates the wallet', () => {
    // The current net worth itself is real even if the trend history is older
    // than the first wallet.
    expect(
      buildNetWorthSeries(1000, cashflows, {
        monthKeys: months,
        earliestWalletCreatedAt: '2026-07-01T00:00:00Z',
      }),
    ).toEqual([1000])
  })

  it('accepts RFC3339 month bucket labels (DATE-as-timestamp)', () => {
    expect(
      buildNetWorthSeries(1000, cashflows, {
        monthKeys: [
          '2026-04-01T00:00:00Z',
          '2026-05-01T00:00:00Z',
          '2026-06-01T00:00:00Z',
        ],
        earliestWalletCreatedAt: '2026-05-10T08:00:00Z',
      }),
    ).toEqual([700, 1000])
  })

  it('skips clamping without month keys', () => {
    expect(
      buildNetWorthSeries(1000, cashflows, {
        earliestWalletCreatedAt: '2026-05-10T08:00:00Z',
      }),
    ).toEqual([500, 700, 1000])
  })

  it('skips clamping without an earliest wallet date', () => {
    expect(
      buildNetWorthSeries(1000, cashflows, { monthKeys: months }),
    ).toEqual([500, 700, 1000])
  })

  it('fails open on mismatched month-key length', () => {
    expect(
      buildNetWorthSeries(1000, cashflows, {
        monthKeys: ['2026-05', '2026-06'],
        earliestWalletCreatedAt: '2026-05-10T08:00:00Z',
      }),
    ).toEqual([500, 700, 1000])
  })

  it('fails open on malformed labels', () => {
    expect(
      buildNetWorthSeries(1000, cashflows, {
        monthKeys: ['garbage', '2026-05', '2026-06'],
        earliestWalletCreatedAt: '2026-05-10T08:00:00Z',
      }),
    ).toEqual([500, 700, 1000])
    expect(
      buildNetWorthSeries(1000, cashflows, {
        monthKeys: months,
        earliestWalletCreatedAt: 'not-a-date',
      }),
    ).toEqual([500, 700, 1000])
  })

  it('fails open on a null earliest wallet date', () => {
    expect(
      buildNetWorthSeries(1000, cashflows, {
        monthKeys: months,
        earliestWalletCreatedAt: null,
      }),
    ).toEqual([500, 700, 1000])
  })
})
