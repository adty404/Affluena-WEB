import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { Input, Select } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { mockGoals } from '../../data/mockGoals';
import type { GoalMember } from '../../types/goal';

export function GoalMembersPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const goal = useMemo(() => mockGoals.find((item) => item.id === id) ?? mockGoals[0], [id]);

  return (
    <AppLayout title="Goal Members" description="Manage members, roles, and contribution access for shared goals.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Goal Members</span><h2>Kelola anggota untuk {goal.name}.</h2><p>Role member membantu mengatur siapa yang bisa contribute, melihat progress, atau mengelola target.</p></div>
          <div className="app-hero-actions"><Button to={`/goals/${goal.id}`}><AppIcon name="back" /> Back</Button><Button variant="primary" onClick={() => showToast('Goal invitation sent successfully.')}><AppIcon name="profile" /> Send Invite</Button></div>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Invite Member</h3><p>Tambahkan anggota baru ke shared goal.</p></div></div>
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Goal invitation sent successfully.'); }}>
              <div className="form-two"><label><span>Email or name</span><Input defaultValue="rina@example.com" /></label><label><span>Role</span><Select defaultValue="contributor"><option value="contributor">Contributor</option><option value="viewer">Viewer</option></Select></label></div>
              <div className="form-row-between"><Button to={`/goals/${goal.id}`}>Cancel</Button><Button type="submit" variant="primary"><AppIcon name="profile" /> Invite Member</Button></div>
            </form>
          </Card>

          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Member Rules</h3><p>Permission yang digunakan goal_members.</p></div></div>
            <div className="metric-list">
              <div><span>Owner</span><strong>Manage goal, members, and contribution rules</strong></div>
              <div><span>Contributor</span><strong>Can add contribution and view progress</strong></div>
              <div><span>Viewer</span><strong>Read-only progress access</strong></div>
            </div>
          </Card>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Members</h3><p>Anggota yang sudah joined atau masih pending.</p></div></div>
          <DataTable<GoalMember>
            data={goal.members}
            getRowKey={(member) => member.id}
            columns={[
              { key: 'name', header: 'Member', render: (member) => <div className="table-title"><span className="mini-icon safe"><AppIcon name="profile" /></span><strong>{member.name}</strong><small>{member.role}</small></div> },
              { key: 'role', header: 'Role', render: (member) => member.role },
              { key: 'contribution', header: 'Contribution', align: 'right', render: (member) => <Amount value={member.contributionAmount} type="income" /> },
              { key: 'status', header: 'Status', render: (member) => <Badge tone={member.status === 'joined' ? 'green' : 'orange'}>{member.status}</Badge> },
              { key: 'action', header: 'Action', render: (member) => <Button size="small" onClick={() => showToast(`${member.name} role reviewed.`)}>Review</Button> },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
