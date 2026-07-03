import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { faqItems } from '../../constants/faq';
import { SettingsCard, SettingsHero } from './SettingsShared';

export function HelpPage() {
  const { showToast } = useToast();
  const [ticketOpen, setTicketOpen] = useState(false);

  return (
    <AppLayout title="Bantuan & FAQ" description="Bantuan penggunaan Affluena dan kontak dukungan.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Bantuan" title="Bantuan yang langsung mengarah ke alur nyata." description="FAQ menjelaskan konsep saldo dompet, notifikasi anggaran, transaksi berulang, ekspor, dan privasi.">
          <Button to="/settings/about"><AppIcon name="success" /> Tentang</Button>
          <Button variant="primary" onClick={() => setTicketOpen(true)}><AppIcon name="profile" /> Hubungi Dukungan</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="list" title="Pertanyaan yang Sering Diajukan" description="Penjelasan singkat untuk alur utama Affluena.">
            <div className="faq-list">
              {faqItems.map((item) => (
                <details key={item.id} open={item.id === 'faq-balance'}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </SettingsCard>

          <SettingsCard icon="health" title="Saluran Bantuan" description="Akses bantuan berdasarkan tipe masalah.">
            <div className="settings-list">
              <div><span>Masalah transaksi</span><Button to="/transactions/filter" size="small"><AppIcon name="filter" /> Buka filter transaksi</Button></div>
              <div><span>Masalah ekspor</span><Button to="/exports/history" size="small"><AppIcon name="download" /> Cek riwayat ekspor</Button></div>
              <div><span>Masalah pemberitahuan</span><Button to="/alerts" size="small"><AppIcon name="warning" /> Buka pemberitahuan</Button></div>
              <div><span>Masalah keamanan</span><Button to="/settings/security" size="small"><AppIcon name="settings" /> Pengaturan keamanan</Button></div>
            </div>
          </SettingsCard>
        </section>

        <Modal open={ticketOpen} title="Hubungi Dukungan" description="Ceritakan masalah kamu, tim Affluena akan menindaklanjuti." onClose={() => setTicketOpen(false)}>
          <form className="form-stack" onSubmit={(event) => { event.preventDefault(); setTicketOpen(false); showToast('Tiket bantuan dibuat. Riwayat aktivitas diperbarui.'); }}>
            <label><span>Topik</span><Select defaultValue="transaction"><option value="transaction">Masalah transaksi</option><option value="security">Masalah keamanan</option><option value="export">Masalah ekspor</option><option value="bug">Laporan bug UI</option></Select></label>
            <label><span>Subjek</span><Input defaultValue="Butuh bantuan meninjau data keuangan" /></label>
            <label><span>Deskripsi</span><Textarea defaultValue="Jelaskan masalahnya beserta halaman, ukuran layar, dan hasil yang kamu harapkan." /></label>
            <div className="modal-actions"><Button onClick={() => setTicketOpen(false)}>Batal</Button><Button type="submit" variant="primary"><AppIcon name="save" /> Kirim Tiket</Button></div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
