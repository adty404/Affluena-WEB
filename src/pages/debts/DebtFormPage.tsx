import { useLocation } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { mockWallets } from '../../data/mockWallets';

export function DebtFormPage() {
  const { pathname } = useLocation();
  const { showToast } = useToast();
  const isReceivable = pathname.includes('receivable');
  const title = isReceivable ? 'Add Receivable' : 'Add Payable';

  return (
    <AppLayout title={title} description="Create payable or receivable with due date and reminder rule.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Debt Form</span><h2>{isReceivable ? 'Catat piutang yang harus ditagih.' : 'Catat utang yang harus dibayar.'}</h2><p>Form ini terhubung ke wallet dan payment flow agar saldo tetap konsisten.</p></div>
          <div className="app-hero-actions"><Button to="/debts">Back</Button><Button variant="primary" onClick={() => showToast(`${title} saved.`)}><AppIcon name="save" /> Save</Button></div>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Debt Information</h3><p>Lengkapi counterparty, amount, due date, dan wallet.</p></div></div>
            <form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast(`${title} saved.`); }}>
              <div className="form-two"><label><span>Type</span><Select defaultValue={isReceivable ? 'receivable' : 'payable'}><option value="payable">Payable - I owe someone</option><option value="receivable">Receivable - Someone owes me</option></Select></label><label><span>Counterparty</span><Input defaultValue={isReceivable ? 'Team Dinner' : 'Bank ABC'} /></label></div>
              <div className="form-two"><label><span>Title</span><Input defaultValue={isReceivable ? 'Dinner Split Bill' : 'KTA Bank Installment'} /></label><label><span>Original Amount</span><Input defaultValue={isReceivable ? 'Rp 960.000' : 'Rp 10.000.000'} /></label></div>
              <div className="form-two"><label><span>Wallet</span><Select>{mockWallets.map((wallet) => <option key={wallet.id}>{wallet.name}</option>)}</Select></label><label><span>Due Date</span><Input type="date" defaultValue="2026-06-20" /></label></div>
              <div className="form-two"><label><span>Reminder</span><Select><option>H-3, H-1, due date, overdue</option><option>H-7, H-3, H-1, due date</option><option>Due date only</option></Select></label><label><span>Initial Status</span><Select><option>Open</option><option>Partial</option></Select></label></div>
              <label><span>Note</span><Textarea defaultValue={isReceivable ? 'Receivable generated from split bill or manual lending.' : 'Debt that needs scheduled payment tracking.'} /></label>
              <div className="form-row-between"><Button to="/debts">Cancel</Button><Button type="submit" variant="primary"><AppIcon name="save" /> Save Debt</Button></div>
            </form>
          </Card>

          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Balance Impact</h3><p>Preview payment behavior setelah debt dibuat.</p></div></div>
            <div className="metric-list">
              <div><span>Payment direction</span><strong>{isReceivable ? 'Wallet increases on collection' : 'Wallet decreases on payment'}</strong></div>
              <div><span>Sample amount</span><strong><Amount value={isReceivable ? 960000 : 10000000} type={isReceivable ? 'income' : 'expense'} /></strong></div>
              <div><span>Reminder rule</span><strong>H-3, H-1, due date</strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
