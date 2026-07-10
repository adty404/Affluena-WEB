import { LegalLayout } from './LegalLayout';

/**
 * Public privacy policy — the URL submitted as the app's privacy policy in the
 * Google Play Console. Keep every claim here TRUTHFUL to what the app actually
 * does; update this page in the same PR as any behavior change it describes.
 */
export function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Kebijakan Privasi Affluena" updated="7 Juli 2026">
      <p>
        Affluena adalah aplikasi pencatat keuangan pribadi. Kebijakan ini menjelaskan data apa
        yang kami kumpulkan, untuk apa data itu dipakai, dan kendali apa yang kamu punya.
      </p>

      <h2>Data yang kami kumpulkan</h2>
      <ul>
        <li><strong>Data akun</strong> — alamat email, nama, dan kata sandi (disimpan sebagai hash bcrypt, tidak pernah dalam bentuk asli).</li>
        <li><strong>Data finansial yang kamu masukkan sendiri</strong> — dompet, transaksi, anggaran, utang-piutang, cicilan, langganan, target tabungan, kategori, dan catatanmu. Kami tidak menghubungkan ke rekening bank dan tidak menarik data dari pihak lain.</li>
        <li><strong>Data teknis</strong> — log akses dasar (endpoint, waktu, status) untuk keamanan dan pemecahan masalah, dengan retensi terbatas.</li>
      </ul>

      <h2>Untuk apa data dipakai</h2>
      <ul>
        <li>Menjalankan fitur aplikasi: pencatatan, ringkasan, laporan, pengingat jatuh tempo, dan ekspor CSV.</li>
        <li>Keamanan akun: autentikasi sesi dan pemberitahuan terkait akun.</li>
        <li>Kami <strong>tidak menjual</strong> datamu dan <strong>tidak menampilkan iklan</strong>.</li>
      </ul>

      <h2>Berbagi data</h2>
      <ul>
        <li>Data finansialmu hanya terlihat oleh akunmu sendiri.</li>
        <li>Fitur <strong>Berbagi Dompet</strong> bersifat opsional dan sepenuhnya atas kendalimu: kamu bisa mengundang maksimal 5 pemantau (hanya-lihat) dan mencabutnya kapan saja.</li>
        <li>Tidak ada pembagian data ke pihak ketiga untuk pemasaran.</li>
      </ul>

      <h2>Penyimpanan &amp; keamanan</h2>
      <ul>
        <li>Data disimpan di server kami dengan akses terbatas; kata sandi di-hash, sesi memakai token yang bisa dicabut, dan cadangan basis data rutin dibuat untuk mencegah kehilangan data.</li>
        <li>Setiap permintaan diisolasi per pengguna di sisi server.</li>
      </ul>

      <h2>Hak &amp; kendalimu</h2>
      <ul>
        <li><strong>Akses &amp; ekspor</strong> — unduh datamu sebagai CSV kapan saja lewat Pengaturan → Data.</li>
        <li><strong>Perbaikan</strong> — semua data bisa kamu ubah atau hapus satu per satu dari dalam aplikasi.</li>
        <li><strong>Hapus akun</strong> — hapus akun beserta seluruh datamu secara permanen lewat Pengaturan → Data → Hapus Akun, atau ikuti langkah di halaman <a href="/hapus-akun">Hapus Akun</a>. Penghapusan berlaku seketika dan tidak bisa dibatalkan.</li>
      </ul>

      <h2>Anak-anak</h2>
      <p>Affluena tidak ditujukan untuk anak di bawah 13 tahun dan tidak dengan sengaja mengumpulkan data mereka.</p>

      <h2>Perubahan kebijakan</h2>
      <p>Perubahan berarti pada kebijakan ini akan diumumkan lewat aplikasi. Tanggal "terakhir diperbarui" di atas selalu mencerminkan versi terbaru.</p>

      <h2>Kontak</h2>
      <p>Pertanyaan tentang privasi atau datamu: <a href="mailto:kevandirga21@gmail.com">kevandirga21@gmail.com</a>.</p>
    </LegalLayout>
  );
}
