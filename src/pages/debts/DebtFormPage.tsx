import { useNavigate, useLocation } from 'react-router-dom';
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
import { useCreateDebt } from '../../hooks/useDebts';
import { createDebtSchema, type CreateDebtInput } from '../../schemas/debt';
import type { ApiError } from '../../api/types';

export function DebtFormPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isReceivable = pathname.includes('receivable');
  const title = isReceivable ? 'Add Receivable' : 'Add Payable';

  const { data: walletsData } = useWallets();
  const wallets = walletsData?.wallets ?? [];

  const { data: categoriesData } = useCategories({ limit: 200 });
  const categories = categoriesData?.categories ?? [];

  const createMut = useCreateDebt();

  const form = useForm<CreateDebtInput>({
    resolver: zodResolver(createDebtSchema),
    defaultValues: {
      type: isReceivable ? 'receivable' : 'payable',
      counterparty_name: '',
      wallet_id: '',
      disbursement_category_id: '',
      payment_category_id: '',
      principal_amount_minor: 0,
      opened_at: new Date().toISOString().split('T')[0],
      due_date: '',
      note: '',
    },
  });

  async function onSubmit(values: CreateDebtInput) {
    try {
      await createMut.mutateAsync(values);
      showToast(`${title} saved.`);
      navigate('/debts', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || `Failed to create ${isReceivable ? 'receivable' : 'payable'}.`);
    }
  }

  const amountMinor = form.watch('principal_amount_minor');

  return (
    <AppLayout title={title} description="Create payable or receivable with due date and reminder rule.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Debt Form</span><h2>{isReceivable ? 'Catat piutang yang harus ditagih.' : 'Catat utang yang harus dibayar.'}</h2><p>Form ini terhubung ke wallet dan payment flow agar saldo tetap konsisten.</p></div>
          <div className="app-hero-actions"><Button to="/debts">Back</Button></div>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Debt Information</h3><p>Lengkapi counterparty, amount, due date, dan wallet.</p></div></div>
            <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div className="form-two">
                <label>
                  <span>Type</span>
                  <Select {...form.register('type')} disabled>
                    <option value="payable">Payable - I owe someone</option>
                    <option value="receivable">Receivable - Someone owes me</option>
                  </Select>
                </label>
                <label>
                  <span>Counterparty</span>
                  <Input {...form.register('counterparty_name')} placeholder={isReceivable ? 'Team Dinner' : 'Bank ABC'} />
                  {form.formState.errors.counterparty_name && <span className="form-error">{form.formState.errors.counterparty_name.message}</span>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Original Amount (Minor)</span>
                  <Input type="number" {...form.register('principal_amount_minor', { valueAsNumber: true })} />
                  {form.formState.errors.principal_amount_minor && <span className="form-error">{form.formState.errors.principal_amount_minor.message}</span>}
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
              <div className="form-two">
                <label>
                  <span>Disbursement Category</span>
                  <Select {...form.register('disbursement_category_id')}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </Select>
                  {form.formState.errors.disbursement_category_id && <span className="form-error">{form.formState.errors.disbursement_category_id.message}</span>}
                </label>
                <label>
                  <span>Payment Category</span>
                  <Select {...form.register('payment_category_id')}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </Select>
                  {form.formState.errors.payment_category_id && <span className="form-error">{form.formState.errors.payment_category_id.message}</span>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Opened At</span>
                  <Input type="date" {...form.register('opened_at')} />
                  {form.formState.errors.opened_at && <span className="form-error">{form.formState.errors.opened_at.message}</span>}
                </label>
                <label>
                  <span>Due Date</span>
                  <Input type="date" {...form.register('due_date')} />
                  {form.formState.errors.due_date && <span className="form-error">{form.formState.errors.due_date.message}</span>}
                </label>
              </div>
              <label>
                <span>Note</span>
                <Textarea {...form.register('note')} placeholder={isReceivable ? 'Receivable generated from split bill or manual lending.' : 'Debt that needs scheduled payment tracking.'} />
                {form.formState.errors.note && <span className="form-error">{form.formState.errors.note.message}</span>}
              </label>
              <div className="form-row-between">
                <Button to="/debts">Cancel</Button>
                <Button type="submit" variant="primary" disabled={form.formState.isSubmitting || createMut.isPending}><AppIcon name="save" /> Save Debt</Button>
              </div>
            </form>
          </Card>

          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Balance Impact</h3><p>Preview payment behavior setelah debt dibuat.</p></div></div>
            <div className="metric-list">
              <div><span>Payment direction</span><strong>{isReceivable ? 'Wallet increases on collection' : 'Wallet decreases on payment'}</strong></div>
              <div><span>Sample amount</span><strong><Amount value={amountMinor || 0} type={isReceivable ? 'income' : 'expense'} /></strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
