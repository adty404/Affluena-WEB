import { useState, type InputHTMLAttributes } from 'react';
import { Input } from './Input';

/**
 * Password field with a reveal toggle. Shared by Login/Register/Reset so the
 * show/hide button stays consistent and accessible: it sits outside the field
 * <label>, is type="button", and exposes aria-pressed + an Indonesian
 * aria-label. Spread a react-hook-form `register(...)` result onto it just like
 * a plain <Input>.
 */
export function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <div className="password-field">
      <Input {...props} type={show ? 'text' : 'password'} />
      <button
        type="button"
        aria-pressed={show}
        aria-label={show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        onClick={() => setShow((value) => !value)}
      >
        {show ? 'Sembunyikan' : 'Tampilkan'}
      </button>
    </div>
  );
}
