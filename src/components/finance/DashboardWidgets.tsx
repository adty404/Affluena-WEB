import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
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

export function CashflowChart() {
  return (
    <Card className="dashboard-panel chart-panel">
      <div className="panel-head">
        <div>
          <h3>Cashflow Trend</h3>
          <p>Income vs expense in the last 6 months.</p>
        </div>
        <Badge tone="blue">Jun 2026</Badge>
      </div>
      <div className="cashflow-chart" aria-label="Cashflow trend chart">
        <svg viewBox="0 0 760 260" preserveAspectRatio="none">
          <text x="0" y="24" className="axis-text">15M</text>
          <text x="0" y="106" className="axis-text">10M</text>
          <text x="0" y="188" className="axis-text">5M</text>
          <text x="0" y="250" className="axis-text">0</text>
          <path d="M55 82 C150 70, 210 68, 292 58 C370 48, 430 54, 512 42 C590 34, 668 40, 742 28" fill="none" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
          <path d="M55 158 C150 140, 210 154, 292 134 C370 146, 430 126, 512 138 C590 124, 668 132, 742 118" fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
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
            <div className={`transaction-icon ${item.type}`}>{item.type === 'income' ? '↙' : '↗'}</div>
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
