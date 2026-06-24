import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { useToast } from '../../components/ui/Toast';
import { useGoal, useUpdateGoal } from '../../hooks/useGoals';
import { goalStatusBadgeTone, goalStatusLabel, goalProgressTone } from '../../lib/goalStatus';
import type { GoalStatus } from '../../types/goal';

type PendingTransition = { status: GoalStatus; title: string; description: string; confirmLabel: string };

export function GoalDetailPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const { data: goal, isLoading } = useGoal(id || '');
  const updateGoal = useUpdateGoal();
  const [pending, setPending] = useState<PendingTransition | null>(null);

  if (isLoading || !goal) {
    return <AppLayout title="Goal Detail" description="Loading..."><div className="loading-state">Loading...</div></AppLayout>;
  }

  const progress = goal.target_amount_minor > 0 ? Math.round((goal.collected_amount_minor / goal.target_amount_minor) * 100) : 0;
  const remaining = Math.max(goal.target_amount_minor - goal.collected_amount_minor, 0);

  const onConfirmTransition = async () => {
    if (!id || !pending) return;
    try {
      await updateGoal.mutateAsync({
        id,
        data: {
          name: goal.name,
          target_amount_minor: goal.target_amount_minor,
          deadline: goal.deadline,
          status: pending.status,
        },
      });
      showToast(`Goal marked as ${goalStatusLabel(pending.status).toLowerCase()}.`);
      setPending(null);
    } catch (error) {
      showToast('Failed to update goal status.');
    }
  };

  return (
    <AppLayout title="Goal Detail" description="Goal progress, members, contribution history, and next action.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Goal Detail</span><h2>{goal.name}</h2></div>
          <div className="app-hero-actions">
            <Button to="/goals"><AppIcon name="back" /> Back</Button>
            <Button to={`/goals/${goal.id}/edit`}><AppIcon name="edit" /> Edit</Button>
            {goal.status === 'active' && (
              <Button to={`/goals/${goal.id}/contribute`} variant="primary"><AppIcon name="pay" /> Contribute</Button>
            )}
          </div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card goal-detail-card">
            <div className="panel-head"><div><h3>Progress Overview</h3><p>Target, current saved, remaining amount, dan deadline.</p></div><Badge tone={goalStatusBadgeTone(goal.status)}>{goalStatusLabel(goal.status)}</Badge></div>
            <div className="goal-progress-hero"><span className="preview-icon"><AppIcon name="goal" /></span><div><strong><Amount value={goal.collected_amount_minor} type="income" /></strong><small>of <Amount value={goal.target_amount_minor} /> target</small></div></div>
            <ProgressBar value={progress} tone={goalProgressTone(goal.status)} />
            <div className="metric-list compact-metrics">
              <div><span>Progress</span><strong>{progress}% funded</strong></div>
              <div><span>Remaining</span><strong><Amount value={remaining} type="expense" /></strong></div>
              <div><span>Deadline</span><strong>{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : '-'}</strong></div>
            </div>
            <div className="form-row-between goal-status-actions">
              {goal.status === 'active' && (
                <>
                  <Button
                    variant="primary"
                    disabled={updateGoal.isPending}
                    onClick={() => setPending({ status: 'achieved', title: 'Mark goal as achieved?', description: 'This goal will be marked complete. You can reactivate it later if needed.', confirmLabel: 'Mark complete' })}
                  ><AppIcon name="success" /> Mark complete</Button>
                  <Button
                    variant="danger"
                    disabled={updateGoal.isPending}
                    onClick={() => setPending({ status: 'cancelled', title: 'Cancel this goal?', description: 'The goal will be marked as cancelled. Saved funds in the goal wallet are not affected.', confirmLabel: 'Cancel goal' })}
                  ><AppIcon name="cancelled" /> Cancel goal</Button>
                </>
              )}
              {goal.status !== 'active' && (
                <Button
                  variant="primary"
                  disabled={updateGoal.isPending}
                  onClick={() => setPending({ status: 'active', title: 'Reactivate this goal?', description: 'The goal will return to active so you can keep contributing.', confirmLabel: 'Reactivate' })}
                ><AppIcon name="recurring" /> Reactivate goal</Button>
              )}
            </div>
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Goal Members</h3><p>Owner, contributor, dan pending invite.</p></div><Button to={`/goals/${goal.id}/members`} size="small"><AppIcon name="profile" /> Manage</Button></div>
            <div className="readiness-list">
              {goal.members?.map((member) => (
                <div key={member.user_id}>
                  <span>Member<small>{member.user_id}</small></span>
                  <Badge tone={member.status === 'joined' ? 'green' : member.status === 'rejected' ? 'red' : 'orange'}>{member.status}</Badge>
                </div>
              ))}
              {(!goal.members || goal.members.length === 0) && (
                <div className="empty-state">No members yet.</div>
              )}
            </div>
          </Card>
        </section>
      </div>

      <Modal
        open={pending !== null}
        title={pending?.title ?? ''}
        description={pending?.description}
        onClose={() => { if (!updateGoal.isPending) setPending(null); }}
      >
        <div className="form-row-between">
          <Button onClick={() => setPending(null)} disabled={updateGoal.isPending}>Back</Button>
          <Button
            variant={pending?.status === 'cancelled' ? 'danger' : 'primary'}
            onClick={onConfirmTransition}
            disabled={updateGoal.isPending}
          >{updateGoal.isPending ? 'Saving...' : pending?.confirmLabel}</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
