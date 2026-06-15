import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input, Select } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';

export function ExportNewPage() {
  const [created, setCreated] = useState(false);

  return (
    <AppLayout title="Create Export" description="Generate CSV/XLSX data export with clear module and period filters.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><Badge>● New Export</Badge><h2>Pilih modul, periode, format, lalu generate file export.</h2><p>Form ini siap disambungkan ke endpoint export/csv saat backend aktif.</p></div><div className="app-hero-actions"><Button to="/exports">Back</Button><Button to="/exports/export-cashflow-jun" variant="primary"><AppIcon name="download" /> Open Latest</Button></div></section>
        <section className="dashboard-grid two-col form-dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Export Configuration</h3><p>Semua field diberi label dan helper agar jelas di desktop maupun mobile.</p></div></div>
            <form className="form-grid" onSubmit={(event) => { event.preventDefault(); setCreated(true); }}>
              <div className="form-two"><label className="field"><span>Module</span><Select defaultValue="Transactions"><option>Transactions</option><option>Reports</option><option>Budgets</option><option>Debts</option><option>Goals</option></Select></label><label className="field"><span>Format</span><Select defaultValue="CSV"><option>CSV</option><option>XLSX</option></Select></label></div>
              <div className="form-two"><label className="field"><span>Start date</span><Input type="date" defaultValue="2026-06-01" /></label><label className="field"><span>End date</span><Input type="date" defaultValue="2026-06-30" /></label></div>
              <div className="form-two"><label className="field"><span>Wallet filter</span><Select defaultValue="All wallets"><option>All wallets</option><option>Bank BCA</option><option>Cash Wallet</option><option>OVO</option></Select></label><label className="field"><span>Category filter</span><Select defaultValue="All categories"><option>All categories</option><option>Food & Drink</option><option>Transportation</option><option>Shopping</option></Select></label></div>
              <label className="field"><span>Export name</span><Input defaultValue="Transactions June 2026" /></label>
              <div className="form-actions"><Button to="/exports">Cancel</Button><Button type="submit" variant="primary"><AppIcon name="export" /> Generate Export</Button></div>
            </form>
          </Card>
          <Card className="panel-card export-result-card">
            <div className="mini-icon safe"><AppIcon name={created ? 'success' : 'export'} /></div>
            <h3>{created ? 'Export generated' : 'Export preview'}</h3>
            <p>{created ? 'File sudah masuk export history dan siap dibuka dari detail export.' : 'Konfigurasi export akan menghasilkan file dengan filter yang dipilih.'}</p>
            <div className="metric-list compact-metrics">
              <div className="metric-cell"><span>Rows</span><strong>{created ? '842' : 'Estimated 800+'}</strong><small>Based on current filters</small></div>
              <div className="metric-cell"><span>Format</span><strong>CSV</strong><small>Compatible with spreadsheet tools</small></div>
            </div>
            <div className="inline-actions"><Button to="/exports/export-transactions-q2" variant={created ? 'primary' : 'default'}>Open Result</Button><Button to="/exports">History</Button></div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
