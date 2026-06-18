import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { useToast } from '../../components/ui/Toast';
import { useGoal, useCreateGoal, useUpdateGoal } from '../../hooks/useGoals';
import { goalSchema, type GoalFormData } from '../../schemas/goal';

export function GoalFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(id);
  
  const { data: goal, isLoading } = useGoal(id || '');
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: '',
      target_amount_minor: 0,
      deadline: '',
    }
  });

  useEffect(() => {
    if (goal && isEdit) {
      reset({
        name: goal.name,
        target_amount_minor: goal.target_amount_minor,
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().slice(0, 16) : '',
      });
    }
  }, [goal, isEdit, reset]);

  const onSubmit = async (data: GoalFormData) => {
    try {
      const payload = {
        ...data,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined,
      };

      if (isEdit && id) {
        await updateGoal.mutateAsync({ id, data: payload });
        showToast('Goal updated successfully.');
      } else {
        await createGoal.mutateAsync(payload);
        showToast('Goal created successfully.');
      }
      navigate('/goals');
    } catch (error) {
      showToast('Failed to save goal.');
    }
  };

  const watchTarget = watch('target_amount_minor') || 0;
  const currentAmount = goal?.collected_amount_minor || 0;
  const progress = watchTarget > 0 ? Math.round((currentAmount / watchTarget) * 100) : 0;
  const status = goal?.status || 'active';

  if (isEdit && isLoading) {
    return <AppLayout title="Edit Goal" description="Loading..."><div className="loading-state">Loading...</div></AppLayout>;
  }

  return (
    <AppLayout title={isEdit ? 'Edit Goal' : 'New Goal'} description="Create and update financial saving goals with clear target and deadline.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Goal Form</span><h2>{isEdit ? 'Update target goal dan contribution plan.' : 'Buat target keuangan baru yang actionable.'}</h2><p>Form ini memastikan target amount, wallet, deadline, dan visibility jelas sebelum goal dijalankan.</p></div>
          <div className="app-hero-actions"><Button to="/goals"><AppIcon name="back" /> Back</Button><Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}><AppIcon name="save" /> Save</Button></div>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Goal Information</h3><p>Lengkapi target, wallet tujuan, deadline, dan visibility.</p></div></div>
            <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-two">
                <label>
                  <span>Goal Name</span>
                  <Input {...register('name')} placeholder="Emergency Fund" />
                  {errors.name && <small className="field-error">{errors.name.message}</small>}
                </label>
                <label>
                  <span>Target Amount</span>
                  <Input type="number" {...register('target_amount_minor', { valueAsNumber: true })} />
                  {errors.target_amount_minor && <small className="field-error">{errors.target_amount_minor.message}</small>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Deadline</span>
                  <Input type="datetime-local" {...register('deadline')} />
                  {errors.deadline && <small className="field-error">{errors.deadline.message}</small>}
                </label>
              </div>
              <div className="form-row-between"><Button to="/goals">Cancel</Button><Button type="submit" variant="primary" disabled={isSubmitting}><AppIcon name="save" /> Save Goal</Button></div>
            </form>
          </Card>

          <Card className="panel-card side-metrics-card goal-preview-card">
            <div className="panel-head"><div><h3>Goal Preview</h3><p>Progress dan target yang akan tampil ke user.</p></div><Badge tone={status === 'at_risk' ? 'orange' : 'green'}>{status.replace('_', ' ')}</Badge></div>
            <div className="preview-icon"><AppIcon name="goal" /></div>
            <h3>{watch('name') || 'New Goal'}</h3>
            <div className="metric-list">
              <div><span>Current saved</span><strong><Amount value={currentAmount} type="income" /></strong></div>
              <div><span>Target</span><strong><Amount value={watchTarget} /></strong></div>
              <div><span>Progress</span><strong>{progress}% funded</strong></div>
            </div>
            <ProgressBar value={progress} tone={status === 'at_risk' ? 'orange' : 'green'} />
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
