import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { AppIcon } from '../components/ui/AppIcon';
import { Logo } from '../components/ui/Logo';
import { useAuth } from '../hooks/useAuth';

type LandingLayoutProps = {
  children: ReactNode;
};

export function LandingLayout({ children }: LandingLayoutProps) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const hasSession = isAuthenticated || isLoading;
  const loginTarget = hasSession ? '/dashboard' : '/login';
  const primaryTarget = hasSession ? '/dashboard' : '/register';
  const loginLabel = hasSession ? 'Beranda' : 'Masuk';
  const primaryLabel = hasSession ? 'Buka Beranda' : 'Mulai Gratis';

  return (
    <>
      <header className="header">
        <div className="container navbar">
          <Logo />
          <nav className="nav-links" aria-label="Navigasi utama">
            <a href="#features">Fitur</a>
            <a href="#modules">Solusi</a>
            <a href="#workflow">Alur</a>
            <a href="#pricing">Harga</a>
          </nav>
          <div className="nav-actions">
            <Button variant="ghost" className="desktop-only" to={loginTarget}>{loginLabel}</Button>
            <Button variant="primary" className="desktop-only" to={primaryTarget}>{primaryLabel}</Button>
            <Button size="icon" className="mobile-menu-button" onClick={() => setOpen((value) => !value)} aria-label="Buka menu"><AppIcon name="more" /></Button>
          </div>
        </div>
        <nav className={`mobile-drawer ${open ? 'show' : ''}`}>
          <a href="#features" onClick={() => setOpen(false)}>Fitur</a>
          <a href="#modules" onClick={() => setOpen(false)}>Solusi</a>
          <a href="#workflow" onClick={() => setOpen(false)}>Alur</a>
          <a href="#pricing" onClick={() => setOpen(false)}>Harga</a>
          <Link to={loginTarget}>{loginLabel}</Link>
          <Link to={primaryTarget}>{primaryLabel}</Link>
        </nav>
      </header>
      {children}
      <footer className="public-footer">
        <div className="container public-footer-grid">
          <div>
            <Logo />
            <p>Pusat kendali keuangan pribadi untuk dompet, transaksi, anggaran, utang-piutang, transaksi berulang, target tabungan, laporan, dan ekspor.</p>
          </div>
          <nav aria-label="Tautan produk">
            <a href="#features">Fitur</a>
            <a href="#modules">Solusi</a>
            <a href="#workflow">Alur</a>
            <a href="#pricing">Harga</a>
          </nav>
          <nav aria-label="Tautan akun">
            <Link to={loginTarget}>{loginLabel}</Link>
            <Link to={primaryTarget}>{primaryLabel}</Link>
          </nav>
        </div>
        <div className="container public-footer-bottom">
          <span>© 2026 Affluena</span>
          <span>Dibuat agar kamu fokus mengelola keuangan.</span>
        </div>
      </footer>
    </>
  );
}
