import type { FAQItem } from '../types/settings';

export const faqItems: FAQItem[] = [
  { id: 'faq-balance', question: 'Kenapa saldo dompet berubah otomatis?', answer: 'Pemasukan menambah saldo dompet yang dipilih, pengeluaran menguranginya, transfer memindahkan saldo antar dompet, dan penyesuaian mengubah saldo secara manual dengan catatan yang bisa kamu telusuri.' },
  { id: 'faq-budget', question: 'Bagaimana notifikasi anggaran dihitung?', answer: 'Pemakaian anggaran dihitung dari transaksi pengeluaran per kategori dan periode. Notifikasi muncul saat pemakaian menyentuh ambang peringatan atau melewati batas yang kamu atur.' },
  { id: 'faq-recurring', question: 'Apa yang terjadi saat transaksi berulang dijalankan?', answer: 'Transaksi berulang membuat transaksi baru sesuai dompet, kategori, jumlah, jadwal, dan tag yang kamu atur. Setiap eksekusi tercatat di riwayat.' },
  { id: 'faq-export', question: 'Bisakah data keuangan pribadi diekspor?', answer: 'Bisa. Pusat Ekspor dapat membuat file CSV untuk transaksi, dompet, anggaran, utang, target tabungan, aktivitas, pemberitahuan, dan log sistem.' },
];
