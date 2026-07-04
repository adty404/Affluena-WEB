import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { TransactionItem } from '../../components/transactions/TransactionItem';
import { transactionTypeLabels } from '../../data/mockTransactions';
import type { Transaction } from '../../types/transaction';
import type { TransactionListParams } from '../../api/transactions';
import { useTransactions } from '../../hooks/useTransactions';
import { useWallets } from '../../hooks/useWallets';
import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';
import { NAV } from '../../lib/copy';

export function TransactionListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  const { data: tagsData } = useTags();

  const filterParams: TransactionListParams = {};
  const type = searchParams.get('type');
  const walletId = searchParams.get('wallet_id');
  const categoryId = searchParams.get('category_id');
  const tagId = searchParams.get('tag_id');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  if (type) filterParams.type = type;
  if (walletId) filterParams.wallet_id = walletId;
  if (categoryId) filterParams.category_id = categoryId;
  if (tagId) filterParams.tag_id = tagId;
  if (from) filterParams.from = from;
  if (to) filterParams.to = to;

  const hasFilters = Object.keys(filterParams).length > 0;
  const filterTo = hasFilters ? `/transactions/filter?${searchParams.toString()}` : '/transactions/filter';

  const { data, isLoading, error } = useTransactions(filterParams);
  const transactions = data?.transactions || [];

  const walletName = (id: string | null) => (walletsData?.wallets ?? []).find((w) => w.id === id)?.name;
  const categoryName = (id: string | null) => (categoriesData?.categories ?? []).find((c) => c.id === id)?.name;
  const tagName = (id: string | null) => (tagsData?.tags ?? []).find((t) => t.id === id)?.name;

  const activeFilterChips: string[] = [];
  if (type) activeFilterChips.push(transactionTypeLabels[type as Transaction['type']] ?? type);
  if (walletId) activeFilterChips.push(walletName(walletId) ?? 'Dompet');
  if (categoryId) activeFilterChips.push(categoryName(categoryId) ?? 'Kategori');
  if (tagId) activeFilterChips.push(`#${tagName(tagId) ?? 'Tag'}`);
  if (from) activeFilterChips.push(`Dari ${from}`);
  if (to) activeFilterChips.push(`Sampai ${to}`);

  const clearFilters = () => setSearchParams({});
  
  const income = transactions.filter((tx) => tx.type === 'income').reduce((sum, tx) => sum + tx.amount_minor, 0);
  const expenses = transactions.filter((tx) => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount_minor, 0);
  const net = income - expenses;
  
  const columns = [
    {
      key: 'title',
      header: 'Transaksi',
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
      header: 'Tipe',
      render: (tx: Transaction) => (
        <Badge tone={tx.type === 'income' ? 'green' : tx.type === 'expense' ? 'red' : tx.type === 'transfer' ? 'blue' : 'orange'}>
          {transactionTypeLabels[tx.type]}
        </Badge>
      ) 
    },
    {
      key: 'wallet',
      header: 'Dompet',
      render: (tx: Transaction) => {
        const wallet = (walletsData?.wallets ?? []).find(w => w.id === tx.wallet_id);
        const toWallet = (walletsData?.wallets ?? []).find(w => w.id === tx.to_wallet_id);
        return toWallet ? `${wallet?.name || 'Tidak diketahui'} → ${toWallet.name}` : (wallet?.name || 'Tidak diketahui');
      }
    },
    {
      key: 'category',
      header: 'Kategori',
      render: (tx: Transaction) => {
        const category = (categoriesData?.categories ?? []).find(c => c.id === tx.category_id);
        return category?.name ?? '—';
      } 
    },
    {
      key: 'amount',
      header: 'Jumlah',
      align: 'right' as const, 
      render: (tx: Transaction) => (
        <Amount value={tx.amount_minor} variant={tx.type === 'income' ? 'income' : tx.type === 'expense' ? 'expense' : 'neutral'} />
      ) 
    },
    {
      key: 'action',
      header: 'Aksi',
      render: (tx: Transaction) => (
        <div className="inline-actions">
          <Button size="small" to={`/transactions/${tx.id}`}>Lihat</Button>
          <Button size="small" to={`/transactions/${tx.id}/edit`}>Edit</Button>
        </div>
      )
    },
  ];

  return (
    <AppLayout title={NAV.transaksi} description="Pemasukan, pengeluaran, transfer, penyesuaian, bagi tagihan, dan catat cepat.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● {NAV.transaksi}</span>
            <h2>Catat semua transaksi dan pantau perubahan saldomu.</h2>
            <p>Pemasukan menambah saldo, pengeluaran mengurangi saldo, transfer memindahkan saldo antar dompet, dan penyesuaian mengoreksi saldo secara manual.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/transactions/new" variant="primary">+ Transaksi</Button>
            <Button to="/transactions/transfer">Transfer</Button>
            <Button to="/quick-entry">{NAV.catatCepat}</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Total Pemasukan</span><strong><Amount value={income} variant="income" /></strong><small>Transaksi yang tampil</small></Card>
          <Card className="stat-card orange"><span>Total Pengeluaran</span><strong><Amount value={expenses} variant="expense" /></strong><small>Transaksi yang tampil</small></Card>
          <Card className="stat-card blue"><span>{NAV.transaksi}</span><strong>{transactions.length}</strong><small>Transaksi tercatat</small></Card>
          <Card className="stat-card purple"><span>Arus Bersih</span><strong><Amount value={net} variant={net < 0 ? 'expense' : 'income'} /></strong><small>Pemasukan - pengeluaran</small></Card>
        </section>

        {hasFilters && (
          <Card className="panel-card filter-active-bar">
            <div className="panel-head">
              <div>
                <h3>Filter aktif</h3>
                <div className="tag-row">
                  {activeFilterChips.map((chip) => <Badge key={chip} tone="blue">{chip}</Badge>)}
                </div>
              </div>
              <div className="inline-actions">
                <Button to={filterTo} size="small"><AppIcon name="filter" /> Edit Filter</Button>
                <Button size="small" onClick={clearFilters}>Hapus</Button>
              </div>
            </div>
          </Card>
        )}

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Transaksi Terbaru</h3><p>Aktivitas terakhir dari semua dompet kamu.</p></div><Button to={filterTo} size="small"><AppIcon name="filter" /> Filter</Button></div>
            <div className="transaction-list">
              {isLoading && <p>Memuat transaksi...</p>}
              {error && <p>Gagal memuat transaksi.</p>}
              {!isLoading && !error && transactions.length === 0 && <p>{hasFilters ? 'Tidak ada transaksi yang cocok dengan filter.' : 'Belum ada transaksi.'}</p>}
              {transactions.slice(0, 4).map((tx) => <TransactionItem key={tx.id} transaction={tx} />)}
            </div>
          </Card>
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Aksi Cepat</h3><p>Mulai pencatatan dalam sekali klik.</p></div></div>
            <div className="quick-action-grid">
              <Button to="/transactions/new" variant="primary" full>Pemasukan / Pengeluaran</Button>
              <Button to="/transactions/transfer" full>Transfer Dompet</Button>
              <Button to="/transactions/adjustment" full>Penyesuaian Saldo</Button>
              <Button to="/transactions/split" full>{NAV.bagiTagihan}</Button>
              <Button to="/quick-entry" full>Template Catat Cepat</Button>
            </div>
          </Card>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Tabel Transaksi</h3><p>Semua transaksi lengkap dengan filter dan aksi.</p></div><Button to="/transactions/new" size="small" variant="primary"><AppIcon name="add" /> Transaksi</Button></div>
          <DataTable
            columns={columns}
            data={transactions}
            getRowKey={(tx) => tx.id}
            emptyMessage={hasFilters ? 'Tidak ada transaksi yang cocok dengan filter.' : 'Belum ada transaksi.'}
            activeFilters={activeFilterChips}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
