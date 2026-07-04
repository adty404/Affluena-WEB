import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema, type RegisterFormValues } from '../../schemas/auth';
import type { ApiError } from '../../api/types';

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { register: registerUser } = useAuth();

  // Onboarding hands a chosen goal here via navigation state; surface it and
  // carry it to /dashboard so the choice isn't silently discarded.
  const onboardingGoal = (location.state as { goal?: string } | null)?.goal;

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
      if (onboardingGoal) {
        try {
          window.localStorage.setItem('affluena.onboardingGoal', onboardingGoal);
        } catch {
          // ignore storage failures (private mode etc.)
        }
      }
      showToast('Akun berhasil dibuat. Membuka Beranda...');
      window.setTimeout(() => navigate('/dashboard', { replace: true }), 200);
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Pendaftaran gagal. Coba email lain.');
    }
  }

  return (
    <AuthLayout title="Bangun kebiasaan finansial yang lebih rapi." description="Buat akun, lalu mulai kelola keuangan kamu.">
      <h2>Buat akun baru</h2>
      <p>Cukup email dan kata sandi untuk mulai.</p>
      {onboardingGoal ? <p className="field-help">Fokus yang kamu pilih: <strong>{onboardingGoal}</strong>.</p> : null}
      <form className="form-stack" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>
          <span>Email</span>
          <Input type="email" autoComplete="email" required {...field('email')} />
          {errors.email && <span className="form-error">{errors.email.message}</span>}
        </label>
        <label>
          <span>Kata Sandi</span>
          <PasswordInput autoComplete="new-password" required {...field('password')} />
          <small>Minimal 8 karakter</small>
          {errors.password && <span className="form-error">{errors.password.message}</span>}
        </label>
        <label>
          <span>Konfirmasi Kata Sandi</span>
          <PasswordInput autoComplete="new-password" required {...field('confirmPassword')} />
          {errors.confirmPassword && <span className="form-error">{errors.confirmPassword.message}</span>}
        </label>
        <Button type="submit" variant="primary" full disabled={isSubmitting}>
          {isSubmitting ? 'Memproses…' : 'Daftar'}
        </Button>
      </form>
      <p className="auth-switch">Sudah punya akun? <Link to="/login">Masuk</Link></p>
    </AuthLayout>
  );
}
