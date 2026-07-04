import type { ReactNode } from 'react';
import { Logo } from '../components/ui/Logo';

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
  narrow?: boolean;
};

export function AuthLayout({ children, title, description, narrow }: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <aside className="auth-aside">
          <Logo />
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="auth-stat-grid">
            <div className="auth-stat"><strong>Multi-dompet</strong><span>Bank, e-wallet, dan tunai jadi satu</span></div>
            <div className="auth-stat"><strong>Aman</strong><span>Data finansialmu tetap pribadi</span></div>
          </div>
        </aside>
        <section className={`auth-card ${narrow ? 'narrow' : ''}`}>
          {children}
          <footer className="auth-legal">
            <span>© 2026 Affluena</span>
            <span>Data finansial tetap berada di akun pribadi kamu.</span>
          </footer>
        </section>
      </section>
    </main>
  );
}
