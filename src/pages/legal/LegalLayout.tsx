import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/ui/Logo';

/**
 * Bare public shell for legal/compliance documents (privacy policy, account
 * deletion). No auth, no AppLayout chrome — these URLs are submitted to the
 * Google Play Console and must be reachable logged-out.
 */
export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="legal-page">
      <header className="legal-head">
        <Link to="/" aria-label="Kembali ke beranda Affluena"><Logo /></Link>
      </header>
      <article className="legal-body">
        <h1>{title}</h1>
        <p className="legal-updated">Terakhir diperbarui: {updated}</p>
        {children}
      </article>
      <footer className="legal-foot">
        <span>© 2026 Affluena</span>
        <nav>
          <Link to="/privacy">Kebijakan Privasi</Link>
          <Link to="/hapus-akun">Hapus Akun</Link>
          <Link to="/login">Masuk</Link>
        </nav>
      </footer>
    </main>
  );
}
