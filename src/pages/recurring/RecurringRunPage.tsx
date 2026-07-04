import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input, Textarea } from '../../components/ui/Input';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { useCategories } from '../../hooks/useCategories';
import { useRecurringRule, useRunRecurringRule } from '../../hooks/useRecurring';
import { useWallets } from '../../hooks/useWallets';
import { categoryLabel, createNameById, walletPairLabel } from '../../lib/financeLabels';
import { toLocalDatetimeInput } from '../../lib/dates';
import { formatIDR } from '../../lib/money';
import { ACTIONS } from '../../lib/copy';

const typeLabel = (type: string) => type === 'income' ? 'Pemasukan' : type === 'expense' ? 'Pengeluaran' : type === 'transfer' ? 'Transfer' : 'Penyesuaian';

export function RecurringRunPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data: rule, isLoading, error } = useRecurringRule(id || '');
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  const runMutation = useRunRecurringRule();
  const walletNameById = createNameById(walletsData?.wallets ?? []);
  const categoryNameById = createNameById(categoriesData?.categories ?? []);

  if (isLoading) return <AppLayout title="Jalankan Manual" description={ACTIONS.memuat}><div className="loading-state">{ACTIONS.memuat}</div></AppLayout>;
  if (error || !rule) return <AppLayout title="Jalankan Manual" description="Gagal memuat"><Card className="panel-card"><EmptyState icon={<AppIcon name="empty" />} title="Gagal memuat aturan berulang" description="Periksa koneksi lalu coba lagi." action={<Button to="/recurring">{ACTIONS.kembali}</Button>} /></Card></AppLayout>;
  const walletText = walletPairLabel(walletNameById, rule.wallet_id, rule.to_wallet_id);
  const categoryText = categoryLabel(categoryNameById, rule.category_id, rule.type);

  const handleRun = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await runMutation.mutateAsync({ id: rule.id, data: { now: true } });
      showToast('Aturan berulang berhasil dijalankan');
      navigate(`/recurring/${rule.id}`);
    } catch (error) {
      showToast('Gagal menjalankan aturan berulang');
    }
  };

  return (
    <AppLayout title="Jalankan Manual" description="Jalankan satu aturan berulang secara manual dengan pratinjau konfirmasi.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><Badge className="dark">Jalankan Manual</Badge><h2>Jalankan {rule.name} secara manual.</h2><p>Eksekusi manual membuat transaksi dari aturan yang sama dan tercatat di riwayat eksekusi.</p></div>
          <div className="app-hero-actions"><Button to={`/recurring/${rule.id}`}>{ACTIONS.kembali}</Button><Button variant="primary" onClick={() => handleRun()} disabled={runMutation.isPending}><AppIcon name="run" /> {runMutation.isPending ? 'Menjalankan...' : 'Jalankan Sekarang'}</Button></div>
        </section>

        <section className="form-detail-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Konfirmasi Eksekusi</h3><p>Periksa data sebelum eksekusi manual.</p></div></div>
            <form className="form-stack" onSubmit={handleRun}>
              <div className="form-two">
                <label><span>Aturan</span><Input defaultValue={rule.name} readOnly /></label>
                <label><span>Tanggal Eksekusi</span><Input type="datetime-local" defaultValue={toLocalDatetimeInput(new Date())} readOnly /></label>
              </div>
              <div className="form-two">
                <label><span>Dompet</span><Input value={walletText} readOnly /></label>
                <label><span>Jumlah</span><Input defaultValue={formatIDR(rule.amount_minor)} readOnly /></label>
              </div>
              <label><span>Catatan Eksekusi</span><Textarea defaultValue="Eksekusi manual diminta dari halaman detail berulang." readOnly /></label>
              <div className="form-row-between">
                <Button to={`/recurring/${rule.id}`}>{ACTIONS.batal}</Button>
                <Button type="submit" variant="primary" disabled={runMutation.isPending}><AppIcon name="run" /> {runMutation.isPending ? 'Menjalankan...' : 'Jalankan Aturan'}</Button>
              </div>
            </form>
          </Card>

          <Card className="panel-card side-metrics-card">
            <div className="panel-head"><div><h3>Pratinjau Transaksi</h3><p>Dampak eksekusi terhadap dompet.</p></div></div>
            <div className="metric-list">
              <div><span>Tipe</span><strong>{typeLabel(rule.type)}</strong></div>
              <div><span>Jumlah</span><strong><Amount value={rule.amount_minor} type={rule.type === 'income' ? 'income' : 'expense'} /></strong></div>
              <div><span>Dompet</span><strong>{walletText}</strong></div>
              <div><span>Kategori</span><strong>{categoryText}</strong></div>
              <div><span>Mode</span><strong>Buat transaksi sekarang</strong></div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
