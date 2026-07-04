import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingsCard, SettingsHero } from './SettingsShared';
import { useRevokeSession, useSessions } from '../../hooks/useAuthSettings';
import { fromRFC3339 } from '../../lib/dates';
import { humanizeUserAgent } from '../../lib/auditLabels';
import type { ApiError } from '../../api/types';

export function SessionsPage() {
  const { showToast } = useToast();
  const { data, isLoading } = useSessions();
  const revokeMut = useRevokeSession();
  const sessions = data?.sessions ?? [];
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);

  async function onRevoke(sessionId: string) {
    try {
      await revokeMut.mutateAsync(sessionId);
      showToast('Sesi dicabut.');
      setRevokeTarget(null);
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal mencabut sesi.');
    }
  }

  return (
    <AppLayout title="Sesi Aktif" description="Kelola sesi masuk yang aktif.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="Sesi" title="Sesi masuk aktif." description="Setiap sesi mewakili perangkat yang pernah masuk ke akun kamu. Cabut untuk keluar paksa.">
          <Button to="/settings/security"><AppIcon name="warning" /> Keamanan</Button>
        </SettingsHero>

        <section className="stat-grid">
          <div className="stat-card"><span>Total sesi</span><strong>{sessions.length}</strong><small>Termasuk yang sudah kedaluwarsa/dicabut</small></div>
          <div className="stat-card"><span>Sesi aktif</span><strong>{sessions.filter((s) => !s.revoked_at).length}</strong><small>Belum dicabut</small></div>
          <div className="stat-card"><span>Sesi dicabut</span><strong>{sessions.filter((s) => s.revoked_at).length}</strong><small>Riwayat</small></div>
        </section>

        <section className="dashboard-grid">
          <SettingsCard icon="history" title="Token Refresh" description="Daftar sesi masuk yang diterbitkan untuk akun ini.">
            {isLoading ? (
              <div className="loading-state">Memuat...</div>
            ) : sessions.length === 0 ? (
              <EmptyState icon={<AppIcon name="history" />} title="Belum ada sesi" description="Sesi masuk yang pernah dibuat akan muncul di sini." />
            ) : (
              <div className="settings-list">
                {sessions.map((session) => {
                  const isRevoked = Boolean(session.revoked_at);
                  const isExpired = new Date(session.expires_at).getTime() < Date.now();
                  return (
                    <div className="session-row" key={session.id}>
                      <div className="settings-icon"><AppIcon name={isRevoked || isExpired ? 'cancelled' : 'active'} /></div>
                      <div>
                        <strong>{humanizeUserAgent(session.user_agent)}</strong>
                        <span>
                          {session.ip_address || 'IP tidak tercatat'} · token: {session.token_suffix}… · kedaluwarsa {fromRFC3339(session.expires_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <Badge tone={isRevoked ? 'gray' : isExpired ? 'orange' : 'green'}>
                        {isRevoked ? 'Dicabut' : isExpired ? 'Kedaluwarsa' : 'Aktif'}
                      </Badge>
                      {!isRevoked && !isExpired ? (
                        <Button size="small" variant="danger" onClick={() => setRevokeTarget(session.id)} disabled={revokeMut.isPending}>
                          <AppIcon name="close" /> Cabut
                        </Button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </SettingsCard>

          <SettingsCard icon="list" title="Catatan" description="Cara kerja sesi masuk.">
            <div className="settings-list">
              <div><span>Cabut sesi</span><strong>Perangkat itu langsung keluar dari akun</strong></div>
              <div><span>Ubah kata sandi</span><strong>Semua sesi lain ikut dicabut</strong></div>
              <div><span>Masa berlaku</span><strong>Sesi kedaluwarsa otomatis setelah 30 hari</strong></div>
              <div><span>Perangkat & IP</span><strong>Dicatat saat kamu masuk</strong></div>
            </div>
          </SettingsCard>
        </section>
      </div>

      <Modal
        open={revokeTarget !== null}
        title="Cabut sesi ini?"
        description="Perangkat itu langsung keluar dari akun dan harus masuk lagi."
        onClose={() => (revokeMut.isPending ? null : setRevokeTarget(null))}
      >
        <div className="modal-actions">
          <Button onClick={() => setRevokeTarget(null)} disabled={revokeMut.isPending}>Batal</Button>
          <Button variant="danger" onClick={() => revokeTarget && onRevoke(revokeTarget)} disabled={revokeMut.isPending}>{revokeMut.isPending ? 'Mencabut…' : 'Cabut Sesi'}</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
