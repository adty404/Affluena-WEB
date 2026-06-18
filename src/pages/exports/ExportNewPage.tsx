import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input, Select } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { useToast } from '../../components/ui/Toast';
import { useExportCSV } from '../../hooks/useExports';
import type { ApiError } from '../../api/types';

export function ExportNewPage() {
  const [created, setCreated] = useState(false);
  const { showToast } = useToast();
  const exportMut = useExportCSV();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fromDate = formData.get('from') as string;
    const toDate = formData.get('to') as string;

    let from: string | undefined;
    let to: string | undefined;

    if (fromDate) {
      from = new Date(fromDate).toISOString();
    }
    if (toDate) {
      const toDateObj = new Date(toDate);
      toDateObj.setHours(23, 59, 59, 999);
      to = toDateObj.toISOString();
    }

    try {
      const blob = await exportMut.mutateAsync({ from, to });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      setCreated(true);
      showToast('Export berhasil diunduh.');
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal melakukan export.');
    }
  }

  return (
    <AppLayout title="Create Export" description="Generate CSV/XLSX data export with clear module and period filters.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><Badge>● New Export</Badge><h2>Pilih modul, periode, format, lalu generate file export.</h2><p>Form ini siap disambungkan ke endpoint export/csv saat backend aktif.</p></div><div className="app-hero-actions"><Button to="/exports">Back</Button><Button to="/exports/export-cashflow-jun" variant="primary"><AppIcon name="download" /> Open Latest</Button></div></section>
        <section className="dashboard-grid two-col form-dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Export Configuration</h3><p>Semua field diberi label dan helper agar jelas di desktop maupun mobile.</p></div></div>
            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-two"><label className="field"><span>Module</span><Select defaultValue="Transactions"><option>Transactions</option><option>Reports</option><option>Budgets</option><option>Debts</option><option>Goals</option></Select></label><label className="field"><span>Format</span><Select defaultValue="CSV"><option>CSV</option><option>XLSX</option></Select></label></div>
              <div className="form-two"><label className="field"><span>Start date</span><Input type="date" name="from" defaultValue="2026-06-01" /></label><label className="field"><span>End date</span><Input type="date" name="to" defaultValue="2026-06-30" /></label></div>
              <div className="form-two"><label className="field"><span>Wallet filter</span><Select defaultValue="All wallets"><option>All wallets</option><option>Bank BCA</option><option>Cash Wallet</option><option>OVO</option></Select></label><label className="field"><span>Category filter</span><Select defaultValue="All categories"><option>All categories</option><option>Food & Drink</option><option>Transportation</option><option>Shopping</option></Select></label></div>
              <label className="field"><span>Export name</span><Input defaultValue="Transactions June 2026" /></label>
              <div className="form-actions"><Button to="/exports">Cancel</Button><Button type="submit" variant="primary" disabled={exportMut.isPending}><AppIcon name="export" /> {exportMut.isPending ? 'Generating...' : 'Generate Export'}</Button></div>
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
