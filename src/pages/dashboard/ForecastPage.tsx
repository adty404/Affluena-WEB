import { AppLayout } from '../../layouts/AppLayout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { ForecastCards } from '../../components/finance/DashboardWidgets';
import { forecastItems } from '../../data/mockDashboard';
import { useToast } from '../../components/ui/Toast';

export function ForecastPage() {
  const { showToast } = useToast();

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
            <Button variant="primary" onClick={() => showToast('Forecast recalculated from latest financial metrics.')}>Recalculate</Button>
            <Button to="/dashboard">Back Dashboard</Button>
          </div>
        </section>

        <ForecastCards items={forecastItems} />

        <section className="dashboard-grid">
          <Card className="dashboard-panel forecast-timeline">
            <div className="panel-head"><div><h3>Month-End Projection</h3><p>Cash reserve and risk projection.</p></div><Badge>Healthy</Badge></div>
            <div className="forecast-step"><div><strong>Today</strong><span>Rp 68.450.000</span></div><ProgressBar value={72} /></div>
            <div className="forecast-step"><div><strong>Expected income</strong><span>+Rp 3.400.000</span></div><ProgressBar value={86} tone="green" /></div>
            <div className="forecast-step"><div><strong>Expected expense</strong><span>-Rp 1.950.000</span></div><ProgressBar value={43} tone="orange" /></div>
            <div className="forecast-step"><div><strong>Projected balance</strong><span>Rp 72.900.000</span></div><ProgressBar value={91} tone="blue" /></div>
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
