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
    showToast(`Onboarding selesai: ${selected}. Membuka dashboard...`);
    window.setTimeout(() => navigate('/dashboard'), 450);
  }

  return (
    <main className="onboarding-shell">
      <aside className="onboarding-side">
        <Logo />
        <h1>Personalisasi dashboard Affluena kamu.</h1>
        <p>Pilih fokus utama agar dashboard, quick action, dan rekomendasi module terasa relevan.</p>
      </aside>
      <section className="onboarding-main">
        <form className="onboarding-card" onSubmit={handleSubmit}>
          <span className="step-label">Langkah 1 dari 1</span>
          <h2>Apa tujuan utama kamu?</h2>
          <p>Pilihan ini menyesuaikan dashboard dan rekomendasi module. Bisa diubah kapan saja dari Settings.</p>
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
            <Button to="/login">Skip</Button>
            <Button type="submit" variant="primary">Finish onboarding</Button>
          </div>
        </form>
      </section>
    </main>
  );
}
