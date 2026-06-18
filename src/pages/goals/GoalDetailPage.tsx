import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { useGoal } from '../../hooks/useGoals';

export function GoalDetailPage() {
  const { id } = useParams();
  const { data: goal, isLoading } = useGoal(id || '');

  if (isLoading || !goal) {
    return <AppLayout title="Goal Detail" description="Loading..."><div className="loading-state">Loading...</div></AppLayout>;
  }

  const progress = goal.target_amount_minor > 0 ? Math.round((goal.collected_amount_minor / goal.target_amount_minor) * 100) : 0;
  const remaining = Math.max(goal.target_amount_minor - goal.collected_amount_minor, 0);

  return (
    <AppLayout title="Goal Detail" description="Goal progress, members, contribution history, and next action.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Goal Detail</span><h2>{goal.name}</h2></div>
          <div className="app-hero-actions"><Button to="/goals"><AppIcon name="back" /> Back</Button><Button to={`/goals/${goal.id}/edit`}><AppIcon name="edit" /> Edit</Button><Button to={`/goals/${goal.id}/contribute`} variant="primary"><AppIcon name="pay" /> Contribute</Button></div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card goal-detail-card">
            <div className="panel-head"><div><h3>Progress Overview</h3><p>Target, current saved, remaining amount, dan deadline.</p></div><Badge tone={goal.status === 'at_risk' ? 'orange' : 'green'}>{goal.status.replace('_', ' ')}</Badge></div>
            <div className="goal-progress-hero"><span className="preview-icon"><AppIcon name="goal" /></span><div><strong><Amount value={goal.collected_amount_minor} type="income" /></strong><small>of <Amount value={goal.target_amount_minor} /> target</small></div></div>
            <ProgressBar value={progress} tone={goal.status === 'at_risk' ? 'orange' : 'green'} />
            <div className="metric-list compact-metrics">
              <div><span>Progress</span><strong>{progress}% funded</strong></div>
              <div><span>Remaining</span><strong><Amount value={remaining} type="expense" /></strong></div>
              <div><span>Deadline</span><strong>{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : '-'}</strong></div>
            </div>
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Goal Members</h3><p>Owner, contributor, dan pending invite.</p></div><Button to={`/goals/${goal.id}/members`} size="small"><AppIcon name="profile" /> Manage</Button></div>
            <div className="readiness-list">
              {goal.members?.map((member) => (
                <div key={member.user_id}>
                  <span>{member.user_id}<small>{member.status}</small></span>
                  <Badge tone={member.status === 'joined' ? 'green' : 'orange'}>{member.status}</Badge>
                </div>
              ))}
              {(!goal.members || goal.members.length === 0) && (
                <div className="empty-state">No members yet.</div>
              )}
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
