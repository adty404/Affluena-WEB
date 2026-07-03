import clsx from 'clsx';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { FinanceOverviewCard } from '../../components/finance/FinanceOverviewCard';
import { itemAccentVars } from '../../components/finance/ColorPicker';
import { useGoals } from '../../hooks/useGoals';
import { goalStatusBadgeTone, goalStatusLabel, goalProgressTone } from '../../lib/goalStatus';
import type { Goal } from '../../types/goal';

export function GoalListPage() {
  const { data: goals = [], isLoading } = useGoals();

  const totalTarget = goals.reduce((sum, g) => sum + g.target_amount_minor, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.collected_amount_minor, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const sharedGoals = goals.filter(g => (g.members?.length ?? 0) > 1).length;
  // Default the hero "Contribute" shortcut to a still-active goal so users do
  // not land on an achieved/cancelled goal's contribution form.
  const contributeTarget = goals.find(g => g.status === 'active') ?? goals[0];

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
            {contributeTarget && (
              <Button to={`/goals/${contributeTarget.id}/contribute`}><AppIcon name="pay" /> Contribute</Button>
            )}
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Total Target</span><strong><Amount value={totalTarget} /></strong><small>Across goals</small></Card>
          <Card className="stat-card"><span>Total Saved</span><strong><Amount value={totalSaved} type="income" /></strong><small>{overallProgress}% funded</small></Card>
          <Card className="stat-card blue"><span>Active Goals</span><strong>{activeGoals}</strong><small>Currently tracked</small></Card>
          <Card className="stat-card purple"><span>Shared Goals</span><strong>{sharedGoals}</strong><small>With members</small></Card>
        </section>

        {isLoading ? (
          <div className="loading-state">Loading goals...</div>
        ) : (
          <>
            <section className="entity-card-grid stable-card-grid">
              {goals.map((goal) => {
                const progress = goal.target_amount_minor > 0 ? Math.round((goal.collected_amount_minor / goal.target_amount_minor) * 100) : 0;
                return (
                  <FinanceOverviewCard
                    key={goal.id}
                    title={goal.name}
                    subtitle={`deadline ${goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}`}
                    icon="goal"
                    iconTone={goal.status === 'cancelled' ? 'warning' : 'safe'}
                    badge={goalStatusLabel(goal.status)}
                    badgeTone={goalStatusBadgeTone(goal.status)}
                    amount={goal.collected_amount_minor}
                    amountType="income"
                    description=""
                    progress={progress}
                    progressTone={goalProgressTone(goal.status)}
                    accentColor={goal.color}
                    metaLeft={`${progress}% funded`}
                    metaRight={`Target ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(goal.target_amount_minor)}`}
                    actions={<><Button to={`/goals/${goal.id}`} size="small">Detail</Button><Button to={`/goals/${goal.id}/contribute`} size="small" variant="primary"><AppIcon name="pay" /> Contribute</Button><Button to={`/goals/${goal.id}/members`} size="small"><AppIcon name="profile" /> Members</Button></>}
                  />
                );
              })}
            </section>

            <Card className="panel-card">
              <div className="panel-head"><div><h3>Goal List</h3><p>Semua target keuangan dengan progress, deadline, dan action kontribusi.</p></div><Button to="/goals/new" size="small" variant="primary"><AppIcon name="add" /> Add Goal</Button></div>
              <DataTable<Goal>
                data={goals}
                getRowKey={(goal) => goal.id}
                columns={[
                  { key: 'name', header: 'Goal', render: (goal) => { const accent = itemAccentVars(goal.color); return <div className="table-title"><span className={clsx('mini-icon', accent ? 'has-accent' : 'safe')} style={accent}><AppIcon name="goal" /></span><strong>{goal.name}</strong></div>; } },
                  { key: 'target', header: 'Target', align: 'right', render: (goal) => <Amount value={goal.target_amount_minor} /> },
                  { key: 'saved', header: 'Saved', align: 'right', render: (goal) => <Amount value={goal.collected_amount_minor} type="income" /> },
                  { key: 'deadline', header: 'Deadline', render: (goal) => goal.deadline ? new Date(goal.deadline).toLocaleDateString() : '-' },
                  { key: 'visibility', header: 'Visibility', render: (goal) => <Badge tone={(goal.members?.length ?? 0) > 1 ? 'purple' : 'gray'}>{(goal.members?.length ?? 0) > 1 ? 'shared' : 'private'}</Badge> },
                  { key: 'status', header: 'Status', render: (goal) => <Badge tone={goalStatusBadgeTone(goal.status)}>{goalStatusLabel(goal.status)}</Badge> },
                  { key: 'action', header: 'Action', render: (goal) => <div className="inline-actions"><Button to={`/goals/${goal.id}`} size="small">View</Button><Button to={`/goals/${goal.id}/contribute`} size="small">Contribute</Button></div> },
                ]}
              />
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
