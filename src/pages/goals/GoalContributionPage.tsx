import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { mockGoals } from '../../data/mockGoals';
import { mockWallets } from '../../data/mockWallets';

export function GoalContributionPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const goal = useMemo(() => mockGoals.find((item) => item.id === id) ?? mockGoals[0], [id]);
  const contribution = 1500000;
  const afterAmount = goal.currentAmount + contribution;

  return (
    <AppLayout title="Goal Contribution" description="Add a contribution and preview wallet/goal balance impact.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Contribute Goal</span><h2>Tambahkan kontribusi ke {goal.name}.</h2><p>Kontribusi akan mengurangi wallet sumber dan menaikkan current amount goal.</p></div>
          <div className="app-hero-actions"><Button to={`/goals/${goal.id}`}><AppIcon name="back" /> Back</Button><Button variant="primary" onClick={() => showToast('Goal contribution recorded successfully.')}><AppIcon name="save" /> Record</Button></div>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Contribution Information</h3><p>Pilih wallet sumber, amount, tanggal, dan note kontribusi.</p></div></div>
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Goal contribution recorded successfully.'); }}>
              <div className="form-two"><label><span>Goal</span><Select defaultValue={goal.id}>{mockGoals.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</Select></label><label><span>Source Wallet</span><Select defaultValue="wallet-bca">{mockWallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}</Select></label></div>
              <div className="form-two"><label><span>Contribution Amount</span><Input defaultValue="Rp 1.500.000" /></label><label><span>Date</span><Input type="datetime-local" defaultValue="2026-06-14T19:30" /></label></div>
              <label><span>Note</span><Textarea defaultValue={`Contribution to ${goal.name}.`} /></label>
              <div className="form-row-between"><Button to={`/goals/${goal.id}`}>Cancel</Button><Button type="submit" variant="primary"><AppIcon name="save" /> Save Contribution</Button></div>
            </form>
          </Card>

          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Goal Balance Preview</h3><p>Dampak kontribusi terhadap progress goal.</p></div></div>
            <div className="metric-list">
              <div><span>Before</span><strong><Amount value={goal.currentAmount} type="income" /></strong></div>
              <div><span>Contribution</span><strong><Amount value={contribution} type="income" /></strong></div>
              <div><span>After</span><strong><Amount value={afterAmount} type="income" /></strong></div>
              <div><span>Remaining target</span><strong><Amount value={Math.max(goal.targetAmount - afterAmount, 0)} type="expense" /></strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
