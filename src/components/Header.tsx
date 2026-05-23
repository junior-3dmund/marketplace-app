import { Link } from 'react-router-dom';

const Header = () => (
  <header className="site-header">
    <div className="site-brand">
      <div className="brand-icon">M</div>
      <div>
        <p className="eyebrow">Local Classifieds</p>
        <h1>Discover Ghana’s best marketplace.</h1>
      </div>
    </div>
    <nav className="nav-links">
      <Link to="/">Home</Link>
      <Link to="/sellers">Sellers</Link>
      <Link to="/categories/Phones">Categories</Link>
      <Link to="/p/p01">Featured</Link>
    </nav>
    <Link className="btn btn-secondary" to="/">
      Sell a product
    </Link>
  </header>
);

export default Header;
