import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { auth } from '../utils/auth';

const Checkout = () => {
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const current = auth.current();
  const [processing, setProcessing] = useState(false);

  const total = items.reduce((s, i) => s + (i.price || 0), 0);

  const doCheckout = () => {
    if (!current) return navigate('/login');
    setProcessing(true);
    const transactionsRaw = localStorage.getItem('transactions');
    const transactions = transactionsRaw ? JSON.parse(transactionsRaw) : [];
    const tx = {
      id: `tx_${Date.now()}`,
      buyer: current.username,
      items,
      total,
      date: new Date().toISOString(),
      status: 'completed'
    };
    transactions.push(tx);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    clear();
    setProcessing(false);
    navigate('/');
  };

  return (
    <main>
      <section className="browse-section" style={{ maxWidth: 720, margin: '2rem auto' }}>
        <h3>Checkout</h3>
        <p>{items.length} items — Total: GHS {total.toLocaleString()}</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn" onClick={doCheckout} disabled={processing || items.length === 0}>Complete purchase</button>
          <button className="btn btn-secondary" onClick={() => navigate('/cart')}>Back to cart</button>
        </div>
      </section>
    </main>
  );
};

export default Checkout;
