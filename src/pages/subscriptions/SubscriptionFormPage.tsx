import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { useWallets } from '../../hooks/useWallets';
import { useCategories } from '../../hooks/useCategories';
import { useCreateSubscription } from '../../hooks/useTrackers';
import { createSubscriptionSchema, type CreateSubscriptionInput } from '../../schemas/tracker';
import type { ApiError } from '../../api/types';

export function SubscriptionFormPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data: walletsData } = useWallets();
  const wallets = walletsData?.wallets ?? [];

  const { data: categoriesData } = useCategories({ limit: 200 });
  const categories = categoriesData?.categories ?? [];

  const createMut = useCreateSubscription();

  const form = useForm<CreateSubscriptionInput>({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: {
      name: '',
      account_detail: '',
      wallet_id: '',
      category_id: '',
      amount_minor: 0,
      billing_cycle: 'monthly',
      next_due_date: new Date().toISOString().split('T')[0],
      status: 'active',
      note: '',
    },
  });

  async function onSubmit(values: CreateSubscriptionInput) {
    try {
      await createMut.mutateAsync(values);
      showToast('Subscription saved.');
      navigate('/subscriptions', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Failed to create subscription.');
    }
  }

  const amountMinor = form.watch('amount_minor') || 0;

  return (
    <AppLayout title="Add Subscription" description="Create subscription with renewal cycle and reminder.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Subscription Form</span><h2>Buat langganan dengan renewal cycle dan reminder.</h2><p>Data subscription masuk ke tracker dan monthly burn summary.</p></div><div className="app-hero-actions"><Button to="/subscriptions">Back</Button></div></section>
        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Subscription Information</h3><p>Service, wallet, cycle, renewal, dan action behavior.</p></div></div>
            <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div className="form-two">
                <label>
                  <span>Name</span>
                  <Input {...form.register('name')} placeholder="Netflix" />
                  {form.formState.errors.name && <span className="form-error">{form.formState.errors.name.message}</span>}
                </label>
                <label>
                  <span>Wallet</span>
                  <Select {...form.register('wallet_id')}>
                    <option value="">Select Wallet</option>
                    {wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                  </Select>
                  {form.formState.errors.wallet_id && <span className="form-error">{form.formState.errors.wallet_id.message}</span>}
                </label>
              </div>
              <div className="form-three">
                <label>
                  <span>Amount (Minor)</span>
                  <Input type="number" {...form.register('amount_minor', { valueAsNumber: true })} />
                  {form.formState.errors.amount_minor && <span className="form-error">{form.formState.errors.amount_minor.message}</span>}
                </label>
                <label>
                  <span>Cycle</span>
                  <Select {...form.register('billing_cycle')}>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                  {form.formState.errors.billing_cycle && <span className="form-error">{form.formState.errors.billing_cycle.message}</span>}
                </label>
                <label>
                  <span>Status</span>
                  <Select {...form.register('status')}>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                  {form.formState.errors.status && <span className="form-error">{form.formState.errors.status.message}</span>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Next Renewal</span>
                  <Input type="date" {...form.register('next_due_date')} />
                  {form.formState.errors.next_due_date && <span className="form-error">{form.formState.errors.next_due_date.message}</span>}
                </label>
                <label>
                  <span>Category</span>
                  <Select {...form.register('category_id')}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </Select>
                  {form.formState.errors.category_id && <span className="form-error">{form.formState.errors.category_id.message}</span>}
                </label>
              </div>
              <label>
                <span>Account Detail</span>
                <Input {...form.register('account_detail')} placeholder="user@example.com" />
                {form.formState.errors.account_detail && <span className="form-error">{form.formState.errors.account_detail.message}</span>}
              </label>
              <label>
                <span>Note</span>
                <Textarea {...form.register('note')} placeholder="Streaming subscription paid monthly." />
                {form.formState.errors.note && <span className="form-error">{form.formState.errors.note.message}</span>}
              </label>
              <div className="form-row-between">
                <Button to="/subscriptions">Cancel</Button>
                <Button type="submit" variant="primary" disabled={form.formState.isSubmitting || createMut.isPending}><AppIcon name="save" /> Save Subscription</Button>
              </div>
            </form>
          </Card>
          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Renewal Preview</h3><p>Pengaruh subscription pada monthly burn.</p></div></div>
            <div className="metric-list">
              <div><span>Amount</span><strong><Amount value={amountMinor} type="expense" /></strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
