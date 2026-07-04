import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { requestPasswordReset } from '../../api/auth';
import type { ApiError } from '../../api/types';

const schema = z.object({
  email: z.string().email('Email tidak valid'),
});
type Values = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: Values) {
    try {
      await requestPasswordReset(values.email);
      showToast('Jika email terdaftar, tautan reset sudah dikirim.');
      setSentTo(values.email);
      form.reset();
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal mengirim tautan reset.');
    }
  }

  return (
    <AuthLayout title="Reset akses akun dengan aman." description="Masukkan email, tautan reset akan dikirim." narrow>
      <h2>Lupa kata sandi</h2>
      {sentTo ? (
        <>
          <div className="warning-note" style={{ borderColor: 'rgba(46,139,87,.28)', background: 'var(--success-soft)', color: 'var(--success)' }}>
            Jika <strong>{sentTo}</strong> terdaftar, tautan reset sudah dikirim ke email itu. Cek kotak masuk dan folder spam.
          </div>
          <Button to="/login" variant="primary" full>Kembali ke masuk</Button>
        </>
      ) : (
        <>
          <p>Masukkan email akun Affluena kamu. Kami akan mengirimkan tautan reset jika email terdaftar.</p>
          <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <label>
              <span>Email</span>
              <Input type="email" autoComplete="email" {...form.register('email')} />
              {form.formState.errors.email && <span className="form-error">{form.formState.errors.email.message}</span>}
            </label>
            <Button type="submit" variant="primary" full disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Mengirim…' : 'Kirim tautan reset'}
            </Button>
          </form>
          <p className="auth-switch"><Link to="/login">Kembali ke halaman masuk</Link></p>
        </>
      )}
    </AuthLayout>
  );
}
