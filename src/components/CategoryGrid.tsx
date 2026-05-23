interface Props {
  categories: string[];
  activeCategory: string;
  onCategoryClick: (category: string) => void;
}

const CategoryGrid = ({ categories, activeCategory, onCategoryClick }: Props) => (
  <section className="category-section" id="categories">
    <div className="section-heading">
      <div>
        <span className="eyebrow">Browse by category</span>
        <h2>Popular categories for every need</h2>
      </div>
      <p>Tap a category to narrow your search and see the freshest local listings.</p>
    </div>

    <div className="category-grid">
      {categories.slice(1, 7).map((category) => (
        <button
          key={category}
          type="button"
          className={`category-card ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryClick(category)}
        >
          <span>{category}</span>
          <small>{`Search ${category.toLowerCase()}`}</small>
        </button>
      ))}
    </div>
  </section>
);

export default CategoryGrid;
