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
    <AppLayout title="Widget States" description="Loading, empty, error, dan success state untuk dashboard widgets.">
      <div className="grid stack-lg">
        <section className="app-hero-card">
          <div>
            <Badge tone="gray">● UI States</Badge>
            <h2>State pattern supaya dashboard tetap profesional saat data belum lengkap.</h2>
            <p>Halaman ini menjadi referensi reusable widget behavior: user bisa lihat detail state, action pemulihan, dan next action yang jelas.</p>
          </div>
          <div className="app-hero-actions">
            <Button variant="primary" onClick={() => showToast('Widget states refreshed successfully.')}><AppIcon name="success" /> Refresh States</Button>
            <Button to="/dashboard"><AppIcon name="back" /> Back Dashboard</Button>
          </div>
        </section>

        <section className="card-grid two widget-state-grid">
          {widgetStates.map((state) => (
            <Card as="article" className="widget-state-card" key={state.title}>
              <div className="widget-icon" aria-hidden="true">{state.icon}</div>
              <h3>{state.title}</h3>
              <p>{state.description}</p>
              <Button size="small" onClick={() => setSelectedState(state.title)}><AppIcon name="widgets" /> Open Preview</Button>
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
            title="No dashboard data yet"
            description="Create wallet and transaction data first. This keeps the dashboard helpful even when empty."
            action={<Button variant="primary" to="/wallets/new"><AppIcon name="wallet" /> Create Wallet</Button>}
          />
        </section>
      </div>

      <Modal open={Boolean(stateDetail)} title={stateDetail?.title ?? 'Widget State'} description="Detail state dan action yang akan dilihat user." onClose={() => setSelectedState(null)}>
        <div className="readiness-list">
          <div><span>State</span><strong>{stateDetail?.title}</strong></div>
          <div><span>Description</span><strong>{stateDetail?.description}</strong></div>
          <div><span>User action</span><strong>{stateDetail?.title === 'Error' ? 'Retry data fetch' : stateDetail?.title === 'Empty' ? 'Create first record' : 'Continue monitoring'}</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setSelectedState(null)}>Close</Button>
          <Button to={stateDetail?.title === 'Empty' ? '/wallets/new' : '/dashboard'} variant="primary" onClick={() => setSelectedState(null)}>
            <AppIcon name={stateDetail?.title === 'Empty' ? 'wallet' : 'dashboard'} /> Continue
          </Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
