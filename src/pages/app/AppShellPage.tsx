import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { AppIcon } from '../../components/ui/AppIcon';
import { appWidgets } from '../../data/stage1Data';

export function AppShellPage() {
  return (
    <AppLayout title="Command Center" description="Akses cepat ke seluruh modul Affluena dari satu halaman.">
      <div className="grid stack-lg">
        <section className="app-hero-card">
          <div>
            <Badge>● Command Center</Badge>
            <h2>Command center untuk membuka flow finansial yang paling sering dipakai.</h2>
            <p>Pantau akses utama, navigasi, dan modul kerja tanpa perlu kembali ke landing page.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/dashboard" variant="primary"><AppIcon name="dashboard" /> Open Dashboard</Button>
            <Button to="/settings/profile"><AppIcon name="settings" /> Settings</Button>
          </div>
        </section>

        <section className="stat-grid">
          {appWidgets.map((widget) => (
            <article className={`stat-card ${widget.tone ?? ''}`} key={widget.title}>
              <span>{widget.title}</span>
              <strong>{widget.value}</strong>
              <small>{widget.note}</small>
            </article>
          ))}
        </section>

        <section className="dashboard-shell-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Module Coverage</h3><p>Semua modul aktif sudah ditautkan ke halaman masing-masing.</p></div></div>
            <div className="readiness-list">
              <div><span>Foundation & Auth</span><Badge>Live</Badge></div>
              <div><span>Dashboard & Analytics</span><Badge>Live</Badge></div>
              <div><span>Wallet, Category & Tag</span><Badge>Live</Badge></div>
              <div><span>Transactions, Split Bill & Quick Entry</span><Badge>Live</Badge></div>
              <div><span>Budget, Debt, Recurring & Goals</span><Badge>Live</Badge></div>
              <div><span>Reports, Alerts & Settings</span><Badge>Live</Badge></div>
            </div>
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Quick Access</h3><p>Akses langsung ke flow paling sering dipakai.</p></div></div>
            <div className="quick-action-grid two-col">
              <Button to="/transactions/new"><AppIcon name="add" /> Add Transaction</Button>
              <Button to="/wallets/new"><AppIcon name="wallet" /> Add Wallet</Button>
              <Button to="/budgets/new"><AppIcon name="budget" /> Create Budget</Button>
              <Button to="/app-menu"><AppIcon name="more" /> All Access</Button>
              <Button to="/reports"><AppIcon name="chart" /> Reports</Button>
              <Button to="/settings"><AppIcon name="settings" /> Settings</Button>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
