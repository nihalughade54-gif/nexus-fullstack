import { Router } from 'express';
import { products } from '../data/products.js';

const router = Router();

router.get('/', (req, res) => {
  const { category, search, maxPrice, sort } = req.query;
  let list = [...products];

  if (category && category !== 'All') {
    list = list.filter((p) => p.category === category);
  }
  if (maxPrice) {
    list = list.filter((p) => p.price <= Number(maxPrice));
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);

  res.json({ products: list });
});

router.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  res.json({ product });
});

export default router;
