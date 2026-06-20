import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { useCategories } from '../../hooks/useCategories';
import { useRecurringRule, useRunRecurringRule } from '../../hooks/useRecurring';
import { useWallets } from '../../hooks/useWallets';
import { categoryLabel, createNameById, walletPairLabel } from '../../lib/financeLabels';

export function RecurringRunPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const { data: rule, isLoading, error } = useRecurringRule(id || '');
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  const runMutation = useRunRecurringRule();
  const walletNameById = createNameById(walletsData?.wallets ?? []);
  const categoryNameById = createNameById(categoriesData?.categories ?? []);

  if (isLoading) return <AppLayout title="Manual Run" description="Loading..."><div className="p-8">Loading...</div></AppLayout>;
  if (error || !rule) return <AppLayout title="Manual Run" description="Loading..."><div className="p-8 text-red-500">Error loading recurring rule</div></AppLayout>;
  const walletText = walletPairLabel(walletNameById, rule.wallet_id, rule.to_wallet_id);
  const categoryText = categoryLabel(categoryNameById, rule.category_id, rule.type);

  const handleRun = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await runMutation.mutateAsync({ id: rule.id, data: { now: true } });
      showToast('Recurring rule executed successfully');
      navigate(`/recurring/${rule.id}`);
    } catch (error) {
      showToast('Failed to execute recurring rule');
    }
  };

  return (
    <AppLayout title="Manual Run" description="Execute one recurring rule manually with confirmation preview.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Manual Run</span><h2>Jalankan {rule.name} secara manual.</h2><p>Manual run membuat transaksi dari rule yang sama dan menyimpan run history.</p></div>
          <div className="app-hero-actions"><Button to={`/recurring/${rule.id}`}>Back</Button><Button variant="primary" onClick={() => handleRun()} disabled={runMutation.isPending}><AppIcon name="run" /> {runMutation.isPending ? 'Executing...' : 'Execute Now'}</Button></div>
        </section>
        
        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Run Confirmation</h3><p>Review data sebelum manual execution.</p></div></div>
            <form className="form-stack" onSubmit={handleRun}>
              <div className="form-two">
                <label><span>Rule</span><Input defaultValue={rule.name} readOnly /></label>
                <label><span>Run Date</span><Input type="datetime-local" defaultValue={new Date().toISOString().slice(0, 16)} readOnly /></label>
              </div>
              <div className="form-two">
                <label><span>Wallet</span><Input value={walletText} readOnly /></label>
                <label><span>Amount</span><Input defaultValue={`Rp ${rule.amount_minor.toLocaleString('id-ID')}`} readOnly /></label>
              </div>
              <div className="form-two">
                <label><span>Execution Mode</span><Select><option>Create transaction now</option></Select></label>
                <label><span>Duplicate Guard</span><Select><option>Allow manual duplicate</option></Select></label>
              </div>
              <label><span>Run Note</span><Textarea defaultValue="Manual run requested by user from recurring detail page." readOnly /></label>
              <div className="form-row-between">
                <Button to={`/recurring/${rule.id}`}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={runMutation.isPending}><AppIcon name="run" /> {runMutation.isPending ? 'Executing...' : 'Execute Rule'}</Button>
              </div>
            </form>
          </Card>
          
          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Transaction Preview</h3><p>Dampak run terhadap wallet.</p></div></div>
            <div className="metric-list">
              <div><span>Type</span><strong>{rule.type}</strong></div>
              <div><span>Amount</span><strong><Amount value={rule.amount_minor} type={rule.type === 'income' ? 'income' : 'expense'} /></strong></div>
              <div><span>Wallet</span><strong>{walletText}</strong></div>
              <div><span>Category</span><strong>{categoryText}</strong></div>
              <div><span>History result</span><strong>success / failed / skipped</strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
