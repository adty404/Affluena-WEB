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
import { useInstallment, usePayInstallment } from '../../hooks/useTrackers';
import { payInstallmentSchema, type PayInstallmentInput } from '../../schemas/tracker';
import type { ApiError } from '../../api/types';

export function InstallmentPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: item, isLoading } = useInstallment(id ?? '');
  const payMut = usePayInstallment();

  const form = useForm<PayInstallmentInput>({
    resolver: zodResolver(payInstallmentSchema),
    defaultValues: {
      paid_at: new Date().toISOString().split('T')[0],
      note: '',
    },
  });

  if (isLoading) {
    return (
      <AppLayout title="Pay Installment" description="Loading...">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Loading</span><strong>...</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  if (!item) {
    return (
      <AppLayout title="Pay Installment" description="Not found">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Error</span><strong>Installment not found</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  async function onSubmit(values: PayInstallmentInput) {
    if (!id) return;
    try {
      await payMut.mutateAsync({ id, data: values });
      showToast('Installment payment recorded.');
      navigate('/installments', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Failed to record payment.');
    }
  }

  const paidCount = item.tenor_months - item.remaining_months;

  return (
    <AppLayout title="Pay Installment" description="Record installment payment and advance paid tenor.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Installment Payment</span><h2>Bayar {item.name} dan update progress tenor.</h2><p>Payment akan membuat expense transaction dan menambah paid count.</p></div><div className="app-hero-actions"><Button to="/installments">Back</Button></div></section>
        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Payment Information</h3><p>Wallet, amount, due date, dan linked transaction.</p></div></div>
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
                <Textarea {...form.register('note')} placeholder={`Payment for ${item.name}.`} />
                {form.formState.errors.note && <span className="form-error">{form.formState.errors.note.message}</span>}
              </label>
              <div className="form-row-between">
                <Button to="/installments">Cancel</Button>
                <Button type="submit" variant="primary" disabled={form.formState.isSubmitting || payMut.isPending}><AppIcon name="pay" /> Pay Installment</Button>
              </div>
            </form>
          </Card>
          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Progress After Payment</h3><p>Tenor dan outstanding setelah submit.</p></div></div>
            <div className="metric-list">
              <div><span>Paid Count</span><strong>{paidCount} → {Math.min(paidCount + 1, item.tenor_months)}</strong></div>
              <div><span>Remaining Principal</span><strong><Amount value={Math.max(0, (item.remaining_months - 1) * item.monthly_amount_minor)} /></strong></div>
              <div><span>Wallet Effect</span><strong><Amount value={item.monthly_amount_minor} type="expense" /></strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
