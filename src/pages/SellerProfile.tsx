import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/auth';
import { useProducts } from '../hooks/useProducts';

const SellerProfile = () => {
  const navigate = useNavigate();
  const current = auth.current();
  const { products, loading } = useProducts();

  const myListings = useMemo(() => {
    if (!current) return [];
    return products.filter((p) => p.sellerName === current.username || p.sellerName === current.email);
  }, [products, current]);

  if (!current) return null;

  return (
    <main>
      <section className="browse-section" style={{ maxWidth: 900, margin: '2rem auto' }}>
        <div className="browse-header">
          <div>
            <h3>{current.username}'s profile</h3>
            <p>{current.email}</p>
          </div>
          <div>
            <button className="btn" onClick={() => navigate('/create-listing')}>Create listing</button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : (
          <div className="grid-list">
            {myListings.map((p) => (
              <article key={p.id} className="product-card">
                <img src={p.image} alt={p.name} />
                <div className="product-content">
                  <h3 className="product-title">{p.name}</h3>
                  <p className="product-description">{p.description}</p>
                  <div className="product-meta">
                    <strong className="product-price">GHS {p.price.toLocaleString()}</strong>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn" onClick={() => navigate(`/seller/edit/${p.id}`)}>Edit</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default SellerProfile;
