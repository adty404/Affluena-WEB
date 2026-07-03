import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingRow, SettingsCard, SettingsHero, SettingsToggle } from './SettingsShared';

export function PrivacyPage() {
  const { showToast } = useToast();
  const [maskAmounts, setMaskAmounts] = useState(false);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [auditOpen, setAuditOpen] = useState(false);

  return (
    <AppLayout title="Privasi Data" description="Kontrol visibilitas data, penyamaran nominal, dan akses audit.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Privasi" title="Kontrol privasi untuk data keuangan pribadi." description="Penyamaran nominal, audit data, dan ekspor data pribadi dibuat transparan supaya kamu tetap pegang kendali.">
          <Button to="/settings/data"><AppIcon name="download" /> Kelola Data</Button>
          <Button variant="primary" onClick={() => setAuditOpen(true)}><AppIcon name="list" /> Audit Privasi</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="health" title="Kontrol Privasi" description="Atur visibilitas data sensitif di layar dan laporan.">
            <div className="settings-list">
              <SettingRow title="Samarkan nominal keuangan" description="Sembunyikan nominal di Beranda saat sedang presentasi atau layar dibagikan." aside={<SettingsToggle checked={maskAmounts} onChange={() => setMaskAmounts(!maskAmounts)} label="Aktifkan/nonaktifkan penyamaran nominal" />} />
              <SettingRow title="Izinkan analitik produk" description="Kirim data pemakaian anonim untuk memperbaiki aplikasi tanpa menjual data kamu." aside={<SettingsToggle checked={shareAnalytics} onChange={() => setShareAnalytics(!shareAnalytics)} label="Aktifkan/nonaktifkan analitik produk" />} />
              <SettingRow title="Sertakan jejak audit" description="Sertakan riwayat aktivitas saat ekspor data pribadi." aside={<Badge tone="blue">Aktif</Badge>} />
              <SettingRow title="Retensi data" description="Riwayat aktivitas disimpan selama 12 bulan untuk kebutuhan audit kamu." aside={<Badge tone="gray">12 bulan</Badge>} />
            </div>
          </SettingsCard>

          <SettingsCard icon="warning" title="Aktivitas Privasi" description="Peristiwa penting yang terkait data sensitif.">
            <div className="settings-timeline">
              <div><Badge>Dilihat</Badge><strong>Laporan saldo dompet dibuka</strong><span>Hari ini 20:10 · Beranda</span></div>
              <div><Badge tone="blue">Diekspor</Badge><strong>Ekspor CSV dibuat</strong><span>Kemarin · Transaksi</span></div>
              <div><Badge tone="orange">Diubah</Badge><strong>Saluran notifikasi diperbarui</strong><span>12 Jun 2026 · Pengaturan</span></div>
            </div>
            <div className="modal-actions left-actions"><Button to="/activities"><AppIcon name="history" /> Buka Riwayat Aktivitas</Button></div>
          </SettingsCard>
        </section>

        <Modal open={auditOpen} title="Hasil Audit Privasi" description="Ringkasan audit privasi untuk sesi ini." onClose={() => setAuditOpen(false)}>
          <div className="settings-list compact">
            <div><span>Isolasi data pengguna</span><strong>Lolos</strong></div>
            <div><span>Penyamaran nominal</span><strong>{maskAmounts ? 'Aktif' : 'Tersedia, sedang nonaktif'}</strong></div>
            <div><span>Ekspor data pribadi</span><strong>Tersedia di menu Data</strong></div>
            <div><span>Alur penghapusan akun</span><strong>Butuh konfirmasi ketik</strong></div>
          </div>
          <div className="modal-actions"><Button onClick={() => setAuditOpen(false)}>Tutup</Button><Button to="/settings/data" variant="primary">Kelola Data</Button></div>
        </Modal>
      </div>
    </AppLayout>
  );
}
