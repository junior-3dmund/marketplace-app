import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/auth';
import { Product } from '../types';

const CreateListing = () => {
  const navigate = useNavigate();
  const current = auth.current();
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [category, setCategory] = useState('Misc');
  const [location, setLocation] = useState('Accra');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80');
  const [description, setDescription] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return navigate('/login');
    const raw = localStorage.getItem('userListings');
    const list: Product[] = raw ? JSON.parse(raw) : [];
    const id = `u_${Date.now()}`;
    const item: Product = {
      id,
      name,
      price: Number(price),
      category,
      location,
      sellerName: current.username,
      sellerType: 'Shop',
      image,
      description,
      condition: 'New',
      isFeatured: false,
      listedAt: new Date().toISOString().split('T')[0]
    };
    list.unshift(item);
    localStorage.setItem('userListings', JSON.stringify(list));
    navigate('/seller');
  };

  return (
    <main>
      <section className="browse-section" style={{ maxWidth: 720, margin: '2rem auto' }}>
        <h3>Create a listing</h3>
        <form onSubmit={submit} style={{ display: 'grid', gap: '0.75rem' }}>
          <input placeholder="Title" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')} />
          <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <input placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn" type="submit">Publish</button>
            <button className="btn btn-secondary" type="button" onClick={() => navigate('/seller')}>Cancel</button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreateListing;
