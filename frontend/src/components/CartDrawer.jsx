import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './CartDrawer.css';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? 'visible' : ''}`}
        onClick={() => setIsOpen(false)}
      />
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        <div className="drawer-header">
          <h3>Your Bag ({items.reduce((s, i) => s + i.qty, 0)})</h3>
          <button className="icon-btn" onClick={() => setIsOpen(false)} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <p>Your bag is empty.</p>
            <button className="btn btn-ghost" onClick={() => setIsOpen(false)}>
              Continue browsing
            </button>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {items.map((item) => (
                <div className="drawer-item" key={item.id}>
                  <img src={`https://picsum.photos/seed/${item.seed}/120/120`} alt={item.name} />
                  <div className="drawer-item-info">
                    <p className="drawer-item-name">{item.name}</p>
                    <p className="drawer-item-price">${item.price.toFixed(2)}</p>
                    <div className="qty-control">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease quantity">
                        <Minus size={13} />
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase quantity">
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="drawer-footer">
              <div className="drawer-subtotal">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <p className="drawer-note">Shipping and taxes calculated at checkout.</p>
              <button
                className="btn btn-primary btn-full"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/checkout');
                }}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
