import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { products, loading, error } = useProducts();

  const product = useMemo(
    () => products.find((item) => item.id === id),
    [products, id]
  );

  const similar = useMemo(
    () =>
      products
        .filter((item) => item.category === product?.category && item.id !== product?.id)
        .slice(0, 3),
    [products, product]
  );

  if (loading) {
    return (
      <main className="empty-state">
        <h4>Loading product...</h4>
      </main>
    );
  }

  if (error) {
    return (
      <main className="empty-state">
        <h4>{error}</h4>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="empty-state">
        <h4>Product not found</h4>
        <p>Try going back to browse other listings.</p>
        <button className="btn" type="button" onClick={() => navigate('/')}>Back to home</button>
      </main>
    );
  }

  return (
    <main className="product-detail-page">
      <section className="product-detail-card">
        <img src={product.image} alt={product.name} className="detail-image" />
        <div className="detail-content">
          <span className="eyebrow">{product.category}</span>
          <h2>{product.name}</h2>
          <div className="product-meta">
            <span>{product.condition}</span>
            <span>{product.location}</span>
          </div>
          <p className="product-description">{product.description}</p>
          <div className="detail-summary">
            <div>
              <strong>GHS {product.price.toLocaleString()}</strong>
              <p>Seller: {product.sellerName}</p>
            </div>
            <div>
              <p>Listed on {new Date(product.listedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="detail-actions">
            <button className="btn" type="button">Contact Seller</button>
            <button className="btn btn-secondary" type="button" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="browse-section">
          <div className="browse-header">
            <div>
              <h3>Similar listings</h3>
              <p>Items from the same category you may like.</p>
            </div>
          </div>
          <div className="grid-list">
            {similar.map((item) => (
              <article key={item.id} className="product-card" onClick={() => navigate(`/p/${item.id}`)}>
                <img src={item.image} alt={item.name} />
                <div className="product-content">
                  <div className="product-meta">
                    <span>{item.category}</span>
                    <span>{item.condition}</span>
                  </div>
                  <h3 className="product-title">{item.name}</h3>
                  <p className="product-description">{item.description}</p>
                  <div className="product-meta">
                    <span>{item.location}</span>
                    <span>{item.sellerType}</span>
                  </div>
                  <strong className="product-price">GHS {item.price.toLocaleString()}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetail;
