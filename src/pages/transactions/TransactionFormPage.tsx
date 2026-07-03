import { useNavigate, useParams } from 'react-router-dom';

import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { BalanceDeltaPreview } from '../../components/transactions/BalanceDeltaPreview';
import { useWallets } from '../../hooks/useWallets';
import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';
import { useCreateTransaction, useUpdateTransaction, useTransaction } from '../../hooks/useTransactions';
import { transactionSchema, type TransactionFormData } from '../../schemas/transaction';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useReactHookForm } from 'react-hook-form';
import { useEffect } from 'react';

export function TransactionFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(id);

  const { data: transactionData, isLoading: isLoadingTx } = useTransaction(id);
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  const { data: tagsData } = useTags();

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction(id || '');

  const { register, handleSubmit, formState: { errors }, reset, watch } = useReactHookForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount_minor: 0,
      transaction_at: new Date().toISOString().slice(0, 16),
      tag_ids: [],
    }
  });

  useEffect(() => {
    if (isEdit && transactionData) {
      reset({
        type: transactionData.type as any,
        wallet_id: transactionData.wallet_id,
        category_id: transactionData.category_id,
        amount_minor: transactionData.amount_minor,
        transaction_at: new Date(transactionData.transaction_at).toISOString().slice(0, 16),
        note: transactionData.note,
        tag_ids: transactionData.tag_ids,
      });
    }
  }, [isEdit, transactionData, reset]);

  const onSubmit = (data: TransactionFormData) => {
    const payload = {
      ...data,
      transaction_at: new Date(data.transaction_at).toISOString(),
    };

    if (isEdit) {
      updateMutation.mutate(payload, {
        onSuccess: () => {
          showToast('Transaksi berhasil diperbarui.');
          navigate('/transactions');
        },
        onError: (err: any) => {
          showToast(err.message || 'Gagal memperbarui transaksi');
        }
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          showToast('Transaksi berhasil dibuat.');
          navigate('/transactions');
        },
        onError: (err: any) => {
          showToast(err.message || 'Gagal membuat transaksi');
        }
      });
    }
  };

  const watchType = watch('type');
  const watchAmount = watch('amount_minor');
  const watchWalletId = watch('wallet_id');

  const selectedWallet = (walletsData?.wallets ?? []).find(w => w.id === watchWalletId);
  const currentBalance = selectedWallet?.balance_minor || 0;
  const delta = watchType === 'income' ? watchAmount : -watchAmount;

  if (isEdit && isLoadingTx) {
    return <AppLayout title="Edit Transaksi" description="Memuat detail transaksi"><p>Memuat...</p></AppLayout>;
  }

  return (
    <AppLayout title={isEdit ? 'Edit Transaksi' : 'Transaksi Baru'} description="Catat pemasukan atau pengeluaran dengan kategori dan tag.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Pemasukan / Pengeluaran</span><h2>{isEdit ? 'Perbarui detail transaksi kamu.' : 'Catat pemasukan atau pengeluaran baru.'}</h2><p>Lengkapi dompet, kategori, jumlah, dan catatan — perubahan saldo langsung terlihat sebelum disimpan.</p></div>
          <div className="app-hero-actions"><Button to="/transactions">Kembali</Button><Button variant="primary" onClick={handleSubmit(onSubmit)}>Simpan</Button></div>
        </section>
        <section className="dashboard-grid transaction-entry-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Informasi Transaksi</h3><p>Pilih tipe, dompet, kategori, dan jumlah.</p></div></div>
            <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-two">
                <label>
                  <span>Tipe</span>
                  <Select {...register('type')}>
                    <option value="expense">Pengeluaran</option>
                    <option value="income">Pemasukan</option>
                  </Select>
                  {errors.type && <span className="error-text">{errors.type.message}</span>}
                </label>
                <label>
                  <span>Dompet</span>
                  <Select {...register('wallet_id')}>
                    <option value="">Pilih Dompet</option>
                    {walletsData?.wallets?.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                  </Select>
                  {errors.wallet_id && <span className="error-text">{errors.wallet_id.message}</span>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Kategori</span>
                  <Select {...register('category_id')}>
                    <option value="">Pilih Kategori</option>
                    {categoriesData?.categories?.filter(c => c.type === watchType).map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </Select>
                  {errors.category_id && <span className="error-text">{errors.category_id.message}</span>}
                </label>
                <label>
                  <span>Jumlah (Rp)</span>
                  <Input type="number" {...register('amount_minor', { valueAsNumber: true })} />
                  {errors.amount_minor && <span className="error-text">{errors.amount_minor.message}</span>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Tanggal</span>
                  <Input type="datetime-local" {...register('transaction_at')} />
                  {errors.transaction_at && <span className="error-text">{errors.transaction_at.message}</span>}
                </label>
                <label>
                  <span>Tag</span>
                  <Select multiple {...register('tag_ids')}>
                    {tagsData?.tags?.map((tag) => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
                  </Select>
                  {errors.tag_ids && <span className="error-text">{errors.tag_ids.message}</span>}
                </label>
              </div>
              <label>
                <span>Catatan</span>
                <Textarea {...register('note')} />
                {errors.note && <span className="error-text">{errors.note.message}</span>}
              </label>
              <div className="form-row-between">
                <Button to="/transactions">Batal</Button>
                <Button type="submit" variant="primary" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : 'Simpan Transaksi'}
                </Button>
              </div>
            </form>
          </Card>
          <BalanceDeltaPreview
            title="Pratinjau Saldo Dompet"
            before={currentBalance}
            delta={delta}
            after={currentBalance + delta}
            description={watchType === 'income' ? 'Pemasukan menambah saldo dompet setelah transaksi disimpan.' : 'Pengeluaran mengurangi saldo dompet setelah transaksi disimpan.'}
          />
        </section>
      </div>
    </AppLayout>
  );
}
