import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { actorLabel } from '../../lib/auditLabels';
import { NAV } from '../../lib/copy';
import type { SystemLog } from '../../types/reporting';
import { useSystemLogs } from '../../hooks/useSystemLogs';

const statusTone = (code: number) => code >= 500 ? 'red' : code >= 400 ? 'orange' : code >= 300 ? 'blue' : 'green';

export function SystemLogListPage() {
  const { data, isLoading, isError } = useSystemLogs();
  const systemLogs = data?.logs ?? [];

  return (
    <AppLayout title={NAV.logSistem} description="Catatan teknis permintaan aplikasi lengkap dengan status dan latensi.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><Badge>● Log Sistem</Badge><h2>Pantau permintaan penting untuk audit teknis.</h2><p>Setiap permintaan tercatat dengan metode, status, latensi, dan pengguna.</p></div><div className="app-hero-actions"><Button to="/activities">Riwayat Aktivitas</Button><Button to="/reports" variant="primary"><AppIcon name="chart" /> Laporan</Button></div></section>
        <Card className="panel-card">
          <div className="panel-head"><div><h3>Log Permintaan</h3><p>Log terbaru dari transaksi, utang, berulang, ekspor, dan pemberitahuan.</p></div></div>
          {isLoading ? (
            <div className="empty-state"><p>Memuat log...</p></div>
          ) : isError ? (
            <div className="empty-state"><p>Gagal memuat log. Coba muat ulang halaman.</p></div>
          ) : systemLogs.length === 0 ? (
            <div className="empty-state"><p>Belum ada log.</p></div>
          ) : (
            <DataTable<SystemLog>
              data={systemLogs}
              getRowKey={(log) => log.id}
              columns={[
                { key: 'endpoint', header: 'Endpoint', render: (log) => <div className="table-title"><span className="mini-icon neutral"><AppIcon name="list" /></span><strong>{log.path}</strong><small>{log.method}</small></div> },
                { key: 'method', header: 'Metode', render: (log) => <Badge tone="gray">{log.method}</Badge> },
                { key: 'status', header: 'Status', render: (log) => <Badge tone={statusTone(log.status_code)}>{log.status_code}</Badge> },
                { key: 'latency', header: 'Latensi', align: 'right', render: (log) => `${log.latency_ms} ms` },
                { key: 'user', header: 'Pengguna', render: (log) => actorLabel(log.user_id) },
                { key: 'action', header: 'Aksi', render: (log) => <Button to={`/system-logs/${log.id}`} size="small">Buka</Button> },
              ]}
            />
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
