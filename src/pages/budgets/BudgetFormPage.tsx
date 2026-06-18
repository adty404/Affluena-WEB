import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { flatCategories } from '../../data/mockCategories';
import { mockBudgets } from '../../data/mockBudgets';

export function BudgetFormPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const budget = useMemo(() => mockBudgets.find((item) => item.id === id) ?? mockBudgets[0], [id]);
  const isEdit = Boolean(id);
  const expenseCategories = flatCategories.filter((category) => category.type === 'expense');
  const usage = Math.round((budget.actual / budget.limit) * 100);

  return (
    <AppLayout title={isEdit ? 'Edit Budget' : 'New Budget'} description="Create dan edit monthly category budget dengan threshold warning/exceeded.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Budget form</span>
            <h2>{isEdit ? 'Update category budget tanpa kehilangan alert history.' : 'Buat budget bulanan per kategori expense.'}</h2>
            <p>Form ini memandu user memilih category, period, limit, threshold, dan note. Semua field dibuat jelas agar aman saat nanti connect API.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/budgets"><AppIcon name="back" /> Back</Button>
            <Button variant="primary" onClick={() => showToast('Budget saved successfully.')}><AppIcon name="save" /> Save</Button>
          </div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card form-panel">
            <div className="panel-head"><div><h3>Budget Information</h3><p>Pastikan satu category hanya punya satu budget di periode yang sama.</p></div></div>
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Budget berhasil disimpan.'); }}>
              <div className="form-two">
                <label><span>Expense Category</span><Select defaultValue={budget.categoryId}>{expenseCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select><small className="field-help">Budget hanya berlaku untuk expense category.</small></label>
                <label><span>Period</span><Input type="month" defaultValue="2026-06" /><small className="field-help">Periode digunakan untuk menghitung actual spending.</small></label>
              </div>
              <div className="form-two">
                <label><span>Budget Limit</span><Input defaultValue={`Rp ${budget.limit.toLocaleString('id-ID')}`} inputMode="numeric" /><small className="field-help">Backend sebaiknya menyimpan limit dalam minor unit.</small></label>
                <label><span>Rollover Behavior</span><Select defaultValue="none"><option value="none">No rollover</option><option value="remaining">Rollover remaining to next month</option><option value="overspend">Rollover overspend to next month</option></Select><small className="field-help">Default aman: tidak rollover otomatis.</small></label>
              </div>
              <div className="form-two">
                <label><span>Warning Threshold</span><Select defaultValue="80"><option value="70">70%</option><option value="75">75%</option><option value="80">80%</option><option value="90">90%</option></Select><small className="field-help">Alert pertama saat usage melewati threshold ini.</small></label>
                <label><span>Exceeded Threshold</span><Select defaultValue="100"><option value="95">95%</option><option value="100">100%</option><option value="110">110%</option></Select><small className="field-help">Status exceeded saat actual melewati limit ini.</small></label>
              </div>
              <label><span>Note</span><Textarea defaultValue={budget.note} /><small className="field-help">Tambahkan konteks agar budget mudah dipahami saat review.</small></label>
              <div className="form-row-between"><Button to="/budgets">Cancel</Button><Button type="submit" variant="primary"><AppIcon name="save" /> Save Budget</Button></div>
            </form>
          </Card>

          <div className="grid-stack">
            <Card className="panel-card budget-preview-card">
              <div className="preview-icon"><AppIcon name={budget.categoryIcon} /></div>
              <Badge tone={budget.status === 'safe' ? 'green' : budget.status === 'warning' ? 'orange' : 'red'}>{budget.status}</Badge>
              <h3>{budget.categoryName}</h3>
              <p>{budget.period} · warning at {budget.warningThreshold}%</p>
              <strong><Amount value={budget.limit} /></strong>
              <ProgressBar value={usage} tone={budget.status === 'safe' ? 'green' : budget.status === 'warning' ? 'orange' : 'red'} />
            </Card>
            <Card className="panel-card">
              <div className="panel-head"><div><h3>Validation Rules</h3><p>Guardrail untuk UX form.</p></div></div>
              <div className="readiness-list">
                <div><span>Unique budget</span><Badge tone="blue">category + period</Badge></div>
                <div><span>Actual source</span><Badge tone="purple">expense transactions</Badge></div>
                <div><span>Warning alert</span><Badge tone="orange">80%</Badge></div>
                <div><span>Exceeded alert</span><Badge tone="red">100%</Badge></div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
