import { AppLayout } from '../../layouts/AppLayout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { ForecastCards } from '../../components/finance/DashboardWidgets';
import { useToast } from '../../components/ui/Toast';
import { useForecast } from '../../hooks/useDashboard';
import { NAV } from '../../lib/copy';
import { formatIDR as formatCurrency } from '../../lib/money';
import type { ForecastItem } from '../../types/dashboard';

export function ForecastPage() {
  const { showToast } = useToast();
  const { data: forecast, refetch } = useForecast();

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
            <div className="forecast-step"><div><strong>Pengeluaran Saat Ini</strong><span>{forecast ? formatCurrency(forecast.current_expense_minor) : '...'}</span></div><ProgressBar value={forecast ? (forecast.current_expense_minor / forecast.budget_limit_minor) * 100 : 0} /></div>
            <div className="forecast-step"><div><strong>Rata-rata Harian</strong><span>{forecast ? formatCurrency(forecast.daily_average_minor) : '...'}</span></div><ProgressBar value={forecast ? (forecast.daily_average_minor / (forecast.budget_limit_minor / 30)) * 100 : 0} tone="orange" /></div>
            <div className="forecast-step"><div><strong>Prakiraan Pengeluaran</strong><span>{forecast ? formatCurrency(forecast.forecasted_expense_minor) : '...'}</span></div><ProgressBar value={forecast ? (forecast.forecasted_expense_minor / forecast.budget_limit_minor) * 100 : 0} tone={forecast?.status === 'safe' ? 'green' : 'red'} /></div>
            <div className="forecast-step"><div><strong>Batas Anggaran</strong><span>{forecast ? formatCurrency(forecast.budget_limit_minor) : '...'}</span></div><ProgressBar value={100} tone="blue" /></div>
          </Card>

          <Card className="dashboard-panel">
            <div className="panel-head"><div><h3>Peringatan Risiko</h3><p>Hal yang perlu diwaspadai sebelum akhir bulan.</p></div></div>
            <div className="insight-list">
              <div><Badge tone="orange">Anggaran</Badge><strong>Pengeluaran makanan bisa mencapai 83%.</strong><span>Buka Notifikasi Anggaran untuk meninjau batas peringatan.</span></div>
              <div><Badge tone="red">Jatuh Tempo</Badge><strong>Rp 3.184.000 biaya tetap akan jatuh tempo.</strong><span>Cek Cicilan dan Langganan untuk melihat tagihan terdekat.</span></div>
              <div><Badge tone="blue">Berulang</Badge><strong>3 pembayaran berulang akan berjalan.</strong><span>Buka Berulang untuk melihat jadwal pembayaranmu.</span></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
