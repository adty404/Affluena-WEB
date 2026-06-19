import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { Amount } from '../../components/finance/Amount';
import { TransactionItem } from '../../components/transactions/TransactionItem';
import { transactionTypeLabels } from '../../data/mockTransactions';
import type { Transaction } from '../../types/transaction';
import { useTransactions } from '../../hooks/useTransactions';
import { useWallets } from '../../hooks/useWallets';
import { useCategories } from '../../hooks/useCategories';

export function TransactionListPage() {
  const { data, isLoading, error } = useTransactions();
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();

  const transactions = data?.transactions || [];
  
  const income = transactions.filter((tx) => tx.type === 'income').reduce((sum, tx) => sum + tx.amount_minor, 0);
  const expenses = transactions.filter((tx) => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount_minor, 0);
  
  const columns = [
    { 
      key: 'title', 
      header: 'Transaction', 
      render: (tx: Transaction) => {
        const category = (categoriesData?.categories ?? []).find(c => c.id === tx.category_id);
        return (
          <div>
            <strong>{category?.name || tx.note || transactionTypeLabels[tx.type]}</strong>
            <span className="table-subtitle">{tx.note}</span>
          </div>
        );
      } 
    },
    { 
      key: 'type', 
      header: 'Type', 
      render: (tx: Transaction) => (
        <Badge tone={tx.type === 'income' ? 'green' : tx.type === 'expense' ? 'red' : tx.type === 'transfer' ? 'blue' : 'orange'}>
          {transactionTypeLabels[tx.type]}
        </Badge>
      ) 
    },
    { 
      key: 'wallet', 
      header: 'Wallet', 
      render: (tx: Transaction) => {
        const wallet = (walletsData?.wallets ?? []).find(w => w.id === tx.wallet_id);
        const toWallet = (walletsData?.wallets ?? []).find(w => w.id === tx.to_wallet_id);
        return toWallet ? `${wallet?.name || 'Unknown'} → ${toWallet.name}` : (wallet?.name || 'Unknown');
      } 
    },
    { 
      key: 'category', 
      header: 'Category', 
      render: (tx: Transaction) => {
        const category = (categoriesData?.categories ?? []).find(c => c.id === tx.category_id);
        return category?.name ?? '—';
      } 
    },
    { 
      key: 'amount', 
      header: 'Amount', 
      align: 'right' as const, 
      render: (tx: Transaction) => (
        <Amount value={tx.amount_minor} variant={tx.type === 'income' ? 'income' : tx.type === 'expense' ? 'expense' : 'neutral'} />
      ) 
    },
    { 
      key: 'action', 
      header: 'Action', 
      render: (tx: Transaction) => (
        <div className="inline-actions">
          <Button size="small" to={`/transactions/${tx.id}`}>View</Button>
          <Button size="small" to={`/transactions/${tx.id}/edit`}>Edit</Button>
        </div>
      ) 
    },
  ];

  return (
    <AppLayout title="Transactions" description="Income, expense, transfer, adjustment, split bill, and quick entry.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Transactions</span>
            <h2>Catat transaksi dengan balance delta yang jelas dan aman.</h2>
            <p>Income menambah saldo, expense mengurangi saldo, transfer memindahkan saldo antar wallet, dan adjustment mengoreksi saldo manual.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/transactions/new" variant="primary">+ Transaction</Button>
            <Button to="/transactions/transfer">Transfer</Button>
            <Button to="/quick-entry">Quick Entry</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Total Income</span><strong><Amount value={income} variant="income" /></strong><small>This month</small></Card>
          <Card className="stat-card orange"><span>Total Expense</span><strong><Amount value={expenses} variant="expense" /></strong><small>This month</small></Card>
          <Card className="stat-card blue"><span>Transactions</span><strong>{transactions.length}</strong><small>Posted records</small></Card>
          <Card className="stat-card purple"><span>Net Flow</span><strong><Amount value={income - expenses} variant="income" /></strong><small>Income - expense</small></Card>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Recent Transactions</h3><p>List pattern untuk mobile-friendly transaction feed.</p></div><Button to="/transactions/filter" size="small">Filter</Button></div>
            <div className="transaction-list">
              {isLoading && <p>Loading transactions...</p>}
              {error && <p>Error loading transactions.</p>}
              {!isLoading && !error && transactions.length === 0 && <p>No transactions found.</p>}
              {transactions.slice(0, 4).map((tx) => <TransactionItem key={tx.id} transaction={tx} />)}
            </div>
          </Card>
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Quick Actions</h3><p>Semua action utama transaksi punya route.</p></div></div>
            <div className="quick-action-grid">
              <Button to="/transactions/new" variant="primary" full>Income / Expense</Button>
              <Button to="/transactions/transfer" full>Transfer Wallet</Button>
              <Button to="/transactions/adjustment" full>Balance Adjustment</Button>
              <Button to="/transactions/split" full>Split Bill</Button>
              <Button to="/quick-entry" full>Quick Entry Templates</Button>
            </div>
          </Card>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Transaction Table</h3><p>Table pattern untuk list, pagination, filter, dan action.</p></div><Button to="/transactions/new" size="small" variant="primary">+ Transaction</Button></div>
          <DataTable columns={columns} data={transactions} getRowKey={(tx) => tx.id} />
        </Card>
      </div>
    </AppLayout>
  );
}
