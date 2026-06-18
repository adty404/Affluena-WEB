import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Amount } from '../finance/Amount';
import { transactionTypeLabels } from '../../data/mockTransactions';
import type { Transaction } from '../../types/transaction';
import { useWallets } from '../../hooks/useWallets';
import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';

const typeTone = {
  income: 'green',
  expense: 'red',
  transfer: 'blue',
  adjustment: 'orange',
} as const;

const typeIcon = {
  income: '↑',
  expense: '↓',
  transfer: '↕',
  adjustment: '±',
} as const;

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const amountVariant = transaction.type === 'income' ? 'income' : transaction.type === 'expense' ? 'expense' : 'neutral';
  
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  const { data: tagsData } = useTags();

  const wallet = walletsData?.wallets.find(w => w.id === transaction.wallet_id);
  const toWallet = walletsData?.wallets.find(w => w.id === transaction.to_wallet_id);
  const category = categoriesData?.categories.find(c => c.id === transaction.category_id);
  const tags = tagsData?.tags.filter(t => transaction.tag_ids?.includes(t.id)) || [];

  return (
    <div className="transaction-item">
      <div className={`transaction-icon ${transaction.type}`}>{typeIcon[transaction.type]}</div>
      <div className="transaction-main">
        <strong>{category?.name || transaction.note || transactionTypeLabels[transaction.type]}</strong>
        <span>
          {wallet?.name || 'Unknown Wallet'}
          {toWallet ? ` → ${toWallet.name}` : ''}
          {' · '}{new Date(transaction.transaction_at).toLocaleDateString()}
        </span>
        <div className="tag-row">
          {tags.map((tag) => <span key={tag.id}>#{tag.name}</span>)}
        </div>
      </div>
      <div className="transaction-side">
        <Amount value={transaction.amount_minor} variant={amountVariant} />
        <Badge tone={typeTone[transaction.type]}>{transactionTypeLabels[transaction.type]}</Badge>
      </div>
      <div className="inline-actions">
        <Button size="small" to={`/transactions/${transaction.id}`}>View</Button>
        <Button size="small" to={`/transactions/${transaction.id}/edit`}>Edit</Button>
      </div>
    </div>
  );
}
