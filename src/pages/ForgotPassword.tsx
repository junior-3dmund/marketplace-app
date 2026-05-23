import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../utils/auth';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your username, email, or phone number.');
      return;
    }

    if (!newPassword.trim()) {
      setError('Please enter a new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      auth.forgotPassword(identifier.trim(), newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError((err as Error).message || 'Unable to reset password.');
    }
  };

  return (
    <main className="auth-page">
      <section className="browse-section" style={{ maxWidth: 520, margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3>Reset your password</h3>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Enter your username, email, or phone number and create a new password.</p>
        </div>

        {success ? (
          <div style={{ padding: '1rem', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '10px', textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#065f46', fontWeight: 700 }}>✓ Password reset successfully!</p>
            <p style={{ margin: '0.5rem 0 0', color: '#047857', fontSize: '0.95rem' }}>Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'grid', gap: '0.75rem' }}>
            <input
              placeholder="Username, email, or phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <input
              placeholder="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              placeholder="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <div style={{ color: 'crimson', padding: '0.5rem', background: '#ffe5e5', borderRadius: '6px' }}>{error}</div>}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn" type="submit">Reset password</button>
              <Link className="btn btn-secondary" to="/login">Back to login</Link>
            </div>
          </form>
        )}
      </section>
    </main>
  );
};

export default ForgotPassword;
