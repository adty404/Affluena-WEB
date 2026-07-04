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
      showToast('Lengkapi semua kolom yang wajib diisi.');
      return;
    }
    if (!toWalletId) {
      showToast('Dompet target tabungan tidak ditemukan. Setoran tidak dapat dicatat.');
      return;
    }

    try {
      await createTransaction.mutateAsync({
        type: 'transfer',
        wallet_id: sourceWalletId,
        to_wallet_id: toWalletId,
        amount_minor: parseInt(amount, 10),
        transaction_at: new Date(date).toISOString(),
        note: note || `Setoran untuk ${goal?.name}`,
      });
      // The contribution is a transfer transaction that moves money into the
      // goal wallet, so refresh wallet balances, the dashboard, and budgets.
      invalidateFinancialQueries(queryClient);
      // Also refresh the goal so its collected amount reflects the contribution.
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
      if (id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.goals.detail(id) });
      }
      showToast('Setoran berhasil dicatat.');
      navigate(`/goals/${id}`);
    } catch (error) {
      showToast('Gagal mencatat setoran.');
    }
  };

  if (isLoadingGoal || isLoadingWallets || !goal) {
    return <AppLayout title="Setoran Target" description="Memuat..."><div className="loading-state">Memuat...</div></AppLayout>;
  }

  const contributionAmount = parseInt(amount || '0', 10);
  const afterAmount = goal.collected_amount_minor + contributionAmount;

  return (
    <AppLayout title="Setoran Target" description="Catat setoran dan lihat dampaknya ke saldo dompet dan progres target.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Setoran Target</span><h2>Tambahkan setoran ke {goal.name}.</h2><p>Setoran akan mengurangi saldo dompet sumber dan menambah dana terkumpul target.</p></div>
          <div className="app-hero-actions"><Button to={`/goals/${goal.id}`}><AppIcon name="back" /> Kembali</Button></div>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Informasi Setoran</h3><p>Pilih dompet sumber, jumlah, tanggal, dan catatan setoran.</p></div></div>
            <form className="form-stack" onSubmit={onSubmit}>
              {!goalWallet && (
                <span className="form-error">Dompet target tabungan belum tersedia, setoran tidak dapat dicatat.</span>
              )}
              <div className="form-two">
                <label>
                  <span>Target Tabungan</span>
                  <Input value={goal.name} disabled />
                </label>
                <label>
                  <span>Dompet Sumber</span>
                  <Select value={sourceWalletId} onChange={(e) => setSourceWalletId(e.target.value)} required>
                    <option value="">Pilih Dompet</option>
                    {sourceWallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                  </Select>
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Jumlah Setoran (Rp)</span>
                  <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min="1" />
                </label>
                <label>
                  <span>Tanggal</span>
                  <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
                </label>
              </div>
              <label>
                <span>Catatan</span>
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={`Setoran untuk ${goal.name}`} />
              </label>
              <div className="form-row-between">
                <Button to={`/goals/${goal.id}`}>Batal</Button>
                <Button type="submit" variant="primary" disabled={createTransaction.isPending || !goalWallet}><AppIcon name="save" /> Simpan Setoran</Button>
              </div>
            </form>
          </Card>

          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Pratinjau Saldo Target</h3><p>Dampak setoran terhadap progres target.</p></div></div>
            <div className="metric-list">
              <div><span>Sebelum</span><strong><Amount value={goal.collected_amount_minor} type="income" /></strong></div>
              <div><span>Setoran</span><strong><Amount value={contributionAmount} type="income" /></strong></div>
              <div><span>Sesudah</span><strong><Amount value={afterAmount} type="income" /></strong></div>
              <div><span>Sisa target</span><strong><Amount value={Math.max(goal.target_amount_minor - afterAmount, 0)} type="expense" /></strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
