import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingsCard, SettingsHero } from './SettingsShared';
import { useRevokeSession, useSessions } from '../../hooks/useAuthSettings';
import { fromRFC3339 } from '../../lib/dates';
import type { ApiError } from '../../api/types';

export function SessionsPage() {
  const { showToast } = useToast();
  const { data, isLoading } = useSessions();
  const revokeMut = useRevokeSession();
  const sessions = data?.sessions ?? [];

  async function onRevoke(sessionId: string) {
    try {
      await revokeMut.mutateAsync(sessionId);
      showToast('Sesi dicabut.');
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal mencabut sesi.');
    }
  }

  return (
    <AppLayout title="Active Sessions" description="Kelola refresh token yang aktif.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Sessions" title="Sesi login aktif." description="Setiap sesi adalah refresh token yang diterbitkan backend. Cabut untuk logout paksa.">
          <Button to="/settings/security"><AppIcon name="warning" /> Security</Button>
        </SettingsHero>

        <section className="stat-grid">
          <div className="stat-card"><span>Total sesi</span><strong>{sessions.length}</strong><small>Termasuk yang sudah expired/revoked</small></div>
          <div className="stat-card"><span>Sesi aktif</span><strong>{sessions.filter((s) => !s.revoked_at).length}</strong><small>Belum di-revoke</small></div>
          <div className="stat-card"><span>Sesi di-revoke</span><strong>{sessions.filter((s) => s.revoked_at).length}</strong><small>Historis</small></div>
        </section>

        <section className="dashboard-grid">
          <SettingsCard icon="history" title="Refresh Tokens" description="Daftar refresh token diterbitkan untuk akun ini.">
            {isLoading ? (
              <div className="settings-list"><div><span>Memuat…</span></div></div>
            ) : sessions.length === 0 ? (
              <div className="settings-list"><div><span>Belum ada sesi.</span></div></div>
            ) : (
              <div className="settings-list">
                {sessions.map((session) => {
                  const isRevoked = Boolean(session.revoked_at);
                  const isExpired = new Date(session.expires_at).getTime() < Date.now();
                  return (
                    <div className="session-row" key={session.id}>
                      <div className="settings-icon"><AppIcon name={isRevoked || isExpired ? 'cancelled' : 'active'} /></div>
                      <div>
                        <strong>{session.user_agent || 'Unknown device'}</strong>
                        <span>
                          {session.ip_address || 'IP tidak tercatat'} · token: {session.token_suffix}… · expires {fromRFC3339(session.expires_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <Badge tone={isRevoked ? 'gray' : isExpired ? 'orange' : 'green'}>
                        {isRevoked ? 'Revoked' : isExpired ? 'Expired' : 'Active'}
                      </Badge>
                      {!isRevoked && !isExpired ? (
                        <Button size="small" onClick={() => onRevoke(session.id)} disabled={revokeMut.isPending}>
                          <AppIcon name="close" /> Revoke
                        </Button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </SettingsCard>

          <SettingsCard icon="list" title="Catatan" description="Behavior endpoint sesi.">
            <div className="settings-list">
              <div><span>Sumber data</span><strong>GET /api/v1/auth/sessions</strong></div>
              <div><span>Revoke satu</span><strong>DELETE /api/v1/auth/sessions/:id</strong></div>
              <div><span>Token suffix</span><strong>12 karakter pertama hash</strong></div>
              <div><span>User agent/IP</span><strong>Dicatat saat token diterbitkan</strong></div>
            </div>
          </SettingsCard>
        </section>
      </div>
    </AppLayout>
  );
}
