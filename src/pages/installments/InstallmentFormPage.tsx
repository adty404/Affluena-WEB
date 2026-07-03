import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ColorPicker } from '../../components/finance/ColorPicker';
import { useToast } from '../../components/ui/Toast';
import { useWallets } from '../../hooks/useWallets';
import { useCategories } from '../../hooks/useCategories';
import { useCreateInstallment } from '../../hooks/useTrackers';
import { createInstallmentSchema, type CreateInstallmentInput } from '../../schemas/tracker';
import type { ApiError } from '../../api/types';

export function InstallmentFormPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data: walletsData } = useWallets();
  const wallets = walletsData?.wallets ?? [];

  const { data: categoriesData } = useCategories({ limit: 200 });
  const categories = categoriesData?.categories ?? [];

  const createMut = useCreateInstallment();

  const form = useForm<CreateInstallmentInput>({
    resolver: zodResolver(createInstallmentSchema),
    defaultValues: {
      name: '',
      wallet_id: '',
      category_id: '',
      total_amount_minor: 0,
      monthly_amount_minor: 0,
      tenor_months: 12,
      remaining_months: 12,
      start_date: new Date().toISOString().split('T')[0],
      due_day: 1,
      status: 'active',
      note: '',
      color: '',
      icon: '',
    },
  });

  async function onSubmit(values: CreateInstallmentInput) {
    try {
      await createMut.mutateAsync(values);
      showToast('Installment saved.');
      navigate('/installments', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Failed to create installment.');
    }
  }

  const monthlyAmount = form.watch('monthly_amount_minor') || 0;
  const remainingMonths = form.watch('remaining_months') || 0;

  return (
    <AppLayout title="Add Installment" description="Create installment tracker with tenor, due day, and wallet.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Installment Form</span><h2>Buat tracker cicilan dengan jadwal pembayaran jelas.</h2><p>Installment membantu menjaga fixed outflow tetap terlihat di tracker dan dashboard.</p></div>
          <div className="app-hero-actions"><Button to="/installments">Back</Button></div>
        </section>
        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Installment Information</h3><p>Monthly amount, tenor, paid count, dan due day.</p></div></div>
            <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div className="form-two">
                <label>
                  <span>Name</span>
                  <Input {...form.register('name')} placeholder="Car Installment" />
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
                  <span>Total Amount (Minor)</span>
                  <Input type="number" {...form.register('total_amount_minor', { valueAsNumber: true })} />
                  {form.formState.errors.total_amount_minor && <span className="form-error">{form.formState.errors.total_amount_minor.message}</span>}
                </label>
                <label>
                  <span>Monthly Amount (Minor)</span>
                  <Input type="number" {...form.register('monthly_amount_minor', { valueAsNumber: true })} />
                  {form.formState.errors.monthly_amount_minor && <span className="form-error">{form.formState.errors.monthly_amount_minor.message}</span>}
                </label>
                <label>
                  <span>Total Tenor (Months)</span>
                  <Input type="number" {...form.register('tenor_months', { valueAsNumber: true })} />
                  {form.formState.errors.tenor_months && <span className="form-error">{form.formState.errors.tenor_months.message}</span>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Remaining Months</span>
                  <Input type="number" {...form.register('remaining_months', { valueAsNumber: true })} />
                  {form.formState.errors.remaining_months && <span className="form-error">{form.formState.errors.remaining_months.message}</span>}
                </label>
                <label>
                  <span>Start Date</span>
                  <Input type="date" {...form.register('start_date')} />
                  {form.formState.errors.start_date && <span className="form-error">{form.formState.errors.start_date.message}</span>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Due Day (1-31)</span>
                  <Input type="number" min="1" max="31" {...form.register('due_day', { valueAsNumber: true })} />
                  {form.formState.errors.due_day && <span className="form-error">{form.formState.errors.due_day.message}</span>}
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
                <span>Warna</span>
                <ColorPicker
                  value={form.watch('color')}
                  onChange={(hex) => form.setValue('color', hex, { shouldDirty: true })}
                />
                <small className="field-help">Warna yang sama dipakai di aplikasi mobile.</small>
              </label>
              <label>
                <span>Note</span>
                <Textarea {...form.register('note')} placeholder="Monthly installment tracked inside Affluena." />
                {form.formState.errors.note && <span className="form-error">{form.formState.errors.note.message}</span>}
              </label>
              <div className="form-row-between">
                <Button to="/installments">Cancel</Button>
                <Button type="submit" variant="primary" disabled={form.formState.isSubmitting || createMut.isPending}><AppIcon name="save" /> Save Installment</Button>
              </div>
            </form>
          </Card>
          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Schedule Preview</h3><p>Perhitungan cicilan sebelum disimpan.</p></div></div>
            <div className="metric-list">
              <div><span>Monthly payment</span><strong><Amount value={monthlyAmount} type="expense" /></strong></div>
              <div><span>Remaining tenor</span><strong>{remainingMonths} months</strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
