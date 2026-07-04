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
import { useSubscription, usePaySubscription } from '../../hooks/useTrackers';
import { formatDateID } from '../../lib/dates';
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
      <AppLayout title="Bayar Langganan" description="Memuat...">
        <div className="dashboard-page grid-stack"><div className="loading-state">Memuat...</div></div>
      </AppLayout>
    );
  }

  if (!item) {
    return (
      <AppLayout title="Bayar Langganan" description="Tidak ditemukan">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><EmptyState icon={<AppIcon name="empty" />} title="Langganan tidak ditemukan" description="Langganan mungkin sudah dihapus." action={<Button to="/subscriptions">Kembali ke daftar</Button>} /></Card></div>
      </AppLayout>
    );
  }

  async function onSubmit(values: PaySubscriptionInput) {
    if (!id) return;
    try {
      await payMut.mutateAsync({ id, data: values });
      showToast('Pembayaran langganan tercatat.');
      navigate('/subscriptions', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal mencatat pembayaran.');
    }
  }

  return (
    <AppLayout title="Bayar Langganan" description="Catat pembayaran perpanjangan langganan.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><Badge className="dark">Pembayaran Langganan</Badge><h2>Bayar {item.name} dan perbarui jadwal perpanjangan.</h2><p>Pembayaran tercatat sebagai transaksi dan memajukan tanggal perpanjangan sesuai siklus.</p></div><div className="app-hero-actions"><Button to="/subscriptions">Kembali</Button></div></section>
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
                <Textarea {...form.register('note')} placeholder={`Pembayaran perpanjangan ${item.name}.`} />
                {form.formState.errors.note && <span className="form-error">{form.formState.errors.note.message}</span>}
              </label>
              <div className="form-row-between">
                <Button to="/subscriptions">Batal</Button>
                <Button type="submit" variant="primary" disabled={form.formState.isSubmitting || payMut.isPending}><AppIcon name="pay" /> Bayar Langganan</Button>
              </div>
            </form>
          </Card>
          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Perpanjangan Setelah Pembayaran</h3><p>Jadwal berikutnya setelah pembayaran ini.</p></div></div>
            <div className="metric-list">
              <div><span>Jumlah</span><strong><Amount value={item.amount_minor} type="expense" /></strong></div>
              <div><span>Perpanjangan saat ini</span><strong>{formatDateID(item.next_due_date)}</strong></div>
              <div><span>Siklus</span><strong>{item.billing_cycle === 'weekly' ? 'Mingguan' : 'Bulanan'}</strong></div>
              <div><span>Efek ke dompet</span><strong>Saldo berkurang</strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
