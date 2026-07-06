import type { ReactNode } from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { AppIcon } from '../ui/AppIcon';
import { EmptyState } from '../ui/EmptyState';
import { Amount } from './Amount';
import { ProgressBar } from './ProgressBar';
import { formatIDR } from '../../lib/money';
import type { DashboardStat, DashboardTransaction, ExpenseSlice, ForecastItem } from '../../types/dashboard';

type StatGridProps = { stats: DashboardStat[]; className?: string };

export function StatGrid({ stats, className }: StatGridProps) {
  return (
    <section className={`stat-grid${className ? ` ${className}` : ''}`}>
      {stats.map((stat) => (
        <article className={`stat-card dashboard-stat ${stat.tone ?? ''}`} key={stat.label}>
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
          <small>{stat.note}</small>
        </article>
      ))}
    </section>
  );
}

export function CashflowChart({ trend }: { trend?: { month: string; income_minor: number; expense_minor: number }[] }) {
  if (!trend || trend.length === 0) {
    return (
      <Card className="dashboard-panel chart-panel">
        <div className="panel-head">
          <div>
            <h3>Tren Arus Kas</h3>
            <p>Pemasukan vs pengeluaran 6 bulan terakhir.</p>
          </div>
        </div>
        <div className="cashflow-chart" aria-label="Grafik tren arus kas">
          <p className="panel-note" style={{ textAlign: 'center' }}>Belum ada data</p>
        </div>
      </Card>
    );
  }

  const latest = trend[trend.length - 1];

  const maxVal = Math.max(...trend.map(t => Math.max(t.income_minor, t.expense_minor)), 1000000);
  const width = 760;
  const height = 260;
  const paddingX = 55;
  const paddingY = 24;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const getX = (index: number) => paddingX + (index / Math.max(trend.length - 1, 1)) * chartWidth;
  const getY = (val: number) => height - paddingY - (val / maxVal) * chartHeight;

  const incomePath = trend.map((t, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(t.income_minor)}`).join(' ');
  const expensePath = trend.map((t, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(t.expense_minor)}`).join(' ');

  return (
    <Card className="dashboard-panel chart-panel">
      <div className="panel-head">
        <div>
          <h3>Tren Arus Kas</h3>
          <p>Pemasukan vs pengeluaran {trend.length} bulan terakhir.</p>
        </div>
        <Badge tone="blue">{trend[trend.length - 1]?.month}</Badge>
      </div>
      <div className="cashflow-chart" aria-label="Grafik tren arus kas">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <text x="0" y="24" className="axis-text">{Math.round(maxVal / 1000000)}M</text>
          <text x="0" y={height / 2} className="axis-text">{Math.round(maxVal / 2000000)}M</text>
          <text x="0" y={height - 24} className="axis-text">0</text>
          <path d={incomePath} fill="none" stroke="var(--success, #2e8b57)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d={expensePath} fill="none" stroke="var(--danger, #c2553f)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="chart-legend">
        <span><i className="legend-dot income" />Pemasukan</span>
        <span><i className="legend-dot expense" />Pengeluaran</span>
      </div>
      {latest && (
        <p className="panel-note">
          {latest.month}: pemasukan {formatIDR(latest.income_minor)}, pengeluaran {formatIDR(latest.expense_minor)}.
        </p>
      )}
    </Card>
  );
}

/**
 * Inline SVG sparkline of the reconstructed net-worth trend (mirrors mobile's
 * Beranda "Tren kekayaan bersih"). `series` is the oldest → newest minor-unit
 * points from `buildNetWorthSeries`; its last element is the current net worth,
 * emphasized with an endpoint dot. Renders an area fill under an income-green
 * line. Falls back to a skeleton while loading and a muted note when there is
 * not enough data to draw a line.
 */
export function NetWorthTrend({ series, loading }: { series: number[]; loading?: boolean }) {
  const latest = series.length > 0 ? series[series.length - 1] : 0;

  let body: ReactNode;
  if (loading) {
    body = <div className="networth-spark networth-spark-skeleton" aria-hidden="true" />;
  } else if (series.length < 2) {
    body = (
      <p className="panel-note" style={{ textAlign: 'center' }}>
        Belum cukup data untuk menampilkan tren.
      </p>
    );
  } else {
    const width = 320;
    const height = 96;
    const paddingX = 6;
    const paddingY = 10;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;
    const min = Math.min(...series);
    const max = Math.max(...series);
    const span = max - min || 1;

    const getX = (index: number) => paddingX + (index / (series.length - 1)) * chartWidth;
    const getY = (value: number) => paddingY + (1 - (value - min) / span) * chartHeight;

    const points = series.map((value, i) => ({ x: getX(i), y: getY(value) }));
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
    const end = points[points.length - 1];

    body = (
      <div className="networth-spark" aria-label="Grafik tren kekayaan bersih">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img">
          <path d={areaPath} fill="var(--success-soft)" stroke="none" />
          <path
            d={linePath}
            fill="none"
            stroke="var(--success)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx={end.x} cy={end.y} r="3.5" fill="var(--success)" />
        </svg>
      </div>
    );
  }

  return (
    <Card className="dashboard-panel networth-panel">
      <div className="panel-head">
        <div>
          <h3>Tren Kekayaan Bersih</h3>
          <p>Perkiraan {series.length > 1 ? `${series.length} bulan terakhir` : '12 bulan terakhir'}.</p>
        </div>
        {!loading && series.length > 0 && (
          <strong className="networth-latest">{formatIDR(latest)}</strong>
        )}
      </div>
      {body}
    </Card>
  );
}

const EXPENSE_TONE_COLOR: Record<ExpenseSlice['tone'], string> = {
  green: 'var(--success)',
  blue: 'var(--secondary)',
  orange: 'var(--warning)',
  purple: 'var(--purple)',
  red: 'var(--danger)',
  gray: 'var(--muted-2)',
};

/**
 * A real donut chart driven by the slice percentages. Each slice becomes an arc
 * on a stroked circle (via stroke-dasharray/offset), so the ring reflects actual
 * spending. Falls back to a neutral track when there is no data yet.
 */
function ExpenseDonut({ items }: { items: ExpenseSlice[] }) {
  const size = 150;
  const stroke = 26;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = items.reduce((sum, item) => sum + Math.max(item.percent, 0), 0);

  let offset = 0;
  const arcs = total > 0
    ? items
        .filter((item) => item.percent > 0)
        .map((item) => {
          const length = (item.percent / total) * circumference;
          const arc = { label: item.label, color: EXPENSE_TONE_COLOR[item.tone], length, offset };
          offset += length;
          return arc;
        })
    : [];

  return (
    <div className="expense-donut-chart" aria-label="Grafik sebaran pengeluaran">
      <svg viewBox={`0 0 ${size} ${size}`} role="img">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        {arcs.map((arc) => (
          <circle
            key={arc.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={stroke}
            strokeDasharray={`${arc.length} ${circumference - arc.length}`}
            strokeDashoffset={-arc.offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        ))}
      </svg>
    </div>
  );
}

export function ExpenseDistribution({ items }: { items: ExpenseSlice[] }) {
  return (
    <Card className="dashboard-panel">
      <div className="panel-head">
        <div>
          <h3>Sebaran Pengeluaran</h3>
          <p>Kategori pengeluaran terbesar bulan ini.</p>
        </div>
      </div>
      <ExpenseDonut items={items} />
      <div className="expense-list">
        {items.map((item) => (
          <div key={item.label}>
            <span><i className={`legend-dot ${item.tone}`} />{item.label}</span>
            <strong>{item.amount}</strong>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function RecentTransactions({ items }: { items: DashboardTransaction[] }) {
  return (
    <Card className="dashboard-panel">
      <div className="panel-head">
        <div>
          <h3>Transaksi Terbaru</h3>
          <p>Aktivitas keuangan terakhir kamu.</p>
        </div>
      </div>
      {items.length === 0 ? (
        <EmptyState
          icon={<AppIcon name="transactions" />}
          title="Belum ada transaksi"
          description="Transaksi terbarumu akan muncul di sini."
          action={<Button to="/transactions/new" variant="primary"><AppIcon name="add" /> Catat Transaksi</Button>}
        />
      ) : (
        <div className="transaction-list compact">
          {items.map((item) => (
            <div className="transaction-row" key={item.id}>
              <div className={`transaction-icon ${item.type}`}>
                <AppIcon name={item.type === 'income' ? 'arrow-down' : 'arrow-up'} />
              </div>
              <div>
                <strong>{item.title}</strong>
                <span>{item.note ? `${item.note} · ` : ''}{item.wallet} · {item.date}</span>
              </div>
              <Amount value={item.amountMinor} type={item.type} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function ForecastCards({ items }: { items: ForecastItem[] }) {
  return (
    <section className="card-grid two">
      {items.map((item) => (
        <Card as="article" className="forecast-card" key={item.title}>
          <Badge tone={item.tone}>{item.title}</Badge>
          <h3>{item.value}</h3>
          <p>{item.note}</p>
        </Card>
      ))}
    </section>
  );
}

export function WalletPortfolio({ items }: { items: { name: string; value: string; percent: number }[] }) {
  return (
    <Card className="dashboard-panel">
      <div className="panel-head">
        <div>
          <h3>Portofolio Dompet</h3>
          <p>Sebaran saldo di semua dompetmu.</p>
        </div>
      </div>
      {items.length === 0 ? (
        <EmptyState
          icon={<AppIcon name="wallet" />}
          title="Belum ada dompet"
          description="Tambah dompet untuk melihat sebaran saldomu di sini."
          action={<Button to="/wallets/new" variant="primary"><AppIcon name="add" /> Tambah Dompet</Button>}
        />
      ) : (
        <div className="portfolio-list">
          {items.map((item) => (
            <div key={item.name}>
              <div className="portfolio-head"><strong>{item.name}</strong><span>{item.value}</span></div>
              <ProgressBar value={item.percent} tone="green" />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
