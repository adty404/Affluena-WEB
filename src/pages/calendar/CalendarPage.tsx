import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { StatGrid } from '../../components/finance/DashboardWidgets';
import { TransactionItem } from '../../components/transactions/TransactionItem';
import { useMonthTransactions } from '../../hooks/useMonthTransactions';
import {
  bucketByLocalDay,
  dayLabelID,
  daysInMonth,
  mondayStartOffset,
  monthLabelID,
  WEEKDAYS_ID,
} from '../../lib/calendar';
import { NAV } from '../../lib/copy';
import { formatIDR, formatIDRCompact } from '../../lib/money';
import type { DashboardStat } from '../../types/dashboard';

/**
 * Kalender — the web mirror of mobile's monthly money calendar: a
 * Monday-start month grid with per-day income/expense markers, month summary
 * (Pemasukan · Pengeluaran · Selisih), and a day-detail panel listing the
 * selected day's transactions.
 */
export function CalendarPage() {
  const today = new Date();
  const [refDate, setRefDate] = useState(() => new Date());
  const year = refDate.getFullYear();
  const month = refDate.getMonth() + 1; // 1-based, matches lib/calendar helpers
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;

  // Default selection: today when viewing the current month, else none.
  const [selectedDay, setSelectedDay] = useState<number | null>(() => new Date().getDate());

  const { data: transactions, isLoading, error, refetch } = useMonthTransactions(refDate);
  const buckets = useMemo(
    () => bucketByLocalDay(transactions ?? [], year, month),
    [transactions, year, month],
  );

  const goToMonth = (next: Date) => {
    const now = new Date();
    const nextIsCurrent = next.getFullYear() === now.getFullYear() && next.getMonth() === now.getMonth();
    setRefDate(next);
    setSelectedDay(nextIsCurrent ? now.getDate() : null);
  };
  const goPrev = () => goToMonth(new Date(year, month - 2, 1));
  const goNext = () => goToMonth(new Date(year, month, 1));
  const goToday = () => goToMonth(new Date());

  const monthLabel = monthLabelID(year, month);
  const netMinor = buckets.incomeMinor - buckets.expenseMinor;
  const summaryStats: DashboardStat[] = [
    { label: 'Pemasukan', value: isLoading ? '…' : formatIDR(buckets.incomeMinor), note: `Uang masuk ${monthLabel}`, tone: 'green' },
    { label: 'Pengeluaran', value: isLoading ? '…' : formatIDR(buckets.expenseMinor), note: `Uang keluar ${monthLabel}`, tone: 'orange' },
    { label: 'Selisih', value: isLoading ? '…' : formatIDR(netMinor), note: 'Pemasukan − pengeluaran', tone: isLoading ? undefined : netMinor < 0 ? 'red' : 'green' },
  ];

  const leadingBlanks = mondayStartOffset(year, month);
  const totalDays = daysInMonth(year, month);
  const trailingBlanks = (7 - ((leadingBlanks + totalDays) % 7)) % 7;

  const selectedSummary = selectedDay != null ? buckets.days.get(selectedDay) : undefined;
  const selectedTransactions = selectedSummary?.transactions ?? [];

  return (
    <AppLayout title={NAV.kalender} description="Kalender uang bulanan: pemasukan dan pengeluaran per hari.">
      <div className="dashboard-page grid-stack">
        <StatGrid stats={summaryStats} className="three" />

        <section className="calendar-layout">
          <Card className="panel-card">
            <div className="panel-head calendar-head">
              <div>
                <h3>{monthLabel}</h3>
                <p>Ketuk tanggal untuk melihat transaksi hari itu.</p>
              </div>
              <div className="inline-actions calendar-nav">
                <Button size="icon" onClick={goPrev} aria-label="Bulan sebelumnya"><AppIcon name="back" /></Button>
                <Button size="small" onClick={goToday}>Hari ini</Button>
                <Button size="icon" className="calendar-next" onClick={goNext} aria-label="Bulan berikutnya"><AppIcon name="back" /></Button>
              </div>
            </div>

            {error ? (
              <EmptyState
                icon={<AppIcon name="warning" />}
                title="Gagal memuat transaksi"
                description="Periksa koneksimu, lalu coba lagi."
                action={<Button variant="primary" onClick={() => refetch()}>Coba lagi</Button>}
              />
            ) : isLoading ? (
              <p className="loading-state">Memuat...</p>
            ) : (
              <>
                <div className="calendar-weekdays" aria-hidden="true">
                  {WEEKDAYS_ID.map((label) => <span key={label} className="calendar-weekday">{label}</span>)}
                </div>
                <div className="calendar-grid">
                  {Array.from({ length: leadingBlanks }, (_, i) => (
                    <span key={`pad-${i}`} className="calendar-day is-blank" aria-hidden="true" />
                  ))}
                  {Array.from({ length: totalDays }, (_, i) => {
                    const day = i + 1;
                    const summary = buckets.days.get(day);
                    const txCount = summary?.transactions.length ?? 0;
                    const isToday = isCurrentMonth && day === today.getDate();
                    const isSelected = day === selectedDay;
                    const hasMoney = (summary?.incomeMinor ?? 0) > 0 || (summary?.expenseMinor ?? 0) > 0;
                    return (
                      <button
                        key={day}
                        type="button"
                        className={clsx('calendar-day', isToday && 'is-today', isSelected && 'is-selected', summary && 'has-activity')}
                        aria-label={`${dayLabelID(year, month, day)}, ${txCount} transaksi`}
                        aria-pressed={isSelected}
                        onClick={() => setSelectedDay(day)}
                      >
                        <span className="calendar-day-number">{day}</span>
                        {summary && summary.incomeMinor > 0 && (
                          <span className="calendar-day-marker income">
                            <span className="calendar-dot" />
                            <span className="calendar-day-amount">+{formatIDRCompact(summary.incomeMinor)}</span>
                          </span>
                        )}
                        {summary && summary.expenseMinor > 0 && (
                          <span className="calendar-day-marker expense">
                            <span className="calendar-dot" />
                            <span className="calendar-day-amount">−{formatIDRCompact(summary.expenseMinor)}</span>
                          </span>
                        )}
                        {summary && !hasMoney && (
                          <span className="calendar-day-marker neutral"><span className="calendar-dot" /></span>
                        )}
                      </button>
                    );
                  })}
                  {Array.from({ length: trailingBlanks }, (_, i) => (
                    <span key={`tail-${i}`} className="calendar-day is-blank" aria-hidden="true" />
                  ))}
                </div>
              </>
            )}
          </Card>

          <Card className="panel-card calendar-day-panel">
            <div className="panel-head">
              <div>
                <h3>{selectedDay != null ? dayLabelID(year, month, selectedDay) : 'Detail Hari'}</h3>
                <p>
                  {selectedDay == null
                    ? 'Transaksi pada tanggal yang dipilih tampil di sini.'
                    : isLoading
                      ? 'Memuat transaksi hari ini...'
                      : `${selectedTransactions.length} transaksi tercatat.`}
                </p>
              </div>
            </div>

            {selectedDay == null ? (
              <p className="panel-note">Pilih tanggal di kalender untuk melihat transaksinya.</p>
            ) : isLoading ? (
              <p className="loading-state">Memuat...</p>
            ) : selectedTransactions.length === 0 ? (
              <EmptyState
                icon={<AppIcon name="calendar" />}
                title="Tidak ada transaksi"
                description="Belum ada transaksi yang tercatat pada tanggal ini."
                action={<Button to="/transactions/new" variant="primary"><AppIcon name="add" /> Catat Transaksi</Button>}
              />
            ) : (
              <div className="transaction-list">
                {selectedTransactions.map((tx) => <TransactionItem key={tx.id} transaction={tx} />)}
              </div>
            )}
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
