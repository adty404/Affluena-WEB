import type { CashflowPoint, DashboardStat, DashboardTransaction, ExpenseSlice, ForecastItem } from '../types/dashboard';

export const dashboardStats: DashboardStat[] = [
  { label: 'Kekayaan Bersih', value: 'Rp 68.450.000', note: '+8,2% dari bulan lalu', tone: 'green' },
  { label: 'Pemasukan Bulan Ini', value: 'Rp 14.200.000', note: '3 sumber pemasukan', tone: 'blue' },
  { label: 'Pengeluaran Bulan Ini', value: 'Rp 8.760.000', note: '61,7% dari pemasukan', tone: 'orange' },
  { label: 'Tingkat Menabung', value: '38,3%', note: 'Kisaran sehat', tone: 'purple' },
];

export const cashflowPoints: CashflowPoint[] = [
  { label: 'Jan', income: 12.8, expense: 7.4 },
  { label: 'Feb', income: 13.1, expense: 8.0 },
  { label: 'Mar', income: 13.7, expense: 7.8 },
  { label: 'Apr', income: 14.2, expense: 8.5 },
  { label: 'Mei', income: 14.0, expense: 8.2 },
  { label: 'Jun', income: 14.2, expense: 8.76 },
];

export const expenseSlices: ExpenseSlice[] = [
  { label: 'Makan & Minum', amount: 'Rp 2.180.000', percent: 25, tone: 'green' },
  { label: 'Transportasi', amount: 'Rp 1.420.000', percent: 16, tone: 'blue' },
  { label: 'Tagihan', amount: 'Rp 1.880.000', percent: 21, tone: 'orange' },
  { label: 'Belanja', amount: 'Rp 1.260.000', percent: 14, tone: 'purple' },
  { label: 'Lainnya', amount: 'Rp 2.020.000', percent: 24, tone: 'gray' },
];

export const recentTransactions: DashboardTransaction[] = [
  { id: 'tx-001', title: 'Gaji', note: 'Gaji Juni', wallet: 'Bank BCA', amountMinor: 12_500_000, type: 'income', date: '14 Jun 2026' },
  { id: 'tx-002', title: 'Makan & Minum', note: 'Belanja Bulanan', wallet: 'Dompet Tunai', amountMinor: 350_000, type: 'expense', date: '13 Jun 2026' },
  { id: 'tx-003', title: 'Transportasi', note: 'Naik LRT', wallet: 'OVO', amountMinor: 40_000, type: 'expense', date: '13 Jun 2026' },
  { id: 'tx-004', title: 'Penghasilan Tambahan', note: 'Bayaran Freelance', wallet: 'Bank BCA', amountMinor: 1_700_000, type: 'income', date: '12 Jun 2026' },
];

export const forecastItems: ForecastItem[] = [
  { title: 'Proyeksi Saldo Akhir Bulan', value: 'Rp 72.900.000', note: 'Perkiraan bertambah Rp 4.450.000', tone: 'green' },
  { title: 'Risiko Anggaran', value: '2 kategori', note: 'Makanan dan transportasi mendekati 80%', tone: 'orange' },
  { title: 'Jatuh Tempo Terdekat', value: 'Rp 3.184.000', note: 'Cicilan dan langganan', tone: 'red' },
  { title: 'Aman Dibelanjakan', value: 'Rp 2.050.000', note: 'Sampai 30 Jun 2026', tone: 'blue' },
];

export const walletPortfolio = [
  { name: 'Bank BCA', value: 'Rp 42.800.000', percent: 62 },
  { name: 'Dompet Tunai', value: 'Rp 2.150.000', percent: 3 },
  { name: 'Dompet Digital', value: 'Rp 3.500.000', percent: 5 },
  { name: 'Investasi', value: 'Rp 20.000.000', percent: 30 },
];

export const widgetStates = [
  { title: 'Memuat', icon: '⏳', description: 'Kerangka kartu tampil sementara datamu sedang disiapkan.' },
  { title: 'Kosong', icon: '📭', description: 'Kamu diarahkan membuat dompet, kategori, atau transaksi pertama.' },
  { title: 'Gagal', icon: '⚠️', description: 'Tombol coba lagi tersedia tanpa mengubah tampilan halaman.' },
  { title: 'Berhasil', icon: '✅', description: 'Konfirmasi singkat muncul setelah aksi keuangan berhasil.' },
];
