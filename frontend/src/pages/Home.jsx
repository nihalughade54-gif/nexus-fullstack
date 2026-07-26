import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';
import FilterSidebar from '../components/FilterSidebar.jsx';
import './Home.css';

export default function Home({ search }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(1500);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    api
      .getProducts({
        category: category === 'All' ? undefined : category,
        maxPrice,
        sort: sort === 'featured' ? undefined : sort,
        search: search.trim() || undefined
      })
      .then((data) => {
        if (!cancelled) setProducts(data.products);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load products. Is the backend running?');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category, sort, maxPrice, search]);

  const categories = useMemo(
    () => ['All', 'Audio', 'Wearables', 'Laptops', 'Phones', 'Footwear', 'Home'],
    []
  );

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="badge badge-accent hero-eyebrow">New season drop</span>
            <h1>Tech and gear<br />worth obsessing over.</h1>
            <p>Curated electronics, footwear, and home essentials from brands you already trust — at prices that make sense.</p>
          </div>
        </div>
      </section>

      <section className="container catalog">
        <FilterSidebar
          categories={categories}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
        />

        <div className="catalog-main">
          <div className="catalog-heading">
            <h2>{category === 'All' ? 'All products' : category}</h2>
            <span>{loading ? 'Loading…' : `${products.length} item${products.length !== 1 ? 's' : ''}`}</span>
          </div>

          {error && (
            <div className="empty-state">
              <p>Couldn't load products</p>
              <span>{error}</span>
            </div>
          )}

          {!error && !loading && products.length === 0 && (
            <div className="empty-state">
              <p>No products match your filters.</p>
              <span>Try widening your price range or clearing the search.</span>
            </div>
          )}

          {!error && (loading ? (
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="product-skeleton" />
              ))}
            </div>
          ) : (
            products.length > 0 && (
              <div className="product-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )
          ))}
        </div>
      </section>
    </>
  );
}
