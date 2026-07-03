import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ColorPicker, normalizeItemColor } from '../../components/finance/ColorPicker';
import { useToast } from '../../components/ui/Toast';
import { useWallets } from '../../hooks/useWallets';
import { useCategories } from '../../hooks/useCategories';
import { useRecurringRule, useCreateRecurringRule, useUpdateRecurringRule } from '../../hooks/useRecurring';
import { recurringRuleSchema, type RecurringRuleInput } from '../../schemas/recurring';
import { ACTIONS } from '../../lib/copy';
import { useEffect } from 'react';

export function RecurringFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(id);

  const { data: rule, isLoading: isLoadingRule } = useRecurringRule(id || '');
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();

  const createMutation = useCreateRecurringRule();
  const updateMutation = useUpdateRecurringRule();

  const wallets = walletsData?.wallets || [];
  const categories = categoriesData?.categories || [];

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<RecurringRuleInput>({
    resolver: zodResolver(recurringRuleSchema),
    defaultValues: {
      type: 'expense',
      frequency: 'monthly',
      status: 'active',
      interval_count: 1,
      amount_minor: 0,
      color: '',
      icon: '',
    }
  });

  useEffect(() => {
    if (rule) {
      reset({
        name: rule.name,
        type: rule.type,
        wallet_id: rule.wallet_id,
        to_wallet_id: rule.to_wallet_id || undefined,
        category_id: rule.category_id || undefined,
        amount_minor: rule.amount_minor,
        frequency: rule.frequency,
        interval_count: rule.interval_count,
        next_run_at: rule.next_run_at.split('T')[0] + 'T00:00:00Z', // Simplified for date input
        end_at: rule.end_at ? rule.end_at.split('T')[0] + 'T00:00:00Z' : undefined,
        status: rule.status,
        note: rule.note || '',
        color: normalizeItemColor(rule.color),
        // No icon picker on web yet — round-trip whatever mobile stored.
        icon: rule.icon ?? '',
      });
    }
  }, [rule, reset]);

  const type = watch('type');
  const amount = watch('amount_minor');

  const onSubmit = async (data: RecurringRuleInput) => {
    try {
      // Ensure dates are properly formatted
      const formattedData = {
        ...data,
        next_run_at: new Date(data.next_run_at).toISOString(),
        end_at: data.end_at ? new Date(data.end_at).toISOString() : undefined,
      };

      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data: formattedData });
        showToast('Aturan berulang berhasil diperbarui');
      } else {
        await createMutation.mutateAsync(formattedData);
        showToast('Aturan berulang berhasil dibuat');
      }
      navigate('/recurring');
    } catch (error) {
      showToast('Gagal menyimpan aturan berulang');
    }
  };

  if (isEdit && isLoadingRule) {
    return <AppLayout title="Edit Aturan Berulang" description={ACTIONS.memuat}><div className="p-8">{ACTIONS.memuat}</div></AppLayout>;
  }

  return (
    <AppLayout title={isEdit ? 'Edit Aturan Berulang' : 'Tambah Aturan Berulang'} description="Atur frekuensi, dompet, kategori, jumlah, dan status.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Aturan Berulang</span><h2>{isEdit ? 'Perbarui aturan dengan status dan jadwal berikutnya yang jelas.' : 'Buat transaksi otomatis yang tetap bisa kamu kontrol manual.'}</h2><p>Transaksi akan dibuat otomatis sesuai jadwal, dan kamu tetap bisa menjalankannya manual kapan saja.</p></div>
          <div className="app-hero-actions"><Button to="/recurring">{ACTIONS.kembali}</Button><Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}><AppIcon name="save" /> Simpan Aturan</Button></div>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Informasi Aturan</h3><p>Semua data utama transaksi berulang.</p></div></div>
            <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-two">
                <label>
                  <span>Nama</span>
                  <Input {...register('name')} />
                </label>
                <label>
                  <span>Tipe</span>
                  <Select {...register('type')}>
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                    <option value="transfer">Transfer</option>
                    <option value="adjustment">Penyesuaian</option>
                  </Select>
                </label>
              </div>

              <div className="form-two">
                <label>
                  <span>Dompet</span>
                  <Select {...register('wallet_id')}>
                    <option value="">Pilih Dompet</option>
                    {wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                  </Select>
                </label>
                <label>
                  <span>Dompet Tujuan (untuk Transfer)</span>
                  <Select {...register('to_wallet_id')} disabled={type !== 'transfer'}>
                    <option value="">Tidak dipakai</option>
                    {wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                  </Select>
                </label>
              </div>

              <div className="form-two">
                <label>
                  <span>Kategori</span>
                  <Select {...register('category_id')} disabled={type === 'transfer'}>
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </Select>
                </label>
                <label>
                  <span>Jumlah (Rp)</span>
                  <Input
                    type="number"
                    {...register('amount_minor', { valueAsNumber: true })}

                  />
                </label>
              </div>

              <div className="form-three">
                <label>
                  <span>Frekuensi</span>
                  <Select {...register('frequency')}>
                    <option value="weekly">Mingguan</option>
                    <option value="monthly">Bulanan</option>
                  </Select>
                </label>
                <label>
                  <span>Interval Pengulangan</span>
                  <Input
                    type="number"
                    {...register('interval_count', { valueAsNumber: true })}

                  />
                </label>
                <label>
                  <span>Status</span>
                  <Select {...register('status')}>
                    <option value="active">Aktif</option>
                    <option value="paused">Dijeda</option>
                    <option value="cancelled">Dibatalkan</option>
                  </Select>
                </label>
              </div>

              <div className="form-two">
                <label>
                  <span>Jadwal Berikutnya</span>
                  <Input
                    type="datetime-local"
                    {...register('next_run_at')}

                  />
                </label>
                <label>
                  <span>Tanggal Berakhir (Opsional)</span>
                  <Input
                    type="datetime-local"
                    {...register('end_at')}

                  />
                </label>
              </div>

              <label>
                <span>Warna</span>
                <ColorPicker
                  value={watch('color')}
                  onChange={(hex) => setValue('color', hex, { shouldDirty: true })}
                />
                <small className="field-help">Warna yang sama dipakai di aplikasi mobile.</small>
              </label>

              <label>
                <span>Catatan</span>
                <Textarea {...register('note')} />
              </label>

              <div className="form-row-between">
                <Button to="/recurring">{ACTIONS.batal}</Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  <AppIcon name="save" /> {isSubmitting ? 'Menyimpan...' : 'Simpan Aturan'}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Pratinjau Jadwal</h3><p>Gambaran eksekusi sebelum disimpan.</p></div></div>
            <div className="metric-list">
              <div><span>Perkiraan jumlah</span><strong><Amount value={amount || 0} type={type === 'income' ? 'income' : 'expense'} /></strong></div>
              <div><span>Perilaku status</span><strong>Aktif berjalan otomatis, dijeda dilewati dengan aman.</strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
