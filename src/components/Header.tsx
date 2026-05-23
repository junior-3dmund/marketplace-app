import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { auth } from '../utils/auth';
import { startWatching, stopWatching } from '../utils/geolocation';

const Header = () => {
  const current = auth.current();
  const navigate = useNavigate();

  useEffect(() => {
    if (current && current.username) {
      startWatching(current.username);
    }
    return () => {
      stopWatching();
    };
  }, [current]);

  const handleLogout = () => {
    auth.logout();
    stopWatching();
    navigate('/');
    window.location.reload();
  };

  return (
  <header className="site-header">
    <div className="site-brand">
      <div className="brand-icon">NM</div>
      <div>
        <p className="eyebrow">Nova Mart</p>
        <h1>Buy and sell locally — Nova Mart</h1>
      </div>
    </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/sellers">Sellers</Link>
        <Link to="/categories/Phones">Categories</Link>
        <Link to="/p/p01">Featured</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/help">Help Center</Link>
        {!current && <Link to="/login">Sign in</Link>}
        {!current && <Link to="/register">Register</Link>}
        {current && current.role === 'admin' && <Link to="/admin">Admin</Link>}
      </nav>
      {current ? (
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <span>Hi, {current.username}</span>
          <button className="btn" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <Link className="btn btn-secondary" to="/create-listing">Sell a product</Link>
      )}
    </header>
  );
};

export default Header;
