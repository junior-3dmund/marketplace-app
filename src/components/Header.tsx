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

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'sea';
    document.body.classList.toggle('theme-sea', theme === 'sea');
    document.body.classList.toggle('theme-light', theme === 'light');
  }, []);

  const toggleTheme = () => {
    const currentTheme = localStorage.getItem('theme') || 'sea';
    const next = currentTheme === 'sea' ? 'light' : 'sea';
    localStorage.setItem('theme', next);
    document.body.classList.toggle('theme-sea', next === 'sea');
    document.body.classList.toggle('theme-light', next === 'light');
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
    <div style={{ flex: 1, margin: '0 1rem' }}>
      <div style={{ display: 'flex' }}>
        <input placeholder="Search products, brands and categories" style={{ flex: 1, padding: '.5rem', borderRadius: '4px 0 0 4px', border: '1px solid #ddd' }} />
        <button className="btn" style={{ borderRadius: '0 4px 4px 0' }}>Search</button>
      </div>
      <div style={{ fontSize: '.85rem', color: '#666', marginTop: '.25rem' }}>Categories: Electronics • Fashion • Home • Vehicles</div>
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
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
        <button className="btn" onClick={toggleTheme} title="Toggle theme">Theme</button>
        {current ? (
          <>
            <span>Hi, {current.username}</span>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link className="btn btn-secondary" to="/create-listing">Sell a product</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
