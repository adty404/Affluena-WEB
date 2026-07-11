import { Link, NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { AppIcon, type AppIconName } from '../ui/AppIcon';
import { UserAvatar } from '../ui/UserAvatar';
import { useMe } from '../../hooks/useMe';
import { NAV, NAV_SECTIONS } from '../../lib/copy';

type NavItem = {
  to: string;
  icon: AppIconName;
  label: string;
  activeWhen?: (pathname: string) => boolean;
};

const startsWithSegment = (pathname: string, segment: string) => pathname === segment || pathname.startsWith(`${segment}/`);
const exactOrId = (pathname: string, root: string, extras: string[] = []) => pathname === root || extras.includes(pathname) || new RegExp(`^${root}/[^/]+(/edit|/pay|/sharing|/run|/history)?$`).test(pathname);
const isTransactionRoot = (p: string) => exactOrId(p, '/transactions', ['/transactions/new', '/transactions/transfer', '/transactions/adjustment', '/transactions/filter']) && !startsWithSegment(p, '/transactions/split');
const isBudgetRoot = (p: string) => exactOrId(p, '/budgets', ['/budgets/new']) && !startsWithSegment(p, '/budgets/alerts') && !startsWithSegment(p, '/budgets/report');
const isGoalsRoot = (p: string) => exactOrId(p, '/goals', ['/goals/new']) && !/\/goals\/[^/]+\/(contribute|members)$/.test(p);

const dashboardLinks: NavItem[] = [
  { to: '/dashboard', icon: 'dashboard', label: NAV.beranda, activeWhen: (p) => p === '/dashboard' },
  { to: '/dashboard/analytics', icon: 'analytics', label: NAV.analitik, activeWhen: (p) => startsWithSegment(p, '/dashboard/analytics') },
  { to: '/dashboard/forecast', icon: 'forecast', label: NAV.prakiraan, activeWhen: (p) => startsWithSegment(p, '/dashboard/forecast') },
];

const manageLinks: NavItem[] = [
  { to: '/wallets', icon: 'wallet', label: NAV.dompet, activeWhen: (p) => startsWithSegment(p, '/wallets') },
  { to: '/categories', icon: 'categories', label: NAV.kategori, activeWhen: (p) => startsWithSegment(p, '/categories') },
];

const transactionLinks: NavItem[] = [
  { to: '/transactions', icon: 'transactions', label: NAV.transaksi, activeWhen: isTransactionRoot },
  { to: '/quick-entry', icon: 'quick', label: NAV.catatCepat, activeWhen: (p) => startsWithSegment(p, '/quick-entry') },
];

const planningLinks: NavItem[] = [
  { to: '/budgets', icon: 'budget', label: NAV.anggaran, activeWhen: isBudgetRoot },
  { to: '/budgets/alerts', icon: 'budgetAlert', label: NAV.notifikasiAnggaran, activeWhen: (p) => startsWithSegment(p, '/budgets/alerts') },
  { to: '/budgets/report', icon: 'budgetReport', label: NAV.laporanAnggaran, activeWhen: (p) => startsWithSegment(p, '/budgets/report') },
  { to: '/installments', icon: 'installment', label: NAV.cicilan, activeWhen: (p) => startsWithSegment(p, '/installments') },
  { to: '/subscriptions', icon: 'subscription', label: NAV.langganan, activeWhen: (p) => startsWithSegment(p, '/subscriptions') },
  { to: '/recurring', icon: 'recurring', label: NAV.berulang, activeWhen: (p) => startsWithSegment(p, '/recurring') },
  { to: '/goals', icon: 'goal', label: NAV.targetTabungan, activeWhen: isGoalsRoot },
];


const insightsLinks: NavItem[] = [
  { to: '/insights', icon: 'analytics', label: NAV.wawasan, activeWhen: (p) => startsWithSegment(p, '/insights') },
  { to: '/calendar', icon: 'calendar', label: NAV.kalender, activeWhen: (p) => startsWithSegment(p, '/calendar') },
  { to: '/reports', icon: 'chart', label: NAV.laporan, activeWhen: (p) => startsWithSegment(p, '/reports') },
  { to: '/activities', icon: 'history', label: NAV.riwayatAktivitas, activeWhen: (p) => startsWithSegment(p, '/activities') },
  { to: '/alerts', icon: 'warning', label: NAV.pemberitahuan, activeWhen: (p) => startsWithSegment(p, '/alerts') },
  { to: '/system-logs', icon: 'list', label: NAV.logSistem, activeWhen: (p) => startsWithSegment(p, '/system-logs') },
];

const workspaceLinks: NavItem[] = [
  { to: '/settings', icon: 'settings', label: NAV.pengaturan, activeWhen: (p) => p === '/settings' || startsWithSegment(p, '/settings/profile') || startsWithSegment(p, '/settings/account') || startsWithSegment(p, '/settings/notifications') || startsWithSegment(p, '/settings/preferences') || startsWithSegment(p, '/settings/privacy') || startsWithSegment(p, '/settings/data') || startsWithSegment(p, '/settings/help') || startsWithSegment(p, '/settings/about') || startsWithSegment(p, '/settings/ui-audit') },
  { to: '/settings/security', icon: 'warning', label: NAV.keamanan, activeWhen: (p) => startsWithSegment(p, '/settings/security') || startsWithSegment(p, '/settings/sessions') },
  { to: '/app-menu', icon: 'more', label: NAV.aksesLengkap, activeWhen: (p) => p === '/app-menu' },
];

function LinkGroup({ links, onClose }: { links: NavItem[]; onClose: () => void }) {
  const location = useLocation();

  return (
    <nav className="side-nav">
      {links.map((link) => {
        const active = link.activeWhen?.(location.pathname) ?? location.pathname === link.to;
        return (
          <Link key={link.to} to={link.to} onClick={onClose} className={`nav-item ${active ? 'active' : ''}`} aria-current={active ? 'page' : undefined}>
            <span className="nav-icon"><AppIcon name={link.icon} /></span><span className="nav-text">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Section({ title, links, onClose }: { title: string; links: NavItem[]; onClose: () => void }) {
  return <section className="nav-section"><p className="nav-label">{title}</p><LinkGroup links={links} onClose={onClose} /></section>;
}

export function Sidebar({ onClose }: { onClose: () => void }) {
  const { data, isLoading } = useMe();
  const user = data?.user;
  const initials = user?.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <Logo to="/dashboard" />
        <Button size="icon" className="sidebar-toggle" onClick={onClose} aria-label="Tutup sidebar"><AppIcon name="close" /></Button>
      </div>

      <div className="sidebar-scroll" aria-label="Navigasi utama">
        <Section title={NAV_SECTIONS.beranda} links={dashboardLinks} onClose={onClose} />
        <Section title={NAV_SECTIONS.kelola} links={manageLinks} onClose={onClose} />
        <Section title={NAV_SECTIONS.transaksi} links={transactionLinks} onClose={onClose} />
        <Section title={NAV_SECTIONS.perencanaan} links={planningLinks} onClose={onClose} />
        <Section title={NAV_SECTIONS.wawasan} links={insightsLinks} onClose={onClose} />
        <Section title={NAV_SECTIONS.lainnya} links={workspaceLinks} onClose={onClose} />
      </div>

      <div className="sidebar-footer">
        <NavLink to="/settings/profile" onClick={onClose} className="sidebar-user sidebar-user-link">
          <UserAvatar src={user?.avatar_url} fallback={isLoading ? '…' : initials} />
          <div>
            <strong>{isLoading ? 'Memuat…' : (user?.email ?? 'Tamu')}</strong>
            <span>Pengguna Affluena</span>
          </div>
        </NavLink>
        <nav className="sidebar-quick-links" aria-label="Pintasan akun">
          <Link to="/settings/profile" onClick={onClose}>{NAV.profil}</Link>
          <Link to="/settings/help" onClick={onClose}>{NAV.bantuan}</Link>
          <Link to="/settings/about" onClick={onClose}>{NAV.tentang}</Link>
        </nav>
        <div className="sidebar-version" aria-label="Versi aplikasi">
          <span>Affluena Web</span>
          <strong>v1.0.0</strong>
        </div>
      </div>
    </aside>
  );
}
