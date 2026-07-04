import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { ColorPicker, normalizeItemColor, itemAccentVars } from '../../components/finance/ColorPicker';
import { CategoryIcon } from '../../components/master-data/CategoryIcon';
import { useCategories } from '../../hooks/useCategories';
import { useBudget, useCreateBudget, useUpdateBudget, useDeleteBudget } from '../../hooks/useBudgets';
import { budgetSchema, type BudgetFormData } from '../../schemas/budget';
import { currentMonth } from '../../lib/reporting';

export function BudgetFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(id);

  const { data: categoriesData } = useCategories({ type: 'expense' });
  const expenseCategories = categoriesData?.categories ?? [];

  const { data: budget, isLoading: isBudgetLoading } = useBudget(id);
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget(id as string);
  const deleteBudget = useDeleteBudget();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category_id: '',
      month: currentMonth(),
      limit_minor: 0,
      color: '',
      icon: '',
    },
  });

  useEffect(() => {
    if (isEdit && budget) {
      reset({
        category_id: budget.category_id,
        month: budget.month ? budget.month.slice(0, 7) : currentMonth(),
        limit_minor: budget.limit_minor,
        color: normalizeItemColor(budget.color),
        // No icon picker on web yet — round-trip whatever mobile stored.
        icon: budget.icon ?? '',
      });
    }
  }, [isEdit, budget, reset]);

  const onSubmit = async (data: BudgetFormData) => {
    try {
      if (isEdit) {
        await updateBudget.mutateAsync(data);
        showToast('Anggaran berhasil diperbarui.');
      } else {
        await createBudget.mutateAsync(data);
        showToast('Anggaran berhasil dibuat.');
      }
      navigate('/budgets');
    } catch (error) {
      showToast('Gagal menyimpan anggaran.');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteBudget.mutateAsync(id);
      showToast('Anggaran berhasil dihapus.');
      navigate('/budgets');
    } catch (error) {
      showToast('Gagal menghapus anggaran.');
    }
  };

  const watchCategoryId = watch('category_id');
  const watchLimitMinor = watch('limit_minor');
  const watchMonth = watch('month');

  const selectedCategory = expenseCategories.find(c => c.id === watchCategoryId);
  const categoryName = selectedCategory?.name ?? 'Pilih Kategori';
  const previewAccent = itemAccentVars(watch('color') || selectedCategory?.color);

  if (isEdit && isBudgetLoading) {
    return <AppLayout title="Edit Anggaran" description="Memuat data anggaran..."><div className="loading-state">Memuat...</div></AppLayout>;
  }

  return (
    <AppLayout title={isEdit ? 'Edit Anggaran' : 'Anggaran Baru'} description="Buat dan atur batas belanja bulanan per kategori.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <Badge className="dark">Anggaran</Badge>
            <h2>{isEdit ? 'Perbarui anggaran tanpa kehilangan riwayat notifikasi.' : 'Buat anggaran bulanan per kategori pengeluaran.'}</h2>
            <p>Pilih kategori, tentukan periode dan batas, lalu biarkan Affluena memantau pengeluaranmu.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/budgets"><AppIcon name="back" /> Kembali</Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}><AppIcon name="save" /> Simpan</Button>
          </div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card form-panel">
            <div className="panel-head"><div><h3>Informasi Anggaran</h3><p>Satu kategori hanya punya satu anggaran di bulan yang sama.</p></div></div>
            <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-two">
                <label>
                  <span>Kategori Pengeluaran</span>
                  <Controller
                    control={control}
                    name="category_id"
                    render={({ field }) => (
                      <Select name={field.name} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} onBlur={field.onBlur}>
                        <option value="">Pilih kategori</option>
                        {expenseCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                      </Select>
                    )}
                  />
                  {errors.category_id && <span className="form-error">{errors.category_id.message}</span>}
                  <small className="field-help">Anggaran hanya berlaku untuk kategori pengeluaran.</small>
                </label>
                <label>
                  <span>Periode</span>
                  <Input type="month" {...register('month')} />
                  {errors.month && <span className="form-error">{errors.month.message}</span>}
                  <small className="field-help">Periode dipakai untuk menghitung pengeluaran aktual.</small>
                </label>
              </div>
              <label>
                <span>Batas Bulanan (Rp)</span>
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  {...register('limit_minor', { valueAsNumber: true })}
                />
                {errors.limit_minor && <span className="form-error">{errors.limit_minor.message}</span>}
                <small className="field-help">Batas belanja maksimum untuk kategori ini dalam sebulan.</small>
              </label>
              <label>
                <span>Warna</span>
                <ColorPicker
                  value={watch('color')}
                  onChange={(hex) => setValue('color', hex, { shouldDirty: true })}
                />
                <small className="field-help">Warna yang sama dipakai di aplikasi mobile.</small>
              </label>
              <div className="form-row-between">
                <div>
                  <Button to="/budgets">Batal</Button>
                  {isEdit && (
                    <Button type="button" variant="danger" onClick={() => setDeleteOpen(true)} disabled={deleteBudget.isPending} style={{ marginLeft: '8px' }}>
                      <AppIcon name="delete" /> Hapus
                    </Button>
                  )}
                </div>
                <Button type="submit" variant="primary" disabled={isSubmitting}><AppIcon name="save" /> Simpan Anggaran</Button>
              </div>
            </form>
          </Card>

          <div className="grid-stack">
            <Card className="panel-card budget-preview-card">
              <div className="preview-icon" style={previewAccent}><CategoryIcon icon={selectedCategory?.icon} type="expense" /></div>
              <Badge tone="green">Aman</Badge>
              <h3>{categoryName}</h3>
              <p>{watchMonth || 'YYYY-MM'} · peringatan di 80%</p>
              <strong><Amount value={watchLimitMinor || 0} /></strong>
              <ProgressBar value={0} tone="green" />
            </Card>
            <Card className="panel-card">
              <div className="panel-head"><div><h3>Cara Kerja Anggaran</h3><p>Hal penting yang perlu kamu tahu.</p></div></div>
              <div className="readiness-list">
                <div><span>Satu anggaran</span><Badge tone="blue">per kategori per bulan</Badge></div>
                <div><span>Sumber data</span><Badge tone="purple">transaksi pengeluaran</Badge></div>
                <div><span>Peringatan</span><Badge tone="orange">80%</Badge></div>
                <div><span>Terlampaui</span><Badge tone="red">100%</Badge></div>
              </div>
            </Card>
          </div>
        </section>
      </div>

      <Modal
        open={deleteOpen}
        title="Hapus Anggaran"
        description="Tindakan ini menghapus anggaran ini. Riwayat notifikasi yang sudah tercatat tidak ikut terhapus."
        onClose={() => (deleteBudget.isPending ? null : setDeleteOpen(false))}
      >
        <div className="readiness-list">
          <div><span>Kategori</span><strong>{categoryName}</strong></div>
          <div><span>Batas</span><strong><Amount value={watchLimitMinor || 0} /></strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setDeleteOpen(false)} disabled={deleteBudget.isPending}>Batal</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteBudget.isPending}>{deleteBudget.isPending ? 'Menghapus...' : 'Hapus Anggaran'}</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
