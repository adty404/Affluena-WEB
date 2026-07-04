import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input, Select } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { ColorPicker, normalizeItemColor } from '../../components/finance/ColorPicker';
import { useToast } from '../../components/ui/Toast';
import { useGoal, useCreateGoal, useUpdateGoal } from '../../hooks/useGoals';
import { goalSchema, type GoalFormData } from '../../schemas/goal';
import { goalStatusBadgeTone, goalStatusLabel } from '../../lib/goalStatus';
import { toLocalDatetimeInput } from '../../lib/dates';

export function GoalFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(id);
  
  const { data: goal, isLoading } = useGoal(id || '');
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue, control } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: '',
      target_amount_minor: 0,
      deadline: '',
      status: 'active',
      color: '',
      icon: '',
    }
  });

  useEffect(() => {
    if (goal && isEdit) {
      reset({
        name: goal.name,
        target_amount_minor: goal.target_amount_minor,
        deadline: goal.deadline ? toLocalDatetimeInput(new Date(goal.deadline)) : '',
        status: goal.status,
        color: normalizeItemColor(goal.color),
        // No icon picker on web yet — round-trip whatever mobile stored.
        icon: goal.icon ?? '',
      });
    }
  }, [goal, isEdit, reset]);

  const onSubmit = async (data: GoalFormData) => {
    try {
      const deadline = data.deadline ? new Date(data.deadline).toISOString() : undefined;

      if (isEdit && id) {
        await updateGoal.mutateAsync({
          id,
          data: {
            name: data.name,
            target_amount_minor: data.target_amount_minor,
            deadline,
            status: data.status,
            color: data.color,
            icon: data.icon,
          },
        });
        showToast('Target berhasil diperbarui.');
      } else {
        await createGoal.mutateAsync({
          name: data.name,
          target_amount_minor: data.target_amount_minor,
          deadline,
          color: data.color,
          icon: data.icon,
        });
        showToast('Target berhasil dibuat.');
      }
      navigate('/goals');
    } catch (error) {
      showToast('Gagal menyimpan target.');
    }
  };

  const watchTarget = watch('target_amount_minor') || 0;
  const currentAmount = goal?.collected_amount_minor || 0;
  const progress = watchTarget > 0 ? Math.round((currentAmount / watchTarget) * 100) : 0;
  const watchStatus = watch('status') || 'active';

  if (isEdit && isLoading) {
    return <AppLayout title="Edit Target" description="Memuat..."><div className="loading-state">Memuat...</div></AppLayout>;
  }

  return (
    <AppLayout title={isEdit ? 'Edit Target' : 'Target Baru'} description="Buat dan perbarui target tabungan dengan jumlah dan batas waktu yang jelas.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Target Tabungan</span><h2>{isEdit ? 'Perbarui target dan rencana setoranmu.' : 'Buat target tabungan baru yang realistis.'}</h2><p>Tentukan nama, jumlah target, dan batas waktu supaya rencana menabungmu jelas.</p></div>
          <div className="app-hero-actions"><Button to="/goals"><AppIcon name="back" /> Kembali</Button><Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}><AppIcon name="save" /> Simpan</Button></div>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Informasi Target</h3><p>Lengkapi nama, jumlah target, dan batas waktu.</p></div></div>
            <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-two">
                <label>
                  <span>Nama Target</span>
                  <Input {...register('name')} placeholder="Dana Darurat" />
                  {errors.name && <small className="form-error">{errors.name.message}</small>}
                </label>
                <label>
                  <span>Target (Rp)</span>
                  <Input type="number" {...register('target_amount_minor', { valueAsNumber: true })} />
                  {errors.target_amount_minor && <small className="form-error">{errors.target_amount_minor.message}</small>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Batas Waktu</span>
                  <Input type="datetime-local" {...register('deadline')} />
                  {errors.deadline && <small className="form-error">{errors.deadline.message}</small>}
                </label>
                {isEdit && (
                  <label>
                    <span>Status</span>
                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Select name={field.name} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} onBlur={field.onBlur}>
                          <option value="active">Aktif</option>
                          <option value="achieved">Tercapai</option>
                          <option value="cancelled">Dibatalkan</option>
                        </Select>
                      )}
                    />
                    <small className="field-help">Tercapai menandai target selesai; dibatalkan menghentikan pemantauan.</small>
                  </label>
                )}
              </div>
              <label>
                <span>Warna</span>
                <ColorPicker
                  value={watch('color')}
                  onChange={(hex) => setValue('color', hex, { shouldDirty: true })}
                />
                <small className="field-help">Warna yang sama dipakai di aplikasi mobile.</small>
              </label>
              <div className="form-row-between"><Button to="/goals">Batal</Button><Button type="submit" variant="primary" disabled={isSubmitting}><AppIcon name="save" /> Simpan Target</Button></div>
            </form>
          </Card>

          <Card className="panel-card side-metrics-card goal-preview-card">
            <div className="panel-head"><div><h3>Pratinjau Target</h3><p>Begini tampilan targetmu nanti.</p></div><Badge tone={goalStatusBadgeTone(watchStatus)}>{goalStatusLabel(watchStatus)}</Badge></div>
            <div className="preview-icon"><AppIcon name="goal" /></div>
            <h3>{watch('name') || 'Target Baru'}</h3>
            <div className="metric-list">
              <div><span>Terkumpul</span><strong><Amount value={currentAmount} type="income" /></strong></div>
              <div><span>Target</span><strong><Amount value={watchTarget} /></strong></div>
              <div><span>Progres</span><strong>{progress}% tercapai</strong></div>
            </div>
            <ProgressBar value={progress} tone={watchStatus === 'cancelled' ? 'orange' : 'green'} />
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
