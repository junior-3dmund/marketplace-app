import { useEffect, useState } from 'react';
import { Product } from '../types';

const USER_LISTINGS_KEY = 'userListings';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const mergeUserListings = (base: Product[]) => {
      try {
        const raw = localStorage.getItem(USER_LISTINGS_KEY);
        const user: Product[] = raw ? JSON.parse(raw) : [];
        // user-created listings should appear first
        return [...user, ...base];
      } catch {
        return base;
      }
    };

    fetch('/products.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data: Product[]) => {
        if (cancelled) return;
        setProducts(mergeUserListings(data));
        setError(null);
      })
      .catch((fetchError) => {
        if (cancelled) return;
        setError((fetchError as Error).message || 'Unable to load products');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    const onStorage = () => {
      // re-run merge when other tabs add user listings
      try {
        const raw = localStorage.getItem(USER_LISTINGS_KEY);
        const user: Product[] = raw ? JSON.parse(raw) : [];
        setProducts((prev) => {
          // keep any base products already loaded, but prefer latest user listings
          const base = prev.filter((p) => !p.id.startsWith('u_'));
          return [...user, ...base];
        });
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return { products, loading, error };
};
