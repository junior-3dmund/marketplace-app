import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { items, remove, clear } = useCart();
  const navigate = useNavigate();

  const total = items.reduce((s, i) => s + (i.price || 0), 0);

  return (
    <main>
      <section className="browse-section" style={{ maxWidth: 900, margin: '2rem auto' }}>
        <div className="browse-header">
          <div>
            <h3>Your cart</h3>
            <p>{items.length} items</p>
          </div>
        </div>
        {items.length === 0 ? (
          <div className="empty-state">
            <h4>Your cart is empty</h4>
            <p>Browse listings to add items.</p>
          </div>
        ) : (
          <div>
            <div className="grid-list">
              {items.map((it) => (
                <article key={it.id} className="product-card">
                  <img src={it.image} alt={it.name} />
                  <div className="product-content">
                    <h3 className="product-title">{it.name}</h3>
                    <strong className="product-price">GHS {it.price.toLocaleString()}</strong>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button className="btn" onClick={() => remove(it.id)}>Remove</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <strong>Total: GHS {total.toLocaleString()}</strong>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn" onClick={() => navigate('/checkout')}>Checkout</button>
                <button className="btn btn-secondary" onClick={() => clear()}>Clear</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default CartPage;
