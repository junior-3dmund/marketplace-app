import { useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';

const Sellers = () => {
  const { products, loading, error } = useProducts();

  const sellers = useMemo(() => {
    const map = new Map<string, { name: string; location: string; listings: number }>();
    products.forEach((product) => {
      const active = map.get(product.sellerName);
      if (active) {
        active.listings += 1;
      } else {
        map.set(product.sellerName, {
          name: product.sellerName,
          location: product.location,
          listings: 1,
        });
      }
    });
    return Array.from(map.values());
  }, [products]);

  if (loading) {
    return (
      <main className="empty-state">
        <h4>Loading sellers...</h4>
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

  return (
    <main className="seller-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Trusted sellers</span>
          <h2>Meet the top sellers on the marketplace</h2>
        </div>
        <p>See who is selling the most listings and serving buyers across the region.</p>
      </div>
      <div className="seller-grid">
        {sellers.map((seller) => (
          <article key={seller.name} className="seller-card">
            <div>
              <strong>{seller.name}</strong>
              <p>{seller.location}</p>
            </div>
            <span>{seller.listings} listings</span>
          </article>
        ))}
      </div>
    </main>
  );
};

export default Sellers;
