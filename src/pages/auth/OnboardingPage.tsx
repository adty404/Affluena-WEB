import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/ui/Logo';
import { Button } from '../../components/ui/Button';
import { onboardingOptions } from '../../data/stage1Data';
import { useToast } from '../../components/ui/Toast';

export function OnboardingPage() {
  const [selected, setSelected] = useState(onboardingOptions[0].title);
  const navigate = useNavigate();
  const { showToast } = useToast();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // This page is logged-out only (PublicOnly), so /dashboard would bounce to
    // /login. Carry the chosen goal into registration instead.
    showToast(`Pilihan tersimpan: ${selected}. Lanjut daftar...`);
    window.setTimeout(() => navigate('/register', { state: { goal: selected } }), 450);
  }

  return (
    <main className="onboarding-shell">
      <aside className="onboarding-side">
        <Logo />
        <h1>Personalisasi dasbor Affluena kamu.</h1>
        <p>Pilih fokus utama agar dasbor, aksi cepat, dan rekomendasi fitur terasa relevan.</p>
      </aside>
      <section className="onboarding-main">
        <form className="onboarding-card" onSubmit={handleSubmit}>
          <span className="step-label">Langkah 1 dari 1</span>
          <h2>Apa tujuan utama kamu?</h2>
          <p>Pilihan ini menyesuaikan dasbor dan rekomendasi fitur. Bisa diubah kapan saja dari Pengaturan.</p>
          <div className="onboarding-grid">
            {onboardingOptions.map((option) => (
              <button
                key={option.title}
                type="button"
                className={`onboarding-option ${selected === option.title ? 'selected' : ''}`}
                onClick={() => setSelected(option.title)}
              >
                <strong>{option.title}</strong>
                <span>{option.body}</span>
              </button>
            ))}
          </div>
          <div className="onboarding-actions">
            <Button to="/login">Lewati</Button>
            <Button type="submit" variant="primary">Selesai</Button>
          </div>
        </form>
      </section>
    </main>
  );
}
