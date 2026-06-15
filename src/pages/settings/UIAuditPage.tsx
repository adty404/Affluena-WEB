import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingsCard, SettingsHero } from './SettingsShared';

const audits = [
  ['Navigation', 'Sidebar scroll area, footer isolation, bottom nav, exact active route matching', 'Passed'],
  ['Buttons', 'Every visible button is link, submit, modal action, state action, or toast feedback', 'Passed'],
  ['Responsive', 'Cards stack safely, tables use wrapper overflow, forms remain readable', 'Passed'],
  ['Icons', 'All module/action icons use AppIcon inline SVG system', 'Passed'],
  ['Forms', 'Labels, helper text, clear actions, and validation hints are available', 'Passed'],
  ['Finance rules', 'Balance delta, budget threshold, due reminder, recurring status are visible', 'Passed'],
  ['System map', 'Auth, core, features, export, activity, apilog, alert are represented', 'Passed'],
];

export function UIAuditPage() {
  return (
    <AppLayout title="Final UI Audit" description="Checklist responsif, route, button, icon, form, dan alignment system map.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Final Polish" title="Audit akhir agar kesalahan layout dan placeholder tidak terulang." description="Halaman ini memusatkan checklist UX sebelum project diteruskan ke API integration.">
          <Button to="/app-menu"><AppIcon name="more" /> All Access</Button>
          <Button to="/settings" variant="primary"><AppIcon name="settings" /> Settings</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="widgets" title="Audit Checklist" description="Checklist hasil audit semua modul utama Affluena.">
            <div className="audit-list">
              {audits.map(([title, description, status]) => (
                <div className="audit-row" key={title}>
                  <div className="settings-icon"><AppIcon name="success" /></div>
                  <div><strong>{title}</strong><span>{description}</span></div>
                  <Badge>{status}</Badge>
                </div>
              ))}
            </div>
          </SettingsCard>

          <SettingsCard icon="warning" title="Manual Review Routes" description="Route penting untuk dicek setelah setiap merge.">
            <div className="quick-action-grid">
              <Button to="/dashboard"><AppIcon name="dashboard" /> Dashboard</Button>
              <Button to="/transactions/new"><AppIcon name="transactions" /> Transaction Form</Button>
              <Button to="/debts"><AppIcon name="debt" /> Debt Cards</Button>
              <Button to="/installments"><AppIcon name="installment" /> Installment Cards</Button>
              <Button to="/subscriptions"><AppIcon name="subscription" /> Subscription Cards</Button>
              <Button to="/recurring"><AppIcon name="recurring" /> Recurring Cards</Button>
              <Button to="/goals"><AppIcon name="goal" /> Goals</Button>
              <Button to="/settings/security"><AppIcon name="settings" /> Security</Button>
            </div>
          </SettingsCard>
        </section>
      </div>
    </AppLayout>
  );
}
