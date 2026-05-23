import { useEffect, useState } from 'react';
import { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/products.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setError(null);
      })
      .catch((fetchError) => {
        setError((fetchError as Error).message || 'Unable to load products');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
};
