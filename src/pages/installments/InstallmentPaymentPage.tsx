import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
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
      <AppLayout title="Bayar Cicilan" description="Memuat...">
        <div className="dashboard-page grid-stack"><div className="loading-state">Memuat...</div></div>
      </AppLayout>
    );
  }

  if (!item) {
    return (
      <AppLayout title="Bayar Cicilan" description="Tidak ditemukan">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><EmptyState icon={<AppIcon name="empty" />} title="Cicilan tidak ditemukan" description="Cicilan mungkin sudah dihapus." action={<Button to="/installments">Kembali ke daftar</Button>} /></Card></div>
      </AppLayout>
    );
  }

  async function onSubmit(values: PayInstallmentInput) {
    if (!id) return;
    try {
      await payMut.mutateAsync({ id, data: values });
      showToast('Pembayaran cicilan tercatat.');
      navigate('/installments', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal mencatat pembayaran.');
    }
  }

  const paidCount = item.tenor_months - item.remaining_months;

  return (
    <AppLayout title="Bayar Cicilan" description="Catat pembayaran cicilan dan perbarui progres tenor.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><Badge className="dark">Pembayaran Cicilan</Badge><h2>Bayar {item.name} dan perbarui progres tenor.</h2><p>Pembayaran tercatat sebagai transaksi pengeluaran dan menambah jumlah cicilan terbayar.</p></div><div className="app-hero-actions"><Button to="/installments">Kembali</Button></div></section>
        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Informasi Pembayaran</h3><p>Tanggal pembayaran dan catatan.</p></div></div>
            <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <label>
                <span>Tanggal Pembayaran</span>
                <Input type="date" {...form.register('paid_at')} />
                {form.formState.errors.paid_at && <span className="form-error">{form.formState.errors.paid_at.message}</span>}
              </label>
              <label>
                <span>Catatan</span>
                <Textarea {...form.register('note')} placeholder={`Pembayaran untuk ${item.name}.`} />
                {form.formState.errors.note && <span className="form-error">{form.formState.errors.note.message}</span>}
              </label>
              <div className="form-row-between">
                <Button to="/installments">Batal</Button>
                <Button type="submit" variant="primary" disabled={form.formState.isSubmitting || payMut.isPending}><AppIcon name="pay" /> Bayar Cicilan</Button>
              </div>
            </form>
          </Card>
          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Progres Setelah Pembayaran</h3><p>Tenor dan sisa pokok setelah pembayaran ini.</p></div></div>
            <div className="metric-list">
              <div><span>Cicilan Terbayar</span><strong>{paidCount} → {Math.min(paidCount + 1, item.tenor_months)}</strong></div>
              <div><span>Sisa Pokok</span><strong><Amount value={Math.max(0, (item.remaining_months - 1) * item.monthly_amount_minor)} /></strong></div>
              <div><span>Efek ke Dompet</span><strong><Amount value={item.monthly_amount_minor} type="expense" /></strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
