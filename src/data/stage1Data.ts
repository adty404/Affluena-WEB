import type { AppWidget, ModuleGroup } from '../types/finance';
import type { AppIconName } from '../components/ui/AppIcon';

export const featureCards: { icon: AppIconName; title: string; body: string }[] = [
  { icon: 'wallet', title: 'Dompet & Saldo', body: 'Kelola dompet tunai, bank, e-wallet, investasi, dan tabungan target dengan saldo yang jelas.' },
  { icon: 'analytics', title: 'Analitik Keuangan', body: 'Ringkasan, tren arus kas, distribusi pengeluaran, prakiraan, dan transaksi terbaru.' },
  { icon: 'budgetAlert', title: 'Notifikasi Anggaran', body: 'Peringatan saat anggaran mencapai 80% atau melewati 100% dari batas bulanan.' },
  { icon: 'quick', title: 'Catat Cepat', body: 'Template transaksi instan untuk pengeluaran rutin seperti makan siang atau transportasi.' },
  { icon: 'split', title: 'Bagi Tagihan & Utang', body: 'Buat satu pengeluaran sekaligus piutang otomatis untuk teman atau keluarga.' },
  { icon: 'goal', title: 'Target Tabungan', body: 'Buat target tabungan kolaboratif dengan undangan anggota dan progres yang mudah dipantau.' },
];

export const modules: ModuleGroup[] = [
  {
    title: 'Mulai Tanpa Ribet',
    description: 'Daftar dengan email, personalisasi fokus keuangan kamu, dan langsung mulai mencatat.',
    items: ['Nyaman di semua perangkat', 'Tampilan rapi dan konsisten', 'Navigasi desktop + mobile'],
  },
  {
    title: 'Keuangan Harian',
    description: 'Beranda, dompet, kategori, tag, dan transaksi — alur harian untuk memantau uang kamu.',
    items: ['Ringkasan saldo sekilas', 'Riwayat transaksi lengkap', 'Formulir yang jelas'],
  },
  {
    title: 'Perencanaan & Rutinitas',
    description: 'Anggaran, utang-piutang, transaksi berulang, target tabungan, ekspor CSV, dan pemberitahuan.',
    items: ['Progres mudah dipantau', 'Status yang jelas', 'Riwayat aktivitas'],
  },
];

export const appWidgets: AppWidget[] = [
  { title: 'Total Saldo', value: 'Rp 24.560.000', note: '+12.5% dari bulan lalu', tone: 'green' },
  { title: 'Pemasukan', value: 'Rp 12.750.000', note: 'Juni 2026', tone: 'blue' },
  { title: 'Pengeluaran', value: 'Rp 6.420.000', note: '61% dari anggaran', tone: 'orange' },
  { title: 'Skor Kesehatan', value: '82/100', note: 'Keuangan terkendali baik', tone: 'purple' },
];

export const onboardingOptions = [
  { title: 'Keuangan Pribadi', body: 'Pantau dompet, anggaran, dan transaksi harian.' },
  { title: 'Keuangan Keluarga', body: 'Kelola dompet bersama, bagi tagihan, dan target tabungan keluarga.' },
  { title: 'Pengguna Mahir', body: 'Transaksi berulang, ekspor CSV, utang-piutang, dan analitik.' },
];
