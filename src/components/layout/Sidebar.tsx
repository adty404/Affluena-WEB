import { Link, NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { AppIcon, type AppIconName } from '../ui/AppIcon';

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
const isDebtRoot = (p: string) => startsWithSegment(p, '/debts') || p === '/tracker';
const isGoalsRoot = (p: string) => exactOrId(p, '/goals', ['/goals/new']) && !/\/goals\/[^/]+\/(contribute|members)$/.test(p);

const dashboardLinks: NavItem[] = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard', activeWhen: (p) => p === '/dashboard' },
  { to: '/dashboard/analytics', icon: 'analytics', label: 'Analytics', activeWhen: (p) => startsWithSegment(p, '/dashboard/analytics') },
  { to: '/dashboard/forecast', icon: 'forecast', label: 'Forecast', activeWhen: (p) => startsWithSegment(p, '/dashboard/forecast') },
];

const manageLinks: NavItem[] = [
  { to: '/wallets', icon: 'wallet', label: 'Wallets', activeWhen: (p) => startsWithSegment(p, '/wallets') },
  { to: '/categories', icon: 'categories', label: 'Categories', activeWhen: (p) => startsWithSegment(p, '/categories') },
  { to: '/tags', icon: 'tags', label: 'Tags', activeWhen: (p) => startsWithSegment(p, '/tags') },
];

const transactionLinks: NavItem[] = [
  { to: '/transactions', icon: 'transactions', label: 'Transactions', activeWhen: isTransactionRoot },
  { to: '/transactions/split', icon: 'split', label: 'Split Bill', activeWhen: (p) => startsWithSegment(p, '/transactions/split') },
  { to: '/quick-entry', icon: 'quick', label: 'Quick Entry', activeWhen: (p) => startsWithSegment(p, '/quick-entry') },
];

const planningLinks: NavItem[] = [
  { to: '/budgets', icon: 'budget', label: 'Budgets', activeWhen: isBudgetRoot },
  { to: '/budgets/alerts', icon: 'budgetAlert', label: 'Budget Alerts', activeWhen: (p) => startsWithSegment(p, '/budgets/alerts') },
  { to: '/budgets/report', icon: 'budgetReport', label: 'Budget Report', activeWhen: (p) => startsWithSegment(p, '/budgets/report') },
  { to: '/debts', icon: 'debt', label: 'Debt & Tracker', activeWhen: isDebtRoot },
  { to: '/installments', icon: 'installment', label: 'Installments', activeWhen: (p) => startsWithSegment(p, '/installments') },
  { to: '/subscriptions', icon: 'subscription', label: 'Subscriptions', activeWhen: (p) => startsWithSegment(p, '/subscriptions') },
  { to: '/recurring', icon: 'recurring', label: 'Recurring', activeWhen: (p) => startsWithSegment(p, '/recurring') },
  { to: '/goals', icon: 'goal', label: 'Goals', activeWhen: isGoalsRoot },
];


const insightsLinks: NavItem[] = [
  { to: '/reports', icon: 'chart', label: 'Reports', activeWhen: (p) => startsWithSegment(p, '/reports') },
  { to: '/exports', icon: 'export', label: 'Exports', activeWhen: (p) => startsWithSegment(p, '/exports') },
  { to: '/activities', icon: 'history', label: 'Activity Log', activeWhen: (p) => startsWithSegment(p, '/activities') },
  { to: '/alerts', icon: 'warning', label: 'Alerts', activeWhen: (p) => startsWithSegment(p, '/alerts') },
  { to: '/system-logs', icon: 'list', label: 'System Logs', activeWhen: (p) => startsWithSegment(p, '/system-logs') },
];

const workspaceLinks: NavItem[] = [
  { to: '/settings', icon: 'settings', label: 'Settings', activeWhen: (p) => p === '/settings' || startsWithSegment(p, '/settings/profile') || startsWithSegment(p, '/settings/account') || startsWithSegment(p, '/settings/notifications') || startsWithSegment(p, '/settings/preferences') || startsWithSegment(p, '/settings/privacy') || startsWithSegment(p, '/settings/data') || startsWithSegment(p, '/settings/help') || startsWithSegment(p, '/settings/about') || startsWithSegment(p, '/settings/ui-audit') },
  { to: '/settings/security', icon: 'warning', label: 'Security', activeWhen: (p) => startsWithSegment(p, '/settings/security') || startsWithSegment(p, '/settings/sessions') },
  { to: '/app-menu', icon: 'more', label: 'All Access', activeWhen: (p) => p === '/app-menu' },
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
  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <Logo to="/dashboard" />
        <Button size="icon" className="sidebar-toggle" onClick={onClose} aria-label="Close sidebar"><AppIcon name="close" /></Button>
      </div>

      <div className="sidebar-scroll" aria-label="Primary navigation">
        <Section title="Dashboard" links={dashboardLinks} onClose={onClose} />
        <Section title="Manage" links={manageLinks} onClose={onClose} />
        <Section title="Transactions" links={transactionLinks} onClose={onClose} />
        <Section title="Planning" links={planningLinks} onClose={onClose} />
        <Section title="Insights" links={insightsLinks} onClose={onClose} />
        <Section title="Workspace" links={workspaceLinks} onClose={onClose} />
      </div>

      <div className="sidebar-footer">
        <NavLink to="/settings/profile" onClick={onClose} className="sidebar-user sidebar-user-link">
          <div className="avatar">AP</div>
          <div>
            <strong>Aditya Prasetyo</strong>
            <span>Personal Finance Pro</span>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}
