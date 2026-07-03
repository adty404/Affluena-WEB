import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { useWallets } from '../../hooks/useWallets';
import { useCategories } from '../../hooks/useCategories';
import { useSplitBill } from '../../hooks/useTransactions';
import { splitTransactionSchema, type SplitTransactionFormData } from '../../schemas/transaction';

export function SplitBillPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [participantOpen, setParticipantOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  const splitMutation = useSplitBill();

  const { register, control, handleSubmit, formState: { errors }, watch, getValues } = useForm<SplitTransactionFormData>({
    resolver: zodResolver(splitTransactionSchema),
    defaultValues: {
      total_amount_minor: 0,
      transaction_at: new Date().toISOString().slice(0, 16),
      splits: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'splits',
  });

  const [newParticipant, setNewParticipant] = useState({
    counterparty_name: '',
    amount_minor: 0,
    disbursement_category_id: '',
    payment_category_id: '',
  });

  const watchTotal = watch('total_amount_minor') || 0;
  const watchSplits = watch('splits') || [];
  
  const receivable = watchSplits.reduce((sum, item) => sum + (item.amount_minor || 0), 0);
  const userShare = watchTotal - receivable;

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipant.counterparty_name || newParticipant.amount_minor <= 0 || !newParticipant.disbursement_category_id || !newParticipant.payment_category_id) {
      showToast('Lengkapi semua data peserta dengan benar');
      return;
    }
    append(newParticipant);
    setParticipantOpen(false);
    setNewParticipant({
      counterparty_name: '',
      amount_minor: 0,
      disbursement_category_id: '',
      payment_category_id: '',
    });
    showToast('Peserta ditambahkan ke bagi tagihan.');
  };

  const onSubmit = (data: SplitTransactionFormData) => {
    const payload = {
      ...data,
      transaction_at: data.transaction_at ? new Date(data.transaction_at).toISOString() : undefined,
    };

    splitMutation.mutate(payload, {
      onSuccess: () => {
        showToast('Bagi tagihan berhasil dibuat.');
        navigate('/transactions');
      },
      onError: (err: any) => {
        showToast(err.message || 'Gagal membuat bagi tagihan');
      }
    });
  };

  return (
    <AppLayout title="Bagi Tagihan" description="Catat satu pengeluaran dan buat piutang untuk tiap peserta.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Bagi Tagihan</span>
            <h2>Bagi tagihan bersama teman tanpa repot hitung manual.</h2>
            <p>Bagianmu tercatat sebagai pengeluaran dan bagian tiap peserta otomatis menjadi piutang.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/transactions">Kembali</Button>
            <Button variant="primary" onClick={() => setConfirmOpen(true)} disabled={watchSplits.length === 0 || userShare < 0}>
              <AppIcon name="split" /> Buat Bagi Tagihan
            </Button>
          </div>
        </section>
        <section className="stat-grid">
          <Card className="stat-card"><span>Total Tagihan</span><strong><Amount value={watchTotal} variant="expense" /></strong><small>Tagihan bersama</small></Card>
          <Card className="stat-card blue"><span>Bagianmu</span><strong><Amount value={userShare} variant="expense" /></strong><small>Tercatat sebagai pengeluaran</small></Card>
          <Card className="stat-card purple"><span>Piutang</span><strong><Amount value={receivable} variant="income" /></strong><small>Tercatat sebagai piutang</small></Card>
          <Card className="stat-card orange"><span>Peserta</span><strong>{watchSplits.length}</strong><small>Ikut patungan</small></Card>
        </section>
        <section className="dashboard-grid transaction-entry-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Informasi Tagihan</h3><p>Detail pengeluaran dari tagihan ini.</p></div></div>
            <form className="form-stack">
              <div className="form-two">
                <label>
                  <span>Dompet</span>
                  <Select {...register('wallet_id')}>
                    <option value="">Pilih Dompet</option>
                    {walletsData?.wallets?.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                  </Select>
                  {errors.wallet_id && <span className="error-text">{errors.wallet_id.message}</span>}
                </label>
                <label>
                  <span>Kategori</span>
                  <Select {...register('category_id')}>
                    <option value="">Pilih Kategori</option>
                    {categoriesData?.categories?.filter(c => c.type === 'expense').map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </Select>
                  {errors.category_id && <span className="error-text">{errors.category_id.message}</span>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Jumlah Total (Rp)</span>
                  <Input type="number" {...register('total_amount_minor', { valueAsNumber: true })} />
                  {errors.total_amount_minor && <span className="error-text">{errors.total_amount_minor.message}</span>}
                </label>
                <label>
                  <span>Tanggal</span>
                  <Input type="datetime-local" {...register('transaction_at')} />
                  {errors.transaction_at && <span className="error-text">{errors.transaction_at.message}</span>}
                </label>
              </div>
              <label>
                <span>Catatan</span>
                <Textarea {...register('note')} />
                {errors.note && <span className="error-text">{errors.note.message}</span>}
              </label>
            </form>
          </Card>
          <Card className="panel-card">
            <div className="panel-head">
              <div><h3>Peserta</h3><p>Piutang untuk tiap peserta.</p></div>
              <Button size="small" onClick={() => setParticipantOpen(true)}><AppIcon name="add" /> Tambah</Button>
            </div>
            <div className="participant-list">
              {fields.map((item, index) => (
                <div key={item.id} className="participant-row">
                  <div>
                    <strong>{item.counterparty_name}</strong>
                  </div>
                  <Amount value={item.amount_minor} variant="income" />
                  <Button size="small" onClick={() => remove(index)}>Hapus</Button>
                </div>
              ))}
              {fields.length === 0 && <p>Belum ada peserta.</p>}
              {errors.splits && <span className="error-text">{errors.splits.message}</span>}
            </div>
          </Card>
        </section>
      </div>

      <Modal open={participantOpen} title="Tambah Peserta" description="Tambahkan peserta dan jumlah bagiannya sebagai piutang." onClose={() => setParticipantOpen(false)}>
        <form className="form-stack" onSubmit={handleAddParticipant}>
          <div className="form-two">
            <label>
              <span>Nama</span>
              <Input
                placeholder="Nama peserta"
                value={newParticipant.counterparty_name}
                onChange={(e) => setNewParticipant({...newParticipant, counterparty_name: e.target.value})}
              />
            </label>
            <label>
              <span>Jumlah Bagian (Rp)</span>
              <Input 
                type="number" 
                value={newParticipant.amount_minor || ''} 
                onChange={(e) => setNewParticipant({...newParticipant, amount_minor: parseInt(e.target.value) || 0})} 
              />
            </label>
          </div>
          <div className="form-two">
            <label>
              <span>Kategori Pengeluaran</span>
              <Select
                value={newParticipant.disbursement_category_id}
                onChange={(e) => setNewParticipant({...newParticipant, disbursement_category_id: e.target.value})}
              >
                <option value="">Pilih Kategori</option>
                {categoriesData?.categories?.filter(c => c.type === 'expense').map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </Select>
            </label>
            <label>
              <span>Kategori Pembayaran</span>
              <Select
                value={newParticipant.payment_category_id}
                onChange={(e) => setNewParticipant({...newParticipant, payment_category_id: e.target.value})}
              >
                <option value="">Pilih Kategori</option>
                {categoriesData?.categories?.filter(c => c.type === 'income').map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </Select>
            </label>
          </div>
          <div className="modal-actions">
            <Button onClick={() => setParticipantOpen(false)} type="button">Batal</Button>
            <Button type="submit" variant="primary">Tambah Peserta</Button>
          </div>
        </form>
      </Modal>

      <Modal open={confirmOpen} title="Buat Bagi Tagihan" description="Periksa rincian sebelum bagi tagihan dibuat." onClose={() => setConfirmOpen(false)}>
        <div className="readiness-list">
          <div><span>Pengeluaran kamu</span><strong><Amount value={userShare} variant="expense" /></strong></div>
          <div><span>Piutang</span><strong><Amount value={receivable} variant="income" /></strong></div>
          <div><span>Peserta</span><strong>{watchSplits.length} orang</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setConfirmOpen(false)}>Batal</Button>
          <Button variant="primary" onClick={() => { setConfirmOpen(false); handleSubmit(onSubmit)(); }} disabled={splitMutation.isPending}>
            {splitMutation.isPending ? 'Membuat...' : 'Konfirmasi Bagi Tagihan'}
          </Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
