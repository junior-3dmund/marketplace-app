import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { auth } from '../utils/auth';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const current = auth.current();
  const { items } = useCart();
  const { products, loading, error } = useProducts();

  const recommended = useMemo(() => products.slice(0, 6), [products]);

  return (
    <main>
      <section className="hero-panel" style={{ margin: '1.5rem 0' }}>
        <div className="left">
          <span className="eyebrow">Buyer Dashboard</span>
          <h2>Welcome back, {current?.username}</h2>
          <p>Shop trusted listings, manage your cart, and connect with sellers across Ghana.</p>
          <div className="search" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => navigate('/')}>Browse new items</button>
          </div>
        </div>
        <div className="hero-cards">
          <article className="hero-card" onClick={() => navigate('/cart')} style={{ cursor: 'pointer' }}>
            <div style={{ flex: 1 }}>
              <strong>{items.length} items in cart</strong>
              <span>View and checkout your items</span>
            </div>
          </article>
          <article className="hero-card" onClick={() => navigate('/sellers')} style={{ cursor: 'pointer' }}>
            <div style={{ flex: 1 }}>
              <strong>Browse sellers</strong>
              <span>See profiles and ratings</span>
            </div>
          </article>
        </div>
      </section>

      <section className="browse-section" style={{ margin: '1.5rem auto' }}>
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="stat-card" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '1.3rem', display: 'block' }}>Ready to sell?</strong>
              <p style={{ margin: '0.5rem 0 0', color: '#666', fontSize: '0.95rem' }}>List your first item on Nova Mart and start earning today.</p>
            </div>
            <button className="btn" onClick={() => navigate('/create-listing')} style={{ whiteSpace: 'nowrap' }}>
              Become a seller
            </button>
          </div>
        </div>
      </section>

      <section className="browse-section" style={{ margin: '1.5rem auto' }}>
        <div className="section-heading" style={{ marginBottom: '1.25rem' }}>
          <h3>Recommended for you</h3>
          <p>Popular items trending on Nova Mart marketplace.</p>
        </div>
        {loading ? (
          <div className="empty-state">
            <h4>Loading product recommendations...</h4>
          </div>
        ) : error ? (
          <div className="empty-state">
            <h4>{error}</h4>
          </div>
        ) : recommended.length > 0 ? (
          <div className="grid-list">
            {recommended.map((product) => (
              <ProductCard key={product.id} product={product} onOpen={() => navigate(`/p/${product.id}`)} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h4>No products available yet.</h4>
            <p>Check back soon for new listings.</p>
          </div>
        )}
      </section>

      {current?.role === 'seller' && (
        <section className="browse-section" style={{ margin: '1.5rem auto' }}>
          <div style={{ padding: '1rem', background: 'var(--primary-100)', border: '1px solid #cfeff6', borderRadius: '12px' }}>
            <strong style={{ fontSize: '1.05rem' }}>Seller mode</strong>
            <p style={{ margin: '0.5rem 0 0', color: 'var(--muted)', fontSize: '0.95rem' }}>You also have seller privileges.</p>
            <button className="btn" onClick={() => navigate('/seller')} style={{ marginTop: '0.75rem' }}>
              Go to seller dashboard
            </button>
          </div>
        </section>
      )}
    </main>
  );
};

export default BuyerDashboard;
