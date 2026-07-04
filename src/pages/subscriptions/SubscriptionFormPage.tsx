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
      color: '',
      icon: '',
    },
  });

  async function onSubmit(values: CreateSubscriptionInput) {
    try {
      await createMut.mutateAsync(values);
      showToast('Langganan tersimpan.');
      navigate('/subscriptions', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal menyimpan langganan.');
    }
  }

  const amountMinor = form.watch('amount_minor') || 0;

  return (
    <AppLayout title="Tambah Langganan" description="Catat langganan dengan siklus tagihan dan pengingat.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><span className="badge dark">Formulir Langganan</span><h2>Catat langganan dengan siklus tagihan dan pengingat.</h2><p>Langganan yang tercatat ikut dihitung dalam pengeluaran bulanan kamu.</p></div><div className="app-hero-actions"><Button to="/subscriptions">Kembali</Button></div></section>
        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Informasi Langganan</h3><p>Layanan, dompet, siklus, dan tanggal perpanjangan.</p></div></div>
            <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div className="form-two">
                <label>
                  <span>Nama</span>
                  <Input {...form.register('name')} placeholder="Netflix" />
                  {form.formState.errors.name && <span className="form-error">{form.formState.errors.name.message}</span>}
                </label>
                <label>
                  <span>Dompet</span>
                  <Select {...form.register('wallet_id')}>
                    <option value="">Pilih Dompet</option>
                    {wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                  </Select>
                  {form.formState.errors.wallet_id && <span className="form-error">{form.formState.errors.wallet_id.message}</span>}
                </label>
              </div>
              <div className="form-three">
                <label>
                  <span>Jumlah (Rp)</span>
                  <Input type="number" {...form.register('amount_minor', { valueAsNumber: true })} />
                  {form.formState.errors.amount_minor && <span className="form-error">{form.formState.errors.amount_minor.message}</span>}
                </label>
                <label>
                  <span>Siklus</span>
                  <Select {...form.register('billing_cycle')}>
                    <option value="weekly">Mingguan</option>
                    <option value="monthly">Bulanan</option>
                  </Select>
                  {form.formState.errors.billing_cycle && <span className="form-error">{form.formState.errors.billing_cycle.message}</span>}
                </label>
                <label>
                  <span>Status</span>
                  <Select {...form.register('status')}>
                    <option value="active">Aktif</option>
                    <option value="paused">Dijeda</option>
                    <option value="cancelled">Dibatalkan</option>
                  </Select>
                  {form.formState.errors.status && <span className="form-error">{form.formState.errors.status.message}</span>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Perpanjangan Berikutnya</span>
                  <Input type="date" {...form.register('next_due_date')} />
                  {form.formState.errors.next_due_date && <span className="form-error">{form.formState.errors.next_due_date.message}</span>}
                </label>
                <label>
                  <span>Kategori</span>
                  <Select {...form.register('category_id')}>
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </Select>
                  {form.formState.errors.category_id && <span className="form-error">{form.formState.errors.category_id.message}</span>}
                </label>
              </div>
              <label>
                <span>Detail Akun</span>
                <Input {...form.register('account_detail')} placeholder="user@example.com" />
                {form.formState.errors.account_detail && <span className="form-error">{form.formState.errors.account_detail.message}</span>}
              </label>
              <label>
                <span>Warna</span>
                <ColorPicker
                  value={form.watch('color')}
                  onChange={(hex) => form.setValue('color', hex, { shouldDirty: true })}
                />
                <small className="field-help">Warna yang sama dipakai di aplikasi mobile.</small>
              </label>
              <label>
                <span>Catatan</span>
                <Textarea {...form.register('note')} placeholder="Langganan streaming yang dibayar bulanan." />
                {form.formState.errors.note && <span className="form-error">{form.formState.errors.note.message}</span>}
              </label>
              <div className="form-row-between">
                <Button to="/subscriptions">Batal</Button>
                <Button type="submit" variant="primary" disabled={form.formState.isSubmitting || createMut.isPending}><AppIcon name="save" /> Simpan Langganan</Button>
              </div>
            </form>
          </Card>
          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Pratinjau Perpanjangan</h3><p>Pengaruh langganan ini pada pengeluaran bulanan.</p></div></div>
            <div className="metric-list">
              <div><span>Jumlah</span><strong><Amount value={amountMinor} type="expense" /></strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
