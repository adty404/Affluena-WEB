import { AppLayout } from '../../layouts/AppLayout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { CashflowChart, ExpenseDistribution, ForecastCards, StatGrid } from '../../components/finance/DashboardWidgets';
import { useToast } from '../../components/ui/Toast';
import { useDashboardSummary, useCashflowTrend, useExpenseDistribution, useForecast } from '../../hooks/useDashboard';
import { formatIDR as formatCurrency } from '../../lib/money';
import type { DashboardStat, ExpenseSlice, ForecastItem } from '../../types/dashboard';

export function AnalyticsPage() {
  const { showToast } = useToast();
  
  const { data: summary } = useDashboardSummary();
  const { data: trendData } = useCashflowTrend(6);
  const { data: expenseData } = useExpenseDistribution();
  const { data: forecast } = useForecast();

  const analyticsStats: DashboardStat[] = summary ? [
    { label: 'Net Worth', value: formatCurrency(summary.net_worth_minor), note: 'Total aset bersih', tone: 'blue' },
    { label: 'Monthly Income', value: formatCurrency(summary.monthly_income_minor), note: 'Pemasukan bulan ini', tone: 'green' },
    { label: 'Avg Daily Spend', value: formatCurrency(summary.monthly_expense_minor / 30), note: 'Estimated daily average', tone: 'orange' },
    { label: 'Expense Ratio', value: `${((summary.monthly_expense_minor / (summary.monthly_income_minor || 1)) * 100).toFixed(1)}%`, note: 'Of monthly income', tone: 'purple' },
  ] : [
    { label: 'Net Worth', value: '...', note: 'Loading...' },
    { label: 'Monthly Income', value: '...', note: 'Loading...' },
    { label: 'Avg Daily Spend', value: '...', note: 'Loading...' },
    { label: 'Expense Ratio', value: '...', note: 'Loading...' },
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
    { title: 'Forecasted Expense', value: formatCurrency(forecast.forecasted_expense_minor), note: 'Expected end of month', tone: forecast.status === 'safe' ? 'green' : 'red' },
    { title: 'Budget Limit', value: formatCurrency(forecast.budget_limit_minor), note: 'Total budget limit', tone: 'purple' },
  ] : [
    { title: 'Forecasted Expense', value: '...', note: 'Loading...', tone: 'green' },
    { title: 'Budget Limit', value: '...', note: 'Loading...', tone: 'purple' },
  ];

  return (
    <AppLayout title="Analytics" description="Analisa cashflow, expense distribution, dan financial trend.">
      <div className="grid stack-lg">
        <section className="app-hero-card">
          <div>
            <Badge tone="blue">● Analytics</Badge>
            <h2>Analisa kebiasaan finansial dari income, expense, dan spending pattern.</h2>
            <p>Gunakan halaman ini untuk membaca tren sebelum membuat keputusan budget atau forecast.</p>
          </div>
          <div className="app-hero-actions">
            <Button variant="primary" onClick={() => showToast('Analytics period changed to current month.')}>Current Month</Button>
            <Button to="/dashboard/forecast">Open Forecast</Button>
          </div>
        </section>

        <StatGrid stats={analyticsStats} />

        <section className="dashboard-grid">
          <div className="grid stack-lg">
            <CashflowChart trend={trendData?.trend} />
            <Card className="dashboard-panel">
              <div className="panel-head"><div><h3>Insight Summary</h3><p>Generated from current dashboard metrics.</p></div></div>
              <div className="insight-list">
                <div><Badge>Good</Badge><strong>Income lebih stabil dibanding expense.</strong><span>Cashflow tetap positif selama 6 bulan.</span></div>
                <div><Badge tone="orange">Watch</Badge><strong>Transportation hampir menyentuh budget risk.</strong><span>Perlu daily cap sampai akhir bulan.</span></div>
                <div><Badge tone="purple">Pattern</Badge><strong>Food spending naik pada minggu kedua.</strong><span>Buka Budget Alerts untuk membuat review threshold pengeluaran.</span></div>
              </div>
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
