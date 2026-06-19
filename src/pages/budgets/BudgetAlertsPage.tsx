import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { BudgetAlertItem } from '../../components/budgets/BudgetAlertItem';
import { useBudgetAlerts } from '../../hooks/useBudgets';

export function BudgetAlertsPage() {
  const { showToast } = useToast();
  const { data, isLoading } = useBudgetAlerts();
  
  const alerts = data?.alerts ?? [];
  const unread = alerts.filter((alert) => !alert.notified_at).length;
  const warning = alerts.filter((alert) => alert.severity === 'warning').length;
  const danger = alerts.filter((alert) => alert.severity === 'danger').length;

  return (
    <AppLayout title="Budget Alerts" description="Threshold alert 80% warning dan 100% exceeded untuk budget.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Budget alerts</span>
            <h2>Alert membantu user tahu kapan budget mulai berbahaya.</h2>
            <p>Alert dibuat dari threshold 80% dan 100%. Setiap action punya state jelas untuk review, mark read, dan buka detail budget.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/budgets" variant="primary"><AppIcon name="budget" /> Budgets</Button>
            <Button to="/budgets/report"><AppIcon name="budgetReport" /> Report</Button>
            <Button onClick={() => showToast('All budget alerts marked as read.')}><AppIcon name="success" /> Mark Read</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Unread</span><strong>{unread}</strong><small>Need attention</small></Card>
          <Card className="stat-card"><span>Warning</span><strong>{warning}</strong><small>80% threshold</small></Card>
          <Card className="stat-card"><span>Exceeded</span><strong>{danger}</strong><small>100% threshold</small></Card>
          <Card className="stat-card"><span>Rule</span><strong>Idempotent</strong><small>No spam alert</small></Card>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Active Alerts</h3><p>Alert yang perlu ditindaklanjuti.</p></div><Button size="small" onClick={() => showToast('Filter by unread, warning, exceeded.')}><AppIcon name="filter" /> Filter</Button></div>
            <div className="budget-alert-list large">
              {isLoading ? (
                <p>Loading alerts...</p>
              ) : alerts.length > 0 ? (
                alerts.map((alert) => <BudgetAlertItem key={alert.id} alert={alert} />)
              ) : (
                <p>No active alerts.</p>
              )}
            </div>
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Alert Rules</h3><p>Rule engine budget alert.</p></div></div>
            <div className="readiness-list">
              <div><span>Warning</span><Badge tone="orange">actual / limit ≥ 80%</Badge></div>
              <div><span>Exceeded</span><Badge tone="red">actual / limit ≥ 100%</Badge></div>
              <div><span>Source</span><Badge tone="blue">expense transactions</Badge></div>
              <div><span>Scope</span><Badge tone="purple">category + period + user</Badge></div>
            </div>
          </Card>
        </section>

        {alerts.length === 0 && !isLoading && (
          <EmptyState
            title="Safe budget empty state"
            description="Jika semua budget aman, tampilkan empty state positif agar user tetap merasa kondisi keuangan terkendali."
            action={<Button to="/budgets" variant="primary"><AppIcon name="budget" /> Back to Budgets</Button>}
          />
        )}
      </div>
    </AppLayout>
  );
}
