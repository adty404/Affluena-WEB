import { useState, type ReactNode } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { BottomNav } from '../components/layout/BottomNav';

type AppLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AppLayout({ title, description, children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className={`app-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      <Sidebar onClose={() => setSidebarOpen(false)} />
      <section className="app-main">
        <Topbar title={title} description={description} onMenuClick={() => setSidebarOpen(true)} />
        <div className="app-content">{children}</div>
      </section>
      <BottomNav />
    </main>
  );
}
