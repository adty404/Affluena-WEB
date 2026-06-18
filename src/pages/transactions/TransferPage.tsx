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
        showToast('Transfer saved successfully.');
        navigate('/transactions');
      },
      onError: (err: any) => {
        showToast(err.message || 'Failed to save transfer');
      }
    });
  };

  const watchAmount = watch('amount_minor') || 0;
  const watchWalletId = watch('wallet_id');
  const watchToWalletId = watch('to_wallet_id');

  const sourceWallet = walletsData?.wallets.find(w => w.id === watchWalletId);
  const destWallet = walletsData?.wallets.find(w => w.id === watchToWalletId);

  const sourceBalance = sourceWallet?.balance_minor || 0;
  const destBalance = destWallet?.balance_minor || 0;

  return (
    <AppLayout title="Transfer Wallet" description="Move money between wallets without category.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Transfer</span>
            <h2>Transfer mengurangi source wallet dan menambah destination wallet.</h2>
            <p>From wallet dan To wallet tidak boleh sama. Transfer tidak memakai category.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/transactions">Back</Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)}>Save Transfer</Button>
          </div>
        </section>
        <section className="dashboard-grid transaction-entry-grid">
          <Card className="panel-card">
            <div className="panel-head">
              <div><h3>Transfer Information</h3><p>Wallet source, destination, amount, dan note.</p></div>
            </div>
            <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-two">
                <label>
                  <span>From Wallet</span>
                  <Select {...register('wallet_id')}>
                    <option value="">Select Source Wallet</option>
                    {walletsData?.wallets?.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                  </Select>
                  {errors.wallet_id && <span className="error-text">{errors.wallet_id.message}</span>}
                </label>
                <label>
                  <span>To Wallet</span>
                  <Select {...register('to_wallet_id')}>
                    <option value="">Select Destination Wallet</option>
                    {walletsData?.wallets?.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                  </Select>
                  {errors.to_wallet_id && <span className="error-text">{errors.to_wallet_id.message}</span>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Amount (Rp)</span>
                  <Input type="number" {...register('amount_minor', { valueAsNumber: true })} />
                  {errors.amount_minor && <span className="error-text">{errors.amount_minor.message}</span>}
                </label>
                <label>
                  <span>Date</span>
                  <Input type="datetime-local" {...register('transaction_at')} />
                  {errors.transaction_at && <span className="error-text">{errors.transaction_at.message}</span>}
                </label>
              </div>
              <label>
                <span>Note</span>
                <Textarea {...register('note')} />
                {errors.note && <span className="error-text">{errors.note.message}</span>}
              </label>
              <div className="form-row-between">
                <Button to="/transactions">Cancel</Button>
                <Button type="submit" variant="primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Saving...' : 'Save Transfer'}
                </Button>
              </div>
            </form>
          </Card>
          <div className="grid-stack">
            <BalanceDeltaPreview 
              title="Source Wallet" 
              before={sourceBalance} 
              delta={-watchAmount} 
              after={sourceBalance - watchAmount} 
              description="Source wallet berkurang." 
            />
            <BalanceDeltaPreview 
              title="Destination Wallet" 
              before={destBalance} 
              delta={watchAmount} 
              after={destBalance + watchAmount} 
              description="Destination wallet bertambah." 
            />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
