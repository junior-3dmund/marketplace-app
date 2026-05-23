import { useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { auth } from '../utils/auth';

const SellerDashboard = () => {
  const { products, loading } = useProducts();
  const current = auth.current();

  const myListings = useMemo(() => {
    if (!current) return [];
    return products.filter((p) => p.sellerName === current.username || p.sellerName === current.email);
  }, [products, current]);

  return (
    <main>
      <section className="browse-section" style={{ maxWidth: 900, margin: '2rem auto' }}>
        <div className="browse-header">
          <div>
            <h3>Your seller dashboard</h3>
            <p>Manage your listings and view performance.</p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : (
          <div className="grid-list">
            {myListings.length > 0 ? (
              myListings.map((p) => (
                <article key={p.id} className="product-card">
                  <img src={p.image} alt={p.name} />
                  <div className="product-content">
                    <h3 className="product-title">{p.name}</h3>
                    <p className="product-description">{p.description}</p>
                    <div className="product-meta">
                      <strong className="product-price">GHS {p.price.toLocaleString()}</strong>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <h4>No listings yet</h4>
                <p>Create your first listing.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default SellerDashboard;
