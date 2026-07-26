import './FilterSidebar.css';

export default function FilterSidebar({ categories, category, setCategory, sort, setSort, maxPrice, setMaxPrice }) {
  return (
    <aside className="filters">
      <div className="filter-group">
        <h4>Category</h4>
        <div className="filter-list">
          {categories.map((c) => (
            <button
              key={c}
              className={`filter-chip ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h4>Max price · ${maxPrice}</h4>
        <input
          type="range"
          min="50"
          max="1500"
          step="25"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="price-slider"
        />
      </div>

      <div className="filter-group">
        <h4>Sort by</h4>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </aside>
  );
}
