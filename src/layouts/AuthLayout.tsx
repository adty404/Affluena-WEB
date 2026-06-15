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
            <div className="auth-stat"><strong>24+</strong><span>Finance widgets</span></div>
            <div className="auth-stat"><strong>100%</strong><span>Responsive</span></div>
          </div>
        </aside>
        <section className={`auth-card ${narrow ? 'narrow' : ''}`}>
          {children}
        </section>
      </section>
    </main>
  );
}
