import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Product } from '../types';

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Product | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('userListings');
    const list: Product[] = raw ? JSON.parse(raw) : [];
    const found = list.find((l) => l.id === id);
    if (found) setItem(found);
  }, [id]);

  if (!item) {
    return (
      <main className="empty-state">
        <h4>Listing not found</h4>
      </main>
    );
  }

  const save = () => {
    const raw = localStorage.getItem('userListings');
    const list: Product[] = raw ? JSON.parse(raw) : [];
    const updated = list.map((l) => (l.id === item.id ? item : l));
    localStorage.setItem('userListings', JSON.stringify(updated));
    navigate('/seller');
  };

  return (
    <main>
      <section className="browse-section" style={{ maxWidth: 720, margin: '2rem auto' }}>
        <h3>Edit listing</h3>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <input value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} />
          <input type="number" value={item.price} onChange={(e) => setItem({ ...item, price: Number(e.target.value) })} />
          <input value={item.category} onChange={(e) => setItem({ ...item, category: e.target.value })} />
          <input value={item.location} onChange={(e) => setItem({ ...item, location: e.target.value })} />
          <input value={item.image} onChange={(e) => setItem({ ...item, image: e.target.value })} />
          <textarea value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn" onClick={save}>Save</button>
            <button className="btn btn-secondary" onClick={() => navigate('/seller')}>Cancel</button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EditListing;
