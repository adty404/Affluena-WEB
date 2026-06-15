import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { useToast } from '../../components/ui/Toast';
import { mockGoals } from '../../data/mockGoals';
import { mockWallets } from '../../data/mockWallets';

export function GoalFormPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const isEdit = Boolean(id);
  const goal = useMemo(() => mockGoals.find((item) => item.id === id) ?? mockGoals[0], [id]);
  const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);

  return (
    <AppLayout title={isEdit ? 'Edit Goal' : 'New Goal'} description="Create and update financial saving goals with clear target and deadline.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Goal Form</span><h2>{isEdit ? 'Update target goal dan contribution plan.' : 'Buat target keuangan baru yang actionable.'}</h2><p>Form ini memastikan target amount, wallet, deadline, dan visibility jelas sebelum goal dijalankan.</p></div>
          <div className="app-hero-actions"><Button to="/goals"><AppIcon name="back" /> Back</Button><Button variant="primary" onClick={() => showToast('Goal saved successfully.')}><AppIcon name="save" /> Save</Button></div>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Goal Information</h3><p>Lengkapi target, wallet tujuan, deadline, dan visibility.</p></div></div>
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Goal saved successfully.'); }}>
              <div className="form-two"><label><span>Goal Name</span><Input defaultValue={isEdit ? goal.name : 'Emergency Fund'} /></label><label><span>Goal Type</span><Select defaultValue={goal.icon}><option value="goal">General Goal</option><option value="cash">Cash Reserve</option><option value="investment">Investment Goal</option><option value="transport">Travel Goal</option><option value="shopping">Purchase Goal</option></Select></label></div>
              <div className="form-two"><label><span>Target Amount</span><Input defaultValue={`Rp ${goal.targetAmount.toLocaleString('id-ID')}`} /></label><label><span>Current Amount</span><Input defaultValue={`Rp ${goal.currentAmount.toLocaleString('id-ID')}`} /></label></div>
              <div className="form-two"><label><span>Saving Wallet</span><Select defaultValue={goal.walletName}>{mockWallets.map((wallet) => <option key={wallet.id}>{wallet.name}</option>)}</Select></label><label><span>Deadline</span><Input type="date" defaultValue={goal.deadline} /></label></div>
              <div className="form-two"><label><span>Visibility</span><Select defaultValue={goal.visibility}><option value="private">Private</option><option value="shared">Shared with members</option></Select><small className="field-help">Shared goal dapat memiliki member dan contribution tracking.</small></label><label><span>Status</span><Select defaultValue={goal.status}><option value="active">Active</option><option value="at_risk">At risk</option><option value="completed">Completed</option></Select></label></div>
              <label><span>Note</span><Textarea defaultValue={goal.note} /></label>
              <div className="form-row-between"><Button to="/goals">Cancel</Button><Button type="submit" variant="primary"><AppIcon name="save" /> Save Goal</Button></div>
            </form>
          </Card>

          <Card className="panel-card side-metrics-card goal-preview-card">
            <div className="panel-head"><div><h3>Goal Preview</h3><p>Progress dan target yang akan tampil ke user.</p></div><Badge tone={goal.status === 'at_risk' ? 'orange' : 'green'}>{goal.status.replace('_', ' ')}</Badge></div>
            <div className="preview-icon"><AppIcon name={goal.icon} /></div>
            <h3>{goal.name}</h3>
            <div className="metric-list">
              <div><span>Current saved</span><strong><Amount value={goal.currentAmount} type="income" /></strong></div>
              <div><span>Target</span><strong><Amount value={goal.targetAmount} /></strong></div>
              <div><span>Progress</span><strong>{progress}% funded</strong></div>
            </div>
            <ProgressBar value={progress} tone={goal.status === 'at_risk' ? 'orange' : 'green'} />
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
