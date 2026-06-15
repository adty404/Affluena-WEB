import { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    showToast('Link reset dikirim. Membuka halaman reset...');
    window.setTimeout(() => navigate('/reset-password'), 450);
  }

  return (
    <AuthLayout title="Reset akses akun dengan aman." description="Masukkan email, lalu ikuti flow reset password." narrow>
      <h2>Lupa password</h2>
      <p>Masukkan email akun Affluena. Setelah submit, user diarahkan ke reset password untuk simulasi flow auth.</p>
      <form className="form-stack" onSubmit={handleSubmit}>
        <label><span>Email</span><Input type="email" defaultValue="aditya@affluena.app" required /></label>
        <Button type="submit" variant="primary" full>Kirim link reset</Button>
      </form>
      <p className="auth-switch"><Link to="/login">Kembali ke login</Link></p>
    </AuthLayout>
  );
}
