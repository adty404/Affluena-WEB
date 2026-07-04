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
import { useMe } from '../../hooks/useMe';
import { goalMemberLabel, goalMemberStatusLabel, goalMemberStatusTone } from '../../lib/goalStatus';
import { goalMemberInviteSchema, type GoalMemberInviteData } from '../../schemas/goal';
import type { GoalMember } from '../../types/goal';

export function GoalMembersPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const { data: goal, isLoading } = useGoal(id || '');
  const { data: meData } = useMe();
  const inviteMember = useInviteGoalMember();
  const respondMember = useRespondGoalMember();
  const currentUserId = meData?.user.id;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<GoalMemberInviteData>({
    resolver: zodResolver(goalMemberInviteSchema),
    defaultValues: { email: '' }
  });

  const onInvite = async (data: GoalMemberInviteData) => {
    if (!id) return;
    try {
      await inviteMember.mutateAsync({ id, data });
      showToast('Undangan target tabungan berhasil dikirim.');
      reset();
    } catch (error) {
      showToast('Gagal mengirim undangan.');
    }
  };

  const onRespond = async (userId: string, status: 'joined' | 'rejected') => {
    if (!id) return;
    try {
      await respondMember.mutateAsync({ id, userId, data: { status } });
      showToast(status === 'joined' ? 'Undangan berhasil diterima.' : 'Undangan berhasil ditolak.');
    } catch (error) {
      showToast('Gagal merespons undangan.');
    }
  };

  if (isLoading || !goal) {
    return <AppLayout title="Anggota Target" description="Memuat..."><div className="loading-state">Memuat...</div></AppLayout>;
  }

  return (
    <AppLayout title="Anggota Target" description="Kelola anggota dan akses setoran untuk target tabungan bersama.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">Anggota Target</span><h2>Kelola anggota untuk {goal.name}.</h2><p>Peran anggota membantu mengatur siapa yang bisa menyetor, melihat progres, atau mengelola target.</p></div>
          <div className="app-hero-actions"><Button to={`/goals/${goal.id}`}><AppIcon name="back" /> Kembali</Button></div>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Undang Anggota</h3><p>Tambahkan anggota baru ke target tabungan bersama.</p></div></div>
            <form className="form-stack" onSubmit={handleSubmit(onInvite)}>
              <div className="form-two">
                <label>
                  <span>Email</span>
                  <Input {...register('email')} placeholder="rina@example.com" />
                  {errors.email && <small className="field-error">{errors.email.message}</small>}
                </label>
              </div>
              <div className="form-row-between"><Button to={`/goals/${goal.id}`}>Batal</Button><Button type="submit" variant="primary" disabled={isSubmitting || inviteMember.isPending}><AppIcon name="profile" /> {inviteMember.isPending ? 'Mengundang...' : 'Undang Anggota'}</Button></div>
            </form>
          </Card>

          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Aturan Anggota</h3><p>Hak akses tiap peran di target bersama.</p></div></div>
            <div className="metric-list">
              <div><span>Pemilik</span><strong>Mengelola target, anggota, dan setoran</strong></div>
              <div><span>Penyetor</span><strong>Bisa menambah setoran dan melihat progres</strong></div>
              <div><span>Pemantau</span><strong>Hanya bisa melihat progres</strong></div>
            </div>
          </Card>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Anggota</h3><p>Anggota yang sudah bergabung atau masih menunggu.</p></div></div>
          <DataTable<GoalMember>
            data={goal.members || []}
            getRowKey={(member) => member.user_id}
            columns={[
              { key: 'name', header: 'Anggota', render: (member) => <div className="table-title"><span className="mini-icon safe"><AppIcon name="profile" /></span><strong>{goalMemberLabel(member, currentUserId)}</strong></div> },
              { key: 'status', header: 'Status', render: (member) => <Badge tone={goalMemberStatusTone(member.status)}>{goalMemberStatusLabel(member.status)}</Badge> },
              { key: 'action', header: 'Aksi', render: (member) => (
                <div className="inline-actions">
                  {member.status === 'pending' && member.user_id === currentUserId ? (
                    <>
                      <Button size="small" variant="primary" disabled={respondMember.isPending} onClick={() => onRespond(member.user_id, 'joined')}>Terima</Button>
                      <Button size="small" variant="danger" disabled={respondMember.isPending} onClick={() => onRespond(member.user_id, 'rejected')}>Tolak</Button>
                    </>
                  ) : (
                    <span className="muted-text">—</span>
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
