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
  new_password: z.string().min(8, 'Kata sandi baru minimal 8 karakter'),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: 'Konfirmasi kata sandi tidak cocok',
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
      showToast('Tautan reset tidak valid. Buka tautan dari email kamu.');
      return;
    }
    try {
      await resetPassword(token, values.new_password);
      showToast('Kata sandi berhasil direset. Silakan masuk.');
      window.setTimeout(() => navigate('/login'), 200);
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal mereset kata sandi. Tautan mungkin sudah tidak berlaku.');
    }
  }

  return (
    <AuthLayout title="Buat kata sandi baru." description="Pastikan kata sandi baru kuat dan mudah diingat." narrow>
      <h2>Reset kata sandi</h2>
      {!token ? (
        <div className="readiness-list">
          <p style={{ color: 'var(--warning)' }}>Tautan reset tidak ditemukan. Buka tautan dari email reset kamu.</p>
        </div>
      ) : null}
      <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <label>
          <span>Kata sandi baru</span>
          <div className="password-field">
            <Input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...form.register('new_password')}
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</button>
          </div>
          {form.formState.errors.new_password && <span className="form-error">{form.formState.errors.new_password.message}</span>}
        </label>
        <label>
          <span>Konfirmasi kata sandi</span>
          <Input
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            {...form.register('confirm_password')}
          />
          {form.formState.errors.confirm_password && <span className="form-error">{form.formState.errors.confirm_password.message}</span>}
        </label>
        <Button type="submit" variant="primary" full disabled={form.formState.isSubmitting || !token}>
          {form.formState.isSubmitting ? 'Memproses…' : 'Reset kata sandi'}
        </Button>
      </form>
      <p className="auth-switch"><Link to="/login">Kembali ke halaman masuk</Link></p>
    </AuthLayout>
  );
}
