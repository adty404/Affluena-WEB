import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { useSubscription, usePaySubscription } from '../../hooks/useTrackers';
import { paySubscriptionSchema, type PaySubscriptionInput } from '../../schemas/tracker';
import type { ApiError } from '../../api/types';

export function SubscriptionPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: item, isLoading } = useSubscription(id ?? '');
  const payMut = usePaySubscription();

  const form = useForm<PaySubscriptionInput>({
    resolver: zodResolver(paySubscriptionSchema),
    defaultValues: {
      paid_at: new Date().toISOString().split('T')[0],
      note: '',
    },
  });

  if (isLoading) {
    return (
      <AppLayout title="Pay Subscription" description="Loading...">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Loading</span><strong>...</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  if (!item) {
    return (
      <AppLayout title="Pay Subscription" description="Not found">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Error</span><strong>Subscription not found</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  async function onSubmit(values: PaySubscriptionInput) {
    if (!id) return;
    try {
      await payMut.mutateAsync({ id, data: values });
      showToast('Subscription payment recorded.');
      navigate('/subscriptions', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Failed to record payment.');
    }
  }

  return (
    <AppLayout title="Pay Subscription" description="Record renewal payment and create transaction.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Subscription Payment</span><h2>Bayar {item.name} dan update renewal schedule.</h2><p>Payment akan membuat expense transaction dan memindahkan next renewal sesuai cycle.</p></div><div className="app-hero-actions"><Button to="/subscriptions">Back</Button></div></section>
        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Payment Information</h3><p>Wallet, amount, renewal date, dan linked transaction.</p></div></div>
            <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div className="form-two">
                <label>
                  <span>Payment Date</span>
                  <Input type="date" {...form.register('paid_at')} />
                  {form.formState.errors.paid_at && <span className="form-error">{form.formState.errors.paid_at.message}</span>}
                </label>
              </div>
              <label>
                <span>Note</span>
                <Textarea {...form.register('note')} placeholder={`Renewal payment for ${item.name}.`} />
                {form.formState.errors.note && <span className="form-error">{form.formState.errors.note.message}</span>}
              </label>
              <div className="form-row-between">
                <Button to="/subscriptions">Cancel</Button>
                <Button type="submit" variant="primary" disabled={form.formState.isSubmitting || payMut.isPending}><AppIcon name="pay" /> Pay Subscription</Button>
              </div>
            </form>
          </Card>
          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Renewal After Payment</h3><p>Schedule berikutnya setelah submit.</p></div></div>
            <div className="metric-list">
              <div><span>Amount</span><strong><Amount value={item.amount_minor} type="expense" /></strong></div>
              <div><span>Current renewal</span><strong>{item.next_due_date}</strong></div>
              <div><span>Cycle</span><strong>{item.billing_cycle}</strong></div>
              <div><span>Wallet effect</span><strong>Wallet decreases</strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
