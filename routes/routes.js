const express = require('express');
const router = express.Router();
const Route = require('../models/Route');

function toNumber(val) {
  if (typeof val === 'number' && isFinite(val)) return val;
  const parsed = parseFloat(String(val).replace(/[^\d.]/g, ''));
  return isFinite(parsed) ? parsed : NaN;
}

router.post('/', async (req, res) => {
  try {
    const { name, email, items } = req.body || {};
    if (!name || !email) return res.status(400).json({ ok:false, error: 'Falta name/email' });
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ ok:false, error: 'items vacío' });

    const normItems = items.map((it, idx) => {
      const productId = String(it.productId || it._id || '').trim();
      const itemName  = String(it.name || '').trim();
      const price     = toNumber(it.price);
      const quantity  = toNumber(it.quantity ?? it.cantidad ?? 1);
      if (!productId || !itemName) throw new Error(`Item ${idx}: id/name vacío`);
      if (!isFinite(price))        throw new Error(`Item ${idx}: price inválido`);
      if (!isFinite(quantity) || quantity < 1) throw new Error(`Item ${idx}: quantity inválido`);
      return { productId, name: itemName, price, quantity };
    });

    const total = normItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const created = await Route.create({ name, email, items: normItems, total });
    res.status(201).json({ ok: true, route: created });
  } catch (err) {
    console.error('POST /routes ERROR:', err?.stack || err);
    res.status(500).json({ ok:false, error: err?.message || 'Internal error' });
  }
});

router.get('/', async (_req, res) => {
  const rows = await Route.find().sort({ createdAt: -1 }).limit(20);
  res.json({ ok:true, routes: rows });
});

module.exports = router;

export async function POST(req) {
  try {
    const body = await req.json();
    const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
    const r = await fetch(`${API}/routes`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    return new Response(JSON.stringify(data), { status: r.status, headers: { 'Content-Type':'application/json' }});
  } catch (e) {
    return new Response(JSON.stringify({ ok:false, error: e?.message || 'Proxy error' }), { status:500 });
  }
}
