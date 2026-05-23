import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/auth';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [asSeller, setAsSeller] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      auth.register({ username, email, phone, password, role: asSeller ? 'seller' : 'buyer' });
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <main className="auth-page">
      <section className="browse-section" style={{ maxWidth: 520, margin: '2rem auto' }}>
        <h3>Create account</h3>
        <form onSubmit={submit} style={{ display: 'grid', gap: '0.75rem' }}>
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="checkbox" checked={asSeller} onChange={(e) => setAsSeller(e.target.checked)} /> Register as a seller
          </label>
          {error && <div style={{ color: 'crimson' }}>{error}</div>}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn" type="submit">Create account</button>
            <button className="btn btn-secondary" type="button" onClick={() => navigate('/login')}>Back</button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Register;
