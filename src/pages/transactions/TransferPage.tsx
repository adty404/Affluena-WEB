import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { BalanceDeltaPreview } from '../../components/transactions/BalanceDeltaPreview';
import { useWallets } from '../../hooks/useWallets';
import { useCreateTransaction } from '../../hooks/useTransactions';
import { transactionSchema, type TransactionFormData } from '../../schemas/transaction';

export function TransferPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const { data: walletsData } = useWallets();
  const createMutation = useCreateTransaction();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'transfer',
      amount_minor: 0,
      transaction_at: new Date().toISOString().slice(0, 16),
    }
  });

  const onSubmit = (data: TransactionFormData) => {
    const payload = {
      ...data,
      transaction_at: new Date(data.transaction_at).toISOString(),
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        showToast('Transfer berhasil disimpan.');
        navigate('/transactions');
      },
      onError: (err: any) => {
        showToast(err.message || 'Gagal menyimpan transfer');
      }
    });
  };

  const watchAmount = watch('amount_minor') || 0;
  const watchWalletId = watch('wallet_id');
  const watchToWalletId = watch('to_wallet_id');

  const sourceWallet = (walletsData?.wallets ?? []).find(w => w.id === watchWalletId);
  const destWallet = (walletsData?.wallets ?? []).find(w => w.id === watchToWalletId);

  const sourceBalance = sourceWallet?.balance_minor || 0;
  const destBalance = destWallet?.balance_minor || 0;

  return (
    <AppLayout title="Transfer Dompet" description="Pindahkan saldo antar dompet tanpa kategori.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Transfer</span>
            <h2>Pindahkan saldo dari dompet asal ke dompet tujuan.</h2>
            <p>Dompet asal dan dompet tujuan harus berbeda, dan transfer tidak memerlukan kategori.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/transactions">Kembali</Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)}>Simpan Transfer</Button>
          </div>
        </section>
        <section className="dashboard-grid transaction-entry-grid">
          <Card className="panel-card">
            <div className="panel-head">
              <div><h3>Informasi Transfer</h3><p>Dompet asal, dompet tujuan, jumlah, dan catatan.</p></div>
            </div>
            <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-two">
                <label>
                  <span>Dompet Asal</span>
                  <Select {...register('wallet_id')}>
                    <option value="">Pilih Dompet Asal</option>
                    {walletsData?.wallets?.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                  </Select>
                  {errors.wallet_id && <span className="error-text">{errors.wallet_id.message}</span>}
                </label>
                <label>
                  <span>Dompet Tujuan</span>
                  <Select {...register('to_wallet_id')}>
                    <option value="">Pilih Dompet Tujuan</option>
                    {walletsData?.wallets?.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                  </Select>
                  {errors.to_wallet_id && <span className="error-text">{errors.to_wallet_id.message}</span>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Jumlah (Rp)</span>
                  <Input type="number" {...register('amount_minor', { valueAsNumber: true })} />
                  {errors.amount_minor && <span className="error-text">{errors.amount_minor.message}</span>}
                </label>
                <label>
                  <span>Tanggal</span>
                  <Input type="datetime-local" {...register('transaction_at')} />
                  {errors.transaction_at && <span className="error-text">{errors.transaction_at.message}</span>}
                </label>
              </div>
              <label>
                <span>Catatan</span>
                <Textarea {...register('note')} />
                {errors.note && <span className="error-text">{errors.note.message}</span>}
              </label>
              <div className="form-row-between">
                <Button to="/transactions">Batal</Button>
                <Button type="submit" variant="primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Menyimpan...' : 'Simpan Transfer'}
                </Button>
              </div>
            </form>
          </Card>
          <div className="grid-stack">
            <BalanceDeltaPreview
              title="Dompet Asal"
              before={sourceBalance}
              delta={-watchAmount}
              after={sourceBalance - watchAmount}
              description="Saldo dompet asal berkurang."
            />
            <BalanceDeltaPreview
              title="Dompet Tujuan"
              before={destBalance}
              delta={watchAmount}
              after={destBalance + watchAmount}
              description="Saldo dompet tujuan bertambah."
            />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
