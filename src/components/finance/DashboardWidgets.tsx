import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { AppIcon } from '../ui/AppIcon';
import { ProgressBar } from './ProgressBar';
import type { DashboardStat, DashboardTransaction, ExpenseSlice, ForecastItem } from '../../types/dashboard';

type StatGridProps = { stats: DashboardStat[] };

export function StatGrid({ stats }: StatGridProps) {
  return (
    <section className="stat-grid">
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
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada data</p>
        </div>
      </Card>
    );
  }

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
      <div className="transaction-list compact">
        {items.map((item) => (
          <div className="transaction-row" key={item.id}>
            <div className={`transaction-icon ${item.type}`}>
              <AppIcon name={item.type === 'income' ? 'arrow-down' : 'arrow-up'} />
            </div>
            <div>
              <strong>{item.title}</strong>
              <span>{item.category} · {item.wallet} · {item.date}</span>
            </div>
            <strong className={`amount ${item.type}`}>{item.amount}</strong>
          </div>
        ))}
      </div>
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
      <div className="portfolio-list">
        {items.map((item) => (
          <div key={item.name}>
            <div className="portfolio-head"><strong>{item.name}</strong><span>{item.value}</span></div>
            <ProgressBar value={item.percent} tone="green" />
          </div>
        ))}
      </div>
    </Card>
  );
}
