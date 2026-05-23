import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';

interface CartContextValue {
  items: Product[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem('cart_items');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  const add = (p: Product) => setItems((s) => [...s, p]);
  const remove = (id: string) => setItems((s) => s.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  return <CartContext.Provider value={{ items, add, remove, clear }}>{children}</CartContext.Provider>;
};
