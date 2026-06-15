import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

export function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    showToast('Login berhasil. Membuka dashboard...');
    window.setTimeout(() => navigate('/dashboard'), 450);
  }

  return (
    <AuthLayout title="Selamat datang kembali." description="Masuk untuk melihat dashboard finansial Affluena." narrow>
      <h2>Masuk ke Affluena</h2>
      <p>Gunakan akun demo atau email pribadi untuk masuk ke dashboard.</p>
      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          <span>Email</span>
          <Input type="email" defaultValue="aditya@affluena.app" required />
        </label>
        <label>
          <span>Password</span>
          <div className="password-field">
            <Input type={showPassword ? 'text' : 'password'} defaultValue="password123" required />
            <button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
        </label>
        <div className="form-row-between">
          <label className="checkbox-row"><input type="checkbox" defaultChecked /> Remember me</label>
          <Link to="/forgot-password">Lupa password?</Link>
        </div>
        <Button type="submit" variant="primary" full>Masuk</Button>
      </form>
      <p className="auth-switch">Belum punya akun? <Link to="/register">Daftar gratis</Link></p>
    </AuthLayout>
  );
}
