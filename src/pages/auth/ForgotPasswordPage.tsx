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
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: Values) {
    try {
      await requestPasswordReset(values.email);
      showToast('Jika email terdaftar, link reset sudah dikirim.');
      form.reset();
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal mengirim link reset.');
    }
  }

  return (
    <AuthLayout title="Reset akses akun dengan aman." description="Masukkan email, link reset akan dikirim." narrow>
      <h2>Lupa password</h2>
      <p>Masukkan email akun Affluena. Backend selalu mengembalikan respons sama untuk mencegah enumeration email.</p>
      <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <label>
          <span>Email</span>
          <Input type="email" autoComplete="email" {...form.register('email')} />
          {form.formState.errors.email && <span className="form-error">{form.formState.errors.email.message}</span>}
        </label>
        <Button type="submit" variant="primary" full disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Mengirim…' : 'Kirim link reset'}
        </Button>
      </form>
      <p className="auth-switch"><Link to="/login">Kembali ke login</Link></p>
    </AuthLayout>
  );
}
