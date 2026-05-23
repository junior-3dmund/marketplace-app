import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import CategoryGrid from '../components/CategoryGrid';
import FilterBar from '../components/FilterBar';
import ProductCard from '../components/ProductCard';
import SellerSpotlight from '../components/SellerSpotlight';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((product) => product.category)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return products
      .filter((product) => {
        const matchesQuery =
          product.name.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery) ||
          product.location.toLowerCase().includes(lowerQuery);
        const matchesCategory = category === 'All' || product.category === category;
        return matchesQuery && matchesCategory;
      })
      .sort((a, b) => {
        if (sort === 'latest') {
          return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime();
        }
        if (sort === 'price-asc') {
          return a.price - b.price;
        }
        if (sort === 'price-desc') {
          return b.price - a.price;
        }
        return Number(b.isFeatured) - Number(a.isFeatured);
      });
  }, [products, query, category, sort]);

  const featuredProducts = useMemo(
    () => products.filter((product) => product.isFeatured).slice(0, 4),
    [products]
  );

  const latestProducts = useMemo(
    () => [...products].sort((a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime()).slice(0, 6),
    [products]
  );

  const sellerSummary = useMemo(() => {
    const map = new Map<string, { name: string; location: string; listings: number }>();
    products.forEach((product) => {
      const existing = map.get(product.sellerName);
      if (existing) {
        existing.listings += 1;
      } else {
        map.set(product.sellerName, {
          name: product.sellerName,
          location: product.location,
          listings: 1,
        });
      }
    });
    return Array.from(map.values()).slice(0, 3);
  }, [products]);

  const openProduct = (product: Product) => {
    navigate(`/p/${product.id}`);
  };

  return (
    <main>
      <section className="hero-panel">
        <div>
          <span className="eyebrow">Local marketplace</span>
          <h2>Shop the best deals from sellers across Ghana</h2>
          <p>
            Browse verified listings for phones, electronics, motors, fashion, home goods, and more.
            Search, filter, and contact sellers in a clean local marketplace experience.
          </p>
          <SearchBar query={query} onQueryChange={setQuery} />
        </div>

        <div className="hero-cards">
          {featuredProducts.map((product) => (
            <article key={product.id} className="hero-card" onClick={() => openProduct(product)}>
              <img src={product.image} alt={product.name} />
              <div>
                <strong>{product.name}</strong>
                <span>{product.location}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CategoryGrid categories={categories} activeCategory={category} onCategoryClick={setCategory} />

      <section className="stats-grid">
        <article className="stat-card">
          <strong>{products.length}</strong>
          <p>Active listings</p>
        </article>
        <article className="stat-card">
          <strong>{Array.from(new Set(products.map((product) => product.sellerName))).length}</strong>
          <p>Unique sellers</p>
        </article>
        <article className="stat-card">
          <strong>{categories.length - 1}</strong>
          <p>Categories</p>
        </article>
      </section>

      <section className="browse-section" id="top-listings">
        <div className="browse-header">
          <div>
            <h3>Top listings</h3>
            <p>Explore the newest and most popular items in the marketplace.</p>
          </div>
          <FilterBar
            categories={categories}
            activeCategory={category}
            onCategoryChange={setCategory}
            sort={sort}
            onSortChange={setSort}
          />
        </div>

        <div className="grid-list">
          {loading ? (
            <div className="empty-state">
              <h4>Loading listings...</h4>
            </div>
          ) : error ? (
            <div className="empty-state">
              <h4>{error}</h4>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onOpen={() => openProduct(product)} />
            ))
          ) : (
            <div className="empty-state">
              <h4>No matching products</h4>
              <p>Try a broader keyword or remove the active filter.</p>
            </div>
          )}
        </div>
      </section>

      <section className="work-section" id="how-it-works">
        <div className="section-heading">
          <div>
            <span className="eyebrow">How it works</span>
            <h2>Buy or sell in three easy steps</h2>
          </div>
          <p>Get started quickly with simple browsing, seller contact, and secure listing creation.</p>
        </div>
        <div className="work-grid">
          <article className="work-card">
            <strong>1. Find a category</strong>
            <p>Search listings by category, price, or location to find the exact item you need.</p>
          </article>
          <article className="work-card">
            <strong>2. Compare offers</strong>
            <p>Review product details, prices, and seller reputation before you reach out.</p>
          </article>
          <article className="work-card">
            <strong>3. Contact the seller</strong>
            <p>Send a message or call the seller to negotiate, arrange delivery, and close the deal.</p>
          </article>
        </div>
      </section>

      <SellerSpotlight sellers={sellerSummary} />
    </main>
  );
};

export default Home;
