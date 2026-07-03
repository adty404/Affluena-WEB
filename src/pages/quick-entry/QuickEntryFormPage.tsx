import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { useWallets } from '../../hooks/useWallets';
import { useCategories } from '../../hooks/useCategories';
import { useQuickEntryTemplate, useCreateQuickEntryTemplate, useUpdateQuickEntryTemplate } from '../../hooks/useQuickEntry';
import { quickEntryTemplateSchema, type QuickEntryTemplateInput } from '../../schemas/quickEntry';
import { useEffect } from 'react';

export function QuickEntryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(id);

  const { data: template, isLoading: isLoadingTemplate } = useQuickEntryTemplate(id || '');
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  
  const createMutation = useCreateQuickEntryTemplate();
  const updateMutation = useUpdateQuickEntryTemplate();

  const wallets = walletsData?.wallets || [];
  const categories = categoriesData?.categories || [];

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<QuickEntryTemplateInput>({
    resolver: zodResolver(quickEntryTemplateSchema),
    defaultValues: {
      type: 'expense',
      amount_minor: 0,
    }
  });

  useEffect(() => {
    if (template) {
      reset({
        name: template.name,
        type: template.type as any,
        wallet_id: template.wallet_id,
        to_wallet_id: template.to_wallet_id || undefined,
        category_id: template.category_id || undefined,
        amount_minor: template.amount_minor,
        note: template.note || '',
      });
    }
  }, [template, reset]);

  const type = watch('type');

  const onSubmit = async (data: QuickEntryTemplateInput) => {
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data });
        showToast('Template catat cepat berhasil diperbarui');
      } else {
        await createMutation.mutateAsync(data);
        showToast('Template catat cepat berhasil dibuat');
      }
      navigate('/quick-entry');
    } catch (error) {
      showToast('Gagal menyimpan template catat cepat');
    }
  };

  if (isEdit && isLoadingTemplate) {
    return <AppLayout title="Edit Catat Cepat" description="Memuat..."><div className="p-8">Memuat...</div></AppLayout>;
  }

  return (
    <AppLayout title={isEdit ? 'Edit Catat Cepat' : 'Catat Cepat Baru'} description="Buat template transaksi siap pakai.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Catat Cepat</span><h2>{isEdit ? 'Edit template transaksi rutin.' : 'Buat template transaksi rutin.'}</h2><p>Sekali disimpan, template bisa dijalankan kapan pun untuk mencatat transaksi yang sama.</p></div>
          <div className="app-hero-actions"><Button to="/quick-entry">Kembali</Button><Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>Simpan Template</Button></div>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Informasi Template</h3><p>Detail template untuk pencatatan cepat.</p></div></div>
          <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-two">
              <label>
                <span>Nama</span>
                <Input {...register('name')} />
              </label>
              <label>
                <span>Tipe</span>
                <Select {...register('type')}>
                  <option value="expense">Pengeluaran</option>
                  <option value="income">Pemasukan</option>
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
            
            <label>
              <span>Catatan</span>
              <Textarea {...register('note')} />
            </label>

            <div className="form-row-between">
              <Button to="/quick-entry">Batal</Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Template'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
