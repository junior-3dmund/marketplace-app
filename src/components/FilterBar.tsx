interface Props {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
}

const FilterBar = ({ categories, activeCategory, onCategoryChange, sort, onSortChange }: Props) => (
  <div className="filter-row">
    <select value={activeCategory} onChange={(event) => onCategoryChange(event.target.value)}>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
    <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
      <option value="featured">Featured</option>
      <option value="latest">Latest</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  </div>
);

export default FilterBar;
