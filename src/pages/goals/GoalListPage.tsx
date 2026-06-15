import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { FinanceOverviewCard } from '../../components/finance/FinanceOverviewCard';
import { mockGoals, goalSummary } from '../../data/mockGoals';
import type { Goal } from '../../types/goal';

const statusTone = (status: Goal['status']) => status === 'completed' ? 'green' : status === 'at_risk' ? 'orange' : 'blue';

export function GoalListPage() {
  const overallProgress = Math.round((goalSummary.totalSaved / goalSummary.totalTarget) * 100);

  return (
    <AppLayout title="Goals" description="Financial goals, shared saving targets, members, and contribution tracking.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Goals</span>
            <h2>Rencanakan target keuangan dengan progress yang jelas dan bisa dibagi bersama anggota.</h2>
            <p>Goal menghubungkan target amount, wallet tujuan, contribution history, dan goal members agar saving plan tetap terukur.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/goals/new" variant="primary"><AppIcon name="add" /> Add Goal</Button>
            <Button to="/goals/goal-emergency-fund/contribute"><AppIcon name="pay" /> Contribute</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Total Target</span><strong><Amount value={goalSummary.totalTarget} /></strong><small>Across goals</small></Card>
          <Card className="stat-card"><span>Total Saved</span><strong><Amount value={goalSummary.totalSaved} type="income" /></strong><small>{overallProgress}% funded</small></Card>
          <Card className="stat-card blue"><span>Active Goals</span><strong>{goalSummary.active}</strong><small>Currently tracked</small></Card>
          <Card className="stat-card purple"><span>Shared Goals</span><strong>{goalSummary.shared}</strong><small>With members</small></Card>
        </section>

        <section className="entity-card-grid stable-card-grid">
          {mockGoals.map((goal) => {
            const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
            return (
              <FinanceOverviewCard
                key={goal.id}
                title={goal.name}
                subtitle={`${goal.walletName} · deadline ${goal.deadline}`}
                icon={goal.icon}
                iconTone={goal.status === 'at_risk' ? 'warning' : 'safe'}
                badge={goal.status.replace('_', ' ')}
                badgeTone={statusTone(goal.status)}
                amount={goal.currentAmount}
                amountType="income"
                description={goal.note}
                progress={progress}
                progressTone={goal.status === 'at_risk' ? 'orange' : 'green'}
                metaLeft={`${progress}% funded`}
                metaRight={`Target ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(goal.targetAmount)}`}
                actions={<><Button to={`/goals/${goal.id}`} size="small">Detail</Button><Button to={`/goals/${goal.id}/contribute`} size="small" variant="primary"><AppIcon name="pay" /> Contribute</Button><Button to={`/goals/${goal.id}/members`} size="small"><AppIcon name="profile" /> Members</Button></>}
              />
            );
          })}
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Goal List</h3><p>Semua target keuangan dengan progress, deadline, dan action kontribusi.</p></div><Button to="/goals/new" size="small" variant="primary"><AppIcon name="add" /> Add Goal</Button></div>
          <DataTable<Goal>
            data={mockGoals}
            getRowKey={(goal) => goal.id}
            columns={[
              { key: 'name', header: 'Goal', render: (goal) => <div className="table-title"><span className="mini-icon safe"><AppIcon name={goal.icon} /></span><strong>{goal.name}</strong><small>{goal.walletName}</small></div> },
              { key: 'target', header: 'Target', align: 'right', render: (goal) => <Amount value={goal.targetAmount} /> },
              { key: 'saved', header: 'Saved', align: 'right', render: (goal) => <Amount value={goal.currentAmount} type="income" /> },
              { key: 'deadline', header: 'Deadline', render: (goal) => goal.deadline },
              { key: 'visibility', header: 'Visibility', render: (goal) => <Badge tone={goal.visibility === 'shared' ? 'purple' : 'gray'}>{goal.visibility}</Badge> },
              { key: 'status', header: 'Status', render: (goal) => <Badge tone={statusTone(goal.status)}>{goal.status.replace('_', ' ')}</Badge> },
              { key: 'action', header: 'Action', render: (goal) => <div className="inline-actions"><Button to={`/goals/${goal.id}`} size="small">View</Button><Button to={`/goals/${goal.id}/contribute`} size="small">Contribute</Button></div> },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
