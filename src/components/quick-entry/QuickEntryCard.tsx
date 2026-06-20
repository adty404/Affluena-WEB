import { useState } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { AppIcon } from '../ui/AppIcon';
import { Amount } from '../finance/Amount';
import { useCategories } from '../../hooks/useCategories';
import { useExecuteQuickEntryTemplate } from '../../hooks/useQuickEntry';
import { useWallets } from '../../hooks/useWallets';
import { categoryLabel, createNameById, walletPairLabel } from '../../lib/financeLabels';
import type { QuickEntryTemplate } from '../../types/quickEntry';

export function QuickEntryCard({ item }: { item: QuickEntryTemplate }) {
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const executeMutation = useExecuteQuickEntryTemplate();
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  const amountVariant = item.type === 'income' ? 'income' : 'expense';
  const walletNameById = createNameById(walletsData?.wallets ?? []);
  const categoryNameById = createNameById(categoriesData?.categories ?? []);
  const walletText = walletPairLabel(walletNameById, item.wallet_id, item.to_wallet_id);
  const categoryText = categoryLabel(categoryNameById, item.category_id, item.type);

  async function executeTemplate() {
    try {
      await executeMutation.mutateAsync({ id: item.id });
      setConfirmOpen(false);
      showToast(`${item.name} berhasil dibuat sebagai transaksi ${item.type}.`);
    } catch (error) {
      showToast('Failed to execute template');
    }
  }

  return (
    <>
      <Card className="quick-entry-card">
        <div className="card-topline">
          <div className={`finance-icon ${item.type === 'income' ? 'income' : 'danger'}`}><AppIcon name={item.type === 'income' ? 'success' : 'transactions'} /></div>
          <div><h3>{item.name}</h3><p>{walletText} · {categoryText}</p></div>
          <Badge tone={item.type === 'income' ? 'green' : 'red'}>{item.type}</Badge>
        </div>
        <h2><Amount value={item.amount_minor} type={amountVariant} /></h2>
        <p className="muted-text">{item.note}</p>
        <div className="card-actions">
          <Button size="small" variant="primary" onClick={() => setConfirmOpen(true)} disabled={executeMutation.isPending}><AppIcon name="quick" /> {executeMutation.isPending ? 'Executing...' : 'Execute'}</Button>
          <Button size="small" to={`/quick-entry/${item.id}/edit`}><AppIcon name="edit" /> Edit</Button>
        </div>
      </Card>

      <Modal open={confirmOpen} title="Execute Quick Entry" description="Konfirmasi detail transaksi sebelum template dijalankan." onClose={() => setConfirmOpen(false)}>
        <div className="readiness-list">
          <div><span>Template</span><strong>{item.name}</strong></div>
          <div><span>Wallet</span><strong>{walletText}</strong></div>
          <div><span>Category</span><strong>{categoryText}</strong></div>
          <div><span>Amount</span><strong><Amount value={item.amount_minor} type={amountVariant} /></strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={executeTemplate} disabled={executeMutation.isPending}><AppIcon name="save" /> {executeMutation.isPending ? 'Creating...' : 'Create Transaction'}</Button>
        </div>
      </Modal>
    </>
  );
}
