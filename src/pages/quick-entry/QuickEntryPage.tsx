import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useQuickEntryTemplates, useExecuteQuickEntryTemplate } from '../../hooks/useQuickEntry';
import { useWallets } from '../../hooks/useWallets';
import { useCategories } from '../../hooks/useCategories';
import { useToast } from '../../components/ui/Toast';

export function QuickEntryPage() {
  const { data, isLoading, error } = useQuickEntryTemplates();
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  const executeMutation = useExecuteQuickEntryTemplate();
  const { showToast } = useToast();

  if (isLoading) return <AppLayout title="Quick Entry" description="Loading..."><div className="p-8">Loading...</div></AppLayout>;
  if (error) return <AppLayout title="Quick Entry" description="Loading..."><div className="p-8 text-red-500">Error loading quick entry templates</div></AppLayout>;

  const templates = data?.templates || [];
  const walletNameById = new Map((walletsData?.wallets ?? []).map((wallet) => [wallet.id, wallet.name]));
  const categoryNameById = new Map((categoriesData?.categories ?? []).map((category) => [category.id, category.name]));

  const walletLabel = (walletId: string) => walletNameById.get(walletId) ?? 'Unknown wallet';
  const categoryLabel = (categoryId: string | undefined, type: string) => categoryId ? (categoryNameById.get(categoryId) ?? 'Unknown category') : type;

  const handleExecute = async (id: string) => {
    try {
      await executeMutation.mutateAsync({ id });
      showToast('Transaction created successfully');
    } catch (error) {
      showToast('Failed to create transaction');
    }
  };

  return (
    <AppLayout title="Quick Entry" description="Reusable templates for frequent transactions.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Quick Entry</span><h2>Template transaksi rutin agar pencatatan harian makin cepat.</h2><p>Template menyimpan type, wallet, category, amount, note, dan tags. Execute quick entry akan membuat transaction sungguhan.</p></div>
          <div className="app-hero-actions"><Button to="/quick-entry/new" variant="primary">+ Template</Button><Button to="/transactions/new">Manual Transaction</Button></div>
        </section>
        
        {templates.length > 0 ? (
          <section className="master-grid cards-3">
            {templates.map((item) => (
              <Card key={item.id} className="quick-entry-card">
                <div className="qe-header">
                  <div className="qe-title">
                    <span className="mini-icon info"><AppIcon name={item.type === 'income' ? 'receivable' : item.type === 'expense' ? 'payable' : 'transactions'} /></span>
                    <strong>{item.name}</strong>
                  </div>
                  <Button to={`/quick-entry/${item.id}/edit`} size="small" variant="ghost"><AppIcon name="edit" /></Button>
                </div>
                <div className="qe-amount">
                  <Amount value={item.amount_minor} type={item.type === 'income' ? 'income' : 'expense'} />
                </div>
                <div className="qe-meta">
                  <small><span>Wallet</span><strong>{item.to_wallet_id ? `${walletLabel(item.wallet_id)} → ${walletLabel(item.to_wallet_id)}` : walletLabel(item.wallet_id)}</strong></small>
                  <small><span>Category</span><strong>{categoryLabel(item.category_id, item.type)}</strong></small>
                </div>
                <div className="qe-action">
                  <Button 
                    variant="primary" 
                    className="w-full" 
                    onClick={() => handleExecute(item.id)}
                    disabled={executeMutation.isPending}
                  >
                    <AppIcon name="run" /> {executeMutation.isPending ? 'Executing...' : 'Execute'}
                  </Button>
                </div>
              </Card>
            ))}
          </section>
        ) : (
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Empty State Pattern</h3><p>Untuk user baru yang belum punya template.</p></div></div>
            <EmptyState icon="⚡" title="Belum ada quick entry template" description="Buat template untuk transaksi yang sering kamu catat, seperti makan siang, transportasi, atau freelance income." action={<Button to="/quick-entry/new" variant="primary">+ Create Template</Button>} />
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
