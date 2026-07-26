import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';
import './Checkout.css';

function formatCardNumber(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    zip: '',
    country: 'United States'
  });

  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const shippingCost = subtotal > 75 || subtotal === 0 ? 0 : 8.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  function validate() {
    const errs = {};
    if (!shipping.fullName.trim()) errs.fullName = 'Required';
    if (!shipping.address.trim()) errs.address = 'Required';
    if (!shipping.city.trim()) errs.city = 'Required';
    if (!shipping.zip.trim()) errs.zip = 'Required';
    if (card.number.replace(/\s/g, '').length !== 16) errs.number = 'Enter a valid 16-digit card number';
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) errs.expiry = 'Use MM/YY format';
    if (card.cvc.length < 3) errs.cvc = 'Enter a valid CVC';
    if (!card.name.trim()) errs.cardName = 'Required';
    return errs;
  }

  const [serverError, setServerError] = useState('');

  async function handlePay(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setServerError('');
    if (Object.keys(errs).length > 0) return;

    setProcessing(true);
    try {
      // The backend recomputes prices from the catalog and simulates the
      // charge — swap that block server-side for a real gateway call
      // (e.g. Stripe PaymentIntents) to go live.
      const { order } = await api.createOrder({
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
        shipping,
        card
      });
      clearCart();
      navigate('/order-success', { state: { orderId: order.id, total: order.total } });
    } catch (err) {
      setServerError(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container checkout-empty">
        <h2>Your bag is empty</h2>
        <p>Add something you love before checking out.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Browse products</button>
      </div>
    );
  }

  return (
    <div className="container checkout">
      <form className="checkout-form" onSubmit={handlePay}>
        <section className="checkout-section card">
          <h3>Shipping address</h3>
          <div className="form-grid">
            <label className="span-2">
              Full name
              <input
                value={shipping.fullName}
                onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
              />
              {errors.fullName && <span className="field-error">{errors.fullName}</span>}
            </label>
            <label className="span-2">
              Street address
              <input
                value={shipping.address}
                onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                placeholder="123 Market Street"
              />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </label>
            <label>
              City
              <input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
              {errors.city && <span className="field-error">{errors.city}</span>}
            </label>
            <label>
              ZIP code
              <input value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} />
              {errors.zip && <span className="field-error">{errors.zip}</span>}
            </label>
            <label className="span-2">
              Country
              <select
                value={shipping.country}
                onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
              >
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>India</option>
                <option>Australia</option>
              </select>
            </label>
          </div>
        </section>

        <section className="checkout-section card">
          <h3><CreditCard size={18} /> Payment details</h3>
          <div className="form-grid">
            <label className="span-2">
              Card number
              <input
                value={card.number}
                onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                placeholder="4242 4242 4242 4242"
                inputMode="numeric"
              />
              {errors.number && <span className="field-error">{errors.number}</span>}
            </label>
            <label>
              Expiry
              <input
                value={card.expiry}
                onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                placeholder="MM/YY"
                inputMode="numeric"
              />
              {errors.expiry && <span className="field-error">{errors.expiry}</span>}
            </label>
            <label>
              CVC
              <input
                value={card.cvc}
                onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                placeholder="123"
                inputMode="numeric"
              />
              {errors.cvc && <span className="field-error">{errors.cvc}</span>}
            </label>
            <label className="span-2">
              Name on card
              <input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
              {errors.cardName && <span className="field-error">{errors.cardName}</span>}
            </label>
          </div>
          <p className="secure-note"><Lock size={13} /> This is a demo checkout — no real payment is processed.</p>
        </section>

        {serverError && <div className="auth-error">{serverError}</div>}

        <button className="btn btn-primary btn-full pay-btn" disabled={processing}>
          {processing ? 'Processing payment…' : `Pay $${total.toFixed(2)}`}
        </button>
      </form>

      <aside className="order-summary card">
        <h3>Order summary</h3>
        <div className="summary-items">
          {items.map((item) => (
            <div className="summary-item" key={item.id}>
              <img src={`https://picsum.photos/seed/${item.seed}/80/80`} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <span>Qty {item.qty}</span>
              </div>
              <strong>${(item.price * item.qty).toFixed(2)}</strong>
            </div>
          ))}
        </div>
        <div className="summary-line"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="summary-line"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span></div>
        <div className="summary-line"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
        <div className="summary-line total"><span>Total</span><span>${total.toFixed(2)}</span></div>
      </aside>
    </div>
  );
}
