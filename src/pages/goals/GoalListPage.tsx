import clsx from 'clsx';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { FinanceOverviewCard } from '../../components/finance/FinanceOverviewCard';
import { itemAccentVars } from '../../components/finance/ColorPicker';
import { useGoals } from '../../hooks/useGoals';
import { useAmountVisibility } from '../../hooks/useAmountVisibility';
import { goalStatusBadgeTone, goalStatusLabel, goalProgressTone } from '../../lib/goalStatus';
import { formatIDR, maskedIDR } from '../../lib/money';
import { formatDateID } from '../../lib/dates';
import { NAV } from '../../lib/copy';
import type { Goal } from '../../types/goal';

export function GoalListPage() {
  const { data: goals = [], isLoading, error } = useGoals();
  const { amountsVisible } = useAmountVisibility();

  const totalTarget = goals.reduce((sum, g) => sum + g.target_amount_minor, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.collected_amount_minor, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const sharedGoals = goals.filter(g => (g.members?.length ?? 0) > 1).length;
  // Default the hero "Contribute" shortcut to a still-active goal so users do
  // not land on an achieved/cancelled goal's contribution form.
  const contributeTarget = goals.find(g => g.status === 'active') ?? goals[0];

  return (
    <AppLayout title={NAV.targetTabungan} description="Target tabungan, progres, anggota, dan riwayat setoran.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">Target Tabungan</span>
            <h2>Rencanakan target tabungan dengan progres yang jelas, sendiri atau bareng anggota.</h2>
            <p>Tetapkan jumlah target, setor rutin, dan pantau progres bersama anggota yang kamu undang.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/goals/new" variant="primary"><AppIcon name="add" /> Tambah Target</Button>
            {contributeTarget && (
              <Button to={`/goals/${contributeTarget.id}/contribute`}><AppIcon name="pay" /> Setor</Button>
            )}
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Total Target</span><strong><Amount value={totalTarget} maskable /></strong><small>Semua target</small></Card>
          <Card className="stat-card"><span>Total Terkumpul</span><strong><Amount value={totalSaved} type="income" maskable /></strong><small>{overallProgress}% tercapai</small></Card>
          <Card className="stat-card blue"><span>Target Aktif</span><strong>{activeGoals}</strong><small>Sedang berjalan</small></Card>
          <Card className="stat-card purple"><span>Target Bersama</span><strong>{sharedGoals}</strong><small>Dengan anggota</small></Card>
        </section>

        {error ? (
          <Card className="panel-card">
            <EmptyState icon={<AppIcon name="empty" />} title="Gagal memuat target" description="Periksa koneksi lalu coba lagi." />
          </Card>
        ) : isLoading ? (
          <div className="loading-state">Memuat target...</div>
        ) : (
          <>
            <section className="entity-card-grid stable-card-grid">
              {goals.map((goal) => {
                const progress = goal.target_amount_minor > 0 ? Math.round((goal.collected_amount_minor / goal.target_amount_minor) * 100) : 0;
                return (
                  <FinanceOverviewCard
                    key={goal.id}
                    title={goal.name}
                    subtitle={goal.deadline ? `batas waktu ${formatDateID(goal.deadline)}` : 'tanpa batas waktu'}
                    icon="goal"
                    iconTone={goal.status === 'cancelled' ? 'warning' : 'safe'}
                    badge={goalStatusLabel(goal.status)}
                    badgeTone={goalStatusBadgeTone(goal.status)}
                    amount={goal.collected_amount_minor}
                    amountType="income"
                    progress={progress}
                    progressTone={goalProgressTone(goal.status)}
                    accentColor={goal.color}
                    amountMaskable
                    metaLeft={`${progress}% tercapai`}
                    metaRight={`Target ${amountsVisible ? formatIDR(goal.target_amount_minor) : maskedIDR()}`}
                    actions={<><Button to={`/goals/${goal.id}`} size="small">Detail</Button><Button to={`/goals/${goal.id}/contribute`} size="small" variant="primary"><AppIcon name="pay" /> Setor</Button><Button to={`/goals/${goal.id}/members`} size="small"><AppIcon name="profile" /> Anggota</Button></>}
                  />
                );
              })}
            </section>

            <Card className="panel-card">
              <div className="panel-head"><div><h3>Daftar Target</h3><p>Semua target tabungan dengan progres, batas waktu, dan aksi setoran.</p></div><Button to="/goals/new" size="small" variant="primary"><AppIcon name="add" /> Tambah Target</Button></div>
              <DataTable<Goal>
                data={goals}
                getRowKey={(goal) => goal.id}
                columns={[
                  { key: 'name', header: 'Nama', render: (goal) => { const accent = itemAccentVars(goal.color); return <div className="table-title"><span className={clsx('mini-icon', accent ? 'has-accent' : 'safe')} style={accent}><AppIcon name="goal" /></span><strong>{goal.name}</strong></div>; } },
                  { key: 'target', header: 'Target', align: 'right', render: (goal) => <Amount value={goal.target_amount_minor} maskable /> },
                  { key: 'saved', header: 'Terkumpul', align: 'right', render: (goal) => <Amount value={goal.collected_amount_minor} type="income" maskable /> },
                  { key: 'deadline', header: 'Batas Waktu', render: (goal) => formatDateID(goal.deadline) },
                  { key: 'visibility', header: 'Visibilitas', render: (goal) => <Badge tone={(goal.members?.length ?? 0) > 1 ? 'purple' : 'gray'}>{(goal.members?.length ?? 0) > 1 ? 'bersama' : 'pribadi'}</Badge> },
                  { key: 'status', header: 'Status', render: (goal) => <Badge tone={goalStatusBadgeTone(goal.status)}>{goalStatusLabel(goal.status)}</Badge> },
                  { key: 'action', header: 'Aksi', render: (goal) => <div className="inline-actions"><Button to={`/goals/${goal.id}`} size="small">Lihat</Button><Button to={`/goals/${goal.id}/contribute`} size="small">Setor</Button></div> },
                ]}
              />
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
