import { Router } from 'express';
import { readTable, writeTable } from '../data/db.js';
import { requireAuth } from '../middleware/auth.js';
import { products } from '../data/products.js';

const router = Router();

// Creates an order after "charging" the card.
// This SIMULATES payment processing — no real gateway is called.
// To go live, replace the block below with a call to your payment
// provider's server-side API (e.g. Stripe PaymentIntents) and only
// create the order once that call confirms success.
router.post('/', requireAuth, (req, res) => {
  const { items, shipping, card } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty.' });
  }
  if (!shipping?.fullName || !shipping?.address || !shipping?.city || !shipping?.zip) {
    return res.status(400).json({ error: 'Complete shipping address is required.' });
  }
  const cardDigits = (card?.number || '').replace(/\s/g, '');
  if (cardDigits.length !== 16 || !/^\d{2}\/\d{2}$/.test(card?.expiry || '') || (card?.cvc || '').length < 3) {
    return res.status(400).json({ error: 'Invalid payment details.' });
  }

  // Recompute totals server-side from the catalog — never trust client-sent prices.
  let subtotal = 0;
  const lineItems = items.map((item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) throw new Error(`Unknown product: ${item.id}`);
    subtotal += product.price * item.qty;
    return { id: product.id, name: product.name, price: product.price, qty: item.qty };
  });
  const shippingCost = subtotal > 75 ? 0 : 8.99;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + shippingCost + tax).toFixed(2));

  const order = {
    id: `NX-${Math.floor(100000 + Math.random() * 900000)}`,
    userId: req.user.id,
    items: lineItems,
    shipping,
    subtotal: Number(subtotal.toFixed(2)),
    shippingCost,
    tax,
    total,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  const orders = readTable('orders');
  writeTable('orders', [...orders, order]);

  res.status(201).json({ order });
});

router.get('/', requireAuth, (req, res) => {
  const orders = readTable('orders').filter((o) => o.userId === req.user.id);
  res.json({ orders });
});

router.get('/:id', requireAuth, (req, res) => {
  const order = readTable('orders').find((o) => o.id === req.params.id && o.userId === req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  res.json({ order });
});

export default router;
