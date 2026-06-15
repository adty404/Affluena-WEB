import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { QuickEntryCard } from '../../components/quick-entry/QuickEntryCard';
import { mockQuickEntries } from '../../data/mockQuickEntries';

export function QuickEntryPage() {
  return (
    <AppLayout title="Quick Entry" description="Reusable templates for frequent transactions.">
      <div className="dashboard-page grid-stack"><section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Quick Entry</span><h2>Template transaksi rutin agar pencatatan harian makin cepat.</h2><p>Template menyimpan type, wallet, category, amount, note, dan tags. Execute quick entry akan membuat transaction sungguhan.</p></div><div className="app-hero-actions"><Button to="/quick-entry/new" variant="primary">+ Template</Button><Button to="/transactions/new">Manual Transaction</Button></div></section><section className="master-grid cards-3">{mockQuickEntries.map((item) => <QuickEntryCard key={item.id} item={item} />)}</section><Card className="panel-card"><div className="panel-head"><div><h3>Empty State Pattern</h3><p>Untuk user baru yang belum punya template.</p></div></div><EmptyState icon="⚡" title="Belum ada quick entry template" description="Buat template untuk transaksi yang sering kamu catat, seperti makan siang, transportasi, atau freelance income." action={<Button to="/quick-entry/new" variant="primary">+ Create Template</Button>} /></Card></div>
    </AppLayout>
  );
}
