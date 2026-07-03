import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input, Select } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import {
  useInviteMember,
  useRespondWalletInvite,
  useWallet,
  useWalletMembers,
} from '../../hooks/useWallets';
import { useMe } from '../../hooks/useMe';
import type { ApiError } from '../../api/types';
import type { WalletShareStatus } from '../../types/wallet';

const inviteSchema = z.object({
  email: z.string().email('Email tidak valid'),
  role: z.enum(['member', 'viewer']),
});
type InviteValues = z.infer<typeof inviteSchema>;

const roleLabels: Record<string, string> = {
  owner: 'Pemilik',
  member: 'Anggota (bisa mencatat)',
  viewer: 'Hanya lihat',
};

const shareStatusLabels: Record<string, string> = {
  joined: 'Bergabung',
  pending: 'Menunggu',
  rejected: 'Ditolak',
};

function memberLabel(email: string) {
  const local = email.split('@')[0] ?? email;
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export function WalletSharingPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const { data: wallet, isLoading } = useWallet(id);
  const { data: membersData, isLoading: membersLoading } = useWalletMembers(id);
  const { data: meData } = useMe();
  const inviteMut = useInviteMember(id ?? '');
  const respondMut = useRespondWalletInvite(id ?? '');

  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '', role: 'member' },
  });

  const [lastInvite, setLastInvite] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<WalletShareStatus | null>(null);

  async function onSubmit(values: InviteValues) {
    if (!id) return;
    try {
      await inviteMut.mutateAsync({ email: values.email, role: values.role });
      setLastInvite(`${values.email} · ${roleLabels[values.role]}`);
      showToast(`Undangan terkirim ke ${values.email}.`);
      form.reset();
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal mengirim undangan.');
    }
  }

  async function onRespond(memberId: string, status: Extract<WalletShareStatus, 'joined' | 'rejected'>) {
    if (!id) return;
    setPendingAction(status);
    try {
      await respondMut.mutateAsync({ memberId, payload: { status } });
      showToast(status === 'joined' ? 'Undangan diterima. Dompet sudah dibagikan ke kamu.' : 'Undangan ditolak.');
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal merespons undangan.');
    } finally {
      setPendingAction(null);
    }
  }

  if (isLoading) {
    return (
      <AppLayout title="Anggota Dompet" description="Memuat…">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Memuat dompet</span><strong>…</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  if (!wallet) {
    return (
      <AppLayout title="Anggota Dompet" description="Dompet tidak ditemukan.">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Error</span><strong>Dompet tidak ditemukan.</strong></div></div><div className="modal-actions"><Button to="/wallets">Kembali ke daftar</Button></div></Card></div>
      </AppLayout>
    );
  }

  const members = membersData?.members ?? wallet.members ?? [];
  const currentUserId = meData?.user.id;
  const myMembership = currentUserId
    ? members.find((m) => m.user_id === currentUserId)
    : undefined;
  const myInvitePending = myMembership?.status === 'pending';
  const responding = respondMut.isPending;

  return (
    <AppLayout title="Anggota Dompet" description={`Kelola akses untuk ${wallet.name}.`}>
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Anggota Dompet</span>
            <h2>{wallet.name}</h2>
            <p>Peran kamu: <strong>{wallet.role ? roleLabels[wallet.role] ?? wallet.role : '—'}</strong>. Status: <strong>{wallet.share_status ? shareStatusLabels[wallet.share_status] ?? wallet.share_status : '—'}</strong>.</p>
          </div>
          <div className="app-hero-actions"><Button to={`/wallets/${wallet.id}`}>Kembali ke Detail</Button></div>
        </section>

        {myInvitePending ? (
          <Card className="panel-card">
            <div className="panel-head">
              <div>
                <h3>Undangan untuk Kamu</h3>
                <p>Kamu diundang ke dompet ini sebagai <strong>{roleLabels[myMembership?.role ?? 'member'] ?? myMembership?.role}</strong>. Terima untuk mulai berbagi akses.</p>
              </div>
              <Badge tone="orange">Menunggu</Badge>
            </div>
            <div className="inline-actions">
              <Button
                variant="primary"
                disabled={responding}
                onClick={() => onRespond(myMembership!.user_id, 'joined')}
              >
                <AppIcon name="success" /> {responding && pendingAction === 'joined' ? 'Memproses…' : 'Terima'}
              </Button>
              <Button
                variant="danger"
                disabled={responding}
                onClick={() => onRespond(myMembership!.user_id, 'rejected')}
              >
                <AppIcon name="close" /> {responding && pendingAction === 'rejected' ? 'Memproses…' : 'Tolak'}
              </Button>
            </div>
          </Card>
        ) : null}

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Anggota ({members.length})</h3><p>Pemilik dan orang yang diundang.</p></div></div>
            {membersLoading ? (
              <div className="readiness-list"><div><span>Memuat anggota</span><strong>…</strong></div></div>
            ) : members.length === 0 ? (
              <div className="readiness-list"><div><span>Status</span><strong>Belum ada anggota</strong></div></div>
            ) : (
              <div className="member-list">
                {members.map((m) => {
                  const isMe = currentUserId && m.user_id === currentUserId;
                  return (
                    <div className="member-row" key={`${m.wallet_id}-${m.user_id}`}>
                      <div className="avatar">{m.email.slice(0, 2).toUpperCase()}</div>
                      <div>
                        <strong>{memberLabel(m.email)}{isMe ? ' (Kamu)' : ''}</strong>
                        <span>{m.email} · {roleLabels[m.role] ?? m.role}</span>
                      </div>
                      <Badge tone={m.role === 'owner' ? 'green' : m.status === 'joined' ? 'blue' : m.status === 'pending' ? 'orange' : 'red'}>
                        {m.role === 'owner' ? 'Pemilik' : shareStatusLabels[m.status] ?? m.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Akses Kamu</h3><p>Peran dan status kamu di dompet ini.</p></div></div>
            <div className="readiness-list">
              <div><span>Peran</span><Badge tone={wallet.role === 'owner' ? 'green' : 'purple'}>{wallet.role ? roleLabels[wallet.role] ?? wallet.role : '—'}</Badge></div>
              <div><span>Status</span><Badge tone={wallet.share_status === 'joined' ? 'green' : wallet.share_status === 'pending' ? 'orange' : 'red'}>{wallet.share_status ? shareStatusLabels[wallet.share_status] ?? wallet.share_status : '—'}</Badge></div>
              <div><span>Dompet</span><strong>{wallet.name}</strong></div>
            </div>
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Undang Anggota</h3><p>Undang orang lain lewat email. Undangan menunggu sampai diterima.</p></div></div>
            <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <label>
                <span>Email</span>
                <Input type="email" placeholder="friend@example.com" {...form.register('email')} />
                {form.formState.errors.email && <span className="form-error">{form.formState.errors.email.message}</span>}
              </label>
              <label>
                <span>Peran</span>
                <Select {...form.register('role')}>
                  <option value="member">{roleLabels.member}</option>
                  <option value="viewer">{roleLabels.viewer}</option>
                </Select>
                <small className="field-help">Anggota bisa mencatat transaksi di dompet ini; hanya lihat berarti cuma bisa melihat.</small>
              </label>
              <Button type="submit" variant="primary" full disabled={form.formState.isSubmitting || inviteMut.isPending}>
                <AppIcon name="save" /> {inviteMut.isPending ? 'Mengirim…' : 'Kirim Undangan'}
              </Button>
            </form>
            {lastInvite ? (
              <div className="readiness-list" style={{ marginTop: 16 }}>
                <div><span>Undangan terakhir</span><strong>{lastInvite}</strong></div>
                <div><span>Status</span><strong>Menunggu</strong></div>
              </div>
            ) : null}
          </Card>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Cara Kerja Berbagi</h3><p>Alur akses dompet bersama.</p></div></div>
          <div className="readiness-list">
            <div><span>Pemilik</span><strong>Selalu punya akses penuh ke dompetnya</strong></div>
            <div><span>Undangan</span><strong>Orang yang diundang berstatus menunggu sampai merespons</strong></div>
            <div><span>Respons</span><strong>Penerima undangan menerima atau menolak dari halaman ini</strong></div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
