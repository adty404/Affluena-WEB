import { useState } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { AppIcon } from '../ui/AppIcon';
import { Amount } from '../finance/Amount';
import type { QuickEntryTemplate } from '../../types/quickEntry';

export function QuickEntryCard({ item }: { item: QuickEntryTemplate }) {
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const amountVariant = item.type === 'income' ? 'income' : 'expense';

  function executeTemplate() {
    setConfirmOpen(false);
    showToast(`${item.name} berhasil dibuat sebagai transaksi ${item.type}.`);
  }

  return (
    <>
      <Card className="quick-entry-card">
        <div className="card-topline">
          <div className={`finance-icon ${item.type === 'income' ? 'income' : 'danger'}`}><AppIcon name={item.type === 'income' ? 'success' : 'transactions'} /></div>
          <div><h3>{item.name}</h3><p>{item.walletName} · {item.categoryName}</p></div>
          <Badge tone={item.type === 'income' ? 'green' : 'red'}>{item.type}</Badge>
        </div>
        <h2><Amount value={item.amount} variant={amountVariant} /></h2>
        <p className="muted-text">{item.note}</p>
        <div className="tag-row">{item.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
        <div className="card-footer"><span>Used {item.usageCount}x</span><span>{item.lastUsed}</span></div>
        <div className="card-actions">
          <Button size="small" variant="primary" onClick={() => setConfirmOpen(true)}><AppIcon name="quick" /> Execute</Button>
          <Button size="small" to={`/quick-entry/${item.id}/edit`}><AppIcon name="edit" /> Edit</Button>
        </div>
      </Card>

      <Modal open={confirmOpen} title="Execute Quick Entry" description="Konfirmasi detail transaksi sebelum template dijalankan." onClose={() => setConfirmOpen(false)}>
        <div className="readiness-list">
          <div><span>Template</span><strong>{item.name}</strong></div>
          <div><span>Wallet</span><strong>{item.walletName}</strong></div>
          <div><span>Category</span><strong>{item.categoryName}</strong></div>
          <div><span>Amount</span><strong><Amount value={item.amount} variant={amountVariant} /></strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={executeTemplate}><AppIcon name="save" /> Create Transaction</Button>
        </div>
      </Modal>
    </>
  );
}
