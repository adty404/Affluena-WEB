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
import { useMe } from '../../hooks/useMe';
import {
  goalMemberLabel,
  goalMemberStatusLabel,
  goalMemberStatusTone,
  goalStatusBadgeTone,
  goalStatusLabel,
  goalProgressTone,
} from '../../lib/goalStatus';
import type { GoalStatus } from '../../types/goal';

type PendingTransition = { status: GoalStatus; title: string; description: string; confirmLabel: string };

export function GoalDetailPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const { data: goal, isLoading } = useGoal(id || '');
  const { data: meData } = useMe();
  const updateGoal = useUpdateGoal();
  const [pending, setPending] = useState<PendingTransition | null>(null);
  const currentUserId = meData?.user.id;

  if (isLoading || !goal) {
    return <AppLayout title="Detail Target" description="Memuat..."><div className="loading-state">Memuat...</div></AppLayout>;
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
          // PUT replaces color/icon on the API; pass them through so a status
          // transition never wipes the goal's appearance.
          color: goal.color,
          icon: goal.icon,
        },
      });
      showToast(`Target ditandai ${goalStatusLabel(pending.status).toLowerCase()}.`);
      setPending(null);
    } catch (error) {
      showToast('Gagal memperbarui status target.');
    }
  };

  return (
    <AppLayout title="Detail Target" description="Progres target, anggota, dan aksi lanjutan.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">Detail Target</span><h2>{goal.name}</h2></div>
          <div className="app-hero-actions">
            <Button to="/goals"><AppIcon name="back" /> Kembali</Button>
            <Button to={`/goals/${goal.id}/edit`}><AppIcon name="edit" /> Edit</Button>
            {goal.status === 'active' && (
              <Button to={`/goals/${goal.id}/contribute`} variant="primary"><AppIcon name="pay" /> Setor</Button>
            )}
          </div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card goal-detail-card">
            <div className="panel-head"><div><h3>Ringkasan Progres</h3><p>Target, dana terkumpul, sisa, dan batas waktu.</p></div><Badge tone={goalStatusBadgeTone(goal.status)}>{goalStatusLabel(goal.status)}</Badge></div>
            <div className="goal-progress-hero"><span className="preview-icon"><AppIcon name="goal" /></span><div><strong><Amount value={goal.collected_amount_minor} type="income" /></strong><small>dari target <Amount value={goal.target_amount_minor} /></small></div></div>
            <ProgressBar value={progress} tone={goalProgressTone(goal.status)} />
            <div className="metric-list compact-metrics">
              <div><span>Progres</span><strong>{progress}% tercapai</strong></div>
              <div><span>Sisa</span><strong><Amount value={remaining} type="expense" /></strong></div>
              <div><span>Batas Waktu</span><strong>{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : '-'}</strong></div>
            </div>
            <div className="form-row-between goal-status-actions">
              {goal.status === 'active' && (
                <>
                  <Button
                    variant="primary"
                    disabled={updateGoal.isPending}
                    onClick={() => setPending({ status: 'achieved', title: 'Tandai target tercapai?', description: 'Target akan ditandai tercapai. Kamu bisa mengaktifkannya lagi nanti kalau perlu.', confirmLabel: 'Tandai Tercapai' })}
                  ><AppIcon name="success" /> Tandai Tercapai</Button>
                  <Button
                    variant="danger"
                    disabled={updateGoal.isPending}
                    onClick={() => setPending({ status: 'cancelled', title: 'Batalkan target ini?', description: 'Target akan ditandai dibatalkan. Dana yang sudah terkumpul di dompet target tidak berubah.', confirmLabel: 'Batalkan Target' })}
                  ><AppIcon name="cancelled" /> Batalkan Target</Button>
                </>
              )}
              {goal.status !== 'active' && (
                <Button
                  variant="primary"
                  disabled={updateGoal.isPending}
                  onClick={() => setPending({ status: 'active', title: 'Aktifkan lagi target ini?', description: 'Target akan kembali aktif sehingga kamu bisa lanjut menyetor.', confirmLabel: 'Aktifkan Lagi' })}
                ><AppIcon name="recurring" /> Aktifkan Lagi</Button>
              )}
            </div>
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Anggota Target</h3><p>Pemilik, anggota, dan undangan yang menunggu.</p></div><Button to={`/goals/${goal.id}/members`} size="small"><AppIcon name="profile" /> Kelola</Button></div>
            <div className="readiness-list">
              {goal.members?.map((member) => (
                <div key={member.user_id}>
                  <span>{goalMemberLabel(member, currentUserId)}</span>
                  <Badge tone={goalMemberStatusTone(member.status)}>{goalMemberStatusLabel(member.status)}</Badge>
                </div>
              ))}
              {(!goal.members || goal.members.length === 0) && (
                <div className="empty-state">Baru kamu sejauh ini. Undang anggota untuk menabung bersama.</div>
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
          <Button onClick={() => setPending(null)} disabled={updateGoal.isPending}>Kembali</Button>
          <Button
            variant={pending?.status === 'cancelled' ? 'danger' : 'primary'}
            onClick={onConfirmTransition}
            disabled={updateGoal.isPending}
          >{updateGoal.isPending ? 'Menyimpan...' : pending?.confirmLabel}</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
