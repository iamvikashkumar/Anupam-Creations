import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/auth/AuthProvider';

export default function LoginPage() {
  const { signIn, resetPassword, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') navigate('/admin', { replace: true });
  }, [navigate, status]);

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error && error.message.includes('not configured')) {
      return 'Admin login is not configured yet. Please add the Firebase settings.';
    }
    return 'Unable to sign in. Please check your email and password.';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    if (!email.trim()) {
      setMessage('Enter your email first, then choose Forgot password.');
      return;
    }
    setMessage('');
    setIsSubmitting(true);
    try {
      await resetPassword(email.trim());
      setMessage('Password reset instructions sent. Check your email.');
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center bg-paper px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-center font-display text-2xl font-bold text-maroon">
          Anupam Creations
        </h1>
        <p className="mt-1 text-center text-sm text-ink/60">Admin login</p>
        <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-6">
          <label className="block text-sm font-semibold text-ink">
            Email
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 min-h-touch w-full rounded-card border border-ink/20 bg-white px-4 text-base"
            />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 min-h-touch w-full rounded-card border border-ink/20 bg-white px-4 text-base"
            />
          </label>
          {message && (
            <p role="alert" className="rounded-card bg-alert/10 px-3 py-2 text-sm text-alert-dark">
              {message}
            </p>
          )}
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleReset}
            className="min-h-touch w-full text-sm font-semibold text-maroon underline underline-offset-4"
          >
            Forgot password?
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-ink/45">
          {location.state?.from
            ? 'Sign in to continue to your admin workspace.'
            : 'Private workspace for Anupam Creations.'}
        </p>
      </div>
    </main>
  );
}
