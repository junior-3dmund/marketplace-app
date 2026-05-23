interface Props {
  query: string;
  onQueryChange: (value: string) => void;
}

const SearchBar = ({ query, onQueryChange }: Props) => (
  <div className="search-box">
    <input
      type="search"
      placeholder="Search phones, cars, fashion, home appliances..."
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
      aria-label="Search products"
    />
    <button type="button" className="btn">
      Search
    </button>
  </div>
);

export default SearchBar;
