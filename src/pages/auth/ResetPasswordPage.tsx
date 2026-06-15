import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    showToast('Password berhasil direset. Silakan login.');
    window.setTimeout(() => navigate('/login'), 450);
  }

  return (
    <AuthLayout title="Buat password baru." description="Pastikan password baru kuat dan mudah diingat." narrow>
      <h2>Reset password</h2>
      <p>Buat password baru untuk akun Affluena.</p>
      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          <span>Password baru</span>
          <div className="password-field">
            <Input type={showPassword ? 'text' : 'password'} defaultValue="newpassword123" required />
            <button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
        </label>
        <label><span>Konfirmasi password</span><Input type={showPassword ? 'text' : 'password'} defaultValue="newpassword123" required /></label>
        <Button type="submit" variant="primary" full>Reset password</Button>
      </form>
      <p className="auth-switch"><Link to="/login">Kembali ke login</Link></p>
    </AuthLayout>
  );
}
