import { AppLayout } from '../../layouts/AppLayout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { ForecastCards } from '../../components/finance/DashboardWidgets';
import { useToast } from '../../components/ui/Toast';
import { useForecast } from '../../hooks/useDashboard';
import { useRecurringRules } from '../../hooks/useRecurring';
import { useInstallments, useSubscriptions } from '../../hooks/useTrackers';
import { NAV } from '../../lib/copy';
import { formatIDR as formatCurrency } from '../../lib/money';
import type { ForecastItem } from '../../types/dashboard';

type RiskRow = { tone: 'orange' | 'red' | 'blue'; label: string; title: string; note: string };

export function ForecastPage() {
  const { showToast } = useToast();
  const { data: forecast, refetch } = useForecast();
  const { data: recurringData } = useRecurringRules();
  const { data: installmentsData } = useInstallments();
  const { data: subscriptionsData } = useSubscriptions();

  const forecastItems: ForecastItem[] = forecast ? [
    { title: 'Pengeluaran Saat Ini', value: formatCurrency(forecast.current_expense_minor), note: 'Total yang sudah terpakai', tone: 'blue' },
    { title: 'Rata-rata Harian', value: formatCurrency(forecast.daily_average_minor), note: 'Rata-rata pengeluaran per hari', tone: 'orange' },
    { title: 'Prakiraan Pengeluaran', value: formatCurrency(forecast.forecasted_expense_minor), note: 'Perkiraan sampai akhir bulan', tone: forecast.status === 'safe' ? 'green' : 'red' },
    { title: 'Batas Anggaran', value: formatCurrency(forecast.budget_limit_minor), note: 'Total batas anggaran kamu', tone: 'purple' },
  ] : [
    { title: 'Pengeluaran Saat Ini', value: '...', note: 'Memuat...', tone: 'blue' },
    { title: 'Rata-rata Harian', value: '...', note: 'Memuat...', tone: 'orange' },
    { title: 'Prakiraan Pengeluaran', value: '...', note: 'Memuat...', tone: 'green' },
    { title: 'Batas Anggaran', value: '...', note: 'Memuat...', tone: 'purple' },
  ];

  // Risk warnings derived from real data: the forecast vs budget, upcoming
  // fixed costs (active installments + subscriptions), and active recurring
  // rules. No fabricated amounts or percentages.
  const activeInstallments = (installmentsData?.installments ?? []).filter((i) => i.status === 'active');
  const activeSubscriptions = (subscriptionsData?.subscriptions ?? []).filter((s) => s.status === 'active');
  const activeRecurring = (recurringData?.recurring_transactions ?? []).filter((r) => r.status === 'active');
  const upcomingFixedMinor =
    activeInstallments.reduce((sum, i) => sum + i.monthly_amount_minor, 0) +
    activeSubscriptions.reduce((sum, s) => sum + s.amount_minor, 0);

  const risks: RiskRow[] = [];
  if (forecast) {
    const overBudget = forecast.status !== 'safe';
    const remainingMinor = forecast.budget_limit_minor - forecast.forecasted_expense_minor;
    risks.push({
      tone: overBudget ? 'red' : 'orange',
      label: 'Anggaran',
      title: overBudget
        ? `Prakiraan pengeluaran ${formatCurrency(forecast.forecasted_expense_minor)} melewati batas anggaran.`
        : `Sisa ruang anggaran ${formatCurrency(remainingMinor)} sampai akhir bulan.`,
      note: overBudget
        ? 'Buka Notifikasi Anggaran untuk meninjau batas peringatan.'
        : `Batas anggaran ${formatCurrency(forecast.budget_limit_minor)}.`,
    });
  }
  if (upcomingFixedMinor > 0) {
    risks.push({
      tone: 'red',
      label: 'Jatuh Tempo',
      title: `${formatCurrency(upcomingFixedMinor)} biaya tetap akan jatuh tempo.`,
      note: 'Cek Cicilan dan Langganan untuk melihat tagihan terdekat.',
    });
  }
  if (activeRecurring.length > 0) {
    risks.push({
      tone: 'blue',
      label: 'Berulang',
      title: `${activeRecurring.length} pembayaran berulang akan berjalan.`,
      note: 'Buka Berulang untuk melihat jadwal pembayaranmu.',
    });
  }

  return (
    <AppLayout title="Prakiraan" description="Proyeksi saldo, batas aman belanja, dan tagihan yang akan datang.">
      <div className="grid stack-lg">
        <section className="app-hero-card">
          <div>
            <Badge tone="purple">● {NAV.prakiraan}</Badge>
            <h2>Prediksi kondisi akhir bulan sebelum pengeluaran terjadi.</h2>
            <p>Dihitung dari transaksi, anggaran, dan jadwal berulang kamu supaya risiko terlihat lebih awal.</p>
          </div>
          <div className="app-hero-actions">
            <Button variant="primary" onClick={() => { refetch(); showToast('Prakiraan dihitung ulang dari data terbaru.'); }}>Hitung Ulang</Button>
            <Button to="/dashboard">Kembali ke Beranda</Button>
          </div>
        </section>

        <ForecastCards items={forecastItems} />

        <section className="dashboard-grid">
          <Card className="dashboard-panel forecast-timeline">
            <div className="panel-head">
              <div><h3>Proyeksi Akhir Bulan</h3><p>Proyeksi cadangan kas dan risiko.</p></div>
              {forecast && <Badge tone={forecast.status === 'safe' ? 'green' : 'red'}>{forecast.status === 'safe' ? 'Sehat' : 'Melebihi Anggaran'}</Badge>}
            </div>
            <div className="forecast-step"><div><strong>Pengeluaran Saat Ini</strong><span>{forecast ? formatCurrency(forecast.current_expense_minor) : '...'}</span></div><ProgressBar value={forecast && forecast.budget_limit_minor > 0 ? (forecast.current_expense_minor / forecast.budget_limit_minor) * 100 : 0} /></div>
            <div className="forecast-step"><div><strong>Rata-rata Harian</strong><span>{forecast ? formatCurrency(forecast.daily_average_minor) : '...'}</span></div><ProgressBar value={forecast && forecast.budget_limit_minor > 0 ? (forecast.daily_average_minor / (forecast.budget_limit_minor / 30)) * 100 : 0} tone="orange" /></div>
            <div className="forecast-step"><div><strong>Prakiraan Pengeluaran</strong><span>{forecast ? formatCurrency(forecast.forecasted_expense_minor) : '...'}</span></div><ProgressBar value={forecast && forecast.budget_limit_minor > 0 ? (forecast.forecasted_expense_minor / forecast.budget_limit_minor) * 100 : 0} tone={forecast?.status === 'safe' ? 'green' : 'red'} /></div>
            <div className="forecast-step"><div><strong>Batas Anggaran</strong><span>{forecast ? formatCurrency(forecast.budget_limit_minor) : '...'}</span></div><ProgressBar value={100} tone="blue" /></div>
          </Card>

          <Card className="dashboard-panel">
            <div className="panel-head"><div><h3>Peringatan Risiko</h3><p>Hal yang perlu diwaspadai sebelum akhir bulan.</p></div></div>
            {risks.length > 0 ? (
              <div className="insight-list">
                {risks.map((risk) => (
                  <div key={risk.title}>
                    <Badge tone={risk.tone}>{risk.label}</Badge>
                    <strong>{risk.title}</strong>
                    <span>{risk.note}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ padding: '1rem', color: 'var(--muted)' }}>Belum ada risiko yang perlu diwaspadai bulan ini.</p>
            )}
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
