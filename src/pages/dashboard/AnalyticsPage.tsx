import { AppLayout } from '../../layouts/AppLayout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { CashflowChart, ExpenseDistribution, ForecastCards, StatGrid } from '../../components/finance/DashboardWidgets';
import { useDashboardSummary, useCashflowTrend, useExpenseDistribution, useForecast } from '../../hooks/useDashboard';
import { NAV } from '../../lib/copy';
import { formatIDR as formatCurrency } from '../../lib/money';
import type { DashboardStat, ExpenseSlice, ForecastItem } from '../../types/dashboard';

type InsightRow = { tone?: 'orange' | 'purple'; label: string; title: string; note: string };

export function AnalyticsPage() {
  const { data: summary } = useDashboardSummary();
  const { data: trendData } = useCashflowTrend(6);
  const { data: expenseData } = useExpenseDistribution();
  const { data: forecast } = useForecast();

  const analyticsStats: DashboardStat[] = summary ? [
    { label: 'Kekayaan Bersih', value: formatCurrency(summary.net_worth_minor), note: 'Total aset bersih', tone: 'blue' },
    { label: 'Pemasukan Bulan Ini', value: formatCurrency(summary.monthly_income_minor), note: 'Total uang masuk', tone: 'green' },
    { label: 'Rata-rata Harian', value: formatCurrency(summary.monthly_expense_minor / 30), note: 'Perkiraan pengeluaran per hari', tone: 'orange' },
    { label: 'Rasio Pengeluaran', value: `${((summary.monthly_expense_minor / (summary.monthly_income_minor || 1)) * 100).toFixed(1)}%`, note: 'Dari pemasukan bulan ini', tone: 'purple' },
  ] : [
    { label: 'Kekayaan Bersih', value: '...', note: 'Memuat...' },
    { label: 'Pemasukan Bulan Ini', value: '...', note: 'Memuat...' },
    { label: 'Rata-rata Harian', value: '...', note: 'Memuat...' },
    { label: 'Rasio Pengeluaran', value: '...', note: 'Memuat...' },
  ];

  const expenseSlices: ExpenseSlice[] = (expenseData?.distribution ?? []).map((d, i) => {
    const tones: ('green' | 'blue' | 'orange' | 'purple' | 'red' | 'gray')[] = ['blue', 'purple', 'orange', 'green', 'red', 'gray'];
    return {
      label: d.category_name,
      amount: formatCurrency(d.amount_minor),
      percent: d.percentage,
      tone: tones[i % tones.length],
    };
  });

  const forecastItems: ForecastItem[] = forecast ? [
    { title: 'Prakiraan Pengeluaran', value: formatCurrency(forecast.forecasted_expense_minor), note: 'Perkiraan sampai akhir bulan', tone: forecast.status === 'safe' ? 'green' : 'red' },
    { title: 'Batas Anggaran', value: formatCurrency(forecast.budget_limit_minor), note: 'Total batas anggaran kamu', tone: 'purple' },
  ] : [
    { title: 'Prakiraan Pengeluaran', value: '...', note: 'Memuat...', tone: 'green' },
    { title: 'Batas Anggaran', value: '...', note: 'Memuat...', tone: 'purple' },
  ];

  // Insights derived entirely from the real fetched data (summary, expense
  // distribution, forecast) — no fabricated numbers.
  const insights: InsightRow[] = [];
  if (summary) {
    const cashflowPositive = summary.monthly_cashflow_minor >= 0;
    insights.push({
      tone: cashflowPositive ? undefined : 'orange',
      label: cashflowPositive ? 'Baik' : 'Waspada',
      title: cashflowPositive
        ? `Arus kas bulan ini positif ${formatCurrency(summary.monthly_cashflow_minor)}.`
        : `Pengeluaran melebihi pemasukan ${formatCurrency(Math.abs(summary.monthly_cashflow_minor))} bulan ini.`,
      note: cashflowPositive
        ? 'Pemasukan masih menutup pengeluaranmu.'
        : 'Tinjau pengeluaran terbesar sebelum menambah anggaran.',
    });
  }
  const topSlice = (expenseData?.distribution ?? [])[0];
  if (topSlice) {
    insights.push({
      tone: 'purple',
      label: 'Pola',
      title: `${topSlice.category_name} jadi pengeluaran terbesar (${topSlice.percentage.toFixed(0)}%).`,
      note: `Senilai ${formatCurrency(topSlice.amount_minor)} bulan ini.`,
    });
  }
  if (forecast) {
    const overBudget = forecast.status !== 'safe';
    insights.push({
      tone: overBudget ? 'orange' : undefined,
      label: overBudget ? 'Waspada' : 'Aman',
      title: overBudget
        ? `Prakiraan pengeluaran ${formatCurrency(forecast.forecasted_expense_minor)} melewati batas anggaran.`
        : `Prakiraan pengeluaran ${formatCurrency(forecast.forecasted_expense_minor)} masih di bawah batas anggaran.`,
      note: `Batas anggaran ${formatCurrency(forecast.budget_limit_minor)}.`,
    });
  }

  return (
    <AppLayout title="Analitik" description="Analisis arus kas, sebaran pengeluaran, dan tren keuangan kamu.">
      <div className="grid stack-lg">
        <section className="app-hero-card">
          <div>
            <Badge tone="blue">{NAV.analitik}</Badge>
            <h2>Pahami kebiasaan finansial kamu dari pola pemasukan dan pengeluaran.</h2>
            <p>Baca tren keuanganmu lebih dulu sebelum menentukan anggaran atau prakiraan.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/dashboard/forecast" variant="primary">Buka Prakiraan</Button>
          </div>
        </section>

        <StatGrid stats={analyticsStats} />

        <section className="dashboard-grid">
          <div className="grid stack-lg">
            <CashflowChart trend={trendData?.trend} />
            <Card className="dashboard-panel">
              <div className="panel-head"><div><h3>Ringkasan Wawasan</h3><p>Dirangkum dari data keuangan kamu bulan ini.</p></div></div>
              {insights.length > 0 ? (
                <div className="insight-list">
                  {insights.map((insight) => (
                    <div key={insight.title}>
                      <Badge tone={insight.tone}>{insight.label}</Badge>
                      <strong>{insight.title}</strong>
                      <span>{insight.note}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="panel-note">Belum ada cukup data untuk merangkum wawasan bulan ini.</p>
              )}
            </Card>
          </div>
          <div className="grid stack-lg">
            <ExpenseDistribution items={expenseSlices} />
            <ForecastCards items={forecastItems} />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
