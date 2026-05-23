import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn" type="submit">Sign in</button>
            <button className="btn btn-secondary" type="button" onClick={() => navigate('/register')}>Register</button>
            <Link className="btn btn-secondary" to="/forgot-password">Forgot password?</Link>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;
