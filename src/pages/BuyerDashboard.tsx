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
      <section className="browse-section" style={{ maxWidth: 1000, margin: '2rem auto' }}>
        <div className="section-heading" style={{ marginBottom: '1rem' }}>
          <span className="eyebrow">Buyer Dashboard</span>
          <h2>Welcome back, {current?.username}</h2>
          <p>Shop trusted listings, add items to your cart, and quickly reach the sellers marketplace.</p>
        </div>

        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="stat-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '1.5rem' }}>{items.length}</strong>
              <p style={{ margin: '.4rem 0 0' }}>Items in your cart</p>
            </div>
            <button className="btn" type="button" onClick={() => navigate('/cart')}>
              View cart
            </button>
          </div>
          <div className="stat-card" style={{ padding: '1rem', display: 'grid', gap: '0.7rem' }}>
            <strong style={{ fontSize: '1.1rem' }}>Quick actions</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button className="btn" onClick={() => navigate('/')}>Browse items</button>
              <button className="btn btn-secondary" onClick={() => navigate('/sellers')}>Browse sellers</button>
              {current?.role === 'seller' && (
                <button className="btn" onClick={() => navigate('/seller')}>Seller dashboard</button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="browse-section" style={{ maxWidth: 1000, margin: '0 auto 2rem' }}>
        <div className="section-heading" style={{ marginBottom: '1rem' }}>
          <h3>Recommended products</h3>
          <p>Popular items you can add to cart and purchase right away.</p>
        </div>
        {loading ? (
          <div className="empty-state">
            <h4>Loading product recommendations...</h4>
          </div>
        ) : error ? (
          <div className="empty-state">
            <h4>{error}</h4>
          </div>
        ) : (
          <div className="grid-list">
            {recommended.map((product) => (
              <ProductCard key={product.id} product={product} onOpen={() => navigate(`/p/${product.id}`)} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default BuyerDashboard;
