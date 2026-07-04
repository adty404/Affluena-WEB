import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { AppIcon } from '../../components/ui/AppIcon';
import { faqItems } from '../../constants/faq';
import { SettingsCard, SettingsHero } from './SettingsShared';

export function HelpPage() {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <AppLayout title="Bantuan & FAQ" description="Bantuan penggunaan Affluena dan kontak dukungan.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="Bantuan" title="Bantuan yang langsung mengarah ke alur nyata." description="FAQ menjelaskan konsep saldo dompet, notifikasi anggaran, transaksi berulang, ekspor, dan privasi.">
          <Button to="/settings/about"><AppIcon name="success" /> Tentang</Button>
          <Button variant="primary" onClick={() => setHelpOpen(true)}><AppIcon name="profile" /> Butuh Bantuan?</Button>
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

        <Modal open={helpOpen} title="Butuh Bantuan?" description="Sebagian besar masalah bisa langsung kamu selesaikan lewat alur di bawah." onClose={() => setHelpOpen(false)}>
          <div className="settings-list">
            <div><span>Masalah transaksi</span><Button to="/transactions/filter" size="small" onClick={() => setHelpOpen(false)}><AppIcon name="filter" /> Buka filter transaksi</Button></div>
            <div><span>Masalah ekspor</span><Button to="/exports/history" size="small" onClick={() => setHelpOpen(false)}><AppIcon name="download" /> Cek riwayat ekspor</Button></div>
            <div><span>Masalah pemberitahuan</span><Button to="/alerts" size="small" onClick={() => setHelpOpen(false)}><AppIcon name="warning" /> Buka pemberitahuan</Button></div>
            <div><span>Masalah keamanan</span><Button to="/settings/security" size="small" onClick={() => setHelpOpen(false)}><AppIcon name="settings" /> Pengaturan keamanan</Button></div>
          </div>
          <div className="modal-actions"><Button onClick={() => setHelpOpen(false)}>Tutup</Button></div>
        </Modal>
      </div>
    </AppLayout>
  );
}
