import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { mockGoals } from '../../data/mockGoals';
import type { GoalContribution } from '../../types/goal';

export function GoalDetailPage() {
  const { id } = useParams();
  const goal = useMemo(() => mockGoals.find((item) => item.id === id) ?? mockGoals[0], [id]);
  const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);

  return (
    <AppLayout title="Goal Detail" description="Goal progress, members, contribution history, and next action.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Goal Detail</span><h2>{goal.name}</h2><p>{goal.note}</p></div>
          <div className="app-hero-actions"><Button to="/goals"><AppIcon name="back" /> Back</Button><Button to={`/goals/${goal.id}/edit`}><AppIcon name="edit" /> Edit</Button><Button to={`/goals/${goal.id}/contribute`} variant="primary"><AppIcon name="pay" /> Contribute</Button></div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card goal-detail-card">
            <div className="panel-head"><div><h3>Progress Overview</h3><p>Target, current saved, remaining amount, dan deadline.</p></div><Badge tone={goal.status === 'at_risk' ? 'orange' : 'green'}>{goal.status.replace('_', ' ')}</Badge></div>
            <div className="goal-progress-hero"><span className="preview-icon"><AppIcon name={goal.icon} /></span><div><strong><Amount value={goal.currentAmount} type="income" /></strong><small>of <Amount value={goal.targetAmount} /> target</small></div></div>
            <ProgressBar value={progress} tone={goal.status === 'at_risk' ? 'orange' : 'green'} />
            <div className="metric-list compact-metrics">
              <div><span>Progress</span><strong>{progress}% funded</strong></div>
              <div><span>Remaining</span><strong><Amount value={remaining} type="expense" /></strong></div>
              <div><span>Deadline</span><strong>{goal.deadline}</strong></div>
              <div><span>Wallet</span><strong>{goal.walletName}</strong></div>
            </div>
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Goal Members</h3><p>Owner, contributor, dan pending invite.</p></div><Button to={`/goals/${goal.id}/members`} size="small"><AppIcon name="profile" /> Manage</Button></div>
            <div className="readiness-list">
              {goal.members.map((member) => <div key={member.id}><span>{member.name}<small>{member.role} · {member.status}</small></span><Badge tone={member.status === 'joined' ? 'green' : 'orange'}><Amount value={member.contributionAmount} /></Badge></div>)}
            </div>
          </Card>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Contribution History</h3><p>Semua kontribusi yang menaikkan current amount goal.</p></div><Button to={`/goals/${goal.id}/contribute`} size="small" variant="primary"><AppIcon name="pay" /> Add Contribution</Button></div>
          <DataTable<GoalContribution>
            data={goal.contributions}
            getRowKey={(item) => item.id}
            columns={[
              { key: 'date', header: 'Date', render: (item) => item.date },
              { key: 'wallet', header: 'Wallet', render: (item) => item.walletName },
              { key: 'amount', header: 'Amount', align: 'right', render: (item) => <Amount value={item.amount} type="income" /> },
              { key: 'note', header: 'Note', render: (item) => item.note },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
