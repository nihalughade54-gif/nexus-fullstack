import { Link } from 'react-router-dom';
import { Star, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-media">
        <img
          src={`https://picsum.photos/seed/${product.seed}/480/480`}
          alt={product.name}
          loading="lazy"
        />
        {product.tag && (
          <span className={`badge product-tag ${product.tag === 'Sale' ? 'badge-amber' : 'badge-accent'}`}>
            {product.tag}
          </span>
        )}
      </Link>

      <div className="product-body">
        <p className="product-brand">{product.brand}</p>
        <Link to={`/product/${product.id}`} className="product-name">
          {product.name}
        </Link>

        <div className="product-rating">
          <Star size={13} fill="#f2a65a" stroke="none" />
          <span>{product.rating}</span>
          <span className="product-reviews">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className="add-btn"
            onClick={() => addItem(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
