import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Amount } from '../finance/Amount';
import { transactionTypeLabels } from '../../data/mockTransactions';
import type { Transaction } from '../../types/transaction';

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

  return (
    <div className="transaction-item">
      <div className={`transaction-icon ${transaction.type}`}>{typeIcon[transaction.type]}</div>
      <div className="transaction-main">
        <strong>{transaction.title}</strong>
        <span>
          {transaction.walletName}
          {transaction.destinationWalletName ? ` → ${transaction.destinationWalletName}` : ''}
          {' · '}{transaction.date}
        </span>
        <div className="tag-row">
          {transaction.tags.map((tag) => <span key={tag}>#{tag}</span>)}
        </div>
      </div>
      <div className="transaction-side">
        <Amount value={transaction.amount} variant={amountVariant} />
        <Badge tone={typeTone[transaction.type]}>{transactionTypeLabels[transaction.type]}</Badge>
      </div>
      <div className="inline-actions">
        <Button size="small" to={`/transactions/${transaction.id}`}>View</Button>
        <Button size="small" to={`/transactions/${transaction.id}/edit`}>Edit</Button>
      </div>
    </div>
  );
}
