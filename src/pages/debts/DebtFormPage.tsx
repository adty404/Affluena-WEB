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
  const title = isReceivable ? 'Tambah Piutang' : 'Tambah Utang';

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
      showToast(isReceivable ? 'Piutang berhasil disimpan.' : 'Utang berhasil disimpan.');
      navigate('/debts', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || `Gagal menyimpan ${isReceivable ? 'piutang' : 'utang'}.`);
    }
  }

  const amountMinor = form.watch('principal_amount_minor');

  return (
    <AppLayout title={title} description="Catat utang atau piutang lengkap dengan tanggal jatuh tempo.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Utang & Piutang</span><h2>{isReceivable ? 'Catat piutang yang harus ditagih.' : 'Catat utang yang harus dibayar.'}</h2><p>Setiap pembayaran akan langsung memperbarui saldo dompet kamu.</p></div>
          <div className="app-hero-actions"><Button to="/debts">Kembali</Button></div>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Informasi Utang</h3><p>Lengkapi pihak lain, nominal, tanggal jatuh tempo, dan dompet.</p></div></div>
            <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div className="form-two">
                <label>
                  <span>Tipe</span>
                  <Select {...form.register('type')} disabled>
                    <option value="payable">Utang - Saya berutang ke orang lain</option>
                    <option value="receivable">Piutang - Orang lain berutang ke saya</option>
                  </Select>
                </label>
                <label>
                  <span>Nama Pihak Lain</span>
                  <Input {...form.register('counterparty_name')} placeholder={isReceivable ? 'Makan bareng tim' : 'Bank ABC'} />
                  {form.formState.errors.counterparty_name && <span className="form-error">{form.formState.errors.counterparty_name.message}</span>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Nominal Awal (Rp)</span>
                  <Input type="number" {...form.register('principal_amount_minor', { valueAsNumber: true })} />
                  {form.formState.errors.principal_amount_minor && <span className="form-error">{form.formState.errors.principal_amount_minor.message}</span>}
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
              <div className="form-two">
                <label>
                  <span>Kategori Pencairan</span>
                  <Select {...form.register('disbursement_category_id')}>
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </Select>
                  {form.formState.errors.disbursement_category_id && <span className="form-error">{form.formState.errors.disbursement_category_id.message}</span>}
                </label>
                <label>
                  <span>Kategori Pembayaran</span>
                  <Select {...form.register('payment_category_id')}>
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </Select>
                  {form.formState.errors.payment_category_id && <span className="form-error">{form.formState.errors.payment_category_id.message}</span>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Tanggal Mulai</span>
                  <Input type="date" {...form.register('opened_at')} />
                  {form.formState.errors.opened_at && <span className="form-error">{form.formState.errors.opened_at.message}</span>}
                </label>
                <label>
                  <span>Tanggal Jatuh Tempo</span>
                  <Input type="date" {...form.register('due_date')} />
                  {form.formState.errors.due_date && <span className="form-error">{form.formState.errors.due_date.message}</span>}
                </label>
              </div>
              <label>
                <span>Catatan</span>
                <Textarea {...form.register('note')} placeholder={isReceivable ? 'Piutang dari bagi tagihan atau pinjaman ke teman.' : 'Utang yang perlu dilacak pembayarannya.'} />
                {form.formState.errors.note && <span className="form-error">{form.formState.errors.note.message}</span>}
              </label>
              <div className="form-row-between">
                <Button to="/debts">Batal</Button>
                <Button type="submit" variant="primary" disabled={form.formState.isSubmitting || createMut.isPending}><AppIcon name="save" /> Simpan</Button>
              </div>
            </form>
          </Card>

          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Dampak ke Saldo</h3><p>Pratinjau efek pembayaran setelah dicatat.</p></div></div>
            <div className="metric-list">
              <div><span>Arah pembayaran</span><strong>{isReceivable ? 'Saldo dompet bertambah saat piutang diterima' : 'Saldo dompet berkurang saat utang dibayar'}</strong></div>
              <div><span>Contoh nominal</span><strong><Amount value={amountMinor || 0} type={isReceivable ? 'income' : 'expense'} /></strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
