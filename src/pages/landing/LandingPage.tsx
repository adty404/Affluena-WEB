import { LandingLayout } from '../../layouts/LandingLayout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { featureCards, modules } from '../../data/stage1Data';
import { AppIcon } from '../../components/ui/AppIcon';
import { useAuth } from '../../hooks/useAuth';

export function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const hasSession = isAuthenticated || isLoading;
  const primaryTarget = hasSession ? '/dashboard' : '/register';
  const secondaryTarget = hasSession ? '/dashboard' : '/login';
  const primaryLabel = hasSession ? 'Buka Beranda' : 'Buat akun gratis';
  const secondaryLabel = hasSession ? 'Lihat Beranda' : 'Masuk ke akun';

  return (
    <LandingLayout>
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <Badge>Pusat kendali keuangan pribadi</Badge>
              <h1>Kelola uang, anggaran, dan target finansial dalam satu tempat.</h1>
              <p>
                Affluena menyatukan dompet, transaksi, kategori, anggaran, utang-piutang, cicilan,
                langganan, transaksi berulang, bagi tagihan, target tabungan, ekspor CSV, dan riwayat
                aktivitas dalam pengalaman web yang bersih dan mudah dipakai.
              </p>
              <div className="hero-actions">
                <Button variant="primary" to={primaryTarget}>{primaryLabel}</Button>
                <Button to={secondaryTarget}>{secondaryLabel}</Button>
              </div>
              <div className="hero-proof">
                <span><i /> Multi dompet</span>
                <span><i /> Notifikasi anggaran</span>
                <span><i /> Transaksi berulang</span>
                <span><i /> Ekspor CSV</span>
              </div>
            </div>

            <div className="hero-visual" aria-label="Pratinjau Beranda">
              <div className="floating-pill one"><AppIcon name="trend" /> Arus kas +15,2%</div>
              <div className="floating-pill two"><AppIcon name="success" /> Anggaran Makan aman</div>
              <div className="dashboard-preview">
                <div className="preview-top">
                  <div className="preview-user">
                    <div className="avatar">AP</div>
                    <div>
                      <strong>Selamat pagi, Aditya</strong>
                      <span>Ringkasan keuangan · Jun 2026</span>
                    </div>
                  </div>
                  <div className="preview-controls">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                </div>

                <div className="balance-card">
                  <p>Total Saldo</p>
                  <h3>Rp 24.560.000</h3>
                  <Badge>+12,5% dari bulan lalu</Badge>
                  <div className="balance-row">
                    <div className="balance-mini"><span>Pemasukan</span><b>Rp 12.750.000</b></div>
                    <div className="balance-mini"><span>Pengeluaran</span><b>Rp 6.420.000</b></div>
                  </div>
                </div>

                <div className="preview-grid">
                  <div className="preview-card"><h4>Tren Arus Kas</h4><div className="chart-line" /></div>
                  <div className="preview-card"><h4>Pemakaian Anggaran</h4><div className="donut" /></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <Badge tone="blue">Nilai utama</Badge>
                <h2>Tampilan sederhana untuk fitur keuangan yang lengkap.</h2>
                <p>Setiap fitur dirancang dengan kartu, tabel, dan formulir yang konsisten agar pengalaman di desktop maupun ponsel tetap nyaman.</p>
              </div>
            </div>
            <div className="cards-grid">
              {featureCards.map((feature) => (
                <article className="feature-card" key={feature.title}>
                  <div className="icon-box"><AppIcon name={feature.icon} /></div>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="modules" className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <Badge tone="purple">Peta fitur</Badge>
                <h2>Disusun rapi mengikuti seluruh fitur utama Affluena.</h2>
                <p>Halaman ini menjadi pintu masuk ke seluruh fitur utama Affluena: Beranda, Dompet, Transaksi, Anggaran, Utang, Berulang, Target Tabungan, Laporan, Pemberitahuan, dan Pengaturan.</p>
              </div>
            </div>
            <div className="cards-grid three">
              {modules.map((module) => (
                <article className="module-card" key={module.title}>
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                  <div className="module-list">
                    {module.items.map((item) => <span key={item}>{item}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="section soft-section">
          <div className="container workflow-grid">
            <div>
              <Badge tone="orange">Alur pengguna</Badge>
              <h2>Mulai cepat untuk mengelola keuangan pribadi.</h2>
              <p>Daftar dulu, lanjut persiapan awal, lalu masuk ke Beranda — setiap langkah punya aksi yang jelas untuk mulai memakai Affluena.</p>
            </div>
            <div className="workflow-card">
              <span>Halaman depan</span><i />
              <span>Daftar</span><i />
              <span>Persiapan awal</span><i />
              <span>Beranda</span>
            </div>
          </div>
        </section>

        <section id="pricing" className="section cta-section">
          <div className="container cta-card">
            <Badge>Affluena siap dipakai</Badge>
            <h2>Semua fitur utama sudah tersedia dalam satu pengalaman web yang rapi.</h2>
            <p>Kelola dompet, transaksi, anggaran, utang, transaksi berulang, target tabungan, laporan, pemberitahuan, dan pengaturan akun tanpa berpindah aplikasi.</p>
            <div className="hero-actions center">
              <Button variant="primary" to={primaryTarget}>{hasSession ? 'Buka Beranda' : 'Mulai sekarang'}</Button>
              <Button to={secondaryTarget}>{hasSession ? 'Lihat Beranda' : 'Masuk ke akun'}</Button>
            </div>
          </div>
        </section>
      </main>
    </LandingLayout>
  );
}
