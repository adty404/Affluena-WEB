import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { Input } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { useToast } from '../../components/ui/Toast';
import { useGoal, useInviteGoalMember, useRespondGoalMember } from '../../hooks/useGoals';
import { goalMemberInviteSchema, type GoalMemberInviteData } from '../../schemas/goal';
import type { GoalMember } from '../../types/goal';

export function GoalMembersPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const { data: goal, isLoading } = useGoal(id || '');
  const inviteMember = useInviteGoalMember();
  const respondMember = useRespondGoalMember();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<GoalMemberInviteData>({
    resolver: zodResolver(goalMemberInviteSchema),
    defaultValues: { email: '' }
  });

  const onInvite = async (data: GoalMemberInviteData) => {
    if (!id) return;
    try {
      await inviteMember.mutateAsync({ id, data });
      showToast('Goal invitation sent successfully.');
      reset();
    } catch (error) {
      showToast('Failed to send invitation.');
    }
  };

  const onRespond = async (userId: string, status: 'joined' | 'rejected') => {
    if (!id) return;
    try {
      await respondMember.mutateAsync({ id, userId, data: { status } });
      showToast(`Member ${status} successfully.`);
    } catch (error) {
      showToast('Failed to respond.');
    }
  };

  if (isLoading || !goal) {
    return <AppLayout title="Goal Members" description="Loading..."><div className="loading-state">Loading...</div></AppLayout>;
  }

  return (
    <AppLayout title="Goal Members" description="Manage members, roles, and contribution access for shared goals.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Goal Members</span><h2>Kelola anggota untuk {goal.name}.</h2><p>Role member membantu mengatur siapa yang bisa contribute, melihat progress, atau mengelola target.</p></div>
          <div className="app-hero-actions"><Button to={`/goals/${goal.id}`}><AppIcon name="back" /> Back</Button></div>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Invite Member</h3><p>Tambahkan anggota baru ke shared goal.</p></div></div>
            <form className="form-stack" onSubmit={handleSubmit(onInvite)}>
              <div className="form-two">
                <label>
                  <span>Email</span>
                  <Input {...register('email')} placeholder="rina@example.com" />
                  {errors.email && <small className="field-error">{errors.email.message}</small>}
                </label>
              </div>
              <div className="form-row-between"><Button to={`/goals/${goal.id}`}>Cancel</Button><Button type="submit" variant="primary" disabled={isSubmitting}><AppIcon name="profile" /> Invite Member</Button></div>
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
            data={goal.members || []}
            getRowKey={(member) => member.user_id}
            columns={[
              { key: 'name', header: 'Member', render: (member) => <div className="table-title"><span className="mini-icon safe"><AppIcon name="profile" /></span><strong>{member.user_id}</strong></div> },
              { key: 'status', header: 'Status', render: (member) => <Badge tone={member.status === 'joined' ? 'green' : member.status === 'rejected' ? 'red' : 'orange'}>{member.status}</Badge> },
              { key: 'action', header: 'Action', render: (member) => (
                <div className="inline-actions">
                  {member.status === 'pending' && (
                    <>
                      <Button size="small" onClick={() => onRespond(member.user_id, 'joined')}>Accept</Button>
                      <Button size="small" onClick={() => onRespond(member.user_id, 'rejected')}>Reject</Button>
                    </>
                  )}
                </div>
              ) },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
