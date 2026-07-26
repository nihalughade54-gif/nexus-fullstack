import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Star, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';
import { api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api
      .getProduct(id)
      .then((data) => setProduct(data.product))
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="container not-found">
        <h2>Product not found</h2>
        <Link to="/" className="btn btn-primary">Back to shop</Link>
      </div>
    );
  }

  if (!product) return null;

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="container product-detail">
      <div className="pd-media">
        <img src={`https://picsum.photos/seed/${product.seed}/700/700`} alt={product.name} />
      </div>

      <div className="pd-info">
        <p className="product-brand">{product.brand}</p>
        <h1>{product.name}</h1>

        <div className="product-rating">
          <Star size={14} fill="#f2a65a" stroke="none" />
          <span>{product.rating}</span>
          <span className="product-reviews">({product.reviews.toLocaleString()} reviews)</span>
        </div>

        <p className="pd-price">${product.price.toFixed(2)}</p>
        <p className="pd-description">{product.description}</p>

        <div className="pd-purchase">
          <div className="qty-control large">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
              <Minus size={14} />
            </button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
              <Plus size={14} />
            </button>
          </div>
          <button className="btn btn-primary" onClick={handleAdd}>
            {added ? 'Added to bag ✓' : 'Add to bag'}
          </button>
        </div>

        <div className="pd-perks">
          <div><Truck size={16} /> Free shipping on orders over $75</div>
          <div><ShieldCheck size={16} /> 2-year warranty included</div>
        </div>
      </div>
    </div>
  );
}
