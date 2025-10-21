const express = require('express');
const router = express.Router();
const Route = require('../models/Route');

function toNumber(val) {
  if (typeof val === 'number' && isFinite(val)) return val;
  const n = parseFloat(String(val).replace(/[^\d.]/g, ''));
  return isFinite(n) ? n : 0;
}

router.post('/', async (req, res) => {
  try {
    const { name, email, items } = req.body || {};

    if (!name || !email || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, error: 'Faltan name, email o items[]' });
    }

    const normItems = items.map((it, idx) => {
      const productId = String(it.productId || it._id || '').trim();
      const itemName  = String(it.name || '').trim();
      const price     = toNumber(it.price);
      const quantity  = toNumber(it.quantity || it.cantidad || 1);

      if (!productId || !itemName || quantity < 1) {
        throw new Error(`Item inválido en índice ${idx}`);
      }

      return { productId, name: itemName, price, quantity };
    });

    const total = normItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

    const created = await Route.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      items: normItems,
      total,
    });

    return res.status(201).json({ ok: true, route: created });
  } catch (err) {
    console.error('POST /routes error →', err && (err.stack || err.message || err));
    return res.status(500).json({ ok: false, error: 'Error interno creando la Route' });
  }
});

module.exports = router;
