import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

export function RegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    showToast('Akun berhasil dibuat. Lanjut onboarding...');
    window.setTimeout(() => navigate('/onboarding'), 450);
  }

  return (
    <AuthLayout title="Bangun kebiasaan finansial yang lebih rapi." description="Buat akun, pilih kebutuhan, lalu masuk ke dashboard Affluena.">
      <h2>Buat akun baru</h2>
      <p>Form ini menyiapkan akun demo dan mengarahkan user ke onboarding awal.</p>
      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-two">
          <label><span>First name</span><Input defaultValue="Aditya" required /></label>
          <label><span>Last name</span><Input defaultValue="Prasetyo" required /></label>
        </div>
        <label><span>Email</span><Input type="email" defaultValue="aditya@affluena.app" required /></label>
        <label>
          <span>Password</span>
          <div className="password-field">
            <Input type={showPassword ? 'text' : 'password'} defaultValue="password123" required />
            <button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
        </label>
        <label className="checkbox-row"><input type="checkbox" required /> Saya setuju dengan terms dan privacy policy.</label>
        <Button type="submit" variant="primary" full>Daftar dan lanjut onboarding</Button>
      </form>
      <p className="auth-switch">Sudah punya akun? <Link to="/login">Masuk</Link></p>
    </AuthLayout>
  );
}
