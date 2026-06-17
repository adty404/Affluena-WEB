import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { useInviteMember, useWallet } from '../../hooks/useWallets';
import type { ApiError } from '../../api/types';

const inviteSchema = z.object({
  email: z.string().email('Email tidak valid'),
});
type InviteValues = z.infer<typeof inviteSchema>;

export function WalletSharingPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const { data: wallet, isLoading } = useWallet(id);
  const inviteMut = useInviteMember(id ?? '');

  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '' },
  });

  const [lastInvite, setLastInvite] = useState<string | null>(null);

  async function onSubmit(values: InviteValues) {
    if (!id) return;
    try {
      await inviteMut.mutateAsync({ email: values.email });
      setLastInvite(values.email);
      showToast(`Undangan terkirim ke ${values.email}.`);
      form.reset();
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal mengundang member.');
    }
  }

  if (isLoading) {
    return (
      <AppLayout title="Wallet Sharing" description="Memuat…">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Memuat wallet</span><strong>…</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  if (!wallet) {
    return (
      <AppLayout title="Wallet Sharing" description="Wallet tidak ditemukan.">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Error</span><strong>Wallet tidak ditemukan.</strong></div></div><div className="modal-actions"><Button to="/wallets">Back to list</Button></div></Card></div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Wallet Sharing" description={`Kelola akses untuk ${wallet.name}.`}>
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Sharing</span>
            <h2>{wallet.name}</h2>
            <p>Role kamu: <strong>{wallet.role ?? '—'}</strong>. Status: <strong>{wallet.share_status ?? '—'}</strong>.</p>
          </div>
          <div className="app-hero-actions"><Button to={`/wallets/${wallet.id}`}>Back to Detail</Button></div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Akses Kamu</h3><p>Info role dan status wallet ini untuk user yang login.</p></div></div>
            <div className="readiness-list">
              <div><span>Role</span><Badge tone={wallet.role === 'owner' ? 'green' : 'purple'}>{wallet.role ?? '—'}</Badge></div>
              <div><span>Status</span><Badge tone={wallet.share_status === 'joined' ? 'green' : wallet.share_status === 'pending' ? 'orange' : 'red'}>{wallet.share_status ?? '—'}</Badge></div>
              <div><span>Wallet</span><strong>{wallet.name}</strong></div>
            </div>
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Invite Member</h3><p>Undang user lain via email. Status awal: pending.</p></div></div>
            <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <label>
                <span>Email</span>
                <Input type="email" placeholder="friend@example.com" {...form.register('email')} />
                {form.formState.errors.email && <span className="form-error">{form.formState.errors.email.message}</span>}
              </label>
              <Button type="submit" variant="primary" full disabled={form.formState.isSubmitting || inviteMut.isPending}>
                <AppIcon name="save" /> {inviteMut.isPending ? 'Mengirim…' : 'Kirim Undangan'}
              </Button>
            </form>
            {lastInvite ? (
              <div className="readiness-list" style={{ marginTop: 16 }}>
                <div><span>Undangan terakhir</span><strong>{lastInvite}</strong></div>
                <div><span>Status</span><strong>pending</strong></div>
              </div>
            ) : null}
          </Card>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Catatan</h3><p>Keterbatasan endpoint wallet members.</p></div></div>
          <div className="readiness-list">
            <div><span>Daftar semua member</span><strong>Backend belum punya endpoint GET members</strong></div>
            <div><span>Respond undangan</span><strong>PATCH /wallets/:id/members/:user_id</strong></div>
            <div><span>Member yang join</span><strong>Lewat wallet list response share_status</strong></div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
