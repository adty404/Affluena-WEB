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

export function AdjustmentPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const { data: walletsData } = useWallets();
  const createMutation = useCreateTransaction();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'adjustment',
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
        showToast('Adjustment saved successfully.');
        navigate('/transactions');
      },
      onError: (err: any) => {
        showToast(err.message || 'Failed to save adjustment');
      }
    });
  };

  const watchAmount = watch('amount_minor') || 0;
  const watchWalletId = watch('wallet_id');

  const selectedWallet = walletsData?.wallets.find(w => w.id === watchWalletId);
  const currentBalance = selectedWallet?.balance_minor || 0;

  return (
    <AppLayout title="Balance Adjustment" description="Manual correction for wallet balance reconciliation.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Adjustment</span>
            <h2>Adjustment untuk koreksi saldo, bukan pengeluaran normal.</h2>
            <p>Gunakan note/reason yang jelas karena adjustment memengaruhi balance langsung dan butuh audit trail.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/transactions">Back</Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)}>Save Adjustment</Button>
          </div>
        </section>
        <section className="dashboard-grid transaction-entry-grid">
          <Card className="panel-card">
            <div className="panel-head">
              <div><h3>Adjustment Information</h3><p>Wallet, delta amount, dan reason.</p></div>
            </div>
            <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-two">
                <label>
                  <span>Wallet</span>
                  <Select {...register('wallet_id')}>
                    <option value="">Select Wallet</option>
                    {walletsData?.wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                  </Select>
                  {errors.wallet_id && <span className="error-text">{errors.wallet_id.message}</span>}
                </label>
                <label>
                  <span>Amount (Rp)</span>
                  <Input type="number" {...register('amount_minor', { valueAsNumber: true })} />
                  <small>Use negative value to decrease balance</small>
                  {errors.amount_minor && <span className="error-text">{errors.amount_minor.message}</span>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Date</span>
                  <Input type="datetime-local" {...register('transaction_at')} />
                  {errors.transaction_at && <span className="error-text">{errors.transaction_at.message}</span>}
                </label>
              </div>
              <label>
                <span>Reason</span>
                <Textarea {...register('note')} />
                {errors.note && <span className="error-text">{errors.note.message}</span>}
              </label>
              <div className="form-row-between">
                <Button to="/transactions">Cancel</Button>
                <Button type="submit" variant="primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Saving...' : 'Save Adjustment'}
                </Button>
              </div>
            </form>
          </Card>
          <BalanceDeltaPreview 
            title="Adjustment Preview" 
            before={currentBalance} 
            delta={watchAmount} 
            after={currentBalance + watchAmount} 
            description="Adjustment bisa positif atau negatif sesuai reconciliation." 
          />
        </section>
      </div>
    </AppLayout>
  );
}
