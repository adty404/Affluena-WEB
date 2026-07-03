import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { useToast } from '../../components/ui/Toast';
import {
  useInvitePartner,
  usePartners,
  useRespondPartner,
  useRevokePartner,
} from '../../hooks/usePartners';
import { MAX_PARTNER_SHARES, type PartnerLink, type PartnerStatus } from '../../types/partner';
import type { ApiError } from '../../api/types';

const inviteSchema = z.object({
  email: z.string().email('Email tidak valid'),
});
type InviteValues = z.infer<typeof inviteSchema>;

const statusLabel: Record<PartnerStatus, string> = {
  joined: 'Terhubung',
  pending: 'Menunggu',
  rejected: 'Ditolak',
};

const statusTone: Record<PartnerStatus, 'green' | 'orange' | 'red'> = {
  joined: 'green',
  pending: 'orange',
  rejected: 'red',
};

function displayName(link: PartnerLink): string {
  return link.name || link.email;
}

export function SharingPage() {
  const { showToast } = useToast();
  const { data, isLoading, error } = usePartners();
  const inviteMut = useInvitePartner();
  const respondMut = useRespondPartner();
  const revokeMut = useRevokePartner();
  const [revokeTarget, setRevokeTarget] = useState<PartnerLink | null>(null);

  const links = data?.partners ?? [];
  const owned = links.filter((l) => l.direction === 'owned');
  const incoming = links.filter((l) => l.direction === 'incoming');
  const incomingPending = incoming.filter((l) => l.status === 'pending');
  const sharedWithMe = incoming.filter((l) => l.status === 'joined');
  const activeShareCount = owned.filter((l) => l.status === 'pending' || l.status === 'joined').length;
  const canInvite = activeShareCount < MAX_PARTNER_SHARES;

  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '' },
  });

  async function onInvite(values: InviteValues) {
    try {
      await inviteMut.mutateAsync({ email: values.email });
      showToast('Undangan terkirim.');
      form.reset();
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal mengirim undangan.');
    }
  }

  async function onRespond(link: PartnerLink, status: 'joined' | 'rejected') {
    try {
      await respondMut.mutateAsync({ id: link.id, payload: { status } });
      showToast(
        status === 'joined'
          ? `Sekarang kamu bisa melihat dompet ${displayName(link)}.`
          : 'Undangan ditolak.'
      );
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal merespons undangan.');
    }
  }

  async function onRevoke() {
    if (!revokeTarget) return;
    try {
      await revokeMut.mutateAsync(revokeTarget.id);
      showToast(
        revokeTarget.direction === 'owned'
          ? `${displayName(revokeTarget)} tidak bisa lagi melihat dompetmu.`
          : `Kamu berhenti melihat dompet ${displayName(revokeTarget)}.`
      );
      setRevokeTarget(null);
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal menghapus akses.');
    }
  }

  return (
    <AppLayout title="Berbagi Dompet" description="Undang pemantau untuk melihat semua riwayat dompetmu (hanya lihat).">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Berbagi Dompet</span>
            <h2>Bagikan riwayat semua dompetmu ke orang terpercaya.</h2>
            <p>
              Undang maksimal {MAX_PARTNER_SHARES} orang untuk melihat semua riwayat dompetmu (hanya lihat, termasuk
              dompet baru). Mereka tidak bisa mengubah apa pun, dan budget tetap privat.
            </p>
          </div>
          <div className="app-hero-actions">
            <Button to="/wallets"><AppIcon name="wallet" /> Wallets</Button>
            <Button to="/settings"><AppIcon name="settings" /> Settings</Button>
          </div>
        </section>

        {error ? (
          <Card className="panel-card">
            <EmptyState icon={<AppIcon name="empty" />} title="Gagal memuat data berbagi" description="Periksa koneksi lalu coba lagi." />
          </Card>
        ) : null}

        {incomingPending.length > 0 ? (
          <Card className="panel-card">
            <div className="panel-head">
              <div><h3>Undangan Masuk</h3><p>Orang yang ingin berbagi dompetnya denganmu.</p></div>
              <Badge tone="orange">{incomingPending.length} menunggu</Badge>
            </div>
            <div className="member-list">
              {incomingPending.map((link) => (
                <div className="member-row" key={link.id}>
                  <div className="avatar">{displayName(link).slice(0, 2).toUpperCase()}</div>
                  <div>
                    <strong>{displayName(link)}</strong>
                    <span>{link.email} · ingin berbagi dompetnya denganmu</span>
                  </div>
                  <div className="inline-actions">
                    <Button size="small" variant="primary" disabled={respondMut.isPending} onClick={() => onRespond(link, 'joined')}>
                      <AppIcon name="success" /> Terima
                    </Button>
                    <Button size="small" variant="danger" disabled={respondMut.isPending} onClick={() => onRespond(link, 'rejected')}>
                      <AppIcon name="close" /> Tolak
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head">
              <div>
                <h3>Pemantau Saya ({activeShareCount}/{MAX_PARTNER_SHARES})</h3>
                <p>Orang yang kamu undang untuk melihat semua dompetmu.</p>
              </div>
            </div>
            {isLoading ? (
              <div className="readiness-list"><div><span>Memuat</span><strong>…</strong></div></div>
            ) : owned.length === 0 ? (
              <div className="readiness-list"><div><span>Status</span><strong>Belum ada yang kamu undang. Tambahkan lewat email.</strong></div></div>
            ) : (
              <div className="member-list">
                {owned.map((link) => (
                  <div className="member-row" key={link.id}>
                    <div className="avatar">{displayName(link).slice(0, 2).toUpperCase()}</div>
                    <div>
                      <strong>{displayName(link)}</strong>
                      <span>{link.email} · hanya lihat</span>
                    </div>
                    <div className="inline-actions">
                      <Badge tone={statusTone[link.status]}>{statusLabel[link.status]}</Badge>
                      {link.status !== 'rejected' ? (
                        <Button size="small" variant="danger" disabled={revokeMut.isPending} onClick={() => setRevokeTarget(link)}>
                          <AppIcon name="delete" /> Hapus
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="panel-card">
            <div className="panel-head">
              <div><h3>Undang Pemantau</h3><p>Undang lewat email akun Affluena.</p></div>
            </div>
            {canInvite ? (
              <form className="form-stack" onSubmit={form.handleSubmit(onInvite)} noValidate>
                <label>
                  <span>Email</span>
                  <Input type="email" placeholder="email@contoh.com" {...form.register('email')} />
                  {form.formState.errors.email && <span className="form-error">{form.formState.errors.email.message}</span>}
                  <small className="field-help">Mereka hanya bisa melihat, tidak bisa mencatat atau mengubah.</small>
                </label>
                <Button type="submit" variant="primary" full disabled={form.formState.isSubmitting || inviteMut.isPending}>
                  <AppIcon name="profile" /> {inviteMut.isPending ? 'Mengirim…' : 'Undang'}
                </Button>
              </form>
            ) : (
              <div className="readiness-list">
                <div>
                  <span>Batas tercapai</span>
                  <strong>Kamu sudah berbagi dengan {MAX_PARTNER_SHARES} orang. Hapus salah satu untuk menambah yang lain.</strong>
                </div>
              </div>
            )}
          </Card>
        </section>

        <Card className="panel-card">
          <div className="panel-head">
            <div><h3>Dibagikan Untukku</h3><p>Orang yang membagikan semua dompetnya kepadamu.</p></div>
          </div>
          {isLoading ? (
            <div className="readiness-list"><div><span>Memuat</span><strong>…</strong></div></div>
          ) : sharedWithMe.length === 0 ? (
            <div className="readiness-list"><div><span>Status</span><strong>Belum ada dompet yang dibagikan untukmu.</strong></div></div>
          ) : (
            <div className="member-list">
              {sharedWithMe.map((link) => (
                <div className="member-row" key={link.id}>
                  <div className="avatar">{displayName(link).slice(0, 2).toUpperCase()}</div>
                  <div>
                    <strong>{displayName(link)}</strong>
                    <span>{link.email} · dompetnya tampil di daftar wallet kamu</span>
                  </div>
                  <div className="inline-actions">
                    <Badge tone="green">{statusLabel.joined}</Badge>
                    <Button size="small" variant="danger" disabled={revokeMut.isPending} onClick={() => setRevokeTarget(link)}>
                      <AppIcon name="close" /> Berhenti Melihat
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Cara Kerja</h3><p>Aturan berbagi riwayat dompet.</p></div></div>
          <div className="readiness-list">
            <div><span>Akses</span><strong>Hanya lihat — pemantau tidak bisa mencatat transaksi</strong></div>
            <div><span>Cakupan</span><strong>Semua dompetmu, termasuk yang dibuat setelah undangan diterima</strong></div>
            <div><span>Satu arah</span><strong>Kamu tidak otomatis melihat dompet pemantau</strong></div>
            <div><span>Budget</span><strong>Tetap privat, tidak ikut dibagikan</strong></div>
          </div>
        </Card>
      </div>

      <Modal
        open={revokeTarget !== null}
        title={revokeTarget?.direction === 'owned' ? 'Hapus Pemantau' : 'Berhenti Melihat'}
        description={
          revokeTarget?.direction === 'owned'
            ? `${revokeTarget ? displayName(revokeTarget) : ''} tidak akan bisa lagi melihat dompetmu. Lanjutkan?`
            : `Dompet ${revokeTarget ? displayName(revokeTarget) : ''} tidak akan tampil lagi di daftar wallet kamu. Lanjutkan?`
        }
        onClose={() => (revokeMut.isPending ? null : setRevokeTarget(null))}
      >
        <div className="modal-actions">
          <Button onClick={() => setRevokeTarget(null)} disabled={revokeMut.isPending}>Batal</Button>
          <Button variant="danger" onClick={onRevoke} disabled={revokeMut.isPending}>
            {revokeMut.isPending ? 'Memproses…' : 'Hapus Akses'}
          </Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
