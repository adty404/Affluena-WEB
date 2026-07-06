import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { Input } from '../../components/ui/Input';
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

/** Max search length the API accepts (it 400s past 100 chars). */
const SEARCH_MAX_LEN = 100;
const SEARCH_DEBOUNCE_MS = 350;

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
  const search = searchParams.get('search');
  if (type) filterParams.type = type;
  if (walletId) filterParams.wallet_id = walletId;
  if (categoryId) filterParams.category_id = categoryId;
  if (tagId) filterParams.tag_id = tagId;
  if (from) filterParams.from = from;
  if (to) filterParams.to = to;
  if (search) filterParams.search = search;

  // Local search field, debounced into the `search` URL param (consistent with
  // the other from/to/type/wallet/category searchParams). Server-side search is
  // full-history — the DataTable's built-in client search is turned off below
  // so we never also client-filter the loaded page.
  const [searchInput, setSearchInput] = useState(search ?? '');
  const searchInitialized = useRef(false);
  // Keep the field in sync when the URL param changes externally (chip clear,
  // back/forward) — but only when it actually diverges, so typing isn't fought.
  useEffect(() => {
    setSearchInput(search ?? '');
  }, [search]);
  useEffect(() => {
    // Skip the very first run so we don't rewrite the URL from initial state.
    if (!searchInitialized.current) {
      searchInitialized.current = true;
      return;
    }
    const trimmed = searchInput.trim().slice(0, SEARCH_MAX_LEN);
    const handle = setTimeout(() => {
      const current = searchParams.get('search') ?? '';
      if (trimmed === current) return;
      const next = new URLSearchParams(searchParams);
      if (trimmed) next.set('search', trimmed);
      else next.delete('search');
      setSearchParams(next, { replace: true });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const hasFilters = Object.keys(filterParams).length > 0;
  const filterTo = hasFilters ? `/transactions/filter?${searchParams.toString()}` : '/transactions/filter';

  const { data, isLoading, error } = useTransactions(filterParams);
  const transactions = data?.transactions || [];

  const walletName = (id: string | null) => (walletsData?.wallets ?? []).find((w) => w.id === id)?.name;
  const categoryName = (id: string | null) => (categoriesData?.categories ?? []).find((c) => c.id === id)?.name;
  const tagName = (id: string | null) => (tagsData?.tags ?? []).find((t) => t.id === id)?.name;

  const activeFilterChips: string[] = [];
  if (search) activeFilterChips.push(`Cari: “${search}”`);
  if (type) activeFilterChips.push(transactionTypeLabels[type as Transaction['type']] ?? type);
  if (walletId) activeFilterChips.push(walletName(walletId) ?? 'Dompet');
  if (categoryId) activeFilterChips.push(categoryName(categoryId) ?? 'Kategori');
  if (tagId) activeFilterChips.push(`#${tagName(tagId) ?? 'Tag'}`);
  if (from) activeFilterChips.push(`Dari ${from}`);
  if (to) activeFilterChips.push(`Sampai ${to}`);

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };
  const clearSearch = () => {
    setSearchInput('');
    const next = new URLSearchParams(searchParams);
    next.delete('search');
    setSearchParams(next, { replace: true });
  };
  
  // A search or any filter narrows a full-history query, so an empty result is
  // "no match" rather than "nothing recorded yet".
  const noMatchMessage = 'Tidak ada transaksi yang cocok.';
  const emptyMessage = hasFilters ? noMatchMessage : 'Belum ada transaksi.';

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
            <span className="badge dark">{NAV.transaksi}</span>
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

        <Card className="panel-card transaction-search-bar">
          <label className="transaction-search-field">
            <AppIcon name="search" />
            <Input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              maxLength={SEARCH_MAX_LEN}
              placeholder="Cari catatan, kategori, atau dompet…"
              aria-label="Cari transaksi"
            />
            {searchInput && (
              <button type="button" className="transaction-search-clear" onClick={clearSearch} aria-label="Hapus pencarian">
                <AppIcon name="close" />
              </button>
            )}
          </label>
        </Card>

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
              {!isLoading && !error && transactions.length === 0 && <p>{emptyMessage}</p>}
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
            searchable={false}
            emptyMessage={emptyMessage}
            activeFilters={activeFilterChips}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
