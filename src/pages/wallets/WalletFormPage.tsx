import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { useCreateWallet, useDeleteWallet, useUpdateWallet, useWallet } from '../../hooks/useWallets';
import { walletCreateSchema, walletUpdateSchema, walletTypeOptions, type WalletCreateFormValues, type WalletUpdateFormValues } from '../../schemas/wallet';
import { majorToMinor, minorToMajor, formatIDR } from '../../lib/money';
import type { ApiError } from '../../api/types';

export function WalletFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const isEdit = Boolean(id);

  const { data: existing, isLoading } = useWallet(id);
  const createMut = useCreateWallet();
  const updateMut = useUpdateWallet(id ?? '');
  const deleteMut = useDeleteWallet();

  const createForm = useForm<WalletCreateFormValues>({
    resolver: zodResolver(walletCreateSchema),
    defaultValues: { name: '', type: 'bank', currency_code: 'IDR', balance_minor: 0 },
  });

  const updateForm = useForm<WalletUpdateFormValues>({
    resolver: zodResolver(walletUpdateSchema),
    values: existing
      ? { name: existing.name, type: existing.type as 'cash' | 'bank' | 'e_wallet' | 'investment', currency_code: existing.currency_code }
      : undefined,
  });

  async function onCreate(values: WalletCreateFormValues) {
    try {
      await createMut.mutateAsync(values);
      showToast('Wallet dibuat.');
      navigate('/wallets', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal membuat wallet.');
    }
  }

  async function onUpdate(values: WalletUpdateFormValues) {
    if (!id) return;
    try {
      await updateMut.mutateAsync(values);
      showToast('Wallet diperbarui.');
      navigate(`/wallets/${id}`, { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal memperbarui wallet.');
    }
  }

  async function onDelete() {
    if (!id) return;
    try {
      await deleteMut.mutateAsync(id);
      setDeleteOpen(false);
      showToast('Wallet dihapus.');
      navigate('/wallets', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal menghapus wallet.');
    }
  }

  if (isEdit && isLoading) {
    return (
      <AppLayout title="Edit Wallet" description="Memuat…">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Memuat wallet</span><strong>…</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  if (isEdit && !existing) {
    return (
      <AppLayout title="Edit Wallet" description="Wallet tidak ditemukan.">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Error</span><strong>Wallet tidak ditemukan.</strong></div></div><div className="modal-actions"><Button to="/wallets">Back to list</Button></div></Card></div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={isEdit ? 'Edit Wallet' : 'Create Wallet'} description="Buat atau edit wallet. Saldo awal hanya bisa diisi saat membuat.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Wallet Form</span>
            <h2>{isEdit ? `Edit ${existing?.name ?? ''}` : 'Buat wallet baru.'}</h2>
            <p>Backend menyimpan saldo dalam minor unit (IDR tanpa desimal).</p>
          </div>
          <div className="app-hero-actions"><Button to="/wallets"><AppIcon name="back" /> Back</Button></div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Wallet Information</h3><p>Field utama wallets table.</p></div></div>
            {isEdit ? (
              <form className="form-stack" onSubmit={updateForm.handleSubmit(onUpdate)} noValidate>
                <label>
                  <span>Wallet name</span>
                  <Input {...updateForm.register('name')} />
                  {updateForm.formState.errors.name && <span className="form-error">{updateForm.formState.errors.name.message}</span>}
                </label>
                <div className="form-two">
                  <label>
                    <span>Wallet type</span>
                    <Select {...updateForm.register('type')}>
                      {walletTypeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select>
                  </label>
                  <label>
                    <span>Currency</span>
                    <Input {...updateForm.register('currency_code')} maxLength={3} />
                    {updateForm.formState.errors.currency_code && <span className="form-error">{updateForm.formState.errors.currency_code.message}</span>}
                  </label>
                </div>
                <div className="readiness-list">
                  <div><span>Saldo saat ini</span><strong>{existing ? formatIDR(existing.balance_minor) : '—'}</strong></div>
                  <div><span>Cara ubah saldo</span><strong>Buat transaksi income/expense/transfer/adjustment</strong></div>
                </div>
                <div className="form-row-between">
                  <Button to="/wallets">Cancel</Button>
                  <div className="inline-actions">
                    <Button type="button" variant="danger" onClick={() => setDeleteOpen(true)}><AppIcon name="delete" /> Delete</Button>
                    <Button type="submit" variant="primary" disabled={updateForm.formState.isSubmitting || updateMut.isPending}><AppIcon name="save" /> Save Wallet</Button>
                  </div>
                </div>
              </form>
            ) : (
              <form className="form-stack" onSubmit={createForm.handleSubmit(onCreate)} noValidate>
                <label>
                  <span>Wallet name</span>
                  <Input {...createForm.register('name')} />
                  {createForm.formState.errors.name && <span className="form-error">{createForm.formState.errors.name.message}</span>}
                </label>
                <div className="form-two">
                  <label>
                    <span>Wallet type</span>
                    <Select {...createForm.register('type')}>
                      {walletTypeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select>
                  </label>
                  <label>
                    <span>Currency</span>
                    <Input defaultValue="IDR" {...createForm.register('currency_code')} maxLength={3} />
                    {createForm.formState.errors.currency_code && <span className="form-error">{createForm.formState.errors.currency_code.message}</span>}
                  </label>
                </div>
                <label>
                  <span>Opening balance (Rp)</span>
                  <Input
                    defaultValue="0"
                    {...createForm.register('balance_minor', {
                      setValueAs: (v) => (typeof v === 'string' ? majorToMinor(v) : v),
                    })}
                  />
                  {createForm.formState.errors.balance_minor && <span className="form-error">{createForm.formState.errors.balance_minor.message}</span>}
                  <small>Minor unit: {formatIDR(createForm.watch('balance_minor') ?? 0)}</small>
                </label>
                <div className="form-row-between">
                  <Button to="/wallets">Cancel</Button>
                  <Button type="submit" variant="primary" disabled={createForm.formState.isSubmitting || createMut.isPending}><AppIcon name="save" /> Save Wallet</Button>
                </div>
              </form>
            )}
          </Card>
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Guardrails</h3><p>Aturan backend wallet.</p></div></div>
            <div className="readiness-list">
              <div><span>Tipe goal</span><strong>Ditolak di endpoint umum</strong></div>
              <div><span>Saldo edit</span><strong>Hanya via transaksi</strong></div>
              <div><span>Currency</span><strong>3 huruf (IDR/USD/SGD)</strong></div>
              <div><span>Hapus wallet</span><strong>Butuh konfirmasi</strong></div>
            </div>
          </Card>
        </section>
      </div>

      <Modal open={deleteOpen} title="Delete Wallet" description="Konfirmasi sebelum wallet dihapus." onClose={() => setDeleteOpen(false)}>
        <div className="readiness-list">
          <div><span>Wallet</span><strong>{existing?.name ?? id}</strong></div>
          <div><span>Saldo</span><strong>{existing ? formatIDR(existing.balance_minor) : '—'}</strong></div>
          <div><span>Rekomendasi</span><strong>Hapus kalau nggak ada transaksi terkait</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={onDelete} disabled={deleteMut.isPending}>Delete Wallet</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
