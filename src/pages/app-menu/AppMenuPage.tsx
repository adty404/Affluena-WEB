import { AppLayout } from '../../layouts/AppLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AppIcon, type AppIconName } from '../../components/ui/AppIcon';

type MenuItem = readonly [string, string, AppIconName];

const menuGroups: { title: string; items: MenuItem[] }[] = [
  { title: 'Dashboard', items: [ ['/dashboard', 'Dashboard', 'dashboard'], ['/dashboard/analytics', 'Analytics', 'analytics'], ['/dashboard/forecast', 'Forecast', 'forecast'], ['/dashboard/widget-states', 'Widget States', 'widgets'] ] },
  { title: 'Master Data', items: [ ['/wallets', 'Wallets', 'wallet'], ['/sharing', 'Berbagi Dompet', 'profile'], ['/categories', 'Categories', 'categories'], ['/tags', 'Tags', 'tags'] ] },
  { title: 'Transactions', items: [ ['/transactions', 'Transactions', 'transactions'], ['/transactions/new', 'Add Transaction', 'add'], ['/transactions/split', 'Split Bill', 'split'], ['/quick-entry', 'Quick Entry', 'quick'] ] },
  { title: 'Budget', items: [ ['/budgets', 'Budgets', 'budget'], ['/budgets/new', 'Create Budget', 'budgetForm'], ['/budgets/alerts', 'Budget Alerts', 'budgetAlert'], ['/budgets/report', 'Budget Report', 'budgetReport'] ] },
  { title: 'Debt & Tracker', items: [ ['/tracker', 'Tracker Overview', 'tracker'], ['/debts', 'Debt List', 'debt'], ['/debts/new/payable', 'Add Payable', 'payable'], ['/debts/new/receivable', 'Add Receivable', 'receivable'], ['/installments', 'Installments', 'installment'], ['/subscriptions', 'Subscriptions', 'subscription'] ] },
  { title: 'Automation', items: [ ['/recurring', 'Recurring Rules', 'recurring'], ['/recurring/new', 'Add Recurring Rule', 'add'], ['/recurring/rec-salary/run', 'Manual Run', 'run'], ['/recurring/rec-salary/history', 'Run History', 'history'] ] },
  { title: 'Goals', items: [ ['/goals', 'Goals', 'goal'], ['/goals/new', 'Add Goal', 'add'], ['/goals/goal-emergency-fund/contribute', 'Contribute Goal', 'pay'], ['/goals/goal-vacation/members', 'Goal Members', 'profile'] ] },
  { title: 'Reports & Audit', items: [ ['/reports', 'Reports Overview', 'chart'], ['/reports/cashflow', 'Cashflow Report', 'analytics'], ['/reports/expenses', 'Expense Report', 'transactions'], ['/reports/income', 'Income Report', 'forecast'], ['/exports', 'Export Center', 'export'], ['/exports/new', 'Create Export', 'download'], ['/activities', 'Activity Log', 'history'], ['/alerts', 'Alert Center', 'warning'], ['/system-logs', 'System Logs', 'list'] ] },
  { title: 'Settings & Final Polish', items: [ ['/settings', 'Settings Center', 'settings'], ['/settings/profile', 'Profile', 'profile'], ['/settings/account', 'Account', 'settings'], ['/settings/security', 'Security', 'warning'], ['/settings/sessions', 'Sessions', 'history'], ['/settings/notifications', 'Notifications', 'budgetAlert'], ['/settings/preferences', 'Preferences', 'calendar'], ['/settings/privacy', 'Privacy', 'health'], ['/settings/data', 'Data Tools', 'download'], ['/settings/help', 'Help & FAQ', 'list'], ['/settings/about', 'About', 'success'], ['/settings/ui-audit', 'UI Audit', 'widgets'] ] },
];

export function AppMenuPage() {
  return (
    <AppLayout title="All Access" description="Akses cepat ke semua halaman dan flow utama Affluena.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge>● Navigation Hub</Badge>
            <h2>Semua akses utama tersedia dari satu halaman yang mobile-friendly.</h2>
            <p>Menu ini mengarah ke halaman nyata agar user selalu punya next action yang jelas.</p>
          </div>
          <div className="app-hero-actions"><Button to="/dashboard">Back to Dashboard</Button><Button to="/transactions/new" variant="primary"><AppIcon name="add" /> Quick Add</Button></div>
        </section>

        <section className="menu-grid">
          {menuGroups.map((group) => (
            <Card className="panel-card" key={group.title}>
              <div className="panel-head"><div><h3>{group.title}</h3><p>Shortcut halaman {group.title.toLowerCase()}.</p></div></div>
              <div className="quick-action-grid">
                {group.items.map(([to, label, icon]) => (
                  <Button key={to} to={to}><AppIcon name={icon} /> {label}</Button>
                ))}
              </div>
            </Card>
          ))}
        </section>
      </div>
    </AppLayout>
  );
}
