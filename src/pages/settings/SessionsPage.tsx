import { useMemo, useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { sessions, loginHistory } from '../../data/mockSettings';
import { SettingsCard, SettingsHero } from './SettingsShared';

export function SessionsPage() {
  const { showToast } = useToast();
  const [activeSessions, setActiveSessions] = useState(sessions);
  const [reviewOpen, setReviewOpen] = useState(false);
  const trustedCount = useMemo(() => activeSessions.filter((item) => item.status !== 'signed_out').length, [activeSessions]);

  const signOut = (id: string) => {
    setActiveSessions((items) => items.map((item) => item.id === id && item.status !== 'current' ? { ...item, status: 'signed_out' } : item));
    showToast('Selected device signed out.');
  };

  return (
    <AppLayout title="Active Sessions" description="Kelola perangkat aktif dan histori login.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Sessions" title="Pantau perangkat yang sedang mengakses akun Affluena." description="Current session dilindungi, device lain bisa dikeluarkan tanpa merusak data finance.">
          <Button to="/settings/security"><AppIcon name="warning" /> Security</Button>
          <Button variant="primary" onClick={() => { setActiveSessions((items) => items.map((item) => item.status === 'trusted' ? { ...item, status: 'signed_out' } : item)); showToast('All other trusted devices signed out.'); }}><AppIcon name="close" /> Sign Out Others</Button>
        </SettingsHero>

        <section className="stat-grid">
          <div className="stat-card"><span>Trusted sessions</span><strong>{trustedCount}</strong><small>Including current device</small></div>
          <div className="stat-card"><span>Blocked login</span><strong>1</strong><small>Last 7 days</small></div>
          <div className="stat-card"><span>2FA status</span><strong>On</strong><small>Login protected</small></div>
          <div className="stat-card"><span>Current device</span><strong>MacBook</strong><small>Chrome Jakarta</small></div>
        </section>

        <section className="dashboard-grid">
          <SettingsCard icon="history" title="Active Devices" description="Device yang bisa mengakses akun saat ini.">
            <div className="settings-list">
              {activeSessions.map((session) => (
                <div className="session-row" key={session.id}>
                  <div className="settings-icon"><AppIcon name={session.status === 'signed_out' ? 'cancelled' : 'active'} /></div>
                  <div><strong>{session.device}</strong><span>{session.browser} · {session.location} · {session.lastActive}</span></div>
                  <Badge tone={session.status === 'current' ? 'green' : session.status === 'signed_out' ? 'gray' : 'blue'}>{session.status === 'current' ? 'Current' : session.status === 'signed_out' ? 'Signed out' : 'Trusted'}</Badge>
                  <Button size="small" disabled={session.status === 'current' || session.status === 'signed_out'} onClick={() => signOut(session.id)}><AppIcon name="close" /> Sign out</Button>
                </div>
              ))}
            </div>
          </SettingsCard>

          <SettingsCard icon="list" title="Login History" description="Histori login terbaru dan status security review.">
            <div className="settings-timeline">
              {loginHistory.map((item) => (
                <div key={item.id}><Badge tone={item.status === 'blocked' ? 'red' : item.status === 'review' ? 'orange' : 'green'}>{item.status}</Badge><strong>{item.device}</strong><span>{item.location} · {item.time}</span></div>
              ))}
            </div>
            <div className="modal-actions left-actions"><Button onClick={() => setReviewOpen(true)}><AppIcon name="warning" /> Review blocked login</Button></div>
          </SettingsCard>
        </section>

        <Modal open={reviewOpen} title="Blocked Login Review" description="Detail login yang diblokir sistem keamanan." onClose={() => setReviewOpen(false)}>
          <div className="settings-list compact">
            <div><span>Device</span><strong>Unknown Linux · Firefox</strong></div>
            <div><span>Location</span><strong>Singapore</strong></div>
            <div><span>Reason</span><strong>New country and unknown device fingerprint</strong></div>
            <div><span>Action</span><strong>Blocked before session was issued</strong></div>
          </div>
          <div className="modal-actions"><Button onClick={() => setReviewOpen(false)}>Close</Button><Button to="/settings/security" variant="primary">Open Security</Button></div>
        </Modal>
      </div>
    </AppLayout>
  );
}
