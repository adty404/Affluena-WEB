import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AppIcon } from '../../components/ui/AppIcon';
import { useAlert } from '../../hooks/useAlert';
import { severityIcon, severityLabel, severityTone } from '../../components/reports/ReportCards';
import { formatTimestamp, relativeTime } from '../../lib/auditLabels';

export function AlertDetailPage() {
  const { id } = useParams();
  const { data: alert, isLoading, isError } = useAlert(id ?? '');

  if (isLoading) {
    return <AppLayout title="Detail Pemberitahuan" description="Detail pemberitahuan, tingkat, modul, dan aksi."><div className="dashboard-page grid-stack"><div className="empty-state"><p>Memuat pemberitahuan...</p></div></div></AppLayout>;
  }

  if (isError || !alert) {
    return <AppLayout title="Detail Pemberitahuan" description="Detail pemberitahuan, tingkat, modul, dan aksi."><div className="dashboard-page grid-stack"><div className="empty-state"><p>Pemberitahuan tidak ditemukan atau gagal dimuat.</p><Button to="/alerts">Kembali ke Pemberitahuan</Button></div></div></AppLayout>;
  }

  return <AppLayout title="Detail Pemberitahuan" description="Detail pemberitahuan, tingkat, modul, dan aksi."><div className="dashboard-page grid-stack"><section className="app-hero-card dashboard-hero"><div><Badge>● {alert.module}</Badge><h2>{alert.title}</h2><p>{alert.description}</p></div><div className="app-hero-actions"><Button to="/alerts">Kembali</Button><Button to={alert.action_path} variant="primary"><AppIcon name={severityIcon(alert.severity)} /> Buka Modul</Button></div></section><Card className="panel-card"><div className="metric-list compact-metrics"><div className="metric-cell"><span>Tingkat</span><strong><Badge tone={severityTone(alert.severity)}>{severityLabel(alert.severity)}</Badge></strong><small>Tingkat pemberitahuan</small></div><div className="metric-cell"><span>Tipe</span><strong>{alert.type}</strong><small>Kategori pemberitahuan</small></div><div className="metric-cell"><span>Waktu</span><strong>{formatTimestamp(alert.created_at)}</strong><small>{relativeTime(alert.created_at)}</small></div><div className="metric-cell"><span>Modul</span><strong>{alert.module}</strong><small>Cakupan aksi</small></div></div></Card></div></AppLayout>;
}
