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
            <h3>Cashflow Trend</h3>
            <p>Income vs expense in the last 6 months.</p>
          </div>
        </div>
        <div className="cashflow-chart" aria-label="Cashflow trend chart">
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No data available</p>
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
          <h3>Cashflow Trend</h3>
          <p>Income vs expense in the last {trend.length} months.</p>
        </div>
        <Badge tone="blue">{trend[trend.length - 1]?.month}</Badge>
      </div>
      <div className="cashflow-chart" aria-label="Cashflow trend chart">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <text x="0" y="24" className="axis-text">{Math.round(maxVal / 1000000)}M</text>
          <text x="0" y={height / 2} className="axis-text">{Math.round(maxVal / 2000000)}M</text>
          <text x="0" y={height - 24} className="axis-text">0</text>
          <path d={incomePath} fill="none" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d={expensePath} fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="chart-legend">
        <span><i className="legend-dot income" />Income</span>
        <span><i className="legend-dot expense" />Expense</span>
      </div>
    </Card>
  );
}

export function ExpenseDistribution({ items }: { items: ExpenseSlice[] }) {
  return (
    <Card className="dashboard-panel">
      <div className="panel-head">
        <div>
          <h3>Expense Distribution</h3>
          <p>Top spending categories this month.</p>
        </div>
      </div>
      <div className="expense-donut" />
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
          <h3>Recent Transactions</h3>
          <p>Latest financial activities.</p>
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
          <h3>Wallet Portfolio</h3>
          <p>Balance distribution across wallets.</p>
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
