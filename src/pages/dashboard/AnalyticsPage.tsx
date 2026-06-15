import { AppLayout } from '../../layouts/AppLayout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { CashflowChart, ExpenseDistribution, ForecastCards, StatGrid } from '../../components/finance/DashboardWidgets';
import { dashboardStats, expenseSlices, forecastItems } from '../../data/mockDashboard';
import { useToast } from '../../components/ui/Toast';

export function AnalyticsPage() {
  const { showToast } = useToast();
  const analyticsStats = [
    ...dashboardStats.slice(0, 2),
    { label: 'Avg Daily Spend', value: 'Rp 292.000', note: 'June average', tone: 'orange' as const },
    { label: 'Expense Ratio', value: '61.7%', note: 'Of monthly income', tone: 'purple' as const },
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
            <Button variant="primary" onClick={() => showToast('Analytics period changed to June 2026.')}>Jun 2026</Button>
            <Button to="/dashboard/forecast">Open Forecast</Button>
          </div>
        </section>

        <StatGrid stats={analyticsStats} />

        <section className="dashboard-grid">
          <div className="grid stack-lg">
            <CashflowChart />
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
            <ForecastCards items={forecastItems.slice(1, 3)} />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
