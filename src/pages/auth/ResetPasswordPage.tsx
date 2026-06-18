import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { resetPassword } from '../../api/auth';
import type { ApiError } from '../../api/types';

const schema = z.object({
  new_password: z.string().min(8, 'Password baru minimal 8 karakter'),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirm_password'],
});
type Values = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const token = searchParams.get('token') ?? '';

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { new_password: '', confirm_password: '' },
  });

  async function onSubmit(values: Values) {
    if (!token) {
      showToast('Token reset tidak ditemukan di URL.');
      return;
    }
    try {
      await resetPassword(token, values.new_password);
      showToast('Password berhasil direset. Silakan login.');
      window.setTimeout(() => navigate('/login'), 200);
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal mereset password. Token mungkin tidak valid.');
    }
  }

  return (
    <AuthLayout title="Buat password baru." description="Pastikan password baru kuat dan mudah diingat." narrow>
      <h2>Reset password</h2>
      {!token ? (
        <div className="readiness-list">
          <p style={{ color: 'var(--warning)' }}>Token reset tidak ditemukan. Buka link dari email reset.</p>
        </div>
      ) : null}
      <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <label>
          <span>Password baru</span>
          <div className="password-field">
            <Input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...form.register('new_password')}
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
          {form.formState.errors.new_password && <span className="form-error">{form.formState.errors.new_password.message}</span>}
        </label>
        <label>
          <span>Konfirmasi password</span>
          <Input
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            {...form.register('confirm_password')}
          />
          {form.formState.errors.confirm_password && <span className="form-error">{form.formState.errors.confirm_password.message}</span>}
        </label>
        <Button type="submit" variant="primary" full disabled={form.formState.isSubmitting || !token}>
          {form.formState.isSubmitting ? 'Memproses…' : 'Reset password'}
        </Button>
      </form>
      <p className="auth-switch"><Link to="/login">Kembali ke login</Link></p>
    </AuthLayout>
  );
}
