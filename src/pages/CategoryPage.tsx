import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import FilterBar from '../components/FilterBar';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

const CategoryPage = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const { products, loading, error } = useProducts();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');

  const filteredProducts = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return products
      .filter((product) => {
        const matchesCategory = !category || category === 'All' || product.category === category;
        const matchesQuery =
          product.name.toLowerCase().includes(lowerQuery) ||
          product.location.toLowerCase().includes(lowerQuery);
        return matchesCategory && matchesQuery;
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
  }, [products, category, query, sort]);

  return (
    <main>
      <section className="browse-section">
        <div className="browse-header">
          <div>
            <h3>{category ? category : 'Category'} listings</h3>
            <p>Browse the current inventory for this category.</p>
          </div>
          <FilterBar
            categories={['All', ...Array.from(new Set(products.map((product) => product.category)))]}
            activeCategory={category || 'All'}
            onCategoryChange={(value) => navigate(`/categories/${value}`)}
            sort={sort}
            onSortChange={setSort}
          />
        </div>
        <SearchBar query={query} onQueryChange={setQuery} />
        <div className="grid-list" style={{ marginTop: '1.25rem' }}>
          {loading ? (
            <div className="empty-state">
              <h4>Loading category listings...</h4>
            </div>
          ) : error ? (
            <div className="empty-state">
              <h4>{error}</h4>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onOpen={() => navigate(`/p/${product.id}`)} />
            ))
          ) : (
            <div className="empty-state">
              <h4>No products found</h4>
              <p>Try another category or adjust your search.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default CategoryPage;
