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
import { useDebt, usePayDebt } from '../../hooks/useDebts';
import { payDebtSchema, type PayDebtInput } from '../../schemas/debt';
import type { ApiError } from '../../api/types';

export function DebtPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: debt, isLoading } = useDebt(id ?? '');
  const payMut = usePayDebt();

  const form = useForm<PayDebtInput>({
    resolver: zodResolver(payDebtSchema),
    defaultValues: {
      amount_minor: 0,
      paid_at: new Date().toISOString().split('T')[0],
      note: '',
    },
  });

  if (isLoading) {
    return (
      <AppLayout title="Bayar Utang" description="Memuat...">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Memuat</span><strong>...</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  if (!debt) {
    return (
      <AppLayout title="Bayar Utang" description="Tidak ditemukan">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Gagal</span><strong>Utang tidak ditemukan</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  async function onSubmit(values: PayDebtInput) {
    if (!id) return;
    try {
      await payMut.mutateAsync({ id, data: values });
      showToast('Pembayaran utang tercatat.');
      navigate(`/debts/${id}`, { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal mencatat pembayaran.');
    }
  }

  const amountMinor = form.watch('amount_minor') || 0;
  const remainingAfter = Math.max(0, debt.remaining_amount_minor - amountMinor);

  return (
    <AppLayout title="Bayar Utang" description="Catat pembayaran utang atau penerimaan piutang.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Pembayaran</span><h2>{debt.type === 'payable' ? 'Bayar utang dan kurangi saldo dompet.' : 'Terima pembayaran piutang dan tambah saldo dompet.'}</h2><p>Pembayaran otomatis memperbarui sisa tagihan dan tercatat sebagai transaksi.</p></div>
          <div className="app-hero-actions"><Button to={`/debts/${debt.id}`}>Kembali</Button></div>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Informasi Pembayaran</h3><p>Tanggal, nominal, dan catatan pembayaran.</p></div></div>
            <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div className="form-two">
                <label>
                  <span>Tanggal Pembayaran</span>
                  <Input type="date" {...form.register('paid_at')} />
                  {form.formState.errors.paid_at && <span className="form-error">{form.formState.errors.paid_at.message}</span>}
                </label>
                <label>
                  <span>Nominal Pembayaran (Rp)</span>
                  <Input type="number" {...form.register('amount_minor', { valueAsNumber: true })} />
                  {form.formState.errors.amount_minor && <span className="form-error">{form.formState.errors.amount_minor.message}</span>}
                </label>
              </div>
              <label>
                <span>Catatan</span>
                <Textarea {...form.register('note')} placeholder={`Pembayaran untuk ${debt.counterparty_name}.`} />
                {form.formState.errors.note && <span className="form-error">{form.formState.errors.note.message}</span>}
              </label>
              <div className="form-row-between">
                <Button to={`/debts/${debt.id}`}>Batal</Button>
                <Button type="submit" variant="primary" disabled={form.formState.isSubmitting || payMut.isPending}><AppIcon name="pay" /> Catat Pembayaran</Button>
              </div>
            </form>
          </Card>

          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Pratinjau Pembayaran</h3><p>Sisa tagihan setelah pembayaran ini.</p></div></div>
            <div className="metric-list payment-preview-list">
              <div><span>Sisa Sebelum</span><strong><Amount value={debt.remaining_amount_minor} /></strong></div>
              <div><span>Pembayaran</span><strong><Amount value={amountMinor} type={debt.type === 'payable' ? 'expense' : 'income'} /></strong></div>
              <div><span>Sisa Sesudah</span><strong><Amount value={remainingAfter} /></strong></div>
              <div><span>Efek ke Dompet</span><strong>{debt.type === 'payable' ? 'Saldo berkurang' : 'Saldo bertambah'}</strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
