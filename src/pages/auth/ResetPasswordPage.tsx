import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { PasswordInput } from '../../components/ui/PasswordInput';
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
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [done, setDone] = useState(false);
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
      setDone(true);
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal mereset kata sandi. Tautan mungkin sudah tidak berlaku.');
    }
  }

  return (
    <AuthLayout title="Buat kata sandi baru." description="Pastikan kata sandi baru kuat dan mudah diingat." narrow>
      <h2>Reset kata sandi</h2>
      {done ? (
        <>
          <div className="warning-note" style={{ borderColor: 'rgba(46,139,87,.28)', background: 'var(--success-soft)', color: 'var(--success)' }}>
            Kata sandi berhasil direset. Sekarang kamu bisa masuk dengan kata sandi baru.
          </div>
          <Button to="/login" variant="primary" full>Masuk sekarang</Button>
        </>
      ) : (
        <>
          {!token ? (
            <div className="warning-note">Tautan reset tidak ditemukan. Buka tautan dari email reset kamu.</div>
          ) : null}
          <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <label>
              <span>Kata sandi baru</span>
              <PasswordInput autoComplete="new-password" {...form.register('new_password')} />
              <small>Minimal 8 karakter</small>
              {form.formState.errors.new_password && <span className="form-error">{form.formState.errors.new_password.message}</span>}
            </label>
            <label>
              <span>Konfirmasi kata sandi</span>
              <PasswordInput autoComplete="new-password" {...form.register('confirm_password')} />
              {form.formState.errors.confirm_password && <span className="form-error">{form.formState.errors.confirm_password.message}</span>}
            </label>
            <Button type="submit" variant="primary" full disabled={form.formState.isSubmitting || !token}>
              {form.formState.isSubmitting ? 'Memproses…' : 'Reset kata sandi'}
            </Button>
          </form>
          <p className="auth-switch"><Link to="/login">Kembali ke halaman masuk</Link></p>
        </>
      )}
    </AuthLayout>
  );
}
