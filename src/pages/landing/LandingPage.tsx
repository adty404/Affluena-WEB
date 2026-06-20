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
  const primaryLabel = hasSession ? 'Buka dashboard' : 'Buat akun gratis';
  const secondaryLabel = hasSession ? 'Lihat dashboard' : 'Lihat demo app';

  return (
    <LandingLayout>
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <Badge>● Financial command center pribadi</Badge>
              <h1>Kelola uang, budget, dan target finansial dalam satu dashboard.</h1>
              <p>
                Affluena menyatukan wallet, transaksi, kategori, budget, hutang-piutang, cicilan,
                subscription, recurring transaction, split bill, goal, export CSV, dan aktivitas user
                dalam pengalaman web yang bersih dan mudah dipakai.
              </p>
              <div className="hero-actions">
                <Button variant="primary" to={primaryTarget}>{primaryLabel}</Button>
                <Button to={secondaryTarget}>{secondaryLabel}</Button>
              </div>
              <div className="hero-proof">
                <span><i /> Multi wallet</span>
                <span><i /> Budget alert</span>
                <span><i /> Recurring scheduler</span>
                <span><i /> CSV export</span>
              </div>
            </div>

            <div className="hero-visual" aria-label="Dashboard preview">
              <div className="floating-pill one">↗ Cashflow +15.2%</div>
              <div className="floating-pill two">✓ Budget Food aman</div>
              <div className="dashboard-preview">
                <div className="preview-top">
                  <div className="preview-user">
                    <div className="avatar">AP</div>
                    <div>
                      <strong>Good morning, Aditya</strong>
                      <span>Financial overview · Jun 2026</span>
                    </div>
                  </div>
                  <div className="preview-controls">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                </div>

                <div className="balance-card">
                  <p>Total Balance</p>
                  <h3>Rp 24.560.000</h3>
                  <Badge>+12.5% dari bulan lalu</Badge>
                  <div className="balance-row">
                    <div className="balance-mini"><span>Income</span><b>Rp 12.750.000</b></div>
                    <div className="balance-mini"><span>Expense</span><b>Rp 6.420.000</b></div>
                  </div>
                </div>

                <div className="preview-grid">
                  <div className="preview-card"><h4>Cashflow Trend</h4><div className="chart-line" /></div>
                  <div className="preview-card"><h4>Budget Usage</h4><div className="donut" /></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <Badge tone="blue">Core value</Badge>
                <h2>UI sederhana untuk fitur finansial yang cukup kompleks.</h2>
                <p>Setiap modul dirancang berbasis card, table, form, empty state, dan mobile navigation agar pengalaman desktop maupun mobile tetap konsisten.</p>
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
                <Badge tone="purple">Module map</Badge>
                <h2>Disusun mengikuti struktur backend Affluena.</h2>
                <p>Landing page ini menjadi pintu masuk ke seluruh modul utama Affluena: dashboard, wallet, transaksi, budget, debt, recurring, goals, reports, alerts, dan settings.</p>
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
              <Badge tone="orange">User flow</Badge>
              <h2>Onboarding cepat untuk mulai mengelola keuangan pribadi.</h2>
              <p>Register menuju onboarding, onboarding menuju dashboard, dan setiap langkah memiliki aksi yang jelas untuk mulai memakai Affluena.</p>
            </div>
            <div className="workflow-card">
              <span>Landing</span><i />
              <span>Register</span><i />
              <span>Onboarding</span><i />
              <span>Dashboard</span>
            </div>
          </div>
        </section>

        <section id="pricing" className="section cta-section">
          <div className="container cta-card">
            <Badge>Affluena siap dipakai</Badge>
            <h2>Semua modul utama sudah tersedia dalam satu pengalaman web yang rapi.</h2>
            <p>Kelola wallet, transaksi, budget, debt, recurring, goals, reports, alerts, dan pengaturan akun tanpa berpindah aplikasi.</p>
            <div className="hero-actions center">
              <Button variant="primary" to={primaryTarget}>{hasSession ? 'Buka dashboard' : 'Mulai sekarang'}</Button>
              <Button to={secondaryTarget}>{hasSession ? 'Lihat dashboard' : 'Masuk demo'}</Button>
            </div>
          </div>
        </section>
      </main>
    </LandingLayout>
  );
}
