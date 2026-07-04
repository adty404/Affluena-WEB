import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { actorLabel, formatTimestamp, humanizeUserAgent, relativeTime } from '../../lib/auditLabels';
import { useSystemLog } from '../../hooks/useSystemLog';

const statusTone = (code: number) => code >= 500 ? 'red' : code >= 400 ? 'orange' : code >= 300 ? 'blue' : 'green';

export function SystemLogDetailPage() {
  const { id } = useParams();
  const { data: log, isLoading, isError, refetch } = useSystemLog(id ?? '');

  if (isLoading) {
    return (
      <AppLayout title="Detail Log Sistem" description="Detail lengkap satu catatan permintaan.">
        <div className="dashboard-page grid-stack">
          <div className="loading-state">Memuat log...</div>
        </div>
      </AppLayout>
    );
  }

  if (isError || !log) {
    return (
      <AppLayout title="Detail Log Sistem" description="Detail lengkap satu catatan permintaan.">
        <div className="dashboard-page grid-stack">
          <Card className="panel-card">
            <EmptyState icon={<AppIcon name="empty" />} title="Log tidak ditemukan" description="Catatan permintaan ini gagal dimuat atau sudah tidak tersedia." action={<Button variant="primary" onClick={() => refetch()}><AppIcon name="recurring" /> Coba lagi</Button>} />
          </Card>
        </div>
      </AppLayout>
    );
  }

  const hasPayload = log.request_payload || log.response_payload;

  return (
    <AppLayout title="Detail Log Sistem" description="Detail lengkap satu catatan permintaan.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge tone={statusTone(log.status_code)}>{log.method} · {log.status_code}</Badge>
            <h2>{log.path}</h2>
            <p>{formatTimestamp(log.created_at)} · {relativeTime(log.created_at)}</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/system-logs">Kembali</Button>
            <Button to="/activities" variant="primary"><AppIcon name="history" /> Riwayat Aktivitas</Button>
          </div>
        </section>
        <Card className="panel-card">
          <div className="metric-list compact-metrics">
            <div className="metric-cell"><span>Status</span><strong>{log.status_code}</strong><small>Status HTTP</small></div>
            <div className="metric-cell"><span>Latensi</span><strong>{log.latency_ms} ms</strong><small>Durasi permintaan</small></div>
            <div className="metric-cell"><span>Pengguna</span><strong>{actorLabel(log.user_id)}</strong><small>Aktor</small></div>
            <div className="metric-cell"><span>Alamat IP</span><strong>{log.client_ip || '—'}</strong><small>IP klien</small></div>
            <div className="metric-cell"><span>Klien</span><strong>{humanizeUserAgent(log.user_agent)}</strong><small>Peramban & perangkat</small></div>
            <div className="metric-cell"><span>Metode</span><strong>{log.method}</strong><small>Metode HTTP</small></div>
          </div>
        </Card>
        {hasPayload ? (
          <section className="dashboard-grid two-col">
            <Card className="panel-card">
              <div className="panel-head"><div><h3>Isi Permintaan</h3><p>Data yang dikirim bersama permintaan.</p></div></div>
              <pre className="code-block">{log.request_payload ? JSON.stringify(log.request_payload, null, 2) : 'Tidak ada isi permintaan'}</pre>
            </Card>
            <Card className="panel-card">
              <div className="panel-head"><div><h3>Isi Respons</h3><p>Data yang dikembalikan sebagai respons.</p></div></div>
              <pre className="code-block">{log.response_payload ? JSON.stringify(log.response_payload, null, 2) : 'Tidak ada isi respons'}</pre>
            </Card>
          </section>
        ) : null}
      </div>
    </AppLayout>
  );
}
