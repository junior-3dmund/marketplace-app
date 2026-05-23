import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="page-footer">
    <div>
      <strong>Marketplace</strong>
      <p>Modern local commerce with clean browsing, listings, and seller contact features.</p>
    </div>
    <div className="footer-links">
      <Link to="/">Home</Link>
      <Link to="/sellers">Sellers</Link>
      <Link to="/categories/Phones">Categories</Link>
    </div>
  </footer>
);

export default Footer;
