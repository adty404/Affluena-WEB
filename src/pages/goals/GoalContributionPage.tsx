import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { useGoal } from '../../hooks/useGoals';
import { useWallets } from '../../hooks/useWallets';
import { useCreateTransaction } from '../../hooks/useTransactions';
import { invalidateFinancialQueries, queryKeys } from '../../lib/queryClient';

export function GoalContributionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: goal, isLoading: isLoadingGoal } = useGoal(id || '');
  const { data: walletsData, isLoading: isLoadingWallets } = useWallets();
  const createTransaction = useCreateTransaction();

  const [sourceWalletId, setSourceWalletId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [note, setNote] = useState('');

  const wallets = walletsData?.wallets || [];
  const sourceWallets = wallets.filter(w => w.type !== 'goal');

  // The API funds a goal by transferring into its dedicated `goal`-type wallet,
  // which carries the parent goal id in `goal_id`. Match on that — never the goal
  // id directly (a goal id is not a wallet id) nor the wallet name.
  const goalWallet = wallets.find(w => w.type === 'goal' && w.goal_id === id);
  const toWalletId = goalWallet?.id;

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!sourceWalletId || !amount) {
      showToast('Please fill all required fields');
      return;
    }
    if (!toWalletId) {
      showToast('Goal wallet not found. Cannot record contribution.');
      return;
    }

    try {
      await createTransaction.mutateAsync({
        type: 'transfer',
        wallet_id: sourceWalletId,
        to_wallet_id: toWalletId,
        amount_minor: parseInt(amount, 10),
        transaction_at: new Date(date).toISOString(),
        note: note || `Contribution to ${goal?.name}`,
      });
      // The contribution is a transfer transaction that moves money into the
      // goal wallet, so refresh wallet balances, the dashboard, and budgets.
      invalidateFinancialQueries(queryClient);
      // Also refresh the goal so its collected amount reflects the contribution.
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
      if (id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.goals.detail(id) });
      }
      showToast('Goal contribution recorded successfully.');
      navigate(`/goals/${id}`);
    } catch (error) {
      showToast('Failed to record contribution.');
    }
  };

  if (isLoadingGoal || isLoadingWallets || !goal) {
    return <AppLayout title="Goal Contribution" description="Loading..."><div className="loading-state">Loading...</div></AppLayout>;
  }

  const contributionAmount = parseInt(amount || '0', 10);
  const afterAmount = goal.collected_amount_minor + contributionAmount;

  return (
    <AppLayout title="Goal Contribution" description="Add a contribution and preview wallet/goal balance impact.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Contribute Goal</span><h2>Tambahkan kontribusi ke {goal.name}.</h2><p>Kontribusi akan mengurangi wallet sumber dan menaikkan current amount goal.</p></div>
          <div className="app-hero-actions"><Button to={`/goals/${goal.id}`}><AppIcon name="back" /> Back</Button></div>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Contribution Information</h3><p>Pilih wallet sumber, amount, tanggal, dan note kontribusi.</p></div></div>
            <form className="form-stack" onSubmit={onSubmit}>
              {!goalWallet && (
                <span className="error-text">Goal wallet belum tersedia, kontribusi tidak dapat dicatat.</span>
              )}
              <div className="form-two">
                <label>
                  <span>Goal</span>
                  <Input value={goal.name} disabled />
                </label>
                <label>
                  <span>Source Wallet</span>
                  <Select value={sourceWalletId} onChange={(e) => setSourceWalletId(e.target.value)} required>
                    <option value="">Select Wallet</option>
                    {sourceWallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                  </Select>
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Contribution Amount</span>
                  <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min="1" />
                </label>
                <label>
                  <span>Date</span>
                  <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
                </label>
              </div>
              <label>
                <span>Note</span>
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={`Contribution to ${goal.name}`} />
              </label>
              <div className="form-row-between">
                <Button to={`/goals/${goal.id}`}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={createTransaction.isPending || !goalWallet}><AppIcon name="save" /> Save Contribution</Button>
              </div>
            </form>
          </Card>

          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Goal Balance Preview</h3><p>Dampak kontribusi terhadap progress goal.</p></div></div>
            <div className="metric-list">
              <div><span>Before</span><strong><Amount value={goal.collected_amount_minor} type="income" /></strong></div>
              <div><span>Contribution</span><strong><Amount value={contributionAmount} type="income" /></strong></div>
              <div><span>After</span><strong><Amount value={afterAmount} type="income" /></strong></div>
              <div><span>Remaining target</span><strong><Amount value={Math.max(goal.target_amount_minor - afterAmount, 0)} type="expense" /></strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
