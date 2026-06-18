import { AppLayout } from '../../layouts/AppLayout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { ForecastCards } from '../../components/finance/DashboardWidgets';
import { useToast } from '../../components/ui/Toast';
import { useForecast } from '../../hooks/useDashboard';
import { formatIDR as formatCurrency } from '../../lib/money';
import type { ForecastItem } from '../../types/dashboard';

export function ForecastPage() {
  const { showToast } = useToast();
  const { data: forecast, refetch } = useForecast();

  const forecastItems: ForecastItem[] = forecast ? [
    { title: 'Current Expense', value: formatCurrency(forecast.current_expense_minor), note: 'Total spent so far', tone: 'blue' },
    { title: 'Daily Average', value: formatCurrency(forecast.daily_average_minor), note: 'Average daily spend', tone: 'orange' },
    { title: 'Forecasted Expense', value: formatCurrency(forecast.forecasted_expense_minor), note: 'Expected end of month', tone: forecast.status === 'safe' ? 'green' : 'red' },
    { title: 'Budget Limit', value: formatCurrency(forecast.budget_limit_minor), note: 'Total budget limit', tone: 'purple' },
  ] : [
    { title: 'Current Expense', value: '...', note: 'Loading...', tone: 'blue' },
    { title: 'Daily Average', value: '...', note: 'Loading...', tone: 'orange' },
    { title: 'Forecasted Expense', value: '...', note: 'Loading...', tone: 'green' },
    { title: 'Budget Limit', value: '...', note: 'Loading...', tone: 'purple' },
  ];

  return (
    <AppLayout title="Forecast" description="Proyeksi saldo, safe-to-spend, budget risk, dan upcoming due.">
      <div className="grid stack-lg">
        <section className="app-hero-card">
          <div>
            <Badge tone="purple">● Forecast</Badge>
            <h2>Prediksi kondisi akhir bulan sebelum pengeluaran terjadi.</h2>
            <p>Forecast ini memakai transaksi, budget, due reminder, dan recurring schedule agar user bisa melihat risiko sebelum akhir bulan.</p>
          </div>
          <div className="app-hero-actions">
            <Button variant="primary" onClick={() => { refetch(); showToast('Forecast recalculated from latest financial metrics.'); }}>Recalculate</Button>
            <Button to="/dashboard">Back Dashboard</Button>
          </div>
        </section>

        <ForecastCards items={forecastItems} />

        <section className="dashboard-grid">
          <Card className="dashboard-panel forecast-timeline">
            <div className="panel-head">
              <div><h3>Month-End Projection</h3><p>Cash reserve and risk projection.</p></div>
              {forecast && <Badge tone={forecast.status === 'safe' ? 'green' : 'red'}>{forecast.status === 'safe' ? 'Healthy' : 'Overbudget'}</Badge>}
            </div>
            <div className="forecast-step"><div><strong>Current Expense</strong><span>{forecast ? formatCurrency(forecast.current_expense_minor) : '...'}</span></div><ProgressBar value={forecast ? (forecast.current_expense_minor / forecast.budget_limit_minor) * 100 : 0} /></div>
            <div className="forecast-step"><div><strong>Daily Average</strong><span>{forecast ? formatCurrency(forecast.daily_average_minor) : '...'}</span></div><ProgressBar value={forecast ? (forecast.daily_average_minor / (forecast.budget_limit_minor / 30)) * 100 : 0} tone="orange" /></div>
            <div className="forecast-step"><div><strong>Forecasted Expense</strong><span>{forecast ? formatCurrency(forecast.forecasted_expense_minor) : '...'}</span></div><ProgressBar value={forecast ? (forecast.forecasted_expense_minor / forecast.budget_limit_minor) * 100 : 0} tone={forecast?.status === 'safe' ? 'green' : 'red'} /></div>
            <div className="forecast-step"><div><strong>Budget Limit</strong><span>{forecast ? formatCurrency(forecast.budget_limit_minor) : '...'}</span></div><ProgressBar value={100} tone="blue" /></div>
          </Card>

          <Card className="dashboard-panel">
            <div className="panel-head"><div><h3>Risk Alerts</h3><p>Potential issues before month-end.</p></div></div>
            <div className="insight-list">
              <div><Badge tone="orange">Budget</Badge><strong>Food spending may reach 83%.</strong><span>Open Budget Alerts to review warning and exceeded threshold.</span></div>
              <div><Badge tone="red">Due</Badge><strong>Rp 3.184.000 upcoming fixed cost.</strong><span>Open Debt & Tracker readiness page for due reminder flow.</span></div>
              <div><Badge tone="blue">Recurring</Badge><strong>3 recurring payments expected.</strong><span>Open Recurring readiness page for automation flow.</span></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
