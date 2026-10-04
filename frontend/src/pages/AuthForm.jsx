import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Field } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthForm({ mode }) {
  const isRegister = mode === 'register';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await (isRegister ? register(values) : login({ email: values.email, password: values.password }));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  const fieldError = (name) => error?.details?.[name];

  return (
    <div className="grid h-full place-items-center px-6">
      <form onSubmit={submit} className="page w-full max-w-sm space-y-5">
        <div>
          <Link to="/" className="text-sm text-muted hover:text-ink">Interview Forage</Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{isRegister ? 'Create your account' : 'Sign in'}</h1>
        </div>
        {error && !error.details && <p role="alert" className="rounded-md border border-danger/40 bg-danger/5 px-3 py-2 text-sm">{error.message}</p>}
        {isRegister && (
          <Field label="Name" error={fieldError('name')}>
            <input className="input" value={values.name} onChange={set('name')} autoComplete="name" required />
          </Field>
        )}
        <Field label="Email" error={fieldError('email')}>
          <input className="input" type="email" value={values.email} onChange={set('email')} autoComplete="email" required />
        </Field>
        <Field label="Password" error={fieldError('password')} hint={isRegister ? 'At least 8 characters, with a letter and a number.' : undefined}>
          <input className="input" type="password" value={values.password} onChange={set('password')} autoComplete={isRegister ? 'new-password' : 'current-password'} required />
        </Field>
        <Button variant="primary" className="w-full" loading={busy}>{isRegister ? 'Create account' : 'Sign in'}</Button>
        <p className="text-sm text-muted">
          {isRegister ? 'Already have an account? ' : 'New here? '}
          <Link className="text-brand hover:text-brand-hover" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link>
        </p>
      </form>
    </div>
  );
}
