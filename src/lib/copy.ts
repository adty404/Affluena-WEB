// src/lib/copy.ts — kamus istilah UI Affluena (Bahasa Indonesia).
//
// Semua copy yang dilihat pengguna WAJIB Bahasa Indonesia (konvensi workspace;
// mobile sudah sepenuhnya Indonesia). Istilah mobile adalah kanon — jangan
// menerjemahkan ulang dengan sinonim lain. Modul ini memegang label navigasi/
// seksi yang dipakai lintas permukaan (Sidebar, BottomNav, AppMenu, Settings);
// string lokal halaman tetap inline di halamannya.
//
// Istilah teknis yang memang identik/diharapkan tetap dipakai apa adanya:
// Transfer, Status, Edit, Endpoint, Email.
// Catatan: fitur Recurring memakai istilah "Berulang" (mengikuti mobile),
// bukan "Otomasi".

/** Label navigasi & seksi kanonik (identik dengan aplikasi mobile). */
export const NAV = {
  beranda: 'Beranda',
  analitik: 'Analitik',
  prakiraan: 'Prakiraan',
  dompet: 'Dompet',
  berbagiDompet: 'Berbagi Dompet',
  kategori: 'Kategori',
  tag: 'Tag',
  transaksi: 'Transaksi',
  catatCepat: 'Catat Cepat',
  bagiTagihan: 'Bagi Tagihan',
  anggaran: 'Anggaran',
  notifikasiAnggaran: 'Notifikasi Anggaran',
  laporanAnggaran: 'Laporan Anggaran',
  cicilan: 'Cicilan',
  langganan: 'Langganan',
  berulang: 'Berulang',
  targetTabungan: 'Target Tabungan',
  utang: 'Utang',
  pemantauUtang: 'Pemantau Utang',
  laporan: 'Laporan',
  wawasan: 'Wawasan',
  riwayatAktivitas: 'Riwayat Aktivitas',
  pemberitahuan: 'Pemberitahuan',
  logSistem: 'Log Sistem',
  pusatEkspor: 'Pusat Ekspor',
  pengaturan: 'Pengaturan',
  keamanan: 'Keamanan',
  sesi: 'Sesi',
  aksesLengkap: 'Akses Lengkap',
  keluar: 'Keluar',
  lainnya: 'Lainnya',
  tambah: 'Tambah',
  profil: 'Profil',
  akun: 'Akun',
  preferensi: 'Preferensi',
  privasi: 'Privasi',
  bantuan: 'Bantuan',
  tentang: 'Tentang',
} as const;

/** Judul seksi sidebar. */
export const NAV_SECTIONS = {
  beranda: 'Beranda',
  kelola: 'Kelola',
  transaksi: 'Transaksi',
  perencanaan: 'Perencanaan',
  wawasan: 'Wawasan',
  lainnya: 'Lainnya',
} as const;

/** Aksi umum yang dipakai lintas permukaan chrome aplikasi. */
export const ACTIONS = {
  simpan: 'Simpan',
  batal: 'Batal',
  kembali: 'Kembali',
  tutup: 'Tutup',
  lihat: 'Lihat',
  hapus: 'Hapus',
  buka: 'Buka',
  cari: 'Cari...',
  memuat: 'Memuat...',
} as const;
