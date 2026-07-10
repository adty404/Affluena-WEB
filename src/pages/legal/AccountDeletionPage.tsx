import { LegalLayout } from './LegalLayout';

/**
 * Public account-deletion instructions — the URL submitted in the Google Play
 * Console "account deletion" field (Play requires a web-reachable page even
 * though deletion itself is fully self-service in-app).
 */
export function AccountDeletionPage() {
  return (
    <LegalLayout title="Hapus Akun Affluena" updated="7 Juli 2026">
      <p>
        Kamu bisa menghapus akun Affluena beserta <strong>seluruh datanya secara permanen</strong>,
        langsung dari aplikasi, tanpa perlu menghubungi siapa pun.
      </p>

      <h2>Cara menghapus akun</h2>
      <ol>
        <li>Masuk ke akunmu di aplikasi Affluena (Android) atau di web.</li>
        <li>Buka <strong>Pengaturan → Data &amp; Siklus Akun</strong>.</li>
        <li>Pilih <strong>Hapus Akun</strong>, lalu konfirmasi dengan kata sandimu.</li>
      </ol>

      <h2>Yang terjadi setelahnya</h2>
      <ul>
        <li>Akun dan <strong>semua data</strong> — dompet, transaksi, anggaran, utang-piutang, cicilan, langganan, target tabungan, kategori, tag, dan notifikasi — <strong>dihapus permanen seketika</strong>.</li>
        <li>Semua sesi masuk dicabut dan koneksi Berbagi Dompet dihentikan dua arah.</li>
        <li>Tidak ada masa pemulihan: penghapusan <strong>tidak bisa dibatalkan</strong>. Ekspor dulu datamu (Pengaturan → Data → Buat Ekspor) bila masih diperlukan.</li>
        <li>Log akses teknis yang tersisa terhapus otomatis mengikuti masa retensi singkat.</li>
      </ul>

      <h2>Tidak bisa masuk ke akunmu?</h2>
      <p>
        Gunakan <strong>Lupa kata sandi</strong> di halaman masuk untuk memulihkan akses, lalu ikuti
        langkah di atas. Jika tetap terkendala, kirim permintaan penghapusan dari alamat email yang
        terdaftar ke <a href="mailto:kevandirga21@gmail.com">kevandirga21@gmail.com</a> dan kami akan
        memprosesnya setelah verifikasi kepemilikan email.
      </p>
    </LegalLayout>
  );
}
