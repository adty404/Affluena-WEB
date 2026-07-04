import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { ColorPicker, normalizeItemColor } from '../../components/finance/ColorPicker';
import { useCreateWallet, useDeleteWallet, useUpdateWallet, useWallet } from '../../hooks/useWallets';
import { walletCreateSchema, walletUpdateSchema, walletTypeOptions, type WalletCreateFormValues, type WalletUpdateFormValues } from '../../schemas/wallet';
import { majorToMinor, formatIDR } from '../../lib/money';
import { canManageWallet } from '../../lib/wallet';
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
    defaultValues: { name: '', type: 'bank', currency_code: 'IDR', balance_minor: 0, color: '', icon: '', description: '' },
  });

  const updateForm = useForm<WalletUpdateFormValues>({
    resolver: zodResolver(walletUpdateSchema),
    values: existing
      ? {
          name: existing.name,
          type: existing.type as 'cash' | 'bank' | 'e_wallet' | 'investment',
          currency_code: existing.currency_code,
          // Legacy named colors are normalized to the shared hex catalog.
          color: normalizeItemColor(existing.color),
          // No icon picker on web yet — round-trip whatever mobile stored.
          icon: existing.icon ?? '',
          description: existing.description || '',
        }
      : undefined,
  });

  async function onCreate(values: WalletCreateFormValues) {
    try {
      await createMut.mutateAsync(values);
      showToast('Dompet dibuat.');
      navigate('/wallets', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal membuat dompet.');
    }
  }

  async function onUpdate(values: WalletUpdateFormValues) {
    if (!id) return;
    try {
      await updateMut.mutateAsync(values);
      showToast('Dompet diperbarui.');
      navigate(`/wallets/${id}`, { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal memperbarui dompet.');
    }
  }

  async function onDelete() {
    if (!id) return;
    try {
      await deleteMut.mutateAsync(id);
      setDeleteOpen(false);
      showToast('Dompet dihapus.');
      navigate('/wallets', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal menghapus dompet.');
    }
  }

  if (isEdit && isLoading) {
    return (
      <AppLayout title="Edit Dompet" description="Memuat…">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Memuat dompet</span><strong>…</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  if (isEdit && !existing) {
    return (
      <AppLayout title="Edit Dompet" description="Dompet tidak ditemukan.">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Error</span><strong>Dompet tidak ditemukan.</strong></div></div><div className="modal-actions"><Button to="/wallets">Kembali ke daftar</Button></div></Card></div>
      </AppLayout>
    );
  }

  // Shared viewers/members can't edit a wallet they don't own — show a read-only
  // notice instead of a form that would fail on save.
  if (isEdit && existing && !canManageWallet(existing)) {
    return (
      <AppLayout title="Edit Dompet" description="Dompet bersama hanya bisa dilihat.">
        <div className="dashboard-page grid-stack">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Hanya lihat</h3><p>Kamu bukan pemilik dompet ini, jadi tidak bisa mengubahnya.</p></div></div>
            <div className="readiness-list">
              <div><span>Dompet</span><strong>{existing.name}</strong></div>
              <div><span>Aksesmu</span><strong>{existing.role === 'viewer' ? 'Hanya lihat' : 'Anggota (bisa mencatat)'}</strong></div>
            </div>
            <div className="modal-actions"><Button to={`/wallets/${id}`}>Lihat Detail</Button><Button to="/wallets">Kembali ke daftar</Button></div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={isEdit ? 'Edit Dompet' : 'Buat Dompet'} description="Buat atau edit dompet. Saldo awal hanya bisa diisi saat membuat.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Dompet</span>
            <h2>{isEdit ? `Edit ${existing?.name ?? ''}` : 'Buat dompet baru.'}</h2>
            <p>Atur nama, tipe, dan warna dompet sesuai kebutuhanmu.</p>
          </div>
          <div className="app-hero-actions"><Button to="/wallets"><AppIcon name="back" /> Kembali</Button></div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Informasi Dompet</h3><p>Nama, tipe, dan detail dompetmu.</p></div></div>
            {isEdit ? (
              <form className="form-stack" onSubmit={updateForm.handleSubmit(onUpdate)} noValidate>
                <label>
                  <span>Nama dompet</span>
                  <Input {...updateForm.register('name')} />
                  {updateForm.formState.errors.name && <span className="form-error">{updateForm.formState.errors.name.message}</span>}
                </label>
                <div className="form-two">
                  <label>
                    <span>Tipe dompet</span>
                    <Select {...updateForm.register('type')}>
                      {walletTypeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select>
                  </label>
                  <label>
                    <span>Mata Uang</span>
                    <Input {...updateForm.register('currency_code')} maxLength={3} />
                    {updateForm.formState.errors.currency_code && <span className="form-error">{updateForm.formState.errors.currency_code.message}</span>}
                  </label>
                </div>
                <div className="form-two">
                  <label>
                    <span>Warna</span>
                    <ColorPicker
                      value={updateForm.watch('color')}
                      onChange={(hex) => updateForm.setValue('color', hex, { shouldDirty: true })}
                    />
                    <small>Warna yang sama dipakai di aplikasi mobile.</small>
                  </label>
                  <label>
                    <span>Status</span>
                    <Select disabled><option>Aktif</option></Select>
                  </label>
                </div>
                <label>
                  <span>Deskripsi</span>
                  <Textarea {...updateForm.register('description')} rows={3} />
                  {updateForm.formState.errors.description && <span className="form-error">{updateForm.formState.errors.description.message}</span>}
                </label>
                <div className="readiness-list">
                  <div><span>Saldo saat ini</span><strong>{existing ? formatIDR(existing.balance_minor) : '—'}</strong></div>
                  <div><span>Cara ubah saldo</span><strong>Catat transaksi pemasukan, pengeluaran, transfer, atau penyesuaian</strong></div>
                </div>
                <div className="form-row-between">
                  <Button to="/wallets">Batal</Button>
                  <div className="inline-actions">
                    <Button type="button" variant="danger" onClick={() => setDeleteOpen(true)}><AppIcon name="delete" /> Hapus</Button>
                    <Button type="submit" variant="primary" disabled={updateForm.formState.isSubmitting || updateMut.isPending}><AppIcon name="save" /> Simpan Dompet</Button>
                  </div>
                </div>
              </form>
            ) : (
              <form className="form-stack" onSubmit={createForm.handleSubmit(onCreate)} noValidate>
                <label>
                  <span>Nama dompet</span>
                  <Input {...createForm.register('name')} />
                  {createForm.formState.errors.name && <span className="form-error">{createForm.formState.errors.name.message}</span>}
                </label>
                <div className="form-two">
                  <label>
                    <span>Tipe dompet</span>
                    <Select {...createForm.register('type')}>
                      {walletTypeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select>
                  </label>
                  <label>
                    <span>Mata Uang</span>
                    <Input defaultValue="IDR" {...createForm.register('currency_code')} maxLength={3} />
                    {createForm.formState.errors.currency_code && <span className="form-error">{createForm.formState.errors.currency_code.message}</span>}
                  </label>
                </div>
                <label>
                  <span>Saldo Awal (Rp)</span>
                  <Input
                    defaultValue="0"
                    {...createForm.register('balance_minor', {
                      setValueAs: (v) => (typeof v === 'string' ? majorToMinor(v) : v),
                    })}
                  />
                  {createForm.formState.errors.balance_minor && <span className="form-error">{createForm.formState.errors.balance_minor.message}</span>}
                  <small>Tercatat sebagai {formatIDR(createForm.watch('balance_minor') ?? 0)}</small>
                </label>
                <div className="form-two">
                  <label>
                    <span>Warna</span>
                    <ColorPicker
                      value={createForm.watch('color')}
                      onChange={(hex) => createForm.setValue('color', hex, { shouldDirty: true })}
                    />
                    <small>Warna yang sama dipakai di aplikasi mobile.</small>
                  </label>
                  <label>
                    <span>Mode berbagi</span>
                    <Select disabled><option>Pribadi</option></Select>
                  </label>
                </div>
                <label>
                  <span>Deskripsi</span>
                  <Textarea {...createForm.register('description')} rows={3} />
                  {createForm.formState.errors.description && <span className="form-error">{createForm.formState.errors.description.message}</span>}
                </label>
                <div className="form-row-between">
                  <Button to="/wallets">Batal</Button>
                  <Button type="submit" variant="primary" disabled={createForm.formState.isSubmitting || createMut.isPending}><AppIcon name="save" /> Simpan Dompet</Button>
                </div>
              </form>
            )}
          </Card>
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Aturan Dompet</h3><p>Hal-hal yang perlu kamu tahu.</p></div></div>
            <div className="readiness-list">
              <div><span>Dompet target</span><strong>Dibuat otomatis lewat Target Tabungan</strong></div>
              <div><span>Ubah saldo</span><strong>Hanya lewat pencatatan transaksi</strong></div>
              <div><span>Mata uang</span><strong>Kode 3 huruf (IDR/USD/SGD)</strong></div>
              <div><span>Warna</span><strong>Pilih dari palet, sama di semua perangkatmu</strong></div>
              <div><span>Hapus dompet</span><strong>Selalu diminta konfirmasi dulu</strong></div>
            </div>
          </Card>
        </section>
      </div>

      <Modal open={deleteOpen} title="Hapus Dompet" description="Konfirmasi sebelum dompet dihapus." onClose={() => setDeleteOpen(false)}>
        <div className="readiness-list">
          <div><span>Dompet</span><strong>{existing?.name ?? id}</strong></div>
          <div><span>Saldo</span><strong>{existing ? formatIDR(existing.balance_minor) : '—'}</strong></div>
          <div><span>Rekomendasi</span><strong>Hapus kalau sudah tidak ada transaksi terkait</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setDeleteOpen(false)}>Batal</Button>
          <Button variant="danger" onClick={onDelete} disabled={deleteMut.isPending}>Hapus Dompet</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
