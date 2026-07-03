import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { BottomNav } from '../components/layout/BottomNav';
import { AppIcon } from '../components/ui/AppIcon';

type AppLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AppLayout({ title, description, children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const hideMobileFab = ['/transactions/new', '/transactions/transfer', '/transactions/adjustment', '/transactions/split'].includes(pathname);

  return (
    <main className={`app-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      <Sidebar onClose={() => setSidebarOpen(false)} />
      <section className="app-main">
        <Topbar title={title} description={description} onMenuClick={() => setSidebarOpen(true)} />
        <div className="app-content">{children}</div>
      </section>
      <BottomNav />
      {hideMobileFab ? null : (
        <Link to="/transactions/new" className="mobile-fab" aria-label="Tambah transaksi">
          <AppIcon name="add" />
        </Link>
      )}
    </main>
  );
}
