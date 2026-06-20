import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';

type LandingLayoutProps = {
  children: ReactNode;
};

export function LandingLayout({ children }: LandingLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="container navbar">
          <Logo />
          <nav className="nav-links" aria-label="Main navigation">
            <a href="#features">Fitur</a>
            <a href="#modules">Module</a>
            <a href="#workflow">Flow</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <div className="nav-actions">
            <Button variant="ghost" className="desktop-only" to="/login">Masuk</Button>
            <Button variant="primary" className="desktop-only" to="/register">Mulai Gratis</Button>
            <Button size="icon" className="mobile-menu-button" onClick={() => setOpen((value) => !value)} aria-label="Open menu">☰</Button>
          </div>
        </div>
        <nav className={`mobile-drawer ${open ? 'show' : ''}`}>
          <a href="#features" onClick={() => setOpen(false)}>Fitur</a>
          <a href="#modules" onClick={() => setOpen(false)}>Module</a>
          <a href="#workflow" onClick={() => setOpen(false)}>Flow</a>
          <a href="#pricing" onClick={() => setOpen(false)}>Pricing</a>
          <Link to="/login">Masuk</Link>
          <Link to="/register">Mulai Gratis</Link>
        </nav>
      </header>
      {children}
      <footer className="public-footer">
        <div className="container public-footer-grid">
          <div>
            <Logo />
            <p>Personal finance command center untuk wallet, transaksi, budget, debt, recurring, goals, reports, dan export.</p>
          </div>
          <nav aria-label="Footer product links">
            <a href="#features">Fitur</a>
            <a href="#modules">Module</a>
            <a href="#workflow">Flow</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <nav aria-label="Footer account links">
            <Link to="/login">Masuk</Link>
            <Link to="/register">Mulai Gratis</Link>
          </nav>
        </div>
        <div className="container public-footer-bottom">
          <span>© 2026 Affluena</span>
          <span>Built for focused financial workflows.</span>
        </div>
      </footer>
    </>
  );
}
