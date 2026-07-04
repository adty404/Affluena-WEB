import { useMemo, useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { widgetStates } from '../../data/mockDashboard';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';

export function WidgetStatesPage() {
  const { showToast } = useToast();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const stateDetail = useMemo(() => widgetStates.find((item) => item.title === selectedState), [selectedState]);

  return (
    <AppLayout title="Tampilan Widget" description="Pratinjau tampilan widget saat memuat, kosong, gagal, atau berhasil.">
      <div className="grid stack-lg">
        <section className="app-hero-card">
          <div>
            <Badge tone="gray">Tampilan Widget</Badge>
            <h2>Beranda tetap rapi dan informatif meski data belum lengkap.</h2>
            <p>Lihat bagaimana setiap widget tampil saat memuat, kosong, gagal, atau berhasil.</p>
          </div>
          <div className="app-hero-actions">
            <Button variant="primary" onClick={() => showToast('Tampilan widget berhasil dimuat ulang.')}><AppIcon name="success" /> Muat Ulang</Button>
            <Button to="/dashboard"><AppIcon name="back" /> Kembali ke Beranda</Button>
          </div>
        </section>

        <section className="card-grid two widget-state-grid">
          {widgetStates.map((state) => (
            <Card as="article" className="widget-state-card" key={state.title}>
              <div className="widget-icon" aria-hidden="true">{state.icon}</div>
              <h3>{state.title}</h3>
              <p>{state.description}</p>
              <Button size="small" onClick={() => setSelectedState(state.title)}><AppIcon name="widgets" /> Lihat Pratinjau</Button>
            </Card>
          ))}
        </section>

        <section className="dashboard-grid">
          <Card className="dashboard-panel skeleton-panel">
            <div className="skeleton line wide" />
            <div className="skeleton line" />
            <div className="skeleton block" />
            <div className="skeleton-row"><span /><span /><span /></div>
          </Card>

          <EmptyState
            icon="📊"
            title="Belum ada data beranda"
            description="Buat dompet dan transaksi pertamamu dulu supaya berandamu mulai terisi."
            action={<Button variant="primary" to="/wallets/new"><AppIcon name="wallet" /> Buat Dompet</Button>}
          />
        </section>
      </div>

      <Modal open={Boolean(stateDetail)} title={stateDetail?.title ?? 'Tampilan Widget'} description="Detail tampilan dan aksi lanjutan yang bisa kamu lakukan." onClose={() => setSelectedState(null)}>
        <div className="readiness-list">
          <div><span>Kondisi</span><strong>{stateDetail?.title}</strong></div>
          <div><span>Deskripsi</span><strong>{stateDetail?.description}</strong></div>
          <div><span>Aksi lanjutan</span><strong>{stateDetail?.title === 'Gagal' ? 'Coba muat ulang' : stateDetail?.title === 'Kosong' ? 'Buat data pertama' : 'Lanjut memantau'}</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setSelectedState(null)}>Tutup</Button>
          <Button to={stateDetail?.title === 'Kosong' ? '/wallets/new' : '/dashboard'} variant="primary" onClick={() => setSelectedState(null)}>
            <AppIcon name={stateDetail?.title === 'Kosong' ? 'wallet' : 'dashboard'} /> Lanjut
          </Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
