import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      auth.login(identifier, password);
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const recoverPassword = () => {
    const identifierValue = window.prompt('Enter your username, email, or phone number to reset password');
    if (!identifierValue) return;
    const newPassword = window.prompt('Enter your new password');
    if (!newPassword) {
      return;
    }
    try {
      auth.forgotPassword(identifierValue.trim(), newPassword);
      alert('Password updated. You can now sign in with the new password.');
    } catch (err) {
      alert((err as Error).message || 'Unable to reset password.');
    }
  };

  return (
    <main className="auth-page">
      <section className="browse-section" style={{ maxWidth: 520, margin: '2rem auto' }}>
        <h3>Sign in</h3>
        <form onSubmit={submit} style={{ display: 'grid', gap: '0.75rem' }}>
          <input
            placeholder="Username, email or phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div style={{ color: 'crimson' }}>{error}</div>}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button className="btn" type="submit">Sign in</button>
            <button className="btn btn-secondary" type="button" onClick={() => navigate('/register')}>Register</button>
          </div>
          <button type="button" className="btn btn-secondary" onClick={recoverPassword}>
            Forgot password?
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
