import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema, type LoginFormValues } from '../../schemas/auth';
import type { ApiError } from '../../api/types';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard';

  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values);
      showToast('Berhasil masuk. Membuka Beranda...');
      window.setTimeout(() => navigate(from, { replace: true }), 200);
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal masuk. Periksa email dan kata sandi kamu.');
    }
  }

  return (
    <AuthLayout title="Selamat datang kembali." description="Masuk untuk melihat dasbor keuangan Affluena." narrow>
      <h2>Masuk ke Affluena</h2>
      <p>Gunakan akun email pribadi kamu untuk masuk.</p>
      <form className="form-stack" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>
          <span>Email</span>
          <Input type="email" autoComplete="email" required {...field('email')} />
          {errors.email && <span className="form-error">{errors.email.message}</span>}
        </label>
        <label>
          <span>Kata Sandi</span>
          <div className="password-field">
            <Input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              {...field('password')}
            />
            <button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</button>
          </div>
          {errors.password && <span className="form-error">{errors.password.message}</span>}
        </label>
        <div className="form-row-between">
          <label className="checkbox-row"><input type="checkbox" /> Ingat saya</label>
          <Link to="/forgot-password">Lupa kata sandi?</Link>
        </div>
        <Button type="submit" variant="primary" full disabled={isSubmitting}>
          {isSubmitting ? 'Memproses…' : 'Masuk'}
        </Button>
      </form>
      <p className="auth-switch">Belum punya akun? <Link to="/register">Daftar gratis</Link></p>
    </AuthLayout>
  );
}
