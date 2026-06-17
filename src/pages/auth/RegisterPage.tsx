import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema, type RegisterFormValues } from '../../schemas/auth';
import type { ApiError } from '../../api/types';

export function RegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerUser({ email: values.email, password: values.password });
      showToast('Akun berhasil dibuat. Membuka dashboard...');
      window.setTimeout(() => navigate('/dashboard', { replace: true }), 200);
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Pendaftaran gagal. Coba email lain.');
    }
  }

  return (
    <AuthLayout title="Bangun kebiasaan finansial yang lebih rapi." description="Buat akun, lalu masuk ke dashboard Affluena.">
      <h2>Buat akun baru</h2>
      <p>Email dan password saja — backend belum menyimpan nama lengkap.</p>
      <form className="form-stack" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>
          <span>Email</span>
          <Input type="email" autoComplete="email" required {...field('email')} />
          {errors.email && <span className="form-error">{errors.email.message}</span>}
        </label>
        <label>
          <span>Password</span>
          <div className="password-field">
            <Input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              {...field('password')}
            />
            <button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
          {errors.password && <span className="form-error">{errors.password.message}</span>}
        </label>
        <label>
          <span>Konfirmasi Password</span>
          <Input
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            {...field('confirmPassword')}
          />
          {errors.confirmPassword && <span className="form-error">{errors.confirmPassword.message}</span>}
        </label>
        <Button type="submit" variant="primary" full disabled={isSubmitting}>
          {isSubmitting ? 'Memproses…' : 'Daftar dan masuk dashboard'}
        </Button>
      </form>
      <p className="auth-switch">Sudah punya akun? <Link to="/login">Masuk</Link></p>
    </AuthLayout>
  );
}
