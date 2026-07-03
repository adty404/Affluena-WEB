import { useState } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { AppIcon } from '../ui/AppIcon';
import { Amount } from '../finance/Amount';
import { useCategories } from '../../hooks/useCategories';
import { useExecuteQuickEntryTemplate } from '../../hooks/useQuickEntry';
import { useWallets } from '../../hooks/useWallets';
import { categoryLabel, createNameById, walletPairLabel } from '../../lib/financeLabels';
import { transactionTypeLabels } from '../../data/mockTransactions';
import type { QuickEntryTemplate } from '../../types/quickEntry';

export function QuickEntryCard({ item }: { item: QuickEntryTemplate }) {
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [transactionAt, setTransactionAt] = useState(() => new Date().toISOString().slice(0, 16));
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
      await executeMutation.mutateAsync({
        id: item.id,
        data: { transaction_at: new Date(transactionAt).toISOString() },
      });
      setConfirmOpen(false);
      showToast(`${item.name} berhasil dicatat sebagai transaksi.`);
    } catch (error) {
      showToast('Gagal menjalankan template');
    }
  }

  return (
    <>
      <Card className="quick-entry-card">
        <div className="card-topline">
          <div className={`finance-icon ${item.type === 'income' ? 'income' : 'danger'}`}><AppIcon name={item.type === 'income' ? 'success' : 'transactions'} /></div>
          <div><h3>{item.name}</h3><p>{walletText} · {categoryText}</p></div>
          <Badge tone={item.type === 'income' ? 'green' : 'red'}>{transactionTypeLabels[item.type] ?? item.type}</Badge>
        </div>
        <h2><Amount value={item.amount_minor} type={amountVariant} /></h2>
        <p className="muted-text">{item.note}</p>
        <div className="card-actions">
          <Button size="small" variant="primary" onClick={() => setConfirmOpen(true)} disabled={executeMutation.isPending}><AppIcon name="quick" /> {executeMutation.isPending ? 'Menjalankan...' : 'Jalankan'}</Button>
          <Button size="small" to={`/quick-entry/${item.id}/edit`}><AppIcon name="edit" /> Edit</Button>
        </div>
      </Card>

      <Modal open={confirmOpen} title="Jalankan Catat Cepat" description="Konfirmasi detail transaksi sebelum template dijalankan." onClose={() => setConfirmOpen(false)}>
        <div className="readiness-list">
          <div><span>Template</span><strong>{item.name}</strong></div>
          <div><span>Dompet</span><strong>{walletText}</strong></div>
          <div><span>Kategori</span><strong>{categoryText}</strong></div>
          <div><span>Jumlah</span><strong><Amount value={item.amount_minor} type={amountVariant} /></strong></div>
        </div>
        <div className="form-stack">
          <label>
            <span>Tanggal &amp; waktu</span>
            <Input
              type="datetime-local"
              value={transactionAt}
              onChange={(event) => setTransactionAt(event.target.value)}
            />
          </label>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setConfirmOpen(false)}>Batal</Button>
          <Button variant="primary" onClick={executeTemplate} disabled={executeMutation.isPending}><AppIcon name="save" /> {executeMutation.isPending ? 'Membuat...' : 'Buat Transaksi'}</Button>
        </div>
      </Modal>
    </>
  );
}
